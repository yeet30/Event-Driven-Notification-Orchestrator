import { Express } from "express";
import { users, UserPreferencesSchema, UserPreferences } from "../users";

export const preferencesControllerFactory = (app: Express) => {
    app.use((req, res, next) => {
        console.log("Time:", new Date().toISOString());
        next();
    });

    app.get("/preferences/:userId", (req, res) => {
        console.log(`Preferences for user ${req.params.userId} requested`);
        const userId = req.params.userId;
        const requestedPreference = users.get(userId);

        if (!requestedPreference)
            return res.status(404).send({ error: "User not found." });
        res.status(200).send(requestedPreference);
    });

    app.post("/preferences/:userId", (req, res) => {
        const userId = req.params.userId;
        console.log(
            `A post request has been sent for the user with id ${userId}`,
        );
        const parseResult = UserPreferencesSchema.safeParse(req.body);

        if (!parseResult.success) {
            console.log(`Invalid parameters were given.`);
            return res.status(400).send({
                error: "Invalid UserPreferences",
                details: parseResult.error.issues,
            });
        }

        const newPreference: UserPreferences = parseResult.data;
        users.set(userId, newPreference);
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
