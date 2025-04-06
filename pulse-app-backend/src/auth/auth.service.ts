import { Injectable } from '@nestjs/common';
import { UsersService, User } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates user credentials.
   * Called by LocalStrategy.
   * @param email User's email
   * @param pass Plain text password
   * @returns User object without password if valid, null otherwise.
   */
  async validateUser(email: string, pass: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && await bcrypt.compare(pass, user.passwordHash)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...result } = user;
        return result;
    }
    return null;
  }

  /**
   * Generates a JWT for a given user.
   * Called after successful validation (e.g., in the login endpoint).
   * @param user User object (typically the result from validateUser, containing _id, email, and role)
   * @returns An object containing the access token.
   */
  async login(user: Omit<User, 'passwordHash'>) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Registration logic is handled primarily by UsersService.create,
  // but the /register endpoint will be in AuthController.
}
