import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';

// This service is responsible for handling all user-related operations
// It uses the User entity to interact with the database
@Injectable()
export class UsersService {
  // Inject the User repository
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // Get all users
  findUsers() {
    return this.userRepository.find();
  }

  // Get a user by id
  findUserByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  // Get a user by email
  findUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  // Create a new user
  createUser(userDetails: CreateUserParams) {
    const new_user = this.userRepository.create(userDetails);
    return this.userRepository.save(new_user);
  }

  // Update a user
  updateUser(userDetails: UpdateUserParams, id: number) {
    return this.userRepository.update({ id }, { ...userDetails });
  }

  // Delete a user
  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }
}
