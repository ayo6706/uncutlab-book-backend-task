/**
 * @openapi
 * components:
 *  properties:
 *   Email:
 *    type: string
 *    default: johndoe@gmail.com
 *   Password:
 *    type: string
 *    format: password
 *    default: password123
 *   Firstname:
 *    type: string
 *    default: John
 *   Lastname:
 *    type: string
 *    default: Doe
 */
/**
 * @openapi
 * components:
 *  schemas:
 *   User:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *     firstname:
 *      type: string
 *     lastname:
 *      type: string
 *     email:
 *      type: string
 *     token:
 *      type: string
 */
export interface UserDto {
    id?: string,
    firstname?: string,
    lastname?: string,
    email?: string,
    username?: string,
    token?: string,
}

export interface UserRegistrationObjDto extends UserDto {

}
/**
 * @openapi
 * components:
 *  requestBodies:
 *   UserLogin:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/UserLogin'
 *   UserRegistration:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/UserRegistration'
 */

/**
 * @openapi
 * components:
 *  schemas:
 *   UserLogin:
 *    type: object
 *    required:
 *     - password
 *    properties:
 *     password:
 *      $ref: '#/components/properties/Password'
 *   UserRegistration:
 *     type: object
 *     required:
 *       - firstname
 *       - lastname
 *       - email
 *       - password
 *     properties:
 *       firstname:
 *        $ref: '#/components/properties/Firstname'
 *       lastname:
 *        $ref: '#/components/properties/Lastname'
 *       email:
 *        $ref: '#/components/properties/Email'
 *       password:
 *        $ref: '#/components/properties/Password'
 *   CreateAdmin:
 *     type: object
 *     required:
 *       - firstname
 *       - lastname
 *       - email
 *       - phone
 *       - password
 *     properties:
 *       firstname:
 *        $ref: '#/components/properties/Firstname'
 *       lastname:
 *        $ref: '#/components/properties/Lastname'
 *       email:
 *        $ref: '#/components/properties/Email'
 *       password:
 *        $ref: '#/components/properties/Password'
 */

export interface UserRegistrationDto {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
}

/**
 * @openapi
 * components:
 *  requestBodies:
 *   UserUpdate:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/UserUpdate'
 *
 *  schemas:
 *   UserUpdate:
 *     type: object
 *     required:
 *     properties:
 *       firstname:
 *         type: string
 *         default: John
 *       lastname:
 *         type: string
 *         default: Doe
 *       email:
 *         type: string
 *         default: johndoe@gmail.com
 *       username:
 *          type: string
 *          default: john20
 */
export interface UserUpdateDto {
    id: string,
    firstname?: string,
    lastname?: string,
    email?: string,
    username?: string,
}

export interface UpdatePasswordDto {
    id?: string,
    email?: string,
    password?: string,
}
