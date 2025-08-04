import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 401, description: 'Email already in use' })
  async signup(@Body() body: SignUpDto) {
    const user = await this.authService.registerUser(body);
    return this.authService.login(user);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and return access token' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    const user = await this.authService.validateUser({ email, password });
    return this.authService.login(user);
  }
}
