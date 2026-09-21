import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";
import { formularioService } from "./formularios.service";
import { formularioController } from "./formularioController";

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || "dev-secret" }),
  ],
  controllers: [formularioController],
  providers: [formularioService, PrismaService],
})
export class FormulariosModule {}
