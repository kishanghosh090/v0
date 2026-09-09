import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";
import Sandbox from "e2b";
export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "agent/hello" } },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create(
        "kishans-project/vbuild-nextjs-build-new-dev",
      );
      return sandbox.sandboxId;
    });
    const helloAgent = createAgent({
      name: "hello-agent",
      description: "say hello to the users",
      system: "you are a helpful assistent greet with enthusiasan",
      model: gemini({
        model: "gemini-2.5-flash",
        apiKey: process.env.GEMINI_API_KEY!,
      }),
    });
    const { output } = await helloAgent.run(
      "say hello to the user named kishan",
    );
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await Sandbox.connect(sandboxId);
      sandbox.commands.run(
        "cd /home/user/nextjs-app && npx next dev --turbopack -H 0.0.0.0 -p 3000",
      );
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });
    return {
      message: output[0],
    };
  },
);
