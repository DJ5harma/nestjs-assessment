to setup: `npm i`

to run actual server (which fully works!): `npm run start:dev`

to run test cases : `npm run test:e2e`

# Users Module

This module handles all user-related operations. It includes the controller, service, and entity for managing users.

## Components

### UsersController

Handles HTTP requests related to users. It includes endpoints for creating, updating, deleting, and fetching users.

### UsersService

Contains the business logic for user operations. It interacts with the database through the User entity.

### User Entity

Defines the structure of the user table in the database. It includes fields like `id`, `email`, `username`, `password`, `created_at`, and `authStrategy`.

## Setup

- **Controllers**: [UsersController]
- **Providers**: [UsersService]
- **Imports**: [TypeOrmModule.forFeature([User])]

## Usage

- **Create User**: Validates and hashes the password, then creates a new user in the database.
- **Login User**: Validates user credentials and generates a JWT token.
- **Update User**: Updates user details if the user is authorized.
- **Delete User**: Deletes a user if the user is authorized.

## Example

Here's how the module is set up:

```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
```
