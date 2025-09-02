"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preferencesControllerFactory = void 0;
const users_1 = require("../users");
const preferencesControllerFactory = (app) => {
    app.use((req, res, next) => {
        console.log("Time:", new Date().toISOString());
        next();
    });
    app.get("/preferences/:userId", (req, res) => {
        console.log(`Preferences for user ${req.params.userId} requested`);
        const userId = req.params.userId;
        const requestedPreference = users_1.users.get(userId);
        if (!requestedPreference)
            return res.status(404).send({ error: "User not found." });
        res.status(200).send(requestedPreference);
    });
    app.post("/preferences/:userId", (req, res) => {
        const userId = req.params.userId;
        console.log(
            `A post request has been sent for the user with id ${userId}`,
        );
        const parseResult = users_1.UserPreferencesSchema.safeParse(req.body);
        if (!parseResult.success) {
            console.log(`Invalid parameters were given.`);
            return res.status(400).send({
                error: "Invalid UserPreferences",
                details: parseResult.error.issues,
            });
        }
        const newPreference = parseResult.data;
        users_1.users.set(userId, newPreference);
        console.log(
            `The user with id ${userId} has been updated with the following parameters`,
            newPreference,
        );
        res.status(200).send({
            message: `The user with id ${userId} has been updated with the following parameters`,
            newPreference,
        });
    });
};
exports.preferencesControllerFactory = preferencesControllerFactory;
