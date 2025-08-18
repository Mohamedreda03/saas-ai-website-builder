import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "vibe-dev",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
