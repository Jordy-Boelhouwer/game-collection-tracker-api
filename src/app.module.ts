import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevelopersModule } from './developers/developers.module';
import { PublishersModule } from './publishers/publishers.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [DevelopersModule, PublishersModule, GamesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
