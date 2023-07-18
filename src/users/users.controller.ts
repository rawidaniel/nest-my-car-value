import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Delete,
  Patch,
  NotFoundException,
  HttpCode,
  Session,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from './decorators/currentUser.decorator';
import { CurrentUserInterceptor } from './interceptors/currentUser.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { User } from './user.entity';

@ApiTags('Auth')
@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/whoami')
  // async whoAmI(@Session() session: any) {
  //   const user = await this.usersService.findOne(session.userId);
  //   if (!user) {
  //     throw new NotFoundException('user not found');
  //   }
  //   return user;
  // }

  @ApiCookieAuth('in-app-cookie-name')
  @ApiResponse({ status: 401, description: 'you are not logged in' })
  @ApiOperation({ description: 'Retrive currently logged in user' })
  @Get('/whoami')
  @UseGuards(AuthGuard)
  async whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  @ApiOperation({ description: 'sinout a logged in user' })
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  @ApiResponse({
    status: 400,
    description: 'The email provided is taken',
  })
  @ApiOperation({ description: 'Create a new user' })
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  @ApiOperation({ description: 'Sigin in a created user' })
  @ApiResponse({ status: 404, description: 'user not found' })
  @ApiResponse({ status: 400, description: 'invalid credential' })
  @HttpCode(200)
  async loginUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  @ApiOperation({ description: 'Find a user with a provided id' })
  @ApiResponse({ status: 404, description: 'user not found' })
  async findUser(@Param('id') id: string) {
    // console.log('handler is running');
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  @ApiOperation({ description: 'Reterive all users with a provided email' })
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  @ApiOperation({ description: 'Delete a user with a give id' })
  @ApiResponse({ status: 404, description: 'user not found' })
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  @ApiOperation({ description: 'Update a user with a give id' })
  @ApiResponse({ status: 403, description: 'Restricted only for admin' })
  @ApiResponse({ status: 404, description: 'user not found' })
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    if (user?.admin !== true) {
      throw new UnauthorizedException('only admin can update user');
    }
    return this.usersService.update(parseInt(id), body);
  }

  @Get('/filed')
  getColors(@Query() param: any) {
    console.log('helloooooo');
    console.log(param.filed);
    return param.filed.split(',');
  }
}
