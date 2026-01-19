import { Module } from '@nestjs/common'
import { RealtorController } from './realtor.controller'
import { RealtorService } from './realtor.service'

@Module({
  controllers: [RealtorController],
  providers: [RealtorService],
})
export class RealtorModule {}

