import { parseTimeToMinutes, isWithinDnd } from "./utils";

describe("parseTimeToMinutes", () => {
    it("converts HH:MM correctly", () => {
        expect(parseTimeToMinutes("00:00")).toBe(0);
        expect(parseTimeToMinutes("01:30")).toBe(90);
        expect(parseTimeToMinutes("23:59")).toBe(23 * 60 + 59);
    });

    it("handles HH.MM format too", () => {
        expect(parseTimeToMinutes("12.15")).toBe(12 * 60 + 15);
    });
});

describe("isWithinDnd", () => {
    it("detects time inside normal DND range", () => {
        const start = parseTimeToMinutes("22:00");
        const end = parseTimeToMinutes("23:00");
        expect(isWithinDnd(parseTimeToMinutes("22:30"), start, end)).toBe(true);
        expect(isWithinDnd(parseTimeToMinutes("21:59"), start, end)).toBe(false);
    });

    it("detects time inside overnight DND range", () => {
        const start = parseTimeToMinutes("23:00");
        const end = parseTimeToMinutes("02:00");
        expect(isWithinDnd(parseTimeToMinutes("23:30"), start, end)).toBe(true);
        expect(isWithinDnd(parseTimeToMinutes("01:30"), start, end)).toBe(true);
        expect(isWithinDnd(parseTimeToMinutes("15:00"), start, end)).toBe(false);
    });

    it("detects time exactly at start or end as within DND", () => {
        const start = parseTimeToMinutes("10:00");
        const end = parseTimeToMinutes("12:00");

        expect(isWithinDnd(parseTimeToMinutes("10:00"), start, end)).toBe(true);
        expect(isWithinDnd(parseTimeToMinutes("12:00"), start, end)).toBe(false);
    });
});
