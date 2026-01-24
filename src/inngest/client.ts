import { Inngest } from "inngest";
import { realtimeMiddleware } from "@inngest/realtime/middleware";

export const inngest = new Inngest({
  id: "exec-flow-app",
  middleware: [realtimeMiddleware()],
});
