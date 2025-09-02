"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeToMinutes = parseTimeToMinutes;
exports.isWithinDnd = isWithinDnd;
function parseTimeToMinutes(time) {
    const [hoursStr, minutesStr] = time.split(/[:.]/);
    return parseInt(hoursStr, 10) * 60 + parseInt(minutesStr, 10);
}
function isWithinDnd(notificationTimeMinutes, dndStartMinutes, dndEndMinutes) {
    if (dndStartMinutes > dndEndMinutes) {
        //if the starting time is bigger than the ending time, it means the ending time is in the next day
        if (
            notificationTimeMinutes >= dndStartMinutes &&
            notificationTimeMinutes <= 24 * 60
        )
            return true;
        else if (
            notificationTimeMinutes >= 0 &&
            notificationTimeMinutes < dndEndMinutes
        )
            return true;
    } else if (
        notificationTimeMinutes >= dndStartMinutes &&
        notificationTimeMinutes < dndEndMinutes
    )
        return true;
    return false;
}
