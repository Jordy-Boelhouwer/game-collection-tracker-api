import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevelopersModule } from './developers/developers.module';
import { PublishersModule } from './publishers/publishers.module';

@Module({
  imports: [DevelopersModule, PublishersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
