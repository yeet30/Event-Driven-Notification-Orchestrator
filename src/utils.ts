export function parseTimeToMinutes(time: string): number {
    const [hoursStr, minutesStr] = time.split(/[:.]/);
    return parseInt(hoursStr, 10) * 60 + parseInt(minutesStr, 10);
}

export function isWithinDnd(
    notificationTimeMinutes: number,
    dndStartMinutes: number,
    dndEndMinutes: number,
): boolean {
    let isDndActive = false;
    if (dndStartMinutes > dndEndMinutes) {
        //if the starting time is bigger than the ending time, it means the ending time is in the next day
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
        else
            isDndActive =
                notificationTimeMinutes >= dndStartMinutes &&
                notificationTimeMinutes <= dndEndMinutes;
    }
    return isDndActive;
}
