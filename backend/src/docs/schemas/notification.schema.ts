/**
 * @openapi
 * components:
 *   schemas:
 *
 *     Notification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6880d2c1f12ab34cd56789ef
 *
 *         receiver:
 *           $ref: '#/components/schemas/User'
 *
 *         sender:
 *           $ref: '#/components/schemas/User'
 *
 *         conversation:
 *           type: string
 *           nullable: true
 *
 *         type:
 *           type: string
 *           enum:
 *             - MESSAGE
 *             - GROUP_ADD
 *             - GROUP_REMOVE
 *             - GROUP_RENAME
 *             - GROUP_AVATAR
 *             - GROUP_LEAVE
 *             - MENTION
 *
 *         title:
 *           type: string
 *           example: Added to Group
 *
 *         message:
 *           type: string
 *           example: You were added to "Backend Team"
 *
 *         isRead:
 *           type: boolean
 *           example: false
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     NotificationResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Notifications fetched successfully
 *
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Notification'
 */