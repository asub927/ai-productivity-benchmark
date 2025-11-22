import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';
import { ProjectsService } from './services/projects.service';
import { TasksService } from './services/tasks.service';
import { AnalyticsService } from './services/analytics.service';
import { AiOrchestratorService } from './services/ai-orchestrator.service';
import { McpModule } from '../mcp/mcp.module';

@Module({
    imports: [DataModule, McpModule],
    providers: [
        ProjectsService,
        TasksService,
        AnalyticsService,
        AiOrchestratorService,
    ],
    exports: [
        ProjectsService,
        TasksService,
        AnalyticsService,
        AiOrchestratorService,
    ],
})
export class ProcessModule { }
