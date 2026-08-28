import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { FormulariosController } from "./formularios.controller";
import { FormulariosService } from "./formularios.service";
import { PrismaService } from "../prisma.service";
@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || "dev-secret" }),
  ],
  controllers: [FormulariosController],
  providers: [FormulariosService, PrismaService],
  exports: [FormulariosService],
})
export class FormulariosModule {}
