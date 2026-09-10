import { PROMPT } from "@/prompt";
import { inngest } from "./client";
import {
  gemini,
  createAgent,
  openai,
  createTool,
  createNetwork,
} from "@inngest/agent-kit";
import Sandbox from "e2b";
import z from "zod";
import { lastAssistantTextMessageContent } from "./utils";

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent", triggers: { event: "code-agent/run" } },
  async ({ event, step }) => {
    // sandboxId
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create(
        "kishans-project/vbuild-nextjs-build-new-dev",
      );
      return sandbox.sandboxId;
    });

    // codeAgent
    const codeAgent = createAgent({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: gemini({
        model: "gemini-3.1-pro-preview",
        apiKey: process.env.GEMINI_API_KEY!,
      }),
      tools: [
        // 1. Terminal
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {},
        }),

        // 2. createOrUpdateFiles
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sanbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),

          handler: async ({ files }, { step, network }) => {},
        }),
        // 3. readFiles
        createTool({
          name: "readFiles",
          description: "Read files in the sandbox",

          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {},
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);
          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }
          return result;
        },
      },
    });

    // network
    const network = createNetwork({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 10,

      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) {
          return;
        }

        return codeAgent;
      },
    });
    // Fallback to ensure prompt is always a valid string
    const inputPrompt =
      event.data?.prompt ||
      event.data?.input ||
      "Build the application based on setup.";

    // Run network with validated prompt string
    const result = await network.run(inputPrompt);
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await Sandbox.connect(sandboxId);
      // Just get the host directly — Next.js is already running inside E2B
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });
    console.log(sandboxUrl);

    return result;
  },
);
