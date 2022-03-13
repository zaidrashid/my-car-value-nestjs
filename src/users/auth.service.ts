import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    const existingUser = await this.userService.find(email);
    if (existingUser.length) {
      throw new BadRequestException('user already exist');
    }
  }
}
