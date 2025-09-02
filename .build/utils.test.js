"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
describe("parseTimeToMinutes", () => {
    it("converts HH:MM correctly", () => {
        expect((0, utils_1.parseTimeToMinutes)("00:00")).toBe(0);
        expect((0, utils_1.parseTimeToMinutes)("01:30")).toBe(90);
        expect((0, utils_1.parseTimeToMinutes)("23:59")).toBe(23 * 60 + 59);
    });
    it("handles HH.MM format too", () => {
        expect((0, utils_1.parseTimeToMinutes)("12.15")).toBe(12 * 60 + 15);
    });
});
describe("isWithinDnd", () => {
    it("detects time inside normal DND range", () => {
        const start = (0, utils_1.parseTimeToMinutes)("22:00");
        const end = (0, utils_1.parseTimeToMinutes)("23:00");
        expect(
            (0, utils_1.isWithinDnd)(
                (0, utils_1.parseTimeToMinutes)("22:30"),
                start,
                end,
            ),
        ).toBe(true);
        expect(
            (0, utils_1.isWithinDnd)(
                (0, utils_1.parseTimeToMinutes)("21:59"),
                start,
                end,
            ),
        ).toBe(false);
    });
    it("detects time inside overnight DND range", () => {
        const start = (0, utils_1.parseTimeToMinutes)("23:00");
        const end = (0, utils_1.parseTimeToMinutes)("02:00");
        expect(
            (0, utils_1.isWithinDnd)(
                (0, utils_1.parseTimeToMinutes)("23:30"),
                start,
                end,
            ),
        ).toBe(true);
        expect(
            (0, utils_1.isWithinDnd)(
                (0, utils_1.parseTimeToMinutes)("01:30"),
                start,
                end,
            ),
        ).toBe(true);
        expect(
            (0, utils_1.isWithinDnd)(
                (0, utils_1.parseTimeToMinutes)("15:00"),
                start,
                end,
            ),
        ).toBe(false);
    });
    it("detects time exactly at start or end as within DND", () => {
        const start = (0, utils_1.parseTimeToMinutes)("10:00");
        const end = (0, utils_1.parseTimeToMinutes)("12:00");
        expect(
            (0, utils_1.isWithinDnd)(
                (0, utils_1.parseTimeToMinutes)("10:00"),
                start,
                end,
            ),
        ).toBe(true);
        expect(
            (0, utils_1.isWithinDnd)(
                (0, utils_1.parseTimeToMinutes)("12:00"),
                start,
                end,
            ),
        ).toBe(false);
    });
});
