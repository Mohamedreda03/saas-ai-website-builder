import { openai, createAgent } from "@inngest/agent-kit";

import { Sandbox } from "@e2b/code-interpreter";

import { inngest } from "./client";
import { getSandbox } from "./utils";

export const chat = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("tlahv91cck2pgvg72m7v");

      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "coder",
      system:
        "You are an expert Next.js developer specializing in creating custom components. You excel at:\n" +
        "- Building reusable React components with TypeScript\n" +
        "- Implementing modern Next.js patterns (App Router, Server Components, Client Components)\n" +
        "- Using Tailwind CSS for styling and responsive design\n" +
        "- Integrating with shadcn/ui components and design systems\n" +
        "- Optimizing performance with Next.js features (Image, Link, loading strategies)\n" +
        "- Handling state management, forms, and user interactions\n" +
        "- Creating accessible and SEO-friendly components\n" +
        "- Following React best practices and clean code principles\n\n" +
        "When creating components, always:\n" +
        "- Use TypeScript with proper type definitions\n" +
        "- Include proper error handling and loading states\n" +
        "- Make components responsive and accessible\n" +
        "- Follow Next.js 14+ conventions and App Router patterns\n" +
        "- Provide clean, well-documented code with comments\n" +
        "- Consider performance and bundle size optimization",
      model: openai({ model: "gpt-4o" }),
    });

    const { output } = await codeAgent.run(
      `Summarize the following text: ${event.data.message}`
    );

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    console.log(output);

    return { output, sandboxUrl };
  }
);
