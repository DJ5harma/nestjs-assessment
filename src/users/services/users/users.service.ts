import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findUsers() {
    return this.userRepository.find();
  }

  createUser(userDetails: CreateUserParams) {
    const new_user = this.userRepository.create(userDetails);
    return this.userRepository.save(new_user);
  }

  updateUser(userDetails: UpdateUserParams, id: number) {
    return this.userRepository.update({ id }, { ...userDetails });
  }
}
