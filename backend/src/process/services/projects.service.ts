import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProjectsRepository } from '../../data/repositories/projects.repository';
import { McpService } from '../../mcp/mcp.service';
import { z } from 'zod';

@Injectable()
export class ProjectsService implements OnModuleInit {
    constructor(
        private projectsRepository: ProjectsRepository,
        private mcpService: McpService
    ) { }

    onModuleInit() {
        this.mcpService.registerTool(
            'get_user_projects',
            'Get all projects for a user',
            {
                userId: z.string().describe('The ID of the user to fetch projects for'),
            },
            async ({ userId }) => this.getAllProjects(userId)
        );

        this.mcpService.registerTool(
            'create_project',
            'Create a new project',
            {
                userId: z.string().describe('The ID of the user creating the project'),
                name: z.string().describe('The name of the project'),
                initialTask: z.string().optional().describe('Optional initial task name'),
            },
            async ({ userId, name, initialTask }) => this.createProject(userId, { name, taskNames: initialTask ? [initialTask] : [] })
        );
    }

    async getAllProjects(userId: string) {
        return this.projectsRepository.findAllByUserId(userId);
    }

    async getProjectById(id: string) {
        return this.projectsRepository.findById(id);
    }

    async createProject(
        userId: string,
        data: { name: string; taskNames?: string[] },
    ) {
        // Business logic: validate project name
        if (!data.name || data.name.trim().length === 0) {
            throw new Error('Project name cannot be empty');
        }

        return this.projectsRepository.create(userId, data);
    }

    async addTaskDefinition(projectId: string, taskName: string) {
        if (!taskName || taskName.trim().length === 0) {
            throw new Error('Task name cannot be empty');
        }
        return this.projectsRepository.addTaskDefinition(projectId, taskName);
    }

    async removeTaskDefinition(projectId: string, taskName: string) {
        return this.projectsRepository.removeTaskDefinition(projectId, taskName);
    }

    async updateProject(id: string, data: { name?: string }) {
        if (data.name && data.name.trim().length === 0) {
            throw new Error('Project name cannot be empty');
        }

        return this.projectsRepository.update(id, data);
    }

    async deleteProject(id: string) {
        return this.projectsRepository.delete(id);
    }
}
