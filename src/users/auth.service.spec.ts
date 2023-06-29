import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

let service: AuthService;
let fakeUsersService: Partial<UsersService>;

describe('AuthService', () => {
  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        const userFiltered = users.filter((user) => user.email === email);
        return Promise.resolve(userFiltered);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can crate an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', '12345');

    expect(user.password).not.toBe('1234');
    const [salt, storedHash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(storedHash).toBeDefined();
  });

  it('throw an error if user signs up with email that is in use', async () => {
    await service.signup('test@test.com', '12345');

    // try {
    //   const user = await service.signup('test@test.com', '12345');
    //   console.log(user);

    //   expect(user).toBeUndefined();
    // } catch (e) {
    //   expect(e.response?.message).toBe('email in use');
    //   expect(e).toBeInstanceOf(BadRequestException);
    // }

    await expect(service.signup('test@test.com', '12345')).rejects.toThrow(
      new BadRequestException('email in use'),
    );
  });

  it('throw an error if signin is called with an unused email', async () => {
    return expect(service.signin('test@test.com', '12345')).rejects.toThrow(
      new NotFoundException('user not found'),
    );
  });

  it('throw an error if signin is called with invalid password', async () => {
    await service.signup('test@test.com', 'password');

    await expect(
      service.signin('test@test.com', 'newpassword'),
    ).rejects.toThrow(new BadRequestException('Invalid credentials'));
  });

  it('return user if correct password is provided', async () => {
    await service.signup('test@test.com', 'password');
    const user = await service.signin('test@test.com', 'password');
    expect(user).toBeDefined();
  });
});
