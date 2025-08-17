import Sandbox from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export const getSandbox = async (sandboxId: string) => {
  const sandbox = await Sandbox.connect(sandboxId);
  await sandbox.setTimeout(60_000 * 10 * 3); // Set timeout to 30 minutes
  return sandbox;
};

export const lastAssestantTextMessageContent = async (resutl: AgentResult) => {
  const lastAssestantTextMessageIndex = resutl.output.findLastIndex(
    (message) => message.role === "assistant"
  );

  const message = resutl.output[lastAssestantTextMessageIndex] as
    | TextMessage
    | undefined;

  return message?.content
    ? typeof message.content === "string"
      ? message.content
      : message.content.map((c) => c.text).join("")
    : undefined;
};
