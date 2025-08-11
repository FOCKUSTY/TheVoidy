export const BUTTONS = ["voice-switch-black-list", "voice-switch-white-list"] as const;

export const buttons = [...BUTTONS] as string[];

export type ButtonsIds = (typeof BUTTONS)[number];
