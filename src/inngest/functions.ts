import { openai, createAgent } from "@inngest/agent-kit";

import { inngest } from "./client";

export const chat = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const summarizer = createAgent({
      name: "summarizer",
      system:
        "You are a helpful assistant that summarizes text. in 2 words or less.",
      model: openai({ model: "gpt-4o" }),
    });

    const { output } = await summarizer.run(
      `Summarize the following text: ${event.data.message}`
    );

    console.log(output);

    return { message: output };
  }
);
