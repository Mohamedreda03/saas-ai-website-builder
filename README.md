# 🤖 SaaS AI Website Builder

> **Inspired by**: [Replicating Cursor's Agent Mode with E2B and AgentKit](https://e2b.dev/blog/replicating-cursors-agent-mode-with-e2b-and-agentkit)

An intelligent AI-powered website builder that generates Next.js components and applications using natural language prompts. Built with cutting-edge technologies to replicate Cursor's agent mode functionality.

## ✨ Features

- 🧠 **AI-Powered Code Generation**: Uses GPT-4 to understand natural language and generate production-ready React components
- 🏗️ **Live Sandbox Environment**: Real-time code execution in isolated E2B sandboxes
- ⚡ **Next.js 15 Ready**: Built with the latest Next.js features and App Router
- 🎨 **Pre-configured UI**: Includes shadcn/ui components and Tailwind CSS
- 🔄 **Real-time Preview**: Instant preview of generated components
- 📦 **Package Management**: Automatic npm package installation and dependency management
- 🛠️ **File Operations**: Create, read, and update files dynamically

## 🏗️ Tech Stack

### Frontend

- **Next.js 15.3.3** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern React component library
- **tRPC** - End-to-end typesafe APIs

### AI & Execution

- **OpenAI GPT-4** - Large language model for code generation
- **Inngest AgentKit** - AI agent orchestration and workflow management
- **E2B Code Interpreter** - Secure sandbox environment for code execution
- **Zod** - Schema validation

### Database & Infrastructure

- **Prisma** - Database ORM
- **Inngest** - Durable workflow engine

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- E2B API key
- OpenAI API key
- Inngest account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Mohamedreda03/saas-ai-website-builder.git
cd saas-ai-website-builder
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```env
# .env.local
E2B_API_KEY=your_e2b_api_key
OPENAI_API_KEY=your_openai_api_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
INNGEST_EVENT_KEY=your_inngest_event_key
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 💡 How It Works

1. **User Input**: Enter a natural language description of the component you want
2. **AI Processing**: GPT-4 analyzes the request and plans the implementation
3. **Code Generation**: The AI agent creates React components with TypeScript
4. **Sandbox Execution**: Code runs in a secure E2B sandbox environment
5. **Live Preview**: Get an instant preview of your generated component
6. **File Management**: Download or further modify the generated code

## 🛠️ Usage Example

```typescript
// Example prompt
"Create a modern landing page with a hero section, features grid, and call-to-action button";

// The AI will generate:
// - Hero component with responsive design
// - Features section with icons
// - CTA section with button animations
// - Proper TypeScript interfaces
// - Tailwind CSS styling
```

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── api/             # API routes
│   │   ├── inngest/     # Inngest webhook
│   │   └── trpc/        # tRPC API handlers
│   ├── page.tsx         # Main application page
│   └── layout.tsx       # Root layout
├── components/
│   └── ui/              # shadcn/ui components
├── inngest/             # AI agent functions
│   ├── functions.ts     # Main agent logic
│   ├── client.ts        # Inngest client
│   └── utils.ts         # Helper utilities
├── trpc/                # tRPC setup
│   ├── client.tsx       # Client-side tRPC
│   └── server.tsx       # Server-side tRPC
├── lib/                 # Utility libraries
└── prompt.ts            # AI system prompt
```

## 🤖 AI Agent Capabilities

The AI agent is equipped with powerful tools:

- **🖥️ Terminal**: Execute shell commands and install packages
- **📄 File Operations**: Create, read, and update files
- **🔄 State Management**: Track project state across operations
- **🛡️ Error Handling**: Robust error handling and recovery
- **📊 Progress Tracking**: Step-by-step execution monitoring

## 🔧 Customization

### Modify AI Behavior

Edit `src/prompt.ts` to customize the AI's behavior and coding style.

### Add New Tools

Extend the agent's capabilities by adding new tools in `src/inngest/functions.ts`.

### UI Customization

Modify components in `src/components/ui/` or add custom components.

## 📚 Resources & References

- [E2B Documentation](https://e2b.dev/docs) - Sandbox environment setup
- [Inngest AgentKit](https://inngest.com/docs/guides/agent-kit) - AI agent framework
- [Next.js Documentation](https://nextjs.org/docs) - React framework guide
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [OpenAI API](https://platform.openai.com/docs) - AI model integration
- [Cursor Agent Mode Tutorial](https://e2b.dev/blog/replicating-cursors-agent-mode-with-e2b-and-agentkit) - Implementation inspiration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **E2B Team** for the excellent sandbox infrastructure
- **Inngest Team** for the powerful agent framework
- **Cursor Team** for the inspiration
- **Vercel Team** for Next.js and deployment platform
- **shadcn** for the beautiful UI components

---

**Built with ❤️ using AI and modern web technologies**
