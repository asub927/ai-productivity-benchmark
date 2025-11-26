import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) { }

    // Google OAuth
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // Initiates Google OAuth flow
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Req() req, @Res() res: Response) {
        const token = await this.authService.generateJwtToken(req.user);
        const frontendUrl = this.configService.get('FRONTEND_URL');

        // Redirect to frontend with token
        res.redirect(`${frontendUrl}/auth/callback?token=${token.access_token}`);
    }


    // Get current user
    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async getCurrentUser(@Req() req) {
        return req.user;
    }
}
