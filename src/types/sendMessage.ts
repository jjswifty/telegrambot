import { SendMessageOptions } from "node-telegram-bot-api";

export type sendMessageSafeI = (text: string, optParams?: SendMessageOptions) => void
