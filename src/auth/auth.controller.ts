import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Public } from "./decorators/public.decorator";
import type { User } from "prisma/generated/prisma/client";

@Controller("auth")
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("/register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() data: RegisterDto) {
    const result = await this.authService.register(data);

    return {
      message: "Пользователь успешно зарегистрирован",
      ...result,
    };
  }

  @Public()
  @Post("/login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginDto) {
    const result = await this.authService.login(data);

    return {
      message: "Авторизация успешна",
      ...result,
    };
  }

  @Get("/me")
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@CurrentUser() user: User) {
    return user;
  }
}
