/**
 * @openapi
 * components:
 *   schemas:
 *
 *     Conversation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6880d2c1f12ab34cd56789ef
 *
 *         isGroup:
 *           type: boolean
 *           example: false
 *
 *         groupName:
 *           type: string
 *           nullable: true
 *           example: Backend Team
 *
 *         groupAvatar:
 *           type: string
 *           nullable: true
 *
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *
 *         groupAdmin:
 *           $ref: '#/components/schemas/User'
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * components:
 *   schemas:
 *
 *     CreateConversationRequest:
 *       type: object
 *       required:
 *         - receiverId
 *       properties:
 *         receiverId:
 *           type: string
 *           example: 6880d2c1f12ab34cd56789ef
 *
 *     CreateGroupRequest:
 *       type: object
 *       required:
 *         - groupName
 *         - participants
 *       properties:
 *         groupName:
 *           type: string
 *           example: Backend Team
 *
 *         participants:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - 6880d2c1f12ab34cd56789ef
 *             - 6880d2c1f12ab34cd56789aa
 *
 *     RenameGroupRequest:
 *       type: object
 *       required:
 *         - groupName
 *       properties:
 *         groupName:
 *           type: string
 *           example: MERN Developers
 *
 *     AddGroupMembersRequest:
 *       type: object
 *       required:
 *         - participants
 *       properties:
 *         participants:
 *           type: array
 *           items:
 *             type: string
 *
 *     RemoveGroupMembersRequest:
 *       type: object
 *       required:
 *         - participants
 *       properties:
 *         participants:
 *           type: array
 *           items:
 *             type: string
 */

