/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Request completed successfully
 *
 *         data:
 *           type: object
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *
 *         message:
 *           type: string
 *           example: Something went wrong
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *
 *         limit:
 *           type: integer
 *           example: 20
 *
 *         totalMessages:
 *           type: integer
 *           example: 145
 *
 *         totalPages:
 *           type: integer
 *           example: 8
 *
 *         hasNextPage:
 *           type: boolean
 *           example: true
 *
 *         hasPreviousPage:
 *           type: boolean
 *           example: false
 */