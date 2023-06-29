import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import exp from 'constants';

let controller: UsersController;
let fakeUsersService: Partial<UsersService>;
let fakeAuthService: Partial<AuthService>;

describe('UsersController', () => {
  fakeUsersService = {
    findOne: (id: number) =>
      Promise.resolve({
        id,
        email: 'test@test.com',
        password: '12345',
      } as User),
    find: (email: string) =>
      Promise.resolve([{ id: 1, email, password: '12345' } as User]),
    create: (email: string, password: string) => {
      return Promise.resolve({ id: 1, email, password } as User);
    },
    // update: () => {},
    // remove: () => {},
  };

  fakeAuthService = {
    signup: (email, password) => {
      return Promise.resolve({ id: 1, email, password } as User);
    },
    signin: (email, password) => {
      return Promise.resolve({ id: 1, email, password } as User);
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('can create an insatance of user controller', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with given email', async () => {
    const users = await controller.findAllUsers('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toBe('test@test.com');
  });

  it('findUser returns a single user with given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throw an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;

    await expect(controller.findUser('1')).rejects.toThrow(
      new NotFoundException('user not found'),
    );
  });

  it('signin method update session object and return user', async () => {
    const session = { userId: -10 };

    const user = await controller.loginUser(
      { email: 'test@test.com', password: '12345' },
      session,
    );
    expect(user).toBeDefined();
    expect(session.userId).toBe(user.id);
  });

  // it('signup method return user with provided email and password', async () => {
  //   const session = { userId: -10 };

  //   const user = await controller.createUser(
  //     { email: 'test@test.com', password: '12345' },
  //     session,
  //   );
  //   console.log(user);
  //   expect(user).toBeDefined();
  //   expect(user.password).toBe('12345');
  // });
});
