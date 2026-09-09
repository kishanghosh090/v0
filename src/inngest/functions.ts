import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";

export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "agent/hello" } },
  async ({ event, step }) => {
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
    return {
      message: output[0],
    };
  },
);
