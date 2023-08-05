import express, { Request, Response, NextFunction } from "express";

import { Handler } from "../handler";
import UserService from "../../../services/user";
import { ok } from "../../response/response";
import * as msg from "../../response/messages";
import * as errors from "../../response/errors";
import { fieldIsNotEmpty } from "../util";
import { UserUpdateDto } from "../../../dto/user/user.dto";
import AuthRequest from "../../../@types/authRequest";
import routes from "./routes";
import { MsgChangedUserPassword } from "../../response/messages";

const basePath = "/user";

/**
 * @openapi
 * tags:
 *   name: User
 *   description: User authentication and management
 */
export default class UserHandler implements Handler {
    private service: UserService;

    constructor(service: UserService) {
        this.service = service;
    }

    routes(): express.Router {
        return routes(this);
    }

    path(): string {
        return basePath;
    }

    /**
     * @openapi
     * /user/register:
     *   post:
     *     tags:
     *      - User
     *     summary: register a new user
     *     requestBody:
     *      $ref: '#/components/requestBodies/UserRegistration'
     *     responses:
     *        200:
     *          description: User successfully created
     */
    async registerUser(req: AuthRequest, res: Response, next: NextFunction) {
        const {
            firstname, lastname, email, password,
        } = req.body;

        if (!fieldIsNotEmpty(firstname, lastname, email, password)) {
            return next(errors.ErrMissingParameter);
        }
        try {
            const result = await this.service.registerUser({
                firstname,
                lastname,
                email,
                password,
            });
            return ok(msg.MsgUserCreate, result).send(res);
        } catch (error: any) {
            return next(error);
        }
    }

    /**
     * @openapi
     * /user/login:
     *   post:
     *     tags:
     *      - User
     *     summary: login a user
     *     requestBody:
     *      $ref: '#/components/requestBodies/UserLogin'
     *     responses:
     *        200:
     *          description: User logged in
     */
    async loginUser(req: Request, res: Response, next: NextFunction) {
        const { email, phone, password } = req.body;
        if (!fieldIsNotEmpty(phone || email, password)) {
            return next(errors.ErrMissingParameter);
        }

        try {
            const result = await this.service.loginUser(
                password,
                email,
            );
            return ok(msg.MsgUserLoggedIn, result).send(res);
        } catch (error: any) {
            return next(error);
        }
    }

    async getUserProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.user!;
            if (!fieldIsNotEmpty(id)) {
                return next(errors.ErrMissingParameter);
            }
            const result = await this.service.getUserProfile(id);
            return ok("Gotten User Profile", result).send(res);
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @openapi
     * /user/profile:
     *   patch:
     *     tags:
     *      - User
     *     summary: update user data
     *     requestBody:
     *      $ref: '#/components/requestBodies/UserUpdate'
     *     responses:
     *        200:
     *          description: User was successfully updated
     *     security:
     *      - bearerAuth: []
     */
    async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.user!;
            if (!fieldIsNotEmpty(id)) {
                return next(errors.ErrMissingParameter);
            }
            const user: UserUpdateDto = {
                id,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                username: req.body.username,
            };

            const result = await this.service.updateUser(user);
            return ok("Updated User", result).send(res);
        } catch (error) {
            return next(error);
        }
    }

        /**
     * @openapi
     * /user/reset-password:
     *   post:
     *     tags:
     *      - User
     *     summary: reset a user's password when forgotten
     *     requestBody:
     *      required: true
     *      content:
     *       application/json:
     *        schema:
     *         required:
     *         - code
     *         - phone
     *         - password
     *         properties:
     *          code:
     *            type: number
     *          password:
     *            type: string
     *     responses:
     *        200:
     *          description: User password has been reset
     *     security:
     *      - bearerAuth: []
     */

    async resetUserPassword(req: AuthRequest, res: Response, next: NextFunction) {
        const { phone, password } = req.body;

        if (!fieldIsNotEmpty(phone, password)) {
            return next(errors.ErrMissingParameter);
        }

        try {
            const result = await this.service.resetUserPassword(req.body);
            return ok("User Password has been reset", result).send(res);
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @openapi
     * /user/change-password:
     *   post:
     *     tags:
     *      - User
     *     summary: change a user's password
     *     requestBody:
     *      required: true
     *      content:
     *       application/json:
     *        schema:
     *         required:
     *         - email
     *         - password
     *         - newPassword
     *         properties:
     *          email:
     *           type: string
     *          password:
     *           type: string
     *          newPassword:
     *           type: string
     *     responses:
     *        200:
     *          description: password successfully changed
     *          content:
     *           application/json:
     *            schema:
     *             type: object
     *             properties:
     *              success:
     *               type: boolean
     *              message:
     *               type: string
     *              data:
     *               $ref: '#/components/schemas/User'
     */
    async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
        const { password, newPassword } = req.body;
        const { id } = req.user!;
        if (!fieldIsNotEmpty(id, password, newPassword)) {
            return next(errors.ErrMissingParameter);
        }
        try {
            const result = await this.service.changePassword(id, password, newPassword);
            return ok(MsgChangedUserPassword, result).send(res);
        } catch (error: any) {
            return next(error);
        }
    }
}
