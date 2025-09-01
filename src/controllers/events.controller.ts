import { Express } from "express";
import { users, EventSchema, Event, UserPreferences } from "../users";

export const eventsControllerFactory = (app: Express) => {
  app.post("/events", (req, res) => {
    console.log("Received event:", req.body);
    if (req.body.timestamp) req.body.timestamp = new Date(req.body.timestamp);
    const parseResult = EventSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).send({
        error: "Invalid event parameters.",
        details: parseResult.error.issues,
      });
    }
    const newEvent: Event = parseResult.data;
    const userPreferences = users.get(newEvent.userId);
    if (!userPreferences)
      return res.status(404).send({ error: "User not found." });
    const eventSetting = userPreferences.eventSettings[newEvent.eventType];
    if (!eventSetting || !eventSetting.enabled) {
      return res.status(200).send({
        decision: "DO_NOT_NOTIFY",
        reason: "USER_UNSUBSCRIBED_FROM_EVENT",
      });
    } else {
      let isDndActive = false;
      const notificationTimeMinutes = parseTimeToMinutes(
        newEvent.timestamp.getUTCHours().toString().padStart(2, "0") +
          ":" +
          newEvent.timestamp.getUTCMinutes().toString().padStart(2, "0"),
      );
      console.log(newEvent.timestamp.getHours());
      const dndStartMinutes = parseTimeToMinutes(userPreferences.dnd.start);
      const dndEndMinutes = parseTimeToMinutes(userPreferences.dnd.end);
      if (dndStartMinutes > dndEndMinutes) {
        //if the starting time is bigger than the ending time, it means the ending time is in the next day
        console.log(
          "start: ",
          dndStartMinutes,
          ", end: ",
          dndEndMinutes,
          ", notification time: ",
          notificationTimeMinutes,
        );
        if (
          notificationTimeMinutes >= dndStartMinutes &&
          notificationTimeMinutes <= 24 * 60
        )
          isDndActive = true;
        else if (
          notificationTimeMinutes >= 0 &&
          notificationTimeMinutes <= dndEndMinutes
        )
          isDndActive = true;
      } else
        isDndActive =
          notificationTimeMinutes >= dndStartMinutes &&
          notificationTimeMinutes <= dndEndMinutes;

      if (isDndActive) {
        return res.status(200).send({
          decision: "DO_NOT_NOTIFY",
          reason: "DND_ACTIVE",
        });
      }
    }
    res.status(202).send({ decision: "PROCESS_NOTIFICATION" });
  });
};

function parseTimeToMinutes(time: string) {
  const [hoursStr, minutesStr] = time.split(/[:.]/);
  return parseInt(hoursStr) * 60 + parseInt(minutesStr);
}
