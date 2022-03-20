import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  beforeEach(async () => {
    fakeUserService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({
          id: 1,
          email,
          password,
        } as User),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('signup fail if user already exist', async () => {
    const existingEmail = 'existing@email.com';
    fakeUserService.find = () =>
      Promise.resolve([{ id: 1, email: existingEmail } as User]);
    try {
      await service.signup(existingEmail, '123');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(e.message).toBe('user already exist');
    }
  });

  it('signup a new user with salted and hashed password', async () => {
    const password = '123';
    const user = await service.signup('new@email.com', password);
    expect(user.password).not.toEqual(password);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
    expect(user.id).toBeDefined();
  });

  it('signin fail if email not found', async () => {
    try {
      await service.signin('test@email.com', '123');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(e.message).toBe('user not found or wrong password');
    }
  });

  it('signup fail if password is wrong', async () => {
    const email = 'test@email.com';
    const password = 'wrong password';
    fakeUserService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email,
          password: 'password',
        } as User,
      ]);

    try {
      await service.signin(email, password);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(e.message).toBe('user not found or wrong password');
    }
  });

  it('signup success if credentials is correct', async () => {
    const email = 'test@email.com';
    const password = 'password ok';

    const users: User[] = [];
    fakeUserService.find = (email: string) => {
      const filteredUser = users.filter((user) => user.email === email);
      return Promise.resolve(filteredUser);
    };
    fakeUserService.create = (email: string, password: string) => {
      const user = { id: 1, email, password } as User;
      users.push(user);
      return Promise.resolve(user);
    };

    await service.signup(email, password);

    const user = await service.signin(email, password);
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.password).toBeDefined();
  });
});
