# Full-Stack Implementation Plan: AI Productivity Benchmark

## Overview

Transform the current client-side React application into a comprehensive full-stack application with:
- **Frontend**: React with Vite (existing) - no changes to UI
- **Backend Framework**: NestJS with TypeScript - enterprise-grade Node.js framework
- **Architecture**: Cloud-Native 3-Layer API Design
  - **UI & Experience API Layer**: REST API endpoints for client-facing operations
  - **Process API Layer**: Business logic, Google ADK agents, and workflow orchestration
  - **Data API Layer**: Database operations with Prisma ORM
- **Database**: PostgreSQL (provider-agnostic: Cloud SQL, AWS RDS, Azure Database)
- **AI Framework**: Google ADK with A2A protocol for agent communication
- **Authentication**: Passport.js with OAuth 2.0 (Google, GitHub, Apple, Microsoft)
- **Security & Accessibility**: WCAG 2.1 AA compliance, OWASP Top 10 protection
- **Deployment**: Provider-agnostic containerized deployment (GCP, AWS, Azure, on-premises)

The existing design and UI will remain **exactly the same**. All changes are architectural improvements to add:
- ✅ Data persistence with PostgreSQL
- ✅ Single-user authentication with OAuth
- ✅ Multi-agent AI with Google ADK
- ✅ Cloud-native deployment
- ✅ Enterprise-grade security
- ✅ Full accessibility support

### 3-Layer Architecture Benefits

1. **UI & Experience API**: NestJS REST controllers handle HTTP requests and client interactions
2. **Process API**: Google ADK agents implement business logic and AI workflows
3. **Data API**: Prisma repositories provide type-safe database access

This separation provides:
- **Separation of Concerns**: React frontend + NestJS backend (microservices-ready architecture)
- **Better Scalability**: Each layer can scale independently via container orchestration
- **Improved Maintainability**: Clear separation of concerns with defined boundaries
- **Enhanced Security**: Data layer isolated from direct client access
- **Easier Testing**: Each layer can be tested independently
- **Enterprise-Grade**: NestJS provides built-in dependency injection, middleware, guards, and interceptors

---

## Architecture Diagram

The following diagram illustrates the complete system architecture, showing all layers, components, and their interactions:

![AI Productivity Benchmark Architecture](./architecture.jpeg)

### Architecture Components

**Client Layer**
- React application (Vite) - existing UI unchanged
- Responsive UI (Dashboard, Reports, Projects pages)
- OAuth authentication with 4 providers (Google, GitHub, Apple, Microsoft)

**UI & Experience API Layer**
- NestJS REST controllers handling client requests
- Endpoints: `/api/auth`, `/api/projects`, `/api/tasks`, `/api/analytics`, `/api/ai`
- Request validation with class-validator and DTOs
- Response formatting with interceptors
- Passport.js integration for OAuth authentication

**Process API Layer**
- Google ADK Orchestrator coordinating specialized agents
- **A2A Protocol**: Simple message passing between agents
- **5 Specialized Agents**:
  - **Chat Agent**: Conversational AI for user interactions
  - **Estimation Agent**: AI-powered task time predictions
  - **Insights Agent**: Productivity analytics and recommendations
  - **Data Agent**: Database query coordination
  - **Tool Agent**: Action execution (create tasks, projects)
- Simple orchestrator for routing and agent communication

**Data API Layer**
- Prisma ORM for type-safe database access
- Repository pattern implementation:
  - Users Repository
  - Projects Repository
  - Tasks Repository
  - Chat History Repository

**Database Layer**
- PostgreSQL database (provider-agnostic)
- Supports Cloud SQL (GCP), RDS (AWS), Azure Database, or self-hosted

**Security & Accessibility**
- OWASP Top 10 protection
- Content Security Policy headers
- Rate limiting on all endpoints
- Data encryption at rest
- WCAG 2.1 Level AA compliance
- Keyboard navigation and screen reader support

**Deployment**
- Docker containerization
- Provider-agnostic deployment
- Supports Google Cloud Run, AWS ECS/Fargate, Azure Container Apps
- Health checks and monitoring

---

## User Review Required

> [!IMPORTANT]
> **Technology Stack Decisions**
> 
> This plan uses the following technology choices:
> - **Frontend**: React with Vite and TypeScript (existing, no changes)
> - **Backend Framework**: NestJS with TypeScript (enterprise Node.js framework)
> - **Architecture**: Cloud-Native 3-Layer API Design (UI & Experience + Process + Data)
> - **Database**: PostgreSQL with provider-agnostic abstraction (Cloud SQL, AWS RDS, Azure Database, or self-hosted)
> - **Authentication**: Passport.js with OAuth 2.0 providers (Apple, Microsoft, Google, GitHub)
> - **ORM**: Prisma (open-source, type-safe, database-agnostic)
> - **AI Framework**: **Google ADK (Agent Development Kit)** with A2A protocol
> - **AI Agents**: Built using Google ADK's agent framework with simple message passing
> - **Containerization**: Docker with multi-stage builds (separate containers for frontend and backend)
> - **Cloud Deployment**: Provider-agnostic (supports GCP, AWS, Azure via environment configuration)
> - **Accessibility**: WCAG 2.1 Level AA compliance
> - **Security**: OWASP Top 10 protection, CORS, helmet.js, rate limiting
> 
> **NestJS Benefits:**
> - Enterprise-grade Node.js framework with TypeScript-first approach
> - Built-in dependency injection and modular architecture
> - Extensive middleware, guards, interceptors, and pipes ecosystem
> - Native support for microservices and GraphQL (future extensibility)
> - Excellent documentation and community support
> - Production-ready with built-in testing utilities
> 
> **Google ADK Benefits:**
> - Official Google framework for building AI agents
> - Built-in support for Gemini models
> - Tool calling and function execution
> - Simple agent coordination with A2A protocol
> - Production-ready with monitoring and observability
> - No complex workflow frameworks needed
> 
> **Cloud-Native Principles:**
> - **12-Factor App**: Environment-based configuration, stateless processes, port binding
> - **Containerized**: Docker containers for consistent deployment across any cloud
> - **Scalable**: Horizontal scaling via container orchestration
> - **Observable**: Structured logging, health checks, metrics endpoints
> - **Resilient**: Graceful degradation, retry logic, circuit breakers
> - **Provider Agnostic**: No vendor lock-in, works on GCP, AWS, Azure, or on-premises
> 
> **Single-User Architecture:**
> - Single-user application (one user per deployment instance)
> - No multi-tenancy or user isolation needed
> - Simplified data model without user authentication complexity
> - OAuth used only for user identity verification
> - Can be extended to multi-user features in future versions

> [!IMPORTANT]
> **Deployment Architecture**
> 
> - **No Data Migration**: Fresh start with database persistence (existing localStorage data not migrated)
> - **Single-User Mode**: One user per application instance, OAuth for identity only
> - **API Keys**: Gemini API key moves from client to backend (server environment variable)
> - **Deployment**: Separate containers for frontend (React/Vite) and backend (NestJS) + database (PostgreSQL)
> - **CORS Configuration**: Frontend and backend communicate via REST API with proper CORS setup

---

## Proposed Changes

### Phase 1: NestJS Backend Setup & 3-Layer Architecture

#### [NEW] [backend/](file:///Users/aaranvi/dev/ai/antigravity-demo/ai-productivity-benchmark/backend/)

Create new NestJS backend application:
- Initialize NestJS project with `@nestjs/cli`
- Set up TypeScript configuration
- Configure project structure for 3-layer architecture

#### [NEW] [backend/package.json](file:///Users/aaranvi/dev/ai/antigravity-demo/ai-productivity-benchmark/backend/package.json)

NestJS backend dependencies:
- `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express` - Core framework
- `@nestjs/passport`, `passport`, `passport-google-oauth20`, `passport-github2`, `passport-apple`, `passport-azure-ad` - OAuth authentication
- `@nestjs/jwt` - JWT token management
- `@prisma/client`, `prisma` - Database ORM
- `class-validator`, `class-transformer` - DTO validation
- `@google/generative-ai` - Google ADK for AI agents
- `helmet`, `cors` - Security middleware
- `@nestjs/throttler` - Rate limiting
- Scripts:
  ```json
  "scripts": {
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "build": "nest build",
    "test": "jest",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  }
  ```

#### [MODIFY] [package.json](file:///Users/aaranvi/dev/ai/antigravity-demo/ai-productivity-benchmark/package.json)

Frontend stays with Vite (no changes):
- Keep existing React + Vite setup
- Add `axios` or `fetch` for API calls to backend
- No migration needed - UI remains unchanged
- Update API base URL to point to NestJS backend (e.g., `http://localhost:3001`)

#### [NEW] [backend/src/](file:///Users/aaranvi/dev/ai/antigravity-demo/ai-productivity-benchmark/backend/src/)

NestJS backend directory structure (3-layer architecture):
```
backend/src/
├── main.ts                          # Application entry point
├── app.module.ts                    # Root module
│
├── experience/                      # UI & Experience API Layer
│   ├── experience.module.ts
│   ├── controllers/
│   │   ├── auth.controller.ts       # POST /api/auth/login, /logout
│   │   ├── projects.controller.ts   # CRUD /api/projects
│   │   ├── tasks.controller.ts      # CRUD /api/tasks
│   │   ├── analytics.controller.ts  # GET /api/analytics/*
│   │   └── ai.controller.ts         # POST /api/ai/chat, /estimate
│   ├── dto/                         # Data Transfer Objects
│   │   ├── create-project.dto.ts
│   │   ├── create-task.dto.ts
│   │   └── chat-message.dto.ts
│   └── guards/
│       └── auth.guard.ts            # JWT authentication guard
│
├── process/                         # Process API Layer
│   ├── process.module.ts
│   ├── services/
│   │   ├── projects.service.ts      # Business logic for projects
│   │   ├── tasks.service.ts         # Business logic for tasks
│   │   ├── analytics.service.ts     # Analytics calculations
│   │   └── ai-orchestrator.service.ts
│   └── agents/                      # Google ADK agents
│       ├── chat-agent.ts
│       ├── estimation-agent.ts
│       ├── insights-agent.ts
│       └── orchestrator.ts
│
├── data/                            # Data API Layer
│   ├── data.module.ts
│   ├── prisma.service.ts            # Prisma client singleton
│   └── repositories/
│       ├── users.repository.ts
│       ├── projects.repository.ts
│       ├── tasks.repository.ts
│       └── chat-history.repository.ts
│
├── auth/                            # Authentication module
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── google.strategy.ts
│   │   ├── github.strategy.ts
│   │   ├── apple.strategy.ts
│   │   ├── microsoft.strategy.ts
│   │   └── jwt.strategy.ts
│   └── guards/
│       └── oauth.guard.ts
│
└── common/                          # Shared utilities
    ├── filters/
    │   └── http-exception.filter.ts
    ├── interceptors/
    │   └── transform.interceptor.ts
    └── middleware/
        └── logger.middleware.ts
```

#### [NEW] [backend/src/experience/controllers/](file:///Users/aaranvi/dev/ai/antigravity-demo/ai-productivity-benchmark/backend/src/experience/controllers/)

**UI & Experience API Layer** - NestJS Controllers:

**Purpose**: Handle HTTP requests from the frontend, validate input with DTOs, format responses for UI consumption

**auth.controller.ts** - OAuth authentication endpoints:
```typescript
@Controller('api/auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}
  
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res) {
    // Generate JWT token
    // Redirect to frontend with token
  }
  
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}
  
  // Similar for Apple and Microsoft
}
```

**projects.controller.ts**:
```typescript
@Controller('api/projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  @Get()
  async findAll(@User() user) {
    // GET /api/projects - List user's projects
  }
  
  @Post()
  async create(@Body() dto: CreateProjectDto, @User() user) {
    // POST /api/projects - Create new project
    // Validates with class-validator
    // Calls ProjectsService (Process Layer)
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // GET /api/projects/:id
  }
  
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    // PUT /api/projects/:id
  }
  
  @Delete(':id')
  async remove(@Param('id') id: string) {
    // DELETE /api/projects/:id
  }
}
```

**tasks.controller.ts**:
```typescript
@Controller('api/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  @Get()
  async findAll(@User() user) {
    // GET /api/tasks
  }
  
  @Post()
  async create(@Body() dto: CreateTaskDto, @User() user) {
    // POST /api/tasks
    // Validates time values (positive numbers)
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {}
  
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {}
  
  @Delete(':id')
  async remove(@Param('id') id: string) {}
}
```

**analytics.controller.ts**:
```typescript
@Controller('api/analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  @Get('overview')
  async getOverview(@User() user) {
    // GET /api/analytics/overview - Overall statistics
  }
  
  @Get('by-project')
  async getByProject(@User() user) {
    // GET /api/analytics/by-project - Project breakdown
  }
  
  @Get('chart-data')
  async getChartData(@User() user) {
    // GET /api/analytics/chart-data - Chart-ready data
  }
}
```

**ai.controller.ts**:
```typescript
@Controller('api/ai')
@UseGuards(JwtAuthGuard)
export class AIController {
  @Post('chat')
  async chat(@Body() dto: ChatMessageDto, @User() user) {
    // POST /api/ai/chat - Chat with AI
    // Calls AI Orchestrator Service
  }
  
  @Get('history')
  async getHistory(@User() user) {
    // GET /api/ai/history - Get chat history
  }
  
  @Post('estimate')
  async estimate(@Body() dto: EstimateTaskDto, @User() user) {
    // POST /api/ai/estimate - Estimate task times
  }
}
```

#### [NEW] [backend/src/auth/strategies/](file:///Users/aaranvi/dev/ai/antigravity-demo/ai-productivity-benchmark/backend/src/auth/strategies/)

**OAuth Authentication Strategies** - Passport.js with 4 providers:

**google.strategy.ts**:
```typescript
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }
  
  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id, emails, displayName } = profile;
    return {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: displayName,
    };
  }
}
```

**github.strategy.ts**, **apple.strategy.ts**, **microsoft.strategy.ts** - Similar implementations

**jwt.strategy.ts**:
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

**Environment Variables Required:**
```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Apple OAuth
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
MICROSOFT_TENANT_ID=common  # or your specific tenant
```

**Setup Instructions for Each Provider:**

1. **Google**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://your-domain.com/api/auth/callback/google`

2. **GitHub**: [GitHub Developer Settings](https://github.com/settings/developers)
   - Create OAuth App
   - Authorization callback URL: `https://your-domain.com/api/auth/callback/github`

3. **Apple**: [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list/serviceId)
   - Create Services ID
   - Configure Sign in with Apple
   - Return URL: `https://your-domain.com/api/auth/callback/apple`

4. **Microsoft**: [Azure Portal](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
   - Register application
   - Add redirect URI: `https://your-domain.com/api/auth/callback/azure-ad`


#### [NEW] [lib/process/](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/lib/process/)

**Process API Layer** - Business logic and orchestration:

**Purpose**: Implement business rules, orchestrate workflows, process AI requests using Google ADK

**Google ADK Multi-Agent Architecture** - Using official Google Agent Development Kit:

#### Agent Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              Google ADK Orchestrator                     │
│  (LangGraph-based workflow coordination)                 │
└──────────────┬──────────────────────────────────────────┘
               │
       ┌───────┴───────┐
       │  ADK Runtime  │  (State management, tool calling)
       └───────┬───────┘
               │
    ┌──────────┼──────────┬──────────┬──────────┐
    │          │          │          │          │
┌───▼───┐  ┌──▼───┐  ┌───▼───┐  ┌───▼───┐  ┌──▼────┐
│ Chat  │  │Estim-│  │Insight│  │ Data  │  │ Tool  │
│ Agent │  │ation │  │ Agent │  │ Agent │  │ Agent │
│       │  │Agent │  │       │  │       │  │       │
└───┬───┘  └──┬───┘  └───┬───┘  └───┬───┘  └───┬───┘
    │         │          │          │          │
    └─────────┴──────────┴──────────┴──────────┘
                      │
              ┌───────▼────────┐
              │  Gemini API    │
              │  (via ADK)     │
              └────────────────┘
```

#### [NEW] [lib/process/agents/adk-config.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/lib/process/agents/adk-config.ts)

Google ADK setup and configuration:

```typescript
import { Agent, Tool, LangGraph } from '@google/agent-development-kit';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini via ADK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define tools that agents can use
export const tools: Tool[] = [
  {
    name: 'get_user_tasks',
    description: 'Retrieve all tasks for a user',
    parameters: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID' },
        limit: { type: 'number', description: 'Max tasks to return' }
      },
      required: ['userId']
    },
    execute: async ({ userId, limit = 100 }) => {
      const tasks = await tasksRepository.findAllByUserId(userId);
      return tasks.slice(0, limit);
    }
  },
  {
    name: 'get_user_analytics',
    description: 'Get productivity analytics for a user',
    parameters: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        timeRange: { type: 'string', enum: ['7days', '30days', '90days'] }
      },
      required: ['userId']
    },
    execute: async ({ userId, timeRange }) => {
      const tasks = await tasksRepository.findAllByUserId(userId);
      const projects = await projectsRepository.findAllByUserId(userId);
      
      return {
        totalTasks: tasks.length,
        totalProjects: projects.length,
        avgProductivityGain: calculateAvgGain(tasks),
        totalTimeSaved: calculateTimeSaved(tasks),
        timeRange
      };
    }
  },
  {
    name: 'create_task',
    description: 'Create a new task',
    parameters: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        projectId: { type: 'string' },
        name: { type: 'string' },
        humanTime: { type: 'number' },
        aiTime: { type: 'number' }
      },
      required: ['userId', 'projectId', 'name', 'humanTime', 'aiTime']
    },
    execute: async (params) => {
      return tasksRepository.create(params.userId, params.projectId, {
        name: params.name,
        humanTime: params.humanTime,
        aiTime: params.aiTime
      });
    }
  },
  {
    name: 'create_project',
    description: 'Create a new project',
    parameters: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        name: { type: 'string' },
        initialTask: { type: 'string' }
      },
      required: ['userId', 'name', 'initialTask']
    },
    execute: async ({ userId, name, initialTask }) => {
      return projectsRepository.create(userId, { name, initialTask });
    }
  }
];
```

#### [NEW] [lib/process/agents/chat-agent.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/lib/process/agents/chat-agent.ts)

Chat agent using Google ADK:

```typescript
import { Agent } from '@google/agent-development-kit';
import { tools } from './adk-config';

export class ChatAgent {
  private agent: Agent;

  constructor() {
    this.agent = new Agent({
      name: 'productivity-assistant',
      model: 'gemini-2.0-flash-exp',
      systemPrompt: `You are a helpful AI assistant for productivity tracking.

You can help users:
- Add tasks and projects
- Analyze their productivity data
- Answer questions about their work patterns
- Provide recommendations

When users ask to create tasks or projects, use the available tools.
When users ask about their data, use get_user_tasks or get_user_analytics.

Always be concise and actionable in your responses.`,
      tools: tools,
      temperature: 0.7,
    });
  }

  async chat(userId: string, message: string, conversationHistory: any[] = []) {
    // Build conversation context
    const messages = [
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // ADK handles tool calling automatically
    const response = await this.agent.run({
      messages,
      context: {
        userId, // Pass userId to all tool calls
        timestamp: new Date().toISOString()
      }
    });

    return {
      message: response.text,
      toolCalls: response.toolCalls, // Tools that were executed
      conversationHistory: [...messages, { role: 'assistant', content: response.text }]
    };
  }
}
```

#### [NEW] [lib/process/agents/estimation-agent.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/lib/process/agents/estimation-agent.ts)

Time estimation agent using Google ADK:

```typescript
import { Agent } from '@google/agent-development-kit';
import { tools } from './adk-config';

export class EstimationAgent {
  private agent: Agent;

  constructor() {
    this.agent = new Agent({
      name: 'time-estimator',
      model: 'gemini-2.0-flash-exp',
      systemPrompt: `You are a time estimation specialist.

Analyze task descriptions and historical user data to provide accurate estimates for:
1. Time to complete with AI assistance
2. Time to complete without AI
3. Confidence level (0-100)
4. Task category (coding, design, documentation, etc.)

Use the user's historical data to personalize estimates.
Consider task complexity, user's past performance, and industry benchmarks.

Return estimates in JSON format:
{
  "humanTime": number (in minutes),
  "aiTime": number (in minutes),
  "confidence": number (0-100),
  "category": string,
  "reasoning": string
}`,
      tools: [tools.find(t => t.name === 'get_user_tasks')!],
      temperature: 0.3, // Lower temperature for more consistent estimates
      responseFormat: 'json'
    });
  }

  async estimateTask(userId: string, taskDescription: string) {
    const response = await this.agent.run({
      messages: [{
        role: 'user',
        content: `Estimate time for this task: "${taskDescription}"`
      }],
      context: { userId }
    });

    return JSON.parse(response.text);
  }
}
```

#### [NEW] [lib/process/agents/insights-agent.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/lib/process/agents/insights-agent.ts)

Insights agent using Google ADK:

```typescript
import { Agent } from '@google/agent-development-kit';
import { tools } from './adk-config';

export class InsightsAgent {
  private agent: Agent;

  constructor() {
    this.agent = new Agent({
      name: 'productivity-analyst',
      model: 'gemini-2.0-flash-exp',
      systemPrompt: `You are a productivity insights analyst.

Analyze user data to provide:
1. Key productivity patterns
2. Tasks where AI provides most benefit (highest time savings)
3. Total time saved using AI
4. Recommendations for improvement
5. Trends over time

Be specific with numbers and percentages.
Provide actionable recommendations.

Return insights in JSON format:
{
  "patterns": string[],
  "topAITasks": { task: string, gain: number }[],
  "totalTimeSaved": number,
  "recommendations": string[],
  "trends": { period: string, metric: string, value: number }[]
}`,
      tools: [
        tools.find(t => t.name === 'get_user_tasks')!,
        tools.find(t => t.name === 'get_user_analytics')!
      ],
      temperature: 0.5,
      responseFormat: 'json'
    });
  }

  async generateInsights(userId: string, timeRange: string = '30days') {
    const response = await this.agent.run({
      messages: [{
        role: 'user',
        content: `Generate productivity insights for the last ${timeRange}`
      }],
      context: { userId, timeRange }
    });

    return JSON.parse(response.text);
  }
}
```

#### [NEW] [lib/process/agents/orchestrator.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/lib/process/agents/orchestrator.ts)

Orchestrator using LangGraph (part of Google ADK):

```typescript
import { LangGraph, StateGraph } from '@google/agent-development-kit';
import { ChatAgent } from './chat-agent';
import { EstimationAgent } from './estimation-agent';
import { InsightsAgent } from './insights-agent';

// Define workflow state
interface WorkflowState {
  userId: string;
  intent: 'chat' | 'estimate' | 'insights' | 'unknown';
  userMessage: string;
  conversationHistory: any[];
  result?: any;
}

export class AgentOrchestrator {
  private chatAgent: ChatAgent;
  private estimationAgent: EstimationAgent;
  private insightsAgent: InsightsAgent;
  private workflow: StateGraph<WorkflowState>;

  constructor() {
    this.chatAgent = new ChatAgent();
    this.estimationAgent = new EstimationAgent();
    this.insightsAgent = new InsightsAgent();
    
    // Build LangGraph workflow
    this.workflow = new StateGraph<WorkflowState>()
      .addNode('analyze_intent', this.analyzeIntent.bind(this))
      .addNode('handle_chat', this.handleChat.bind(this))
      .addNode('handle_estimation', this.handleEstimation.bind(this))
      .addNode('handle_insights', this.handleInsights.bind(this))
      .addEdge('analyze_intent', (state) => {
        switch (state.intent) {
          case 'estimate': return 'handle_estimation';
          case 'insights': return 'handle_insights';
          default: return 'handle_chat';
        }
      })
      .setEntryPoint('analyze_intent');
  }

  private async analyzeIntent(state: WorkflowState): Promise<Partial<WorkflowState>> {
    const message = state.userMessage.toLowerCase();
    
    // Simple intent detection (can be enhanced with AI)
    if (message.includes('estimate') || message.includes('how long')) {
      return { intent: 'estimate' };
    } else if (message.includes('insight') || message.includes('analyze') || message.includes('pattern')) {
      return { intent: 'insights' };
    } else {
      return { intent: 'chat' };
    }
  }

  private async handleChat(state: WorkflowState): Promise<Partial<WorkflowState>> {
    const result = await this.chatAgent.chat(
      state.userId,
      state.userMessage,
      state.conversationHistory
    );
    return { result };
  }

  private async handleEstimation(state: WorkflowState): Promise<Partial<WorkflowState>> {
    // Extract task description from message
    const taskDesc = state.userMessage.replace(/estimate|how long/gi, '').trim();
    const result = await this.estimationAgent.estimateTask(state.userId, taskDesc);
    return { result };
  }

  private async handleInsights(state: WorkflowState): Promise<Partial<WorkflowState>> {
    const result = await this.insightsAgent.generateInsights(state.userId);
    return { result };
  }

  async processRequest(userId: string, message: string, conversationHistory: any[] = []) {
    const initialState: WorkflowState = {
      userId,
      userMessage: message,
      conversationHistory,
      intent: 'unknown'
    };

    const finalState = await this.workflow.run(initialState);
    return finalState.result;
  }
}
```

#### [NEW] [lib/process/agents/index.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/lib/process/agents/index.ts)

Export all agents:

```typescript
export { AgentOrchestrator } from './orchestrator';
export { ChatAgent } from './chat-agent';
export { EstimationAgent } from './estimation-agent';
export { InsightsAgent } from './insights-agent';

// Initialize orchestrator singleton
let orchestrator: AgentOrchestrator | null = null;

export function getOrchestrator(): AgentOrchestrator {
  if (!orchestrator) {
    orchestrator = new AgentOrchestrator();
  }
  return orchestrator;
}
```

**Key Differences with Google ADK:**

1. **No custom MCP/A2A implementation** - ADK handles this internally
2. **Built-in tool calling** - Tools are defined once, used by all agents
3. **LangGraph for workflows** - Visual, declarative agent coordination
4. **State management** - ADK manages conversation state automatically
5. **Production-ready** - Built-in monitoring, error handling, retries
6. **Type-safe** - Full TypeScript support with proper types



#### Agent Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  Orchestrator Agent                      │
│  (Coordinates all agents, manages workflows)             │
└──────────────┬──────────────────────────────────────────┘
               │
       ┌───────┴───────┐
       │  A2A Protocol │  (Agent-to-Agent Communication)
       └───────┬───────┘
               │
    ┌──────────┼──────────┬──────────┬──────────┐
    │          │          │          │          │
┌───▼───┐  ┌──▼───┐  ┌───▼───┐  ┌───▼───┐  ┌──▼────┐
│ Chat  │  │Estim-│  │Insight│  │ Data  │  │ Tool  │
│ Agent │  │ation │  │ Agent │  │ Agent │  │ Agent │
│       │  │Agent │  │       │  │       │  │       │
└───┬───┘  └──┬───┘  └───┬───┘  └───┬───┘  └───┬───┘
    │         │          │          │          │
    └─────────┴──────────┴──────────┴──────────┘
                      │
              ┌───────▼────────┐
              │  MCP Protocol  │  (Model Context Protocol)
              │  Gemini API    │
              └────────────────┘
```

**agents/base-agent.ts** - Base agent class implementing MCP:
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface MCPContext {
  conversationHistory: Array<{ role: string; content: string }>;
  userContext: {
    userId: string;
    recentTasks?: any[];
    preferences?: any;
  };
  systemPrompt: string;
}

export interface A2AMessage {
  from: string;
  to: string;
  type: 'request' | 'response' | 'broadcast';
  payload: any;
  timestamp: Date;
}

export abstract class BaseAgent {
  protected name: string;
  protected genAI: GoogleGenerativeAI;
  protected model: any;
  
  constructor(name: string) {
    this.name = name;
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  // MCP: Build context for AI model
  protected buildMCPContext(context: MCPContext): string {
    return `
${context.systemPrompt}

Conversation History:
${context.conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}

User Context:
- User ID: ${context.userContext.userId}
- Recent Activity: ${JSON.stringify(context.userContext.recentTasks?.slice(0, 5))}
`;
  }

  // A2A: Send message to another agent
  async sendToAgent(message: A2AMessage): Promise<any> {
    // Implement agent-to-agent communication
    const targetAgent = AgentRegistry.get(message.to);
    if (!targetAgent) {
      throw new Error(`Agent ${message.to} not found`);
    }
    return targetAgent.receiveMessage(message);
  }

  // A2A: Receive message from another agent
  abstract receiveMessage(message: A2AMessage): Promise<any>;

  // MCP: Execute with context
  abstract execute(context: MCPContext): Promise<any>;
}
```

**agents/orchestrator-agent.ts** - Master orchestrator:
```typescript
export class OrchestratorAgent extends BaseAgent {
  private agents: Map<string, BaseAgent>;

  constructor() {
    super('orchestrator');
    this.agents = new Map();
    this.registerAgents();
  }

  private registerAgents() {
    this.agents.set('chat', new ChatAgent());
    this.agents.set('estimation', new EstimationAgent());
    this.agents.set('insights', new InsightsAgent());
    this.agents.set('data', new DataAgent());
    this.agents.set('tool', new ToolAgent());
  }

  async execute(context: MCPContext): Promise<any> {
    // Analyze user intent
    const intent = await this.analyzeIntent(context);

    // Route to appropriate agent(s)
    switch (intent.type) {
      case 'chat':
        return this.routeToChat(context);
      
      case 'estimate':
        return this.routeToEstimation(context);
      
      case 'insights':
        return this.routeToInsights(context);
      
      case 'complex':
        // Multi-agent collaboration
        return this.orchestrateMultiAgent(context, intent.agents);
      
      default:
        return this.routeToChat(context);
    }
  }

  private async orchestrateMultiAgent(
    context: MCPContext,
    agentNames: string[]
  ): Promise<any> {
    const results = [];

    // Execute agents in sequence or parallel based on dependencies
    for (const agentName of agentNames) {
      const agent = this.agents.get(agentName);
      if (agent) {
        const result = await agent.execute(context);
        results.push(result);

        // Update context with results for next agent
        context.conversationHistory.push({
          role: 'system',
          content: `Agent ${agentName} result: ${JSON.stringify(result)}`
        });
      }
    }

    // Synthesize results
    return this.synthesizeResults(results);
  }

  async receiveMessage(message: A2AMessage): Promise<any> {
    // Handle inter-agent messages
    if (message.type === 'request') {
      const targetAgent = this.agents.get(message.to);
      return targetAgent?.receiveMessage(message);
    }
  }
}
```

**agents/chat-agent.ts** - Conversational AI:
```typescript
export class ChatAgent extends BaseAgent {
  constructor() {
    super('chat');
  }

  async execute(context: MCPContext): Promise<any> {
    const prompt = this.buildMCPContext({
      ...context,
      systemPrompt: `You are a helpful AI assistant for productivity tracking.
You can help users:
- Add tasks and projects
- Analyze their productivity data
- Answer questions about their work patterns
- Provide recommendations

Current user data is available in the context.`
    });

    const result = await this.model.generateContent(prompt);
    const response = result.response.text();

    // Check if user wants to perform an action
    const action = await this.detectAction(response);
    
    if (action) {
      // Send A2A message to tool agent
      const toolResult = await this.sendToAgent({
        from: 'chat',
        to: 'tool',
        type: 'request',
        payload: action,
        timestamp: new Date()
      });

      return {
        message: response,
        action: toolResult
      };
    }

    return { message: response };
  }

  private async detectAction(response: string): Promise<any> {
    // Use AI to detect if response contains actionable intent
    const actionPrompt = `Analyze this response and extract any actionable intent:
"${response}"

If there's an action (like creating a task, project, etc.), return JSON:
{ "type": "create_task", "data": {...} }

Otherwise return null.`;

    const result = await this.model.generateContent(actionPrompt);
    try {
      return JSON.parse(result.response.text());
    } catch {
      return null;
    }
  }

  async receiveMessage(message: A2AMessage): Promise<any> {
    // Handle messages from other agents
    return { received: true };
  }
}
```

**agents/estimation-agent.ts** - Time estimation specialist:
```typescript
export class EstimationAgent extends BaseAgent {
  constructor() {
    super('estimation');
  }

  async execute(context: MCPContext): Promise<any> {
    // Get user's historical data via A2A
    const historicalData = await this.sendToAgent({
      from: 'estimation',
      to: 'data',
      type: 'request',
      payload: { action: 'getUserTasks', userId: context.userContext.userId },
      timestamp: new Date()
    });

    const prompt = this.buildMCPContext({
      ...context,
      systemPrompt: `You are a time estimation specialist.
Analyze the task description and historical data to estimate:
1. Time to complete with AI assistance
2. Time to complete without AI
3. Confidence level (0-100)
4. Task category

Historical data shows user's past performance:
${JSON.stringify(historicalData, null, 2)}

Provide estimates in JSON format:
{
  "humanTime": number,
  "aiTime": number,
  "confidence": number,
  "category": string,
  "reasoning": string
}`
    });

    const result = await this.model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }

  async receiveMessage(message: A2AMessage): Promise<any> {
    if (message.type === 'request') {
      return this.execute(message.payload.context);
    }
  }
}
```

**agents/insights-agent.ts** - Analytics and insights:
```typescript
export class InsightsAgent extends BaseAgent {
  constructor() {
    super('insights');
  }

  async execute(context: MCPContext): Promise<any> {
    // Get comprehensive user data
    const userData = await this.sendToAgent({
      from: 'insights',
      to: 'data',
      type: 'request',
      payload: {
        action: 'getAnalytics',
        userId: context.userContext.userId,
        timeRange: '30days'
      },
      timestamp: new Date()
    });

    const prompt = this.buildMCPContext({
      ...context,
      systemPrompt: `You are a productivity insights analyst.
Analyze the user's data and provide:
1. Key productivity patterns
2. Tasks where AI provides most benefit
3. Time savings achieved
4. Recommendations for improvement
5. Trends over time

User data:
${JSON.stringify(userData, null, 2)}

Provide insights in JSON format with clear, actionable recommendations.`
    });

    const result = await this.model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }

  async receiveMessage(message: A2AMessage): Promise<any> {
    return this.execute(message.payload.context);
  }
}
```

**agents/data-agent.ts** - Data access specialist:
```typescript
export class DataAgent extends BaseAgent {
  constructor() {
    super('data');
  }

  async execute(context: MCPContext): Promise<any> {
    // This agent doesn't use AI, it just accesses data
    throw new Error('Use receiveMessage for data agent');
  }

  async receiveMessage(message: A2AMessage): Promise<any> {
    const { action, userId, ...params } = message.payload;

    switch (action) {
      case 'getUserTasks':
        return tasksRepository.findAllByUserId(userId);
      
      case 'getAnalytics':
        return this.getAnalytics(userId, params.timeRange);
      
      case 'getProjects':
        return projectsRepository.findAllByUserId(userId);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private async getAnalytics(userId: string, timeRange: string) {
    // Aggregate analytics data
    const tasks = await tasksRepository.findAllByUserId(userId);
    const projects = await projectsRepository.findAllByUserId(userId);

    return {
      totalTasks: tasks.length,
      totalProjects: projects.length,
      avgProductivityGain: this.calculateAvgGain(tasks),
      totalTimeSaved: this.calculateTimeSaved(tasks),
      tasksByCategory: this.groupByCategory(tasks),
      trends: this.calculateTrends(tasks, timeRange)
    };
  }
}
```

**agents/tool-agent.ts** - Action execution:
```typescript
export class ToolAgent extends BaseAgent {
  constructor() {
    super('tool');
  }

  async execute(context: MCPContext): Promise<any> {
    throw new Error('Use receiveMessage for tool agent');
  }

  async receiveMessage(message: A2AMessage): Promise<any> {
    const { type, data } = message.payload;

    switch (type) {
      case 'create_task':
        return this.createTask(data);
      
      case 'create_project':
        return this.createProject(data);
      
      case 'update_task':
        return this.updateTask(data);
      
      default:
        throw new Error(`Unknown tool: ${type}`);
    }
  }

  private async createTask(data: any) {
    // Validate and create task
    return tasksRepository.create(data.userId, data.projectId, {
      name: data.name,
      humanTime: data.humanTime,
      aiTime: data.aiTime
    });
  }
}
```

**agents/registry.ts** - Agent registry for A2A:
```typescript
class AgentRegistryClass {
  private agents: Map<string, BaseAgent> = new Map();

  register(name: string, agent: BaseAgent) {
    this.agents.set(name, agent);
  }

  get(name: string): BaseAgent | undefined {
    return this.agents.get(name);
  }

  getAll(): BaseAgent[] {
    return Array.from(this.agents.values());
  }
}

export const AgentRegistry = new AgentRegistryClass();

// Initialize agents
export function initializeAgents() {
  const orchestrator = new OrchestratorAgent();
  AgentRegistry.register('orchestrator', orchestrator);
  // Other agents are registered by orchestrator
}
```



#### [NEW] [lib/data/](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/lib/data/)

**Data API Layer** - Database operations:

**Purpose**: Direct database access, data integrity, CRUD operations, no business logic

**prisma.ts**:
- Prisma client initialization
- Connection pooling
- Singleton pattern for client reuse

**repositories/users.repository.ts**:
- `findByEmail(email: string)` - Find user by email
- `findById(id: string)` - Find user by ID
- `create(data)` - Create new user
- `update(id, data)` - Update user
- Pure database operations, no business logic

**repositories/projects.repository.ts**:
- `findAllByUserId(userId: string)` - Get all user's projects
- `findById(id: string)` - Get project by ID
- `create(userId, data)` - Create project
- `update(id, data)` - Update project
- `delete(id: string)` - Delete project (cascades to tasks)
- `getTaskCount(projectId: string)` - Count tasks in project

**repositories/tasks.repository.ts**:
- `findAllByUserId(userId: string)` - Get all user's tasks
- `findByProjectId(projectId: string)` - Get tasks for project
- `findById(id: string)` - Get task by ID
- `create(userId, projectId, data)` - Create task
- `update(id, data)` - Update task
- `delete(id: string)` - Delete task

**repositories/chat-history.repository.ts**:
- `findByUserId(userId: string)` - Get user's chat history
- `create(userId, role, message)` - Store chat message
- `deleteByUserId(userId: string)` - Clear chat history

#### [NEW] [lib/types/](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/lib/types/)

Shared types across all layers:

**api.types.ts** - API request/response types
**domain.types.ts** - Business domain types
**database.types.ts** - Database model types (from Prisma)

#### [NEW] [lib/middleware/](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/lib/middleware/)

**auth.middleware.ts**:
- Verify NextAuth session
- Extract user ID from session
- Attach to request context

**validation.middleware.ts**:
- Zod schema validation
- Type-safe request validation
- Error formatting

**error.middleware.ts**:
- Global error handling
- Consistent error responses
- Logging

**rate-limit.middleware.ts**:
- Rate limiting per user
- Special limits for AI endpoints

#### [NEW] [.env.example](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/.env.example)

Environment variables:
```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_productivity

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# AI
GEMINI_API_KEY=your-gemini-api-key

# Environment
NODE_ENV=development
```

---


---

### Phase 2: Database Design & Setup

#### [NEW] [schema.prisma](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/backend/prisma/schema.prisma)

Prisma schema defining the data model:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  projects  Project[]
  tasks     Task[]
}

model Project {
  id        String   @id @default(uuid())
  name      String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks     Task[]
  
  @@index([userId])
}

model Task {
  id          String   @id @default(uuid())
  name        String
  humanTime   Float    // in minutes
  aiTime      Float    // in minutes
  projectId   String
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([projectId])
}

model ChatHistory {
  id        String   @id @default(uuid())
  userId    String
  role      String   // 'user' or 'model'
  message   String   @db.Text
  createdAt DateTime @default(now())
  
  @@index([userId, createdAt])
}
```

**Key Design Decisions:**
- UUIDs for all IDs (better for distributed systems)
- Cascade deletes (deleting a project deletes its tasks)
- Indexes on foreign keys and userId for query performance
- Timestamps for audit trail
- Chat history stored for AI context persistence

#### [NEW] [migrations/](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/backend/prisma/migrations/)

Database migration files generated by Prisma:
- Initial migration creating all tables
- Indexes for performance
- Foreign key constraints

#### [NEW] [seed.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/backend/prisma/seed.ts)

Seed script for development data:
- Create sample user accounts
- Create sample projects
- Create sample tasks with realistic data
- Useful for testing and development

---

### Phase 3: Frontend Component Migration

Since we're using Next.js, the frontend components need minimal changes. The main work is migrating from Vite to Next.js structure.

#### [MODIFY] [components/](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/components/)

Move all existing components from `src/components/` to `components/` at root level:
- Keep all existing component files unchanged
- Keep all CSS modules unchanged
- Components work identically in Next.js
- No design changes needed

#### [MODIFY] [src/context/ProjectContext.tsx](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/src/context/ProjectContext.tsx) → [context/ProjectContext.tsx](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/context/ProjectContext.tsx)

Replace localStorage with API calls:
- Use `fetch` or `axios` to call `/api/experience/projects` and `/api/experience/tasks`
- Add React Query (TanStack Query) for caching and state management
- Add loading and error states
- Keep the same interface (no changes needed in components using this context)
- Remove all localStorage logic

**Example changes:**
```typescript
// Before (localStorage)
const [projects, setProjects] = useState<Project[]>(() => {
  const saved = localStorage.getItem('projects');
  return saved ? JSON.parse(saved) : [];
});

// After (API with React Query)
const { data: projects, isLoading, error } = useQuery({
  queryKey: ['projects'],
  queryFn: async () => {
    const res = await fetch('/api/experience/projects');
    return res.json();
  }
});
```

#### [NEW] [context/AuthContext.tsx](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/context/AuthContext.tsx)

Authentication context using NextAuth:
- Wrap NextAuth's `useSession` hook
- Provide user data to components
- Handle loading states
- Provide login/logout helpers

#### [NEW] [app/login/page.tsx](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/app/login/page.tsx)

Login page matching existing design:
- Use same styling as `InputForm` component
- Email and password inputs
- Submit calls NextAuth `signIn`
- Redirect to dashboard on success
- Link to registration page
- Error message display

#### [NEW] [app/register/page.tsx](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/app/register/page.tsx)

Registration page matching existing design:
- Use same styling as `InputForm` component
- Name, email, password, confirm password inputs
- Submit calls `/api/experience/auth/register`
- Auto-login after registration
- Link to login page
- Validation feedback

#### [MODIFY] [app/layout.tsx](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/app/layout.tsx)

Root layout with authentication:
- Wrap with NextAuth `SessionProvider`
- Wrap with React Query `QueryClientProvider`
- Include existing Layout component for authenticated pages
- Add user menu with logout button
- Keep existing design and navigation

#### [MODIFY] [components/Layout.tsx](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/components/Layout.tsx)

Add user information display:
- Show current user name/email in header
- Add logout button
- Keep all existing navigation
- Maintain exact same design

#### [MODIFY] [components/ChatWindow.tsx](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/components/ChatWindow.tsx)

Update to use API instead of direct Gemini calls:
- Replace `generateResponse` import with API call
- Call `/api/experience/ai/chat` instead
- Load chat history from `/api/experience/ai/history`
- Keep all existing UI and design
- Add error handling for API failures

#### [NEW] [hooks/useAuth.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/hooks/useAuth.ts)

Custom hook for authentication:
```typescript
export function useAuth() {
  const { data: session, status } = useSession();
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated'
  };
}
```

#### [MODIFY] [types.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/types.ts)

Add authentication and API types:
```typescript
export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
```

Update existing types to include IDs from database:
```typescript
export interface Project {
  id: string;  // Add database ID
  name: string;
  tasks: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskData {
  id?: string;  // Add database ID
  projectId?: string;  // Add project reference
  projectName: string;
  task: string;
  humanTime: number;
  aiTime: number;
  createdAt?: string;
  updatedAt?: string;
}
```

---


---

### Phase 4: Enhanced AI Features

This phase focuses on implementing advanced AI capabilities in the Process API layer.

#### [NEW] [lib/process/ai/insights.service.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/lib/process/ai/insights.service.ts)

AI-powered productivity insights:
- Analyze user's task completion patterns
- Identify which types of tasks benefit most from AI
- Generate weekly/monthly productivity summaries
- Detect productivity trends over time
- Provide personalized recommendations

**Key Features:**
1. **Pattern Detection**: Identify tasks where AI provides 5x+ productivity gains
2. **Time Savings Analysis**: Calculate total time saved using AI
3. **Project Recommendations**: Suggest which projects to prioritize for AI adoption
4. **Anomaly Detection**: Flag unusually high or low productivity gains

#### [NEW] [lib/process/ai/estimation.service.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/lib/process/ai/estimation.service.ts)

AI-powered task time estimation:
- Given a task description, estimate completion times
- Learn from user's historical data for personalized estimates
- Provide confidence scores for estimates
- Categorize tasks automatically (coding, design, documentation, etc.)

**Implementation:**
```typescript
export async function estimateTaskTime(
  userId: string,
  taskDescription: string
): Promise<{
  humanTime: number;
  aiTime: number;
  confidence: number;
  category: string;
}> {
  // Get user's historical data
  const historicalTasks = await tasksRepository.findAllByUserId(userId);
  
  // Build context-aware prompt
  const prompt = buildEstimationPrompt(taskDescription, historicalTasks);
  
  // Call Gemini API
  const response = await geminiService.generateEstimate(prompt);
  
  // Parse and return structured data
  return parseEstimationResponse(response);
}
```

#### [NEW] [lib/process/ai/query.service.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/lib/process/ai/query.service.ts)

Natural language query interface:
- Users can ask questions about their data
- Examples:
  - "Which project saves me the most time?"
  - "How much time have I saved this month?"
  - "What tasks should I use AI for?"
- AI queries user's data and provides answers
- Generates visualizations when appropriate

#### [MODIFY] [app/api/experience/ai/insights/route.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/app/api/experience/ai/insights/route.ts)

New endpoint for AI insights:
- `GET /api/experience/ai/insights` - Get productivity insights
- Calls Process API insights service
- Returns formatted insights for UI display

#### [NEW] [components/AIInsights.tsx](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/components/AIInsights.tsx) (Optional)

Insights panel component:
- Display AI-generated insights on Dashboard or Reports page
- Show productivity trends
- Highlight top-performing projects
- Display recommendations
- Match existing design aesthetic
- Can be added as a collapsible panel

---


---

### Phase 5: Cloud-Native Deployment Configuration

#### Provider-Agnostic Architecture

The application is designed to run on any cloud provider or on-premises infrastructure using standard containerization and environment-based configuration.

#### [NEW] [config/cloud-providers.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/config/cloud-providers.ts)

Provider-agnostic configuration abstraction:

```typescript
export interface CloudConfig {
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    ssl?: boolean;
  };
  storage?: {
    bucket: string;
    region: string;
  };
  secrets: {
    getSecret(name: string): Promise<string>;
  };
}

export function getCloudConfig(): CloudConfig {
  const provider = process.env.CLOUD_PROVIDER || 'gcp';
  
  switch (provider) {
    case 'gcp':
      return getGCPConfig();
    case 'aws':
      return getAWSConfig();
    case 'azure':
      return getAzureConfig();
    default:
      return getGenericConfig();
  }
}
```

#### [MODIFY] [Dockerfile](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/Dockerfile)

Cloud-native multi-stage Dockerfile (works on any platform):

```dockerfile
# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js (standalone output for minimal image size)
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image - minimal size
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 8080

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### [NEW] [app/api/health/route.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/app/api/health/route.ts)

Health check endpoint for container orchestration:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data/prisma';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      agents: 'initialized'
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message
      },
      { status: 503 }
    );
  }
}
```

---

#### Google Cloud Platform (GCP) Deployment

#### [MODIFY] [cloudbuild.yaml](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/cloudbuild.yaml)

```yaml
steps:
  # Build container
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/ai-productivity-app:$SHORT_SHA', '.']

  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/ai-productivity-app:$SHORT_SHA']

  # Run database migrations
  - name: 'gcr.io/$PROJECT_ID/ai-productivity-app:$SHORT_SHA'
    entrypoint: 'sh'
    args:
      - '-c'
      - 'npx prisma migrate deploy'
    env:
      - 'DATABASE_URL=$$DATABASE_URL'
    secretEnv: ['DATABASE_URL']

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'ai-productivity-app'
      - '--image=gcr.io/$PROJECT_ID/ai-productivity-app:$SHORT_SHA'
      - '--region=us-central1'
      - '--platform=managed'
      - '--allow-unauthenticated'
      - '--add-cloudsql-instances=$PROJECT_ID:us-central1:ai-productivity-db'
      - '--set-env-vars=CLOUD_PROVIDER=gcp,NODE_ENV=production'
      - '--set-secrets=DATABASE_URL=database-url:latest,NEXTAUTH_SECRET=nextauth-secret:latest,GEMINI_API_KEY=gemini-api-key:latest,GOOGLE_CLIENT_ID=google-client-id:latest,GOOGLE_CLIENT_SECRET=google-client-secret:latest,GITHUB_CLIENT_ID=github-client-id:latest,GITHUB_CLIENT_SECRET=github-client-secret:latest'
      - '--min-instances=1'
      - '--max-instances=10'
      - '--cpu=1'
      - '--memory=512Mi'

availableSecrets:
  secretManager:
    - versionName: projects/$PROJECT_ID/secrets/database-url/versions/latest
      env: 'DATABASE_URL'

images:
  - 'gcr.io/$PROJECT_ID/ai-productivity-app:$SHORT_SHA'
```

---

#### AWS Deployment

#### [NEW] [deploy/aws/task-definition.json](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/deploy/aws/task-definition.json)

AWS ECS Task Definition:

```json
{
  "family": "ai-productivity-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/ai-productivity-app:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "CLOUD_PROVIDER",
          "value": "aws"
        },
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:${AWS_REGION}:${AWS_ACCOUNT_ID}:secret:database-url"
        },
        {
          "name": "NEXTAUTH_SECRET",
          "valueFrom": "arn:aws:secretsmanager:${AWS_REGION}:${AWS_ACCOUNT_ID}:secret:nextauth-secret"
        },
        {
          "name": "GEMINI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:${AWS_REGION}:${AWS_ACCOUNT_ID}:secret:gemini-api-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ai-productivity-app",
          "awslogs-region": "${AWS_REGION}",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8080/api/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

#### [NEW] [deploy/aws/deploy.sh](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/deploy/aws/deploy.sh)

```bash
#!/bin/bash
set -e

AWS_REGION=${AWS_REGION:-us-east-1}
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
IMAGE_NAME="ai-productivity-app"

# Build and push to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

docker build -t $IMAGE_NAME .
docker tag $IMAGE_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME:latest

# Update ECS service
aws ecs update-service \
  --cluster ai-productivity-cluster \
  --service ai-productivity-service \
  --force-new-deployment \
  --region $AWS_REGION

echo "Deployment initiated to AWS ECS"
```

---

#### Azure Deployment

#### [NEW] [deploy/azure/azure-container-app.yaml](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/deploy/azure/azure-container-app.yaml)

Azure Container Apps configuration:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-productivity-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ai-productivity-app
  template:
    metadata:
      labels:
        app: ai-productivity-app
    spec:
      containers:
      - name: app
        image: ${AZURE_REGISTRY}.azurecr.io/ai-productivity-app:latest
        ports:
        - containerPort: 8080
        env:
        - name: CLOUD_PROVIDER
          value: "azure"
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: NEXTAUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: nextauth-secret
        - name: GEMINI_API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: gemini-api-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### [NEW] [deploy/azure/deploy.sh](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/deploy/azure/deploy.sh)

```bash
#!/bin/bash
set -e

RESOURCE_GROUP=${RESOURCE_GROUP:-ai-productivity-rg}
REGISTRY_NAME=${REGISTRY_NAME:-aiproductivityacr}
APP_NAME="ai-productivity-app"

# Login to Azure Container Registry
az acr login --name $REGISTRY_NAME

# Build and push
docker build -t $APP_NAME .
docker tag $APP_NAME:latest $REGISTRY_NAME.azurecr.io/$APP_NAME:latest
docker push $REGISTRY_NAME.azurecr.io/$APP_NAME:latest

# Deploy to Azure Container Apps
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image $REGISTRY_NAME.azurecr.io/$APP_NAME:latest

echo "Deployment initiated to Azure Container Apps"
```

---

#### [NEW] [docker-compose.yml](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/docker-compose.yml)

Local development (provider-agnostic):

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ai_productivity
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    ports:
      - "3000:8080"
    environment:
      CLOUD_PROVIDER: local
      NODE_ENV: development
      DATABASE_URL: postgresql://postgres:password@postgres:5432/ai_productivity
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: development-secret-change-in-production
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      # OAuth credentials (get from respective providers)
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      GITHUB_CLIENT_ID: ${GITHUB_CLIENT_ID}
      GITHUB_CLIENT_SECRET: ${GITHUB_CLIENT_SECRET}
      APPLE_CLIENT_ID: ${APPLE_CLIENT_ID}
      APPLE_CLIENT_SECRET: ${APPLE_CLIENT_SECRET}
      MICROSOFT_CLIENT_ID: ${MICROSOFT_CLIENT_ID}
      MICROSOFT_CLIENT_SECRET: ${MICROSOFT_CLIENT_SECRET}
      MICROSOFT_TENANT_ID: common
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next

volumes:
  postgres_data:
```

---

#### [NEW] [.env.example](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/.env.example)

Environment variables template (provider-agnostic):

```env
# Cloud Provider (gcp, aws, azure, local)
CLOUD_PROVIDER=local

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_productivity

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-secure-random-string

# AI
GEMINI_API_KEY=your-gemini-api-key

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# OAuth - Apple
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret

# OAuth - Microsoft
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
MICROSOFT_TENANT_ID=common

# Application
NODE_ENV=development
PORT=8080
```



#### [MODIFY] [Dockerfile](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/Dockerfile)

Update for Next.js deployment:
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 8080

ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### [MODIFY] [next.config.js](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/next.config.js)

Add production configuration:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For Docker deployment
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

#### [MODIFY] [cloudbuild.yaml](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/cloudbuild.yaml)

Update for Next.js deployment with Cloud SQL:
```yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/ai-productivity-app', '.']

  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/ai-productivity-app']

  # Run database migrations
  - name: 'gcr.io/cloud-builders/gcloud'
    entrypoint: bash
    args:
      - '-c'
      - |
        gcloud run jobs execute migrate-db \
          --region us-central1 \
          --wait

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'ai-productivity-app'
      - '--image'
      - 'gcr.io/$PROJECT_ID/ai-productivity-app'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--add-cloudsql-instances'
      - '$PROJECT_ID:us-central1:ai-productivity-db'
      - '--set-env-vars'
      - 'DATABASE_URL=postgresql://USER:PASSWORD@/ai_productivity?host=/cloudsql/$PROJECT_ID:us-central1:ai-productivity-db'
      - '--set-secrets'
      - 'NEXTAUTH_SECRET=nextauth-secret:latest,GEMINI_API_KEY=gemini-api-key:latest'

images:
  - 'gcr.io/$PROJECT_ID/ai-productivity-app'
```

#### [NEW] [docker-compose.yml](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/docker-compose.yml)

Local development with Docker:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ai_productivity
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/ai_productivity
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: development-secret
      GEMINI_API_KEY: ${GEMINI_API_KEY}
    depends_on:
      - postgres
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next

volumes:
  postgres_data:
```

#### [NEW] [scripts/setup-cloud-sql.sh](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/scripts/setup-cloud-sql.sh)

Script to set up Cloud SQL:
```bash
#!/bin/bash

PROJECT_ID=$1
REGION="us-central1"
INSTANCE_NAME="ai-productivity-db"

# Create Cloud SQL instance
gcloud sql instances create $INSTANCE_NAME \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=$REGION \
  --project=$PROJECT_ID

# Create database
gcloud sql databases create ai_productivity \
  --instance=$INSTANCE_NAME \
  --project=$PROJECT_ID

# Set password
gcloud sql users set-password postgres \
  --instance=$INSTANCE_NAME \
  --password=SECURE_PASSWORD \
  --project=$PROJECT_ID

echo "Cloud SQL instance created successfully!"
```

#### [NEW] [scripts/setup-secrets.sh](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/scripts/setup-secrets.sh)

Script to set up Secret Manager:
```bash
#!/bin/bash

PROJECT_ID=$1

# Create secrets
echo -n "your-nextauth-secret" | gcloud secrets create nextauth-secret \
  --data-file=- \
  --project=$PROJECT_ID

echo -n "your-gemini-api-key" | gcloud secrets create gemini-api-key \
  --data-file=- \
  --project=$PROJECT_ID

# Grant Cloud Run access to secrets
gcloud secrets add-iam-policy-binding nextauth-secret \
  --member="serviceAccount:$PROJECT_ID-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --project=$PROJECT_ID

gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:$PROJECT_ID-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --project=$PROJECT_ID

echo "Secrets created successfully!"
```

---

### Phase 7: Accessibility & Security Implementation

#### Accessibility (WCAG 2.1 Level AA Compliance)

#### [NEW] [lib/accessibility/](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/lib/accessibility/)

**aria-labels.ts** - Centralized ARIA labels:
```typescript
export const ariaLabels = {
  navigation: {
    main: 'Main navigation',
    dashboard: 'Navigate to dashboard',
    reports: 'Navigate to reports',
    projects: 'Navigate to projects',
    logout: 'Sign out of your account'
  },
  forms: {
    taskName: 'Task name',
    humanTime: 'Time without AI assistance in minutes',
    aiTime: 'Time with AI assistance in minutes',
    projectSelect: 'Select project for this task',
    submitTask: 'Add task to dashboard'
  },
  charts: {
    productivity: 'Productivity comparison chart',
    taskBar: (task: string) => `${task} completion time comparison`
  }
};
```

**Requirements:**

1. **Keyboard Navigation**
   - All interactive elements accessible via keyboard
   - Visible focus indicators (2px solid outline)
   - Logical tab order
   - Skip to main content link
   - Keyboard shortcuts documented

2. **Screen Reader Support**
   - Semantic HTML5 elements (`<nav>`, `<main>`, `<article>`, etc.)
   - ARIA labels on all interactive elements
   - ARIA live regions for dynamic content
   - Alt text for all images (including generated charts)
   - Form labels properly associated

3. **Color Contrast**
   - Minimum 4.5:1 for normal text
   - Minimum 3:1 for large text (18pt+)
   - Minimum 3:1 for UI components and graphics
   - Don't rely on color alone for information

4. **Responsive Text**
   - Support 200% zoom without horizontal scrolling
   - Relative units (rem, em) instead of pixels
   - Text spacing adjustable
   - No loss of functionality at 200% zoom

5. **Error Handling**
   - Clear error messages
   - Error identification in forms
   - Suggestions for correction
   - Error prevention (confirmation dialogs)

#### [MODIFY] [components/Chart.tsx](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/components/Chart.tsx)

Add accessibility features:
```typescript
<svg 
  role="img"
  aria-label="Productivity comparison chart showing task completion times"
  aria-describedby="chart-description"
>
  <desc id="chart-description">
    Bar chart comparing task completion times with and without AI assistance.
    {data.map(d => `${d.task}: ${d.humanTime} minutes without AI, ${d.aiTime} minutes with AI`).join('. ')}
  </desc>
  {/* Chart content */}
</svg>

{/* Accessible data table alternative */}
<table className="sr-only" aria-label="Task completion times data table">
  <thead>
    <tr>
      <th>Task</th>
      <th>Time with AI (minutes)</th>
      <th>Time without AI (minutes)</th>
      <th>Productivity Gain</th>
    </tr>
  </thead>
  <tbody>
    {data.map(task => (
      <tr key={task.id}>
        <td>{task.task}</td>
        <td>{task.aiTime}</td>
        <td>{task.humanTime}</td>
        <td>{(task.humanTime / task.aiTime).toFixed(1)}x</td>
      </tr>
    ))}
  </tbody>
</table>
```

#### [NEW] [styles/accessibility.css](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/styles/accessibility.css)

```css
/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

/* Focus visible styles */
*:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --border-width: 2px;
    --focus-outline-width: 3px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

#### Security (OWASP Top 10 Protection)

#### [NEW] [middleware/security.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/middleware/security.ts)

Comprehensive security middleware:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// 1. Content Security Policy
export function securityHeaders(req: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  const headers = new Headers(req.headers);
  headers.set('Content-Security-Policy', cspHeader);
  headers.set('X-DNS-Prefetch-Control', 'off');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return { headers, nonce };
}

// 2. Rate Limiting
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit login attempts
  skipSuccessfulRequests: true,
});

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit AI requests to prevent abuse
});

// 3. Input Validation
import { z } from 'zod';

export const taskSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  humanTime: z.number().positive().max(10000),
  aiTime: z.number().positive().max(10000),
  projectId: z.string().uuid(),
});

export const projectSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  initialTask: z.string().min(1).max(200).trim(),
});

// 4. SQL Injection Prevention
// Prisma handles this automatically with parameterized queries
// Never use raw SQL without parameterization

// 5. XSS Prevention
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// 6. CSRF Protection
// NextAuth handles CSRF tokens automatically
// For custom forms, use next-csrf

// 7. Secure Session Management
export const sessionConfig = {
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};
```

#### [NEW] [lib/security/encryption.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/lib/security/encryption.ts)

Data encryption for sensitive information:

```typescript
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'); // 32 bytes
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  
  const key = crypto.pbkdf2Sync(KEY, salt, 100000, 32, 'sha512');
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return Buffer.concat([salt, iv, tag, Buffer.from(encrypted, 'hex')]).toString('hex');
}

export function decrypt(encryptedData: string): string {
  const buffer = Buffer.from(encryptedData, 'hex');
  
  const salt = buffer.slice(0, SALT_LENGTH);
  const iv = buffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = buffer.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const encrypted = buffer.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  
  const key = crypto.pbkdf2Sync(KEY, salt, 100000, 32, 'sha512');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}
```

#### [NEW] [lib/security/audit-log.ts](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/lib/security/audit-log.ts)

Security audit logging:

```typescript
export interface AuditLog {
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  metadata?: any;
}

export async function logSecurityEvent(event: Omit<AuditLog, 'timestamp'>) {
  const log: AuditLog = {
    ...event,
    timestamp: new Date(),
  };
  
  // Log to database
  await prisma.auditLog.create({ data: log });
  
  // Log to monitoring service (e.g., Google Cloud Logging)
  console.log(JSON.stringify(log));
  
  // Alert on suspicious activity
  if (event.action === 'failed_login' && await checkFailedLoginCount(event.userId) > 5) {
    await sendSecurityAlert(event.userId, 'Multiple failed login attempts');
  }
}
```

#### Security Checklist:

- [x] **A1: Injection** - Prisma ORM prevents SQL injection, Zod validates input
- [x] **A2: Broken Authentication** - NextAuth with OAuth, secure session management
- [x] **A3: Sensitive Data Exposure** - Encryption at rest, HTTPS only, secure headers
- [x] **A4: XML External Entities** - Not applicable (no XML processing)
- [x] **A5: Broken Access Control** - User ID validation on all API routes
- [x] **A6: Security Misconfiguration** - Security headers, CSP, environment-based config
- [x] **A7: XSS** - React auto-escapes, CSP headers, input sanitization
- [x] **A8: Insecure Deserialization** - JSON only, schema validation
- [x] **A9: Using Components with Known Vulnerabilities** - Dependabot, npm audit
- [x] **A10: Insufficient Logging & Monitoring** - Audit logs, security event tracking

---

### Phase 8: Data Migration

**Note**: This phase is **REMOVED** as current data is demo/test data only. No migration needed.

---


#### [NEW] [scripts/migrate-localstorage.html](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/scripts/migrate-localstorage.html)

Simple HTML page for users to export their localStorage data:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Export Data</title>
</head>
<body>
  <h1>Export Your Data</h1>
  <button onclick="exportData()">Download Data</button>
  <script>
    function exportData() {
      const projects = localStorage.getItem('projects');
      const chartData = localStorage.getItem('chartData');
      const data = { projects, chartData };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-productivity-data.json';
      a.click();
    }
  </script>
</body>
</html>
```

#### [NEW] [app/migrate/page.tsx](file:///Users/aaranvi/dev/ai/antigravity-demo/human-vs-ai-app/app/migrate/page.tsx)

Migration page for importing old data:
- File upload for JSON export
- Parse and validate data
- Call API to import projects and tasks
- Show progress and success message
- Match existing design

---


---

## Verification Plan

### Automated Tests

#### Backend Unit Tests

**Location**: `backend/src/__tests__/`

**Command to run**:
```bash
cd backend
npm test
```

**Tests to write**:
1. **Auth Controller Tests** (`auth.controller.test.ts`):
   - User registration with valid data
   - User registration with duplicate email (should fail)
   - Login with correct credentials
   - Login with incorrect password (should fail)
   - JWT token generation and validation

2. **Projects Controller Tests** (`projects.controller.test.ts`):
   - Create project for authenticated user
   - List projects (should only return user's projects)
   - Update project name
   - Delete project (should cascade delete tasks)
   - Access control (user can't access another user's project)

3. **Tasks Controller Tests** (`tasks.controller.test.ts`):
   - Create task with valid data
   - Create task with invalid times (negative numbers)
   - Update task times
   - Delete task
   - List tasks with project information

4. **Analytics Controller Tests** (`analytics.controller.test.ts`):
   - Calculate overall statistics correctly
   - Group by project correctly
   - Calculate productivity gains accurately
   - Handle empty data gracefully

5. **AI Service Tests** (`ai.service.test.ts`):
   - Mock Gemini API responses
   - Parse AI responses correctly
   - Handle API errors gracefully
   - Time estimation logic

**Setup**: Use Jest with Supertest for API testing, mock Prisma client

#### Backend Integration Tests

**Location**: `backend/src/__tests__/integration/`

**Command to run**:
```bash
cd backend
npm run test:integration
```

**Tests to write**:
1. **Full API Flow Test** (`api-flow.test.ts`):
   - Register user → Login → Create project → Add tasks → Get analytics
   - Verify data persistence
   - Test authentication flow end-to-end

2. **Database Tests** (`database.test.ts`):
   - Test cascade deletes
   - Test indexes are used
   - Test transaction rollbacks

**Setup**: Use test database, reset between tests

#### Frontend Unit Tests

**Location**: `src/__tests__/`

**Command to run**:
```bash
npm test
```

**Tests to write**:
1. **Auth Service Tests** (`auth.service.test.ts`):
   - Token storage and retrieval
   - Token expiry detection
   - Auto-refresh logic

2. **API Client Tests** (`api.test.ts`):
   - Request interceptor adds token
   - Response interceptor handles errors
   - Retry logic on network failure

3. **Component Tests**:
   - Login form validation
   - Register form validation
   - Protected route redirects

**Setup**: Use Vitest (already configured), mock API calls

### Manual Verification

#### 1. Local Development Setup

**Steps**:
1. Clone repository
2. Set up PostgreSQL database locally:
   ```bash
   # Using Docker
   docker run --name ai-productivity-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
   ```
3. Set up backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with database credentials
   npx prisma migrate dev
   npx prisma db seed
   npm run dev
   ```
4. Set up frontend:
   ```bash
   npm install
   npm run dev
   ```
5. Verify both servers running:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001
   - Backend health check: http://localhost:3001/health

**Expected Result**: Both servers start without errors, can access frontend in browser

#### 2. Authentication Flow

**Steps**:
1. Navigate to http://localhost:5173
2. Should redirect to login page (not authenticated)
3. Click "Register" link
4. Fill in registration form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "SecurePass123!"
5. Submit form
6. Should redirect to dashboard
7. Verify user name appears in header
8. Logout
9. Login again with same credentials
10. Should successfully login and see dashboard

**Expected Result**: Full auth flow works, user persists in database, can login/logout

#### 3. Data Persistence

**Steps**:
1. Login as test user
2. Create a new project: "Website Redesign"
3. Add a task:
   - Task: "Design homepage mockup"
   - Human + AI: 45 minutes
   - Human Only: 180 minutes
   - Project: "Website Redesign"
4. Verify task appears in dashboard chart
5. Navigate to Projects page
6. Verify project and task appear
7. Close browser completely
8. Reopen browser, navigate to app
9. Login again
10. Verify project and task still exist

**Expected Result**: Data persists across sessions, stored in database not localStorage

#### 4. Multi-User Isolation

**Steps**:
1. Login as test user (test@example.com)
2. Create project "User 1 Project" with task
3. Logout
4. Register new user (test2@example.com)
5. Verify dashboard is empty (no projects/tasks)
6. Create project "User 2 Project" with task
7. Logout
8. Login as first user (test@example.com)
9. Verify only "User 1 Project" is visible
10. Logout
11. Login as second user (test2@example.com)
12. Verify only "User 2 Project" is visible

**Expected Result**: Each user sees only their own data, complete isolation

#### 5. AI Features

**Steps**:
1. Login as test user
2. Open chat widget
3. Send message: "Estimate time for task: Write API documentation"
4. Verify AI responds with time estimates
5. Send message: "What's my most productive project?"
6. Verify AI analyzes user's data and responds
7. Create a task using AI-suggested times
8. Verify task is created with correct data

**Expected Result**: AI features work, can access user's data, provides relevant responses

#### 6. Reports Page

**Steps**:
1. Login with user that has multiple projects and tasks
2. Navigate to Reports page
3. Verify chart displays all projects
4. Verify statistics are accurate
5. Hover over data points
6. Verify tooltips show correct values

**Expected Result**: Reports page works identically to before, but data comes from API

#### 7. Browser Testing

**Using browser_subagent tool**:
1. Test responsive design on mobile viewport
2. Test all navigation links
3. Test form submissions
4. Test error states (network errors, validation errors)
5. Test loading states

**Expected Result**: UI remains exactly the same as current design, all interactions work

### Performance Testing

**Steps**:
1. Create 100+ tasks via API
2. Measure dashboard load time (should be < 2 seconds)
3. Measure reports page render time (should be < 3 seconds)
4. Test concurrent users (10+ simultaneous logins)

**Tools**: Apache Bench or Artillery for load testing

**Expected Result**: App remains responsive with realistic data volumes

### Deployment Verification

#### Cloud SQL Setup

**Steps**:
1. Create Cloud SQL instance:
   ```bash
   gcloud sql instances create ai-productivity-db \
     --database-version=POSTGRES_14 \
     --tier=db-f1-micro \
     --region=us-central1
   ```
2. Create database:
   ```bash
   gcloud sql databases create ai_productivity --instance=ai-productivity-db
   ```
3. Set root password:
   ```bash
   gcloud sql users set-password postgres \
     --instance=ai-productivity-db \
     --password=SECURE_PASSWORD
   ```

#### Backend Deployment

**Steps**:
1. Build and deploy backend:
   ```bash
   gcloud builds submit --config cloudbuild-backend.yaml
   ```
2. Verify backend is running:
   ```bash
   gcloud run services describe ai-productivity-backend --region us-central1
   ```
3. Test health endpoint:
   ```bash
   curl https://ai-productivity-backend-xxx.run.app/health
   ```

**Expected Result**: Backend deploys successfully, health check returns 200 OK

#### Frontend Deployment

**Steps**:
1. Update frontend environment variables to point to production backend
2. Build and deploy frontend:
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```
3. Verify frontend is running:
   ```bash
   gcloud run services describe ai-productivity-app --region us-central1
   ```
4. Open frontend URL in browser
5. Test full user flow in production

**Expected Result**: Frontend deploys successfully, can access via public URL, all features work

#### Database Migrations in Production

**Steps**:
1. Run migrations on Cloud SQL:
   ```bash
   # Connect to Cloud SQL via Cloud Run job or local proxy
   gcloud sql connect ai-productivity-db --user=postgres
   # Run Prisma migrations
   npx prisma migrate deploy
   ```

**Expected Result**: Database schema created successfully in Cloud SQL

### Rollback Plan

If issues are found:
1. Keep old frontend version running
2. Revert Cloud Run to previous revision:
   ```bash
   gcloud run services update-traffic ai-productivity-app \
     --to-revisions PREVIOUS_REVISION=100 \
     --region us-central1
   ```
3. Database migrations can be rolled back using Prisma migrate

---

## Implementation Timeline Estimate

- **Phase 1** (Backend Infrastructure): 4-6 hours
- **Phase 2** (Database Setup): 3-4 hours
- **Phase 3** (API Development): 12-16 hours
- **Phase 4** (Frontend Integration): 8-12 hours
- **Phase 5** (AI Enhancement): 6-8 hours
- **Phase 6** (Deployment): 4-6 hours
- **Phase 7** (Data Migration): 2-3 hours
- **Testing**: 6-8 hours

**Total Estimated Time**: 45-63 hours

---

## Next Steps

1. **Review this plan** and provide feedback
2. **Confirm technology choices** or suggest alternatives
3. **Answer questions** about multi-user features and collaboration
4. **Approve to proceed** to implementation

Once approved, I will begin with Phase 1 (Backend Infrastructure Setup) and proceed systematically through each phase.
