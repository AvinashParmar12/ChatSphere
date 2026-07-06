/**
 * @openapi
 * tags:
 *   name: Conversations
 *   description: Conversation and group management APIs
 */

/**
 * @openapi
 * /api/v1/conversations:
 *   post:
 *     tags:
 *       - Conversations
 *     summary: Create or get a private conversation
 *     description: Creates a new private conversation or returns an existing one.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateConversationRequest'
 *     responses:
 *       201:
 *         description: Conversation created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConversationResponse'
 *       200:
 *         description: Existing conversation returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConversationResponse'
 *       400:
 *         description: Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized.
 */

/**
 * @openapi
 * /api/v1/conversations/group:
 *   post:
 *     tags:
 *       - Conversations
 *     summary: Create group conversation
 *     description: Creates a new group conversation.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGroupRequest'
 *     responses:
 *       201:
 *         description: Group created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConversationResponse'
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @openapi
 * /api/v1/conversations/group/{groupId}:
 *   get:
 *     tags:
 *       - Conversations
 *     summary: Get group details
 *     description: Returns complete information about a group.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Group fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConversationResponse'
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Group not found.
 */

/**
 * @openapi
 * /api/v1/conversations/group/{groupId}/name:
 *   patch:
 *     tags:
 *       - Conversations
 *     summary: Rename group
 *     description: Rename an existing group conversation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RenameGroupRequest'
 *     responses:
 *       200:
 *         description: Group renamed successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Group not found.
 */

/**
 * @openapi
 * /api/v1/conversations/group/{groupId}/members:
 *   patch:
 *     tags:
 *       - Conversations
 *     summary: Add group members
 *     description: Add one or more members to a group.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddGroupMembersRequest'
 *     responses:
 *       200:
 *         description: Members added successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Group not found.
 */

/**
 * @openapi
 * /api/v1/conversations/group/{groupId}/remove-members:
 *   patch:
 *     tags:
 *       - Conversations
 *     summary: Remove group members
 *     description: Remove one or more members from a group.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RemoveGroupMembersRequest'
 *     responses:
 *       200:
 *         description: Members removed successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Group not found.
 */

/**
 * @openapi
 * /api/v1/conversations/group/{groupId}/leave:
 *   patch:
 *     tags:
 *       - Conversations
 *     summary: Leave group
 *     description: Leave a group conversation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Left group successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Group not found.
 */

/**
 * @openapi
 * /api/v1/conversations/group/{groupId}/avatar:
 *   patch:
 *     tags:
 *       - Conversations
 *     summary: Update group avatar
 *     description: Upload a new avatar for the group.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Group avatar updated successfully.
 *       400:
 *         description: Invalid image.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @openapi
 * /api/v1/conversations/group/{groupId}:
 *   delete:
 *     tags:
 *       - Conversations
 *     summary: Delete group
 *     description: Permanently delete a group conversation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Group deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Group not found.
 */

/**
 * @openapi
 * /api/v1/conversations:
 *   get:
 *     tags:
 *       - Conversations
 *     summary: Get user conversations
 *     description: Returns all conversations of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conversations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConversationListResponse'
 *       401:
 *         description: Unauthorized.
 */

/**
 * @openapi
 * /api/v1/conversations/{conversationId}:
 *   get:
 *     tags:
 *       - Conversations
 *     summary: Get conversation by ID
 *     description: Returns complete information about a conversation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: Conversation fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConversationResponse'
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Conversation not found.
 */