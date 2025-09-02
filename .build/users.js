"use strict";
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (
                  !desc ||
                  ("get" in desc
                      ? !m.__esModule
                      : desc.writable || desc.configurable)
              ) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k];
                      },
                  };
              }
              Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, "default", {
                  enumerable: true,
                  value: v,
              });
          }
        : function (o, v) {
              o["default"] = v;
          });
var __importStar =
    (this && this.__importStar) ||
    (function () {
        var ownKeys = function (o) {
            ownKeys =
                Object.getOwnPropertyNames ||
                function (o) {
                    var ar = [];
                    for (var k in o)
                        if (Object.prototype.hasOwnProperty.call(o, k))
                            ar[ar.length] = k;
                    return ar;
                };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null)
                for (var k = ownKeys(mod), i = 0; i < k.length; i++)
                    if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.EventSchema = exports.UserPreferencesSchema = void 0;
const z = __importStar(require("zod"));
const timeRegex = /^([01]\d|2[0-3])[:.]([0-5]\d)$/;
exports.UserPreferencesSchema = z.object({
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
exports.EventSchema = z.object({
    eventId: z.string(),
    userId: z.string(),
    eventType: z.enum(["item_shipped", "invoice_generated"]),
    timestamp: z.date(),
});
exports.users = new Map();
