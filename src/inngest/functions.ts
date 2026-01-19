import db from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-10s", "5s"); // this is passed while invoking the function
    await step.run("create-workflow", () => {
        // creating workflow inside the inngest background function
        return db.workflow.create({
        data: {
          name: "New Workflow",
        },
      });
    });
  },
);
