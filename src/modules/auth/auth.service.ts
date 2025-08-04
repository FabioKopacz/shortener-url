import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user/user.repository';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: LoginDto) {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user?.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  login(user: { user_id: string; email: string }) {
    const payload = { user_id: user.user_id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerUser({ email, password }: SignUpDto) {
    const existing = await this.userRepository.getUserByEmail(email);
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.createUser({
      email,
      password: hashedPassword,
    });

    return user;
  }
}
