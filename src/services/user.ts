import bcrypt from "bcrypt";

import UserRepository from "../repository/user/user.repository";
import * as errors from "../errors/services";
import {
    UserDto, UserRegistrationDto, UserUpdateDto, UpdatePasswordDto, UserRegistrationObjDto,
} from "../dto/user/user.dto";
import UserMapper from "../dto/user/user.mapper";
import {
    failedPromise,
} from "./util";

export default class UserService {
    constructor(private readonly repo: UserRepository) {}

    async registerUser(regDto: UserRegistrationDto): Promise<UserRegistrationObjDto> {
        try {
            const dto: UserRegistrationDto = regDto;

            const user = await this.repo.findUserByEmail(dto.email);
            if (user) {
                return failedPromise(errors.ErrExistingUserEmail);
            }

            const newUser = await this.repo.createUser(UserMapper.toPersistence(dto));
            return UserMapper.toAuthRegisterDto(newUser);
        } catch (error: any) {
            return failedPromise(error);
        }
    }

    async loginUser(
        password: string,
        email: string,
    ): Promise<UserDto> {
        try {
            const user = await this.repo.findUserByEmail(email);

            if (!user) {
                return failedPromise(errors.ErrIncorrectCredentials);
            }
            
            const isMatch = await bcrypt.compare(password, user.password!);
            if (!isMatch) {
                return failedPromise(errors.ErrIncorrectCredentials);
            }

            return UserMapper.toAuthDto(user);
        } catch (error: any) {
            // reject with error which may be Database or Service error
            return failedPromise(error);
        }
    }

    async changePassword(id: string, password: string, newPassword: string): Promise<UserDto> {
        try {
            const user = await this.repo.findUserById(id);
            if (!user) {
                return failedPromise(errors.ErrIncorrectCredentials);
            }
            const isMatch = await bcrypt.compare(password, user.password!);
            if (!isMatch) {
                return failedPromise(errors.ErrIncorrectPassword);
            }
            const userUpdate: UpdatePasswordDto = {
                id,
                password: newPassword,
            };
            const userUpdated = await this.repo.updatePassword(userUpdate);
            return UserMapper.toDto(userUpdated);
        } catch (error: any) {
            // reject with error which may be Database or Service error
            return failedPromise(error);
        }
    }

    async getUserProfile(id: string): Promise<UserDto> {
        try {
            const user = await this.repo.findUserById(id);
            if (!user) {
                throw errors.ErrUserDoesNotExist;
            }
            return UserMapper.toDto(user);
        } catch (error) {
            throw (error);
        }
    }

    async updateUser(dto: UserUpdateDto): Promise<UserDto> {
        try {
            const user = await this.repo.findUserById(dto.id);

            const existingUserEmail = await this.repo.findUserByEmail(dto.email!);

            if (existingUserEmail && existingUserEmail.email !== user.email) {
                return failedPromise(errors.ErrExistingUserEmail);
            }

            const updateDto = dto;
            const result = await this.repo.updateUser(UserMapper.toPersistence(updateDto));
            return UserMapper.toDto(result);
        } catch (error: any) {
            throw (error);
        }
    }

    async resetUserPassword(userObj: UpdatePasswordDto): Promise<UserDto> {
        try {
            const user = await this.repo.findUserByEmail(userObj.email!);
            if (!user) {
                return failedPromise(errors.ErrUserDoesNotExist);
            }
            const userUpdate: UpdatePasswordDto = {
                id: user.id,
                password: userObj.password,
            };
            await this.repo.updatePassword(userUpdate);
            return UserMapper.toDto(user);
        } catch (error: any) {
            throw (error);
        }
    }
}
