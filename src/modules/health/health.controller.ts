import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseDTO } from 'src/common/dto/response.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check API Health' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The API is healthy',
  })
  check() {
    return new BaseResponseDTO({
      data: { status: HttpStatus.OK },
      message: 'Health check successful',
    });
  }
}
