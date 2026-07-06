/**
 * @openapi
 * components:
 *   schemas:
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 687f83d5f58d1f1a9f0a1234
 *
 *         username:
 *           type: string
 *           example: Avinash
 *
 *         email:
 *           type: string
 *           format: email
 *           example: avinash@gmail.com
 *
 *         avatar:
 *           type: string
 *           nullable: true
 *           example: https://res.cloudinary.com/demo/image/upload/avatar.jpg
 *
 *         bio:
 *           type: string
 *           nullable: true
 *           example: Backend Developer
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: Avinash
 *
 *         email:
 *           type: string
 *           format: email
 *           example: avinash@gmail.com
 *
 *         password:
 *           type: string
 *           format: password
 *           example: Password@123
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: avinash@gmail.com
 *
 *         password:
 *           type: string
 *           format: password
 *           example: Password@123
 *
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           example: Avinash
 *
 *         bio:
 *           type: string
 *           example: Backend Developer
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Login successful
 *
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *
 *             token:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     UserSearchResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Users fetched successfully
 *
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *
 *     UserStatusResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: User status fetched successfully
 *
 *         data:
 *           type: object
 *           properties:
 *             isOnline:
 *               type: boolean
 *               example: true
 *
 *             lastSeen:
 *               type: string
 *               format: date-time
 *
 *     AvatarUploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Avatar updated successfully
 *
 *         data:
 *           $ref: '#/components/schemas/User'
 */