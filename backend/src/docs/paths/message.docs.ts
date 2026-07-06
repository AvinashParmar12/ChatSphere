/**
 * @openapi
 * tags:
 *   name: Messages
 *   description: Message management APIs
 */

/**
 * @openapi
 * /api/v1/messages/{conversationId}:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Get conversation messages
 *     description: Returns paginated messages of a conversation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Messages fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageListResponse'
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Conversation not found.
 */

/**
 * @openapi
 * /api/v1/messages:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Send text message
 *     description: Sends a text message to a conversation.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendMessageRequest'
 *     responses:
 *       201:
 *         description: Message sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @openapi
 * /api/v1/messages/media:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Send media message
 *     description: Upload and send an image, video, audio, or file.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - conversationId
 *               - attachment
 *             properties:
 *               conversationId:
 *                 type: string
 *               attachment:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Media message sent successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @openapi
 * /api/v1/messages/{conversationId}/read:
 *   patch:
 *     tags:
 *       - Messages
 *     summary: Mark conversation as read
 *     description: Marks all unread messages in a conversation as read.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation marked as read.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Conversation not found.
 */

/**
 * @openapi
 * /api/v1/messages/{messageId}:
 *   delete:
 *     tags:
 *       - Messages
 *     summary: Delete message
 *     description: Delete a previously sent message.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Message not found.
 */