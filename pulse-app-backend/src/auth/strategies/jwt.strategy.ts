/* eslint-disable @typescript-eslint/require-await */
// pulse-app-backend/src/auth/strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import { Role } from '../enums/role.enum'; // Import Role enum

// Define the structure of the JWT payload we expect
interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: Role; // User Role
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService, // Inject ConfigService
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      // This should theoretically not happen due to Joi validation in AppModule
      throw new InternalServerErrorException('JWT_SECRET not configured');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Standard way to extract JWT from Authorization header
      ignoreExpiration: false, // Ensure expired tokens are rejected
      secretOrKey: secret, // Use the validated secret
      // secretOrKey: 'YOUR_SECRET_KEY', // TODO: Replace with config/env variable access
    });
  }

  /**
   * Called by Passport after verifying JWT signature.
   * @param payload The decoded JWT payload (JwtPayload interface)
   * @returns The validated user object to attach to request.user
   */
  async validate(payload: JwtPayload) {
    // Check for essential properties
    if (!payload || !payload.sub || !payload.email || !payload.role) {
      throw new UnauthorizedException('Invalid token payload');
    }
    // Return the necessary user info, including the role
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
