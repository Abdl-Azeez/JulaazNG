import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RealtorModule } from './modules/realtor/realtor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RealtorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

