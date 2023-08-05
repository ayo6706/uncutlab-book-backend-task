import UserModel from "./model.postgresql";
import User from "./model";
import UserRepository from "./user.repository";
import { log } from "../log";
import DatabaseError from "../../errors/database";
import { PostgresqlConnect } from "../dbconn";

const UserDB = UserModel(PostgresqlConnect);

export default class UserRepositoryPostgreSql implements UserRepository {
    async createUser(user: User): Promise<User> {
        try {
            const createdUser = await UserDB.create({
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                email: user.email,
                password: user.password,
            });
            return Promise.resolve(createdUser);
        } catch (error: any) {
            log.error(error);
            throw new DatabaseError(error);
        }
    }

    async findUserByEmail(email: string): Promise<User> {
        try {
            const user = await UserDB.findOne(
                {
                    where: {
                        email,
                    },
                },
            );
            return Promise.resolve(<User>user);
        } catch (err: any) {
            log.error(err);
            throw new DatabaseError(err);
        }
    }

    async findUserById(id: string): Promise<User> {
        try {
            const user = await UserDB.findByPk(id);
            return Promise.resolve(<User>user);
        } catch (err: any) {
            log.error(err);
            throw new DatabaseError(err);
        }
    }

    async findUserByUsername(username: string): Promise<User> {
        try {
            const user = await UserDB.findOne({
                where: {
                    username,
                },
            });
            return Promise.resolve(<User>user);
        } catch (err: any) {
            log.error(err);
            throw new DatabaseError(err);
        }
    }

    async updateUser(userObj: any): Promise<User> {
        const { id } = userObj;
        try {
            const userdata: User = userObj;
            const user = await UserDB.findByPk(id);
            if (!user) {
                return Promise.reject(user);
            }

              // Update the user properties
            Object.assign(user, userdata);

              // Save the changes
            await user.save();

            return Promise.resolve(user);
        } catch (error: any) {
            log.error(error);
            throw new DatabaseError(error);
        }
    }

    async updatePassword(user: User): Promise<User> {
        const { id, password } = user;
        try {
            const userExist = await UserDB.findByPk(id);
            if (!userExist) {
                return Promise.reject(user);
            }
            userExist.password = password!;
            await userExist.save();
            return Promise.resolve(user);
        } catch (err: any) {
            log.error(err);
            throw new DatabaseError(err);
        }
    }

    async deleteUser(userData: User): Promise<User> {
        const { id, password } = userData;
        try {
            const userExist = await UserDB.findByPk(id);
            if (!userExist) {
                return Promise.reject(userExist);
            }

            // Update the password
            userExist.password = password!;

            // Save the changes
            await userExist.save();

            return Promise.resolve(userExist);
        } catch (error: any) {
            log.error(error);
            throw new DatabaseError(error);
        }
    }
}
