import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "./prisma.service";
import { IziModule } from "./izi/izi.module";
import { InstituicoesModule } from "./instituicoes/instituicoes.module";
import { FormulariosModule } from "./formularios/fomularioModule";
import { PublicoModule } from "./publico/publico.module";

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || "dev-secret" }),
    IziModule,
    InstituicoesModule,
    FormulariosModule,
    PublicoModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService, JwtModule],
})
export class AppModule {}
