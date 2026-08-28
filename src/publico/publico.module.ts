import { Module } from "@nestjs/common";
import { PublicoController } from "./publico.controller";
import { PublicoService } from "./publico.service";
import { PrismaService } from "../prisma.service";
@Module({
  controllers: [PublicoController],
  providers: [PublicoService, PrismaService],
})
export class PublicoModule {}
