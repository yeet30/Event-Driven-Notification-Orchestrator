"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const events_controller_1 = require("./controllers/events.controller");
const preferences_controller_1 = require("./controllers/preferences.controller");
const main = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    const port = Number.parseFloat(process.env.PORT ?? "3000");
    (0, events_controller_1.eventsControllerFactory)(app);
    (0, preferences_controller_1.preferencesControllerFactory)(app);
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
};
main();
