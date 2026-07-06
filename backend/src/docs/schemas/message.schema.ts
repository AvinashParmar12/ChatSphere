/**
 * @openapi
 * components:
 *   schemas:
 *
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6880d2c1f12ab34cd56789ef
 *
 *         conversation:
 *           type: string
 *
 *         sender:
 *           $ref: '#/components/schemas/User'
 *
 *         messageType:
 *           type: string
 *           enum:
 *             - text
 *             - image
 *             - video
 *             - audio
 *             - file
 *             - system
 *
 *         content:
 *           type: string
 *           example: Hello 👋
 *
 *         attachment:
 *           type: object
 *           nullable: true
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     SendMessageRequest:
 *       type: object
 *       required:
 *         - conversationId
 *         - content
 *       properties:
 *         conversationId:
 *           type: string
 *           example: 6880d2c1f12ab34cd56789ef
 *
 *         content:
 *           type: string
 *           example: Hello 👋
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Message sent successfully
 *
 *         data:
 *           $ref: '#/components/schemas/Message'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *
 *     MessageListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Messages fetched successfully
 *
 *         data:
 *           type: object
 *           properties:
 *             messages:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *
 *             pagination:
 *               $ref: '#/components/schemas/Pagination'
 */