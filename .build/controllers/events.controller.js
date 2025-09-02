"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsControllerFactory = void 0;
const users_1 = require("../users");
const utils_1 = require("../utils");
const eventsControllerFactory = (app) => {
    app.post("/events", (req, res) => {
        console.log("Received event:", req.body);
        if (req.body.timestamp)
            req.body.timestamp = new Date(req.body.timestamp);
        const parseResult = users_1.EventSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).send({
                error: "Invalid event parameters.",
                details: parseResult.error.issues,
            });
        }
        const newEvent = parseResult.data;
        const userPreferences = users_1.users.get(newEvent.userId);
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
            const notificationTimeMinutes = (0, utils_1.parseTimeToMinutes)(
                newEvent.timestamp.getUTCHours().toString().padStart(2, "0") +
                    ":" +
                    newEvent.timestamp
                        .getUTCMinutes()
                        .toString()
                        .padStart(2, "0"),
            );
            console.log(newEvent.timestamp.getHours());
            const dndStartMinutes = (0, utils_1.parseTimeToMinutes)(
                userPreferences.dnd.start,
            );
            const dndEndMinutes = (0, utils_1.parseTimeToMinutes)(
                userPreferences.dnd.end,
            );
            if (
                (0, utils_1.isWithinDnd)(
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
exports.eventsControllerFactory = eventsControllerFactory;
