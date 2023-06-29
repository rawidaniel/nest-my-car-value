import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // hash the user password

    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // hash the salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const newPassword = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.usersService.create(email, newPassword);

    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    // find the user with provided email
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    // hash the provided password
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = hash.toString('hex');

    if (result !== storedHash) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }
}
