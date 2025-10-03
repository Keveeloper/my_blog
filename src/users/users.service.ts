import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find({ relations: ['profile'] });
    console.log('Fetched users:', users);
    return users;
  }

  async getUserById(id: string): Promise<User> {
      return await this.findUserById(id);
  }

  async createUser(body: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: body.email } });
    if (user) {
      throw new ConflictException(`User with email ${body.email} already exists`);
    }
    const newUser = this.userRepository.create(body);
    return await this.userRepository.save(newUser);
  }

  async updateUser(id: string, updatedUserBody ): Promise<User> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = this.userRepository.merge(user, updatedUserBody);
    return this.userRepository.save(updatedUser);
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.delete(id);
    return { message: `User with ID ${id} has been deleted` };
  }

  private async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
