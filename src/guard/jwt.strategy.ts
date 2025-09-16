import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../service/users.service';
import { BlacklistService } from '../service/blacklist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private usersService: UsersService,
    private blacklistService: BlacklistService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        done(null, config.get<string>('JWT_SECRET'));
      },
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (this.blacklistService.has(token)) {
      throw new UnauthorizedException('Token has been revoked');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    delete (user as any).password;
    return user;
  }
}
