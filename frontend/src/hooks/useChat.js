import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from '../context/SocketContext.jsx';
import { getMessagesApi, sendMessageApi } from '../api/messageApi.js';

/**
 * Manages real-time chat for a conversation with a specific partner.
 * Uses Socket.io for incoming messages and the REST API for history + sending.
 */
export const useChat = (currentUserId, partnerId) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const partnerIdRef = useRef(partnerId);
  partnerIdRef.current = partnerId;

  const normalizeMessage = (msg) => ({
    id: msg._id || msg.id,
    senderId: msg.sender?._id || msg.sender || msg.senderId,
    receiverId: msg.receiver?._id || msg.receiver || msg.receiverId,
    message: msg.content || msg.message,
    timestamp: new Date(msg.createdAt || msg.timestamp || Date.now()).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    createdAt: msg.createdAt || msg.timestamp || new Date().toISOString(),
  });

  // Load message history when partnerId changes
  const loadMessages = useCallback(async () => {
    if (!partnerId) return;
    setLoading(true);
    setError('');
    try {
      const res = await getMessagesApi(partnerId);
      setMessages(res.data.map(normalizeMessage));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [partnerId]);

  useEffect(() => {
    setMessages([]);
    loadMessages();
  }, [loadMessages]);

  // Listen for incoming real-time messages
  useEffect(() => {
    if (!socket) return;
    const handleReceive = (msg) => {
      const normalized = normalizeMessage(msg);
      // Only add if it's part of this conversation
      const isForThisChat =
        (normalized.senderId === partnerIdRef.current && normalized.receiverId === currentUserId) ||
        (normalized.senderId === currentUserId && normalized.receiverId === partnerIdRef.current);
      if (isForThisChat) {
        setMessages(prev => {
          // Avoid duplicate if REST response already added it
          if (prev.some(m => m.id === normalized.id)) return prev;
          return [...prev, normalized];
        });
      }
    };

    socket.on('receiveMessage', handleReceive);
    return () => socket.off('receiveMessage', handleReceive);
  }, [socket, currentUserId]);

  // Send a message via REST + emit via socket
  const sendMessage = useCallback(async (receiverId, content) => {
    try {
      const res = await sendMessageApi(receiverId, content);
      const normalized = normalizeMessage(res.data);
      setMessages(prev => [...prev, normalized]);

      // Emit to socket so the receiver gets it in real-time
      if (socket) {
        socket.emit('sendMessage', {
          receiverId,
          message: res.data,
        });
      }
      return normalized;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to send message');
    }
  }, [socket]);

  return { messages, loading, error, sendMessage, refetch: loadMessages };
};
