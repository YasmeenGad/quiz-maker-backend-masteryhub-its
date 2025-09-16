import { Module } from '@nestjs/common';
import { SubmissionsService } from '../../service/submissions.service';
import { SubmissionsController } from '../../controller/submissions.controller';

@Module({
  providers: [SubmissionsService],
  controllers: [SubmissionsController]
})
export class SubmissionsModule {}
