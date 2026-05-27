import { create } from 'zustand';
import type { Message, Thread, ID } from '@/types';
import { mockThreads, mockMessages } from '@/lib/mockData';

interface MessagingState {
  threads: Thread[];
  messagesByThread: Record<ID, Message[]>;
  sendMessage: (threadId: ID, senderId: ID, body: string) => void;
  markRead: (threadId: ID) => void;
}

export const useMessaging = create<MessagingState>((set) => ({
  threads: mockThreads,
  messagesByThread: mockMessages,
  sendMessage: (threadId, senderId, body) =>
    set((s) => {
      const msg: Message = {
        id: `m_${Date.now()}`,
        threadId,
        senderId,
        body,
        sentAt: new Date().toISOString(),
        read: true,
      };
      const list = s.messagesByThread[threadId] ?? [];
      return {
        messagesByThread: { ...s.messagesByThread, [threadId]: [...list, msg] },
        threads: s.threads.map((t) =>
          t.id === threadId
            ? {
                ...t,
                lastMessagePreview: body,
                lastMessageAt: msg.sentAt,
              }
            : t,
        ),
      };
    }),
  markRead: (threadId) =>
    set((s) => ({
      threads: s.threads.map((t) =>
        t.id === threadId ? { ...t, unreadCount: 0 } : t,
      ),
      messagesByThread: {
        ...s.messagesByThread,
        [threadId]: (s.messagesByThread[threadId] ?? []).map((m) => ({ ...m, read: true })),
      },
    })),
}));
