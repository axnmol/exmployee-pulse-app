import { Module } from '@nestjs/common';
import { SurveysController } from './surveys.controller';
import { SurveysService } from './surveys.service';

@Module({
  imports: [],
  controllers: [SurveysController],
  providers: [SurveysService],
  // We might need to export SurveysService if other modules need it, but not for now.
})
export class SurveysModule {}
