import {
  gemini,
  openai,
  createAgent,
  createTool,
  createNetwork,
  type Tool,
} from "@inngest/agent-kit";

import { Sandbox } from "@e2b/code-interpreter";

import { inngest } from "./client";
import { getSandbox, lastAssestantTextMessageContent } from "./utils";
import { PROMPT } from "@/prompt";
import { z } from "zod";
import prisma from "@/lib/db";

interface AgentState {
  summary: string;
  files: { [key: string]: string };
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code.agent" },
  { event: "run/code.agent" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("tlahv91cck2pgvg72m7v");

      return sandbox.sandboxId;
    });

    const codeAgent = createAgent<AgentState>({
      name: "coder-agent",
      description: "A code generation agent",
      system: PROMPT,
      model: openai({
        model: "gpt-4.1",
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      // model: gemini({
      //   model: "gemini-2.5-flash",
      // }),
      tools: [
        createTool({
          name: "terminal",
          description: "use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              let buffer = { stdout: "", stderr: "" };

              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffer.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffer.stderr += data;
                  },
                });

                return result.stdout;
              } catch (error) {
                console.log(
                  `Command failed: ${error} \nstdout: ${buffer.stdout} \nstderr: ${buffer.stderr}`
                );
                return `Command failed: ${error} \nstdout: ${buffer.stdout} \nstderr: ${buffer.stderr}`;
              }
            });
          },
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox environment",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }) as any,
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>
          ) => {
            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                try {
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);

                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }

                  return updatedFiles;
                } catch (error) {
                  console.error(`Error updating files: ${error}`);
                  return `Error updating files: ${error}`;
                }
              }
            );

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox environment",
          parameters: z.object({
            files: z.array(z.string()),
          }) as any,
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                let contents = [];

                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push(content);
                }
                return JSON.stringify(contents);
              } catch (error) {
                console.error(`Error reading files: ${error}`);
                return `Error reading files: ${error}`;
              }
            });
          },
        }),
      ],
      lifecycle: {
        async onResponse({ result, network }) {
          const lastAssestantTextMessage =
            await lastAssestantTextMessageContent(result);

          if (lastAssestantTextMessage && network) {
            if (lastAssestantTextMessage.includes("<task_summary>")) {
              network.state.data.summary = lastAssestantTextMessage;
            }
          }

          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) {
          return;
        }

        return codeAgent;
      },
    });

    const result = await network.run(event.data.value);

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    await step.run("save-result", async () => {
      if (isError) {
        return prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Something went wrong. Please try again later.",
            type: "ERROR",
            role: "ASSISTANT",
          },
        });
      }

      return prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: result.state.data.summary,
          type: "RESULT",
          role: "ASSISTANT",
          fragment: {
            create: {
              title: "Fragment",
              sandboxUrl: sandboxUrl,
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
