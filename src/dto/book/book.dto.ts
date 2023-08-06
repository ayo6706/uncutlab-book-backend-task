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
 */

export interface BookDto {
    id?: string,
    title?: string,
    author?: string
}
