import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './users.dto';

interface User {
  id: string;
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  private users: User[] = [
    { id: '1', name: 'John Doe', email: 'pepitoperez@gmail.com' },
    { id: '2', name: 'Jane Smith', email: 'pepitoperez@gmail.com' },
    { id: '3', name: 'Alice Johnson', email: 'pepitoperez@gmail.com' },
  ];

  // Get list of users
  @Get()
  getUsers(): User[] {
    return this.users;
  }

  // Get user by ID
  @Get(':id')
  getUserById(@Param('id') id: string): User | NotFoundException {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Create user
  @Post()
  createUser(@Body() body: CreateUserDto): User | { message: string } {
    const exists = this.users.find((user) => user.id === body.id);
    if (exists) {
      return { message: 'User with this ID already exists' };
    }
    this.users.push(body);
    return body;
  }

  //Update user by ID
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body: User): User | NotFoundException {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users[userIndex] = { ...this.users[userIndex], ...body };
    return this.users[userIndex];
  }

  // Delete user by ID
  @Delete(':id')
  deleteUser(@Param('id') id: string): NotFoundException | { message: string } {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    if (initialLength === this.users.length) {
      throw new NotFoundException(`User with ID ${id} not found`);
    } else {
      return { message: 'User deleted successfully' };
    }
  }
}
