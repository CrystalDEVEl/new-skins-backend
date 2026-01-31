import {
  ConflictException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { PASS_SALT_ROUNDS } from "src/constants";
import bcrypt from "bcryptjs";
import type { User } from "prisma/generated/prisma/client";
import { JwtPayload } from "./strategies/jwt.strategy";

type RegisterResponse = Omit<
  User,
  "password" | "role" | "verified" | "createdAt" | "updatedAt"
>;

interface AuthResponse {
  accessToken: string;
  user: RegisterResponse;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(data: RegisterDto): Promise<AuthResponse> {
    try {
      const { email, name, password, avatar } = data;

      const candidate = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (candidate) {
        throw new ConflictException(
          "Пользователь с таким email уже существует"
        );
      }

      const hashedPassword = await bcrypt.hash(password, PASS_SALT_ROUNDS);

      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: "USER",
          verified: false,
          avatar: avatar || "default-avatar.jpg",
        },
        omit: {
          password: true,
          role: true,
          verified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const accessToken = await this.generateToken(user.id, email, "USER");

      return {
        accessToken,
        user,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Ошибка при регистрации пользователя", 500);
    }
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    try {
      const { email, password } = data;

      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new UnauthorizedException("Неверный email или пароль");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException("Неверный email или пароль");
      }

      const accessToken = await this.generateToken(
        user.id,
        user.email,
        user.role
      );

      const { password: _, role, verified, createdAt, updatedAt, ...userData } = user;

      return {
        accessToken,
        user: userData,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Ошибка при авторизации", 500);
    }
  }

  async validateUser(userId: number): Promise<RegisterResponse | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      omit: {
        password: true,
        role: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  private async generateToken(
    userId: number,
    email: string,
    role: string
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role,
    };

    return this.jwtService.signAsync(payload);
  }
}
