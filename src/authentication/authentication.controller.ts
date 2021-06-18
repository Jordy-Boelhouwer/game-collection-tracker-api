import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Req,
  Res,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthenticationGuard } from './guards/localAuthentication.guard';
import { RequestWithUser } from './interfaces/requestWithUser.interface';
import { Public } from './decorators/public.decorator';
import { JwtAuthenticationGuard } from './guards/jwtAuthentication.guard';
import { UsersService } from '../users/users.service';
import JwtRefreshGuard from './guards/jwtRefresh.guard';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @Public()
  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokencookie = this.authenticationService.getCookieWithJwtToken(
      user.id,
    );
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
    request.res.setHeader('Set-Cookie', [
      accessTokencookie,
      refreshTokenCookie,
    ]);
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookiesForLogOut(),
    );
  }
}
