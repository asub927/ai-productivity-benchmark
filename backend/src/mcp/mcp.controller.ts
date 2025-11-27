import { Controller, Get, Post, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { McpService } from './mcp.service';

@Controller('mcp')
export class McpController {
    constructor(private readonly mcpService: McpService) { }

    @Get('sse')
    async handleSse(@Res() res: Response) {
        await this.mcpService.handleConnection(res);
    }

    @Post('sse')
    async handlePost(@Req() req: Request, @Res() res: Response) {
        await this.mcpService.handleMessage(req, res);
    }
}
