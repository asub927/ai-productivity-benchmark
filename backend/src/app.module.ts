import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ExperienceModule } from './experience/experience.module';
import { ProcessModule } from './process/process.module';
import { DataModule } from './data/data.module';
import { AuthModule } from './auth/auth.module';
import { McpModule } from './mcp/mcp.module';

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per minute
      },
    ]),

    // Application layers
    ExperienceModule,
    ProcessModule,
    DataModule,
    AuthModule,
    McpModule,
  ],
})
export class AppModule { }
