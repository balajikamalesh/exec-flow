# ExecFlow 🚀

A powerful workflow automation platform built with Next.js, allowing you to create, manage, and execute complex workflows with visual node-based editing.

## ✨ Features

- **Visual Workflow Editor**: Drag-and-drop interface powered by React Flow for intuitive workflow creation
- **Multiple Trigger Types**:
  - Manual triggers
  - Google Form submissions
  - Stripe webhooks
  - HTTP requests
- **AI Integrations**: Built-in support for OpenAI, Anthropic (Claude), and Google Gemini
- **Third-party Integrations**: Discord and Slack messaging capabilities
- **Execution History**: Track and monitor all workflow executions with detailed logs
- **Credential Management**: Securely store and manage API keys with encryption
- **Real-time Updates**: Live workflow execution updates powered by Inngest
- **Authentication**: Secure user authentication with Better Auth
- **Subscription Management**: Integrated with Polar for payment and subscription handling
- **Error Tracking**: Built-in Sentry integration for error monitoring

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router and Turbopack
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [Tailwind CSS](https://tailwindcss.com/)
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Workflow Engine**: [Inngest](https://www.inngest.com/) for reliable workflow execution
- **API Layer**: [tRPC](https://trpc.io/) for type-safe API endpoints
- **State Management**: [Jotai](https://jotai.org/) for atomic state management
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Visual Editor**: [React Flow (xyflow)](https://reactflow.dev/)
- **AI SDKs**: Vercel AI SDK with OpenAI, Anthropic, and Google integrations
- **Error Monitoring**: [Sentry](https://sentry.io/)

## � Monetization

ExecFlow is built with monetization in mind, featuring integrated subscription and payment capabilities:

### Built-in Subscription Management

- **Polar Integration**: Seamlessly manage subscriptions, payments, and billing through [Polar](https://polar.sh/)
- **Tiered Pricing**: Support multiple subscription tiers with different feature sets
- **Usage-based Pricing**: Track workflow executions and billing based on usage metrics
- **Secure Transactions**: All payment processing is handled securely through Polar

### Revenue Models

- **Subscription Plans**: Monthly or annual recurring revenue
- **Per-Execution Pricing**: Charge users based on workflow runs
- **Premium Features**: Gate advanced AI nodes, integrations, and execution history
- **Team Plans**: Support multiple users and workflows per account

### Key Monetization Features

- Built-in upgrade modals and subscription prompts
- Execution history tracking for usage-based billing
- Credential management tied to subscription tiers
- AI integration access control based on plan tier
- Webhook triggers (Stripe, Google Forms) for premium features

## 📁 Project Structure

```
exec-flow/
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js app router pages
│   │   ├── (auth)/    # Authentication pages (login, register)
│   │   ├── (dashboard)/ # Main application pages
│   │   └── api/       # API routes (tRPC, webhooks, auth)
│   ├── components/     # React components
│   │   ├── react-flow/ # Custom React Flow components
│   │   └── ui/        # Reusable UI components (shadcn/ui)
│   ├── config/         # Configuration files
│   ├── features/       # Feature-specific code
│   │   ├── auth/      # Authentication logic
│   │   ├── credentials/ # Credential management
│   │   ├── editor/    # Workflow editor
│   │   ├── executions/ # Execution tracking
│   │   ├── subscriptions/ # Payment/subscription handling
│   │   ├── triggers/  # Webhook triggers
│   │   └── workflows/ # Workflow management
│   ├── hooks/          # Custom React hooks
│   ├── inngest/        # Inngest functions and configuration
│   ├── lib/            # Utility libraries
│   ├── trpc/           # tRPC configuration and routers
│   └── types/          # TypeScript type definitions
└── ...config files
```

## 🎯 Core Concepts

### Workflows

Workflows are composed of:

- **Nodes**: Individual steps in your workflow (triggers, actions, AI operations)
- **Connections**: Links between nodes that define the execution flow
- **Triggers**: Entry points for workflow execution (manual, webhooks, forms)

### Node Types

- **Initial**: Starting point for manual workflows
- **Manual Trigger**: User-initiated execution
- **HTTP Request**: Make HTTP API calls
- **Google Form Trigger**: React to form submissions
- **Stripe Trigger**: Handle Stripe webhook events
- **AI Nodes**: OpenAI, Anthropic, and Gemini integrations
- **Messaging**: Discord and Slack notifications

### Credentials

Store API keys and secrets securely with encryption. Credentials can be linked to specific nodes and are encrypted at rest.

## 🔐 Security Features

- Encrypted credential storage using `cryptr`
- Secure session management with Better Auth
- Environment variable validation
- CSRF protection
- SQL injection prevention through Prisma

## 📊 Monitoring & Error Tracking

ExecFlow includes Sentry integration for:

- Error tracking
- Performance monitoring
- Real-time alerts

Configure Sentry with your `SENTRY_AUTH_TOKEN` in the environment variables.

## � Use Cases & Examples

ExecFlow empowers users to automate complex workflows across multiple platforms:

### E-commerce Automation

- **Google Form → Slack Notification**: Collect customer feedback via Google Forms and automatically post summaries to your Slack channel
- **Stripe Webhook → AI Processing**: When a customer makes a purchase, trigger an AI workflow to generate personalized email recommendations using their order data
- **Multi-step Order Processing**: Combine Stripe payment triggers with Discord notifications and AI-powered customer segmentation

### Content & Marketing

- **Form Submission Pipeline**: Automatically process form submissions through OpenAI to generate marketing content, tag leads, and post updates to Discord
- **Data Enrichment Workflows**: Use Anthropic Claude to analyze incoming data and enrich it with insights before storing or sharing results
- **Automated Reporting**: Trigger workflows on schedules or webhooks to generate reports, summarize data with AI, and deliver via Slack/Discord

### Team Collaboration

- **Approval Workflows**: Manual triggers allow teams to create approval chains that process data, notify stakeholders, and update systems
- **Alert & Response Automation**: HTTP triggers enable real-time responses to system events, with AI-powered analysis and team notifications
- **Cross-Platform Sync**: Connect Google Forms, Stripe, and messaging platforms in unified workflows

### API Integration Hub

- **Webhook Processing**: Accept HTTP requests from any service and route data through AI processing and integrations
- **Credential-based Routing**: Different users' API keys and secrets enable multi-tenant workflows with isolated credentials
- **Execution Tracking**: Monitor all workflow runs with full execution history for debugging and compliance

## 🙏 Acknowledgments

Built with amazing open-source tools:

- Next.js, React, and the Vercel ecosystem
- Prisma for type-safe database access
- Inngest for reliable workflow execution
- React Flow for the visual editor
- shadcn/ui for beautiful components

---

Made with ❤️ using Next.js and TypeScript
