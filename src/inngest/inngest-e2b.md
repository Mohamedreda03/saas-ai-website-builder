# AI Code Agent with E2B and AgentKit - Technical Reference

> **Reference Article**: [Replicating Cursor's Agent Mode with E2B and AgentKit](https://e2b.dev/blog/replicating-cursors-agent-mode-with-e2b-and-agentkit)

## 📋 Project Overview

This project implements an AI-powered code generation system that replicates Cursor's agent mode functionality using:

- **E2B Sandboxes** for secure code execution
- **Inngest AgentKit** for AI agent orchestration
- **OpenAI GPT-4** for intelligent code generation
- **Next.js** as the target framework

## 🏗️ Architecture

```
User Input → Inngest Function → AI Agent → E2B Sandbox → Live Preview
```

### Core Components:

1. **Inngest Function**: Event-driven execution engine
2. **AI Agent**: GPT-4 powered code generator
3. **E2B Sandbox**: Isolated environment for code execution
4. **Tools**: Terminal, File Management, Code Execution

## 🔧 Implementation Details

### 1. Main Function Structure

```typescript
export const chat = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // Implementation
  }
);
```

**Key Features:**

- Event-driven architecture
- Step-based execution with reliability
- Automatic retry mechanisms
- State persistence

### 2. Sandbox Creation

```typescript
const sandboxId = await step.run("get-sandbox-id", async () => {
  const sandbox = await Sandbox.create("tlahv91cck2pgvg72m7v");
  return sandbox.sandboxId;
});
```

**Template ID**: `tlahv91cck2pgvg72m7v`

- Pre-configured Next.js environment
- Includes shadcn/ui components
- Ready for development

### 3. AI Agent Configuration

```typescript
const codeAgent = createAgent({
  name: "coder-agent",
  description: "A code generation agent",
  system: PROMPT,
  model: openai({
    model: "gpt-4.1",
    defaultParameters: {
      temperature: 0.1, // Low creativity for precise code
    },
  }),
  tools: [...], // Agent capabilities
});
```

**Agent Capabilities:**

- Natural language to code conversion
- Next.js component generation
- File system operations
- Terminal command execution

## 🛠️ Available Tools

### 1. Terminal Tool

**Purpose**: Execute shell commands in the sandbox

```typescript
createTool({
  name: "terminal",
  description: "use the terminal to run commands",
  parameters: z.object({
    command: z.string(),
  }),
  handler: async ({ command }, { step }) => {
    // Execute command with output buffering
  },
});
```

**Use Cases:**

- Installing npm packages
- Running build commands
- Starting development servers
- File operations

### 2. File Creation/Update Tool

**Purpose**: Create and modify files in the sandbox

```typescript
createTool({
  name: "createOrUpdateFiles",
  parameters: z.object({
    files: z.array(
      z.object({
        path: z.string(),
        content: z.string(),
      })
    ),
  }),
  handler: async ({ files }, { step, network }) => {
    // Write files and update network state
  },
});
```

**Features:**

- Multiple file operations
- State synchronization
- Error handling
- Content validation

### 3. File Reading Tool

**Purpose**: Read existing files from the sandbox

```typescript
createTool({
  name: "readFiles",
  parameters: z.object({
    files: z.array(z.string()),
  }),
  handler: async ({ files }, { step }) => {
    // Read and return file contents
  },
});
```

**Capabilities:**

- Multiple file reading
- JSON serialization
- Error handling
- Content retrieval

## 🌐 Network Management

### Network Configuration

```typescript
const network = createNetwork({
  name: "code-agent-network",
  agents: [codeAgent],
  maxIter: 15,
  router: async ({ network }) => {
    const summary = network.state.data.summary;
    if (summary) return; // Task completed
    return codeAgent; // Continue with agent
  },
});
```

**Network Features:**

- Multi-agent support (scalable)
- Iteration control (prevents infinite loops)
- State management
- Smart routing logic

### State Management

```typescript
network.state.data = {
  files: {}, // Created/modified files
  summary: "", // Task completion summary
};
```

## 🔄 Execution Flow

### 1. Initialization Phase

1. Create E2B sandbox with Next.js template
2. Initialize AI agent with tools
3. Set up network routing

### 2. Processing Phase

1. Receive user message
2. Agent analyzes request
3. Decides which tools to use
4. Executes operations in sandbox
5. Updates network state

### 3. Completion Phase

1. Generate task summary
2. Extract sandbox URL
3. Return results with preview link

### 4. Response Structure

```typescript
return {
  url: sandboxUrl, // Live preview URL
  title: "Fragment", // Result title
  files: result.state.data.files, // Generated files
  summary: result.state.data.summary, // Task summary
};
```

## 📁 Project Structure

```
src/
├── inngest/
│   ├── functions.ts    # Main agent function
│   ├── client.ts       # Inngest client setup
│   └── utils.ts        # Helper functions
├── prompt.ts           # AI system prompt
└── ...
```

## ⚙️ Environment Setup

### Required Environment Variables

```env
E2B_API_KEY=your_e2b_api_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
INNGEST_EVENT_KEY=your_inngest_event_key
OPENAI_API_KEY=your_openai_api_key
```

### Dependencies

```json
{
  "@inngest/agent-kit": "latest",
  "@e2b/code-interpreter": "latest",
  "inngest": "latest",
  "zod": "latest"
}
```

## 🚀 Usage Examples

### Triggering the Agent

```typescript
// Send event to Inngest
await inngest.send({
  name: "test/hello.world",
  data: {
    message: "Create a React component for a landing page",
  },
});
```

### Expected Workflow

1. Agent receives request
2. Plans component structure
3. Creates necessary files
4. Installs dependencies
5. Starts development server
6. Returns preview URL

## 🔍 Debugging & Monitoring

### Step Tracking

- Each operation is wrapped in `step.run()`
- Automatic retry on failures
- Observable execution flow
- Error logging and handling

### Network State Inspection

```typescript
// Access current network state
const currentFiles = network.state.data.files;
const taskStatus = network.state.data.summary;
```

## 🎯 Key Benefits

1. **Reliability**: Step-based execution with automatic retries
2. **Security**: Isolated sandbox environment
3. **Scalability**: Multi-agent network support
4. **Observability**: Full execution tracking
5. **Flexibility**: Extensible tool system

## 🔧 Customization Points

### Adding New Tools

```typescript
createTool({
  name: "customTool",
  description: "Your custom functionality",
  parameters: z.object({
    // Define parameters
  }),
  handler: async (params, context) => {
    // Implementation
  },
});
```

### Modifying Agent Behavior

- Update system prompt in `PROMPT` constant
- Adjust model parameters (temperature, etc.)
- Add lifecycle hooks for custom processing

### Extending Network Logic

- Add multiple agents for specialized tasks
- Implement complex routing strategies
- Add state validation and persistence

## 📚 Related Resources

- [E2B Documentation](https://e2b.dev/docs)
- [Inngest AgentKit Guide](https://inngest.com/docs/guides/agent-kit)
- [OpenAI API Reference](https://platform.openai.com/docs)

## 🐛 Common Issues & Solutions

### Sandbox Creation Failures

- Verify E2B API key
- Check template ID validity
- Monitor rate limits

### Agent Tool Errors

- Validate Zod schemas
- Check file permissions
- Review error logs in step execution

### Network Routing Issues

- Verify router logic
- Check maxIter settings
- Monitor network state changes

---

**Last Updated**: [Current Date]
**Project Version**: 1.0.0
**Compatibility**: Next.js 15+, Node.js 18+
