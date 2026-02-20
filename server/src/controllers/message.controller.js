/**
 * message.controller.js — Messaging and conversation handlers.
 */
import { v4 as uuidv4 } from 'uuid';
import { insforge } from '../config/index.js';
import { ApiError, ApiResponse, asyncHandler } from '../utils/index.js';

export const getConversations = asyncHandler(async (req, res) => {
    const { data: conversations } = await insforge.database
        .from('conversations')
        .select('*')
        .ilike('participants', `%${req.user.id}%`)
        .order('updated_at', { ascending: false });

    ApiResponse.ok(conversations || []).send(res);
});

export const getMessages = asyncHandler(async (req, res) => {
    const { data: messages } = await insforge.database
        .from('messages')
        .select('*')
        .eq('conversation_id', req.params.id)
        .order('created_at', { ascending: true });

    ApiResponse.ok(messages || []).send(res);
});

export const createConversation = asyncHandler(async (req, res) => {
    const { recipientId, listingId, text } = req.body;

    const convId = uuidv4();
    const { data: conv } = await insforge.database
        .from('conversations')
        .insert({
            id: convId,
            participants: [req.user.id, recipientId],
            listing_id: listingId || null,
            last_message_text: text,
            last_message_sender_id: req.user.id,
            last_message_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    // Create first message
    await insforge.database.from('messages').insert({
        id: uuidv4(),
        conversation_id: convId,
        sender_id: req.user.id,
        text,
        is_read: false,
        created_at: new Date().toISOString(),
    });

    ApiResponse.created(conv).send(res);
});

export const sendMessage = asyncHandler(async (req, res) => {
    const { conversationId, text } = req.body;

    const msg = {
        id: uuidv4(),
        conversation_id: conversationId,
        sender_id: req.user.id,
        text,
        is_read: false,
        created_at: new Date().toISOString(),
    };

    const { data } = await insforge.database
        .from('messages')
        .insert(msg)
        .select()
        .single();

    // Update conversation last message
    await insforge.database
        .from('conversations')
        .update({
            last_message_text: text,
            last_message_sender_id: req.user.id,
            last_message_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId);

    ApiResponse.created(data).send(res);
});

export const markConversationRead = asyncHandler(async (req, res) => {
    await insforge.database
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('conversation_id', req.params.id)
        .neq('sender_id', req.user.id);

    ApiResponse.ok(null, 'Marked as read').send(res);
});
