import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { User } from './user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string): Promise<User> {
    const existingUser = await this.userService.find(email);
    if (existingUser.length) {
      throw new BadRequestException('user already exist');
    }

    // hash user password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = `${salt}.${hash.toString('hex')}`;

    // create new user
    const user = await this.userService.create(email, result);

    return user;
  }

  async signin(email: string, password) {
    const errorMessage = 'user not found or wrong password';
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new BadRequestException(errorMessage);
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException(errorMessage);
    }

    return user;
  }
}
