/**
 * @openapi
 * components:
 *  requestBodies:
 *   Book:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CreateBook'
 *   UpdateBook:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/UpdateBook'
 *  schemas:
 *   CreateBook:
 *     type: object
 *     required:
 *       - title
 *     properties:
 *       title:
 *         type: string
 *       author:
 *         type: string
 *   UpdateBook:
 *     type: object
 *     required:
 *       - id
 *     properties:
 *       id:
 *         type: integer
 *       title:
 *         type: string
 *       author:
 *         type: string
 */

export interface BookDto {
    id?: string,
    title?: string,
    author?: string,
    file?: string
}
