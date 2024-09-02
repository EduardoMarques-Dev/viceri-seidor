import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Optional } from '../generic-module/common/helper/vic-optional';
import { UnauthorizedError } from '../generic-module/exception/business-exceptions/unauthorized.error';
import { LoggerService } from '../generic-module/logger/logger.service';
import { UserService } from '../system-module/user/user.service';
import { UserModel } from './../system-module/user/model/user.model';
import { UserPayload } from './models/user-payload.dto';
import { UserToken } from './models/user-token.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  cryptoJS = require('crypto-js');

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
  ) {}

  login(user: UserModel): UserToken {
    const payload: UserPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      access_token: jwtToken,
    };
  }

  /**
   * Validates the user credentials by checking the email and password.
   *
   * @param {string} email - The email of the user attempting to log in.
   * @param {string} password - The password provided by the user.
   * @returns {Promise<Partial<UserModel>>} The user object with the password field omitted if validation is successful.
   * @throws {UnauthorizedError} If the email or password is incorrect.
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<UserModel>> {
    // Attempt to load the user from the database using their email.
    const userOptional: Optional<UserModel> = await this.loadUserFromDatabase(
      email,
    );

    // Log the result of the attempt to load the user.
    this.loggerService.silly(
      `Was it possible to load the user from the database?: ${userOptional.isPresent()}`,
    );

    // Check if the user exists in the database.
    if (userOptional.isPresent()) {
      const user: UserModel = userOptional.get();
      this.loggerService.silly(
        `Loaded user from database: ${JSON.stringify(user)}`,
      );

      // Validate the provided password against the stored password.
      const isPasswordValid = this.checkPassword(user, password);

      // If the password is valid, return the user object without the password field.
      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    // Throw an error if the email or password is incorrect.
    throw new UnauthorizedError(
      'Email address or password provided is incorrect.',
    );
  }

  /**
   * Loads a user from the database by their email.
   *
   * @param {string} email - The email of the user to load from the database.
   * @returns {Promise<Optional<UserModel>>} A Optional containing the user model if found.
   */
  private async loadUserFromDatabase(
    email: string,
  ): Promise<Optional<UserModel>> {
    return await this.userService.genericFindFirst({
      where: { email: email },
    });
  }

  /**
   * Checks if the provided password matches the user's stored password (hashed).
   *
   * @param {UserModel} user - The user object containing the stored password (hashed).
   * @param {string} password - The password provided by the user.
   * @returns {Promise<boolean>} True if the password matches, false otherwise.
   */
  private async checkPassword(
    user: UserModel,
    password: string,
  ): Promise<boolean> {
    // Compare the provided password with the stored hashed password using bcrypt.
    return await bcrypt.compare(password, user.password);
  }
}
