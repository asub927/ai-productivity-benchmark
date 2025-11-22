import { Injectable, OnModuleInit } from '@nestjs/common';
import { TasksRepository } from '../../data/repositories/tasks.repository';
import { McpService } from '../../mcp/mcp.service';
import { z } from 'zod';

@Injectable()
export class TasksService implements OnModuleInit {
    constructor(
        private tasksRepository: TasksRepository,
        private mcpService: McpService
    ) { }

    onModuleInit() {
        this.mcpService.registerTool(
            'get_user_tasks',
            'Get all tasks for a user',
            {
                userId: z.string().describe('The ID of the user to fetch tasks for'),
            },
            async ({ userId }) => this.getAllTasks(userId)
        );

        this.mcpService.registerTool(
            'create_task',
            'Create a new task',
            {
                userId: z.string().describe('The ID of the user creating the task'),
                projectId: z.string().describe('The ID of the project the task belongs to'),
                name: z.string().describe('The name of the task'),
                humanTime: z.number().describe('Time taken by human (minutes)'),
                aiTime: z.number().describe('Time taken with AI (minutes)'),
            },
            async ({ userId, projectId, name, humanTime, aiTime }) => this.createTask(userId, projectId, { name, humanTime, aiTime })
        );
    }

    async getAllTasks(userId: string) {
        return this.tasksRepository.findAllByUserId(userId);
    }

    async getTasksByProject(projectId: string) {
        return this.tasksRepository.findByProjectId(projectId);
    }

    async getTaskById(id: string) {
        return this.tasksRepository.findById(id);
    }

    async createTask(
        userId: string,
        projectId: string,
        data: {
            name: string;
            humanTime: number;
            aiTime: number;
        },
    ) {
        // Business logic: validate task data
        if (!data.name || data.name.trim().length === 0) {
            throw new Error('Task name cannot be empty');
        }

        if (data.humanTime < 0 || data.aiTime < 0) {
            throw new Error('Time values must be positive');
        }

        return this.tasksRepository.create(userId, projectId, data);
    }

    async updateTask(
        id: string,
        data: {
            name?: string;
            humanTime?: number;
            aiTime?: number;
        },
    ) {
        if (data.name && data.name.trim().length === 0) {
            throw new Error('Task name cannot be empty');
        }

        if (
            (data.humanTime !== undefined && data.humanTime < 0) ||
            (data.aiTime !== undefined && data.aiTime < 0)
        ) {
            throw new Error('Time values must be positive');
        }

        return this.tasksRepository.update(id, data);
    }

    async deleteTask(id: string) {
        return this.tasksRepository.delete(id);
    }
}
