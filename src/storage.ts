import * as z from "zod";

const timeRegex = /^([01]\d|2[0-3])[:.]([0-5]\d)$/;
export const UserPreferencesSchema = z.object({
    dnd: z
        .object({
            start: z.string().regex(timeRegex, "Invalid time format"),
            end: z.string().regex(timeRegex, "Invalid time format"),
        })
        .refine((data) => data.start !== data.end, {
            message: "Start and end time cannot be the same",
            path: ["end"],
        }),
    eventSettings: z.object({
        item_shipped: z.object({
            enabled: z.boolean(),
        }),
        invoice_generated: z.object({
            enabled: z.boolean(),
        }),
    }),
});

export const EventSchema = z.object({
    eventId: z.string(),
    userId: z.string(),
    eventType: z.enum(["item_shipped", "invoice_generated"]),
    timestamp: z.date(),
});

export interface RequestLog {
    timestamp: Date;
    method: string;
    url: string;
    body: any;
}

export function addRequestLog(method: string, url: string, body: any) {
    requestLogs.push({
        timestamp: new Date(),
        method,
        url,
        body,
    });
}

export function getRequestLogs(): RequestLog[] {
    return requestLogs;
}


export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type Event = z.infer<typeof EventSchema>;

export const requestLogs : RequestLog[] = [];
export const users = new Map<string, UserPreferences>();
