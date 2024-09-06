/* eslint-disable prettier/prettier */

import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

import { AuthService } from "./auth.service";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";

import constants from "../shared/security/constants";

@Module({
  exports: [AuthService],
  imports: [
    JwtModule.register({
      secret: constants.JWT_SECRET,
      signOptions: { expiresIn: constants.JWT_EXPIRES_IN },
    }),
    PassportModule,
    UserModule,
  ],
  providers: [AuthService, JwtService, JwtStrategy, LocalStrategy, UserService],
})

export class AuthModule { }