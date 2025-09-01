import { Express } from "express";
import { users, EventSchema, Event, UserPreferences } from "../users";
import { isWithinDnd, parseTimeToMinutes } from "../utils";

export const eventsControllerFactory = (app: Express) => {
    app.post("/events", (req, res) => {
        console.log("Received event:", req.body);
        if (req.body.timestamp)
            req.body.timestamp = new Date(req.body.timestamp);
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
                    newEvent.timestamp
                        .getUTCMinutes()
                        .toString()
                        .padStart(2, "0"),
            );
            console.log(newEvent.timestamp.getHours());
            const dndStartMinutes = parseTimeToMinutes(
                userPreferences.dnd.start,
            );
            const dndEndMinutes = parseTimeToMinutes(userPreferences.dnd.end);

            if (
                isWithinDnd(
                    notificationTimeMinutes,
                    dndStartMinutes,
                    dndEndMinutes,
                )
            ) {
                return res.status(200).send({
                    decision: "DO_NOT_NOTIFY",
                    reason: "DND_ACTIVE",
                });
            }
        }
        res.status(202).send({ decision: "PROCESS_NOTIFICATION" });
    });
};
