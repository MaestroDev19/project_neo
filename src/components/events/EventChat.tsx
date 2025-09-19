'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle } from 'lucide-react';
import type { StreamChat } from '@/types/stream';

interface EventChatProps {
  eventId: string;
  streamId?: string;
  isLive: boolean;
}

export function EventChat({ eventId, streamId, isLive }: EventChatProps) {
  const [messages, setMessages] = useState<StreamChat[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Set up WebSocket connection for real-time chat
    // TODO: Load chat history
    setIsConnected(true);

    // Mock messages for demo
    const mockMessages: StreamChat[] = [
      {
        id: '1',
        streamId: streamId || '',
        userId: 'user1',
        username: 'gamer123',
        displayName: 'Gamer123',
        message: 'This stream is amazing! 🔥',
        timestamp: new Date(Date.now() - 300000),
        type: 'message'
      },
      {
        id: '2',
        streamId: streamId || '',
        userId: 'user2',
        username: 'animefan',
        displayName: 'AnimeFan',
        message: 'Just joined! What did I miss?',
        timestamp: new Date(Date.now() - 240000),
        type: 'message'
      },
      {
        id: '3',
        streamId: streamId || '',
        userId: 'system',
        username: 'system',
        displayName: 'System',
        message: 'ComicLover joined the watch party',
        timestamp: new Date(Date.now() - 180000),
        type: 'join'
      }
    ];
    setMessages(mockMessages);
  }, [eventId, streamId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: StreamChat = {
      id: Date.now().toString(),
      streamId: streamId || '',
      userId: 'current-user',
      username: 'currentuser',
      displayName: 'Current User',
      message: newMessage,
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // TODO: Send message via WebSocket
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageStyle = (type: StreamChat['type']) => {
    switch (type) {
      case 'join':
      case 'leave':
      case 'system':
        return 'text-muted-foreground italic text-sm';
      default:
        return '';
    }
  };

  return (
    <div className="bg-card rounded-lg border h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-semibold">
            {isLive ? 'Live Chat' : 'Event Discussion'}
          </h3>
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
        </div>
        {isLive && (
          <p className="text-sm text-muted-foreground mt-1">
            Chat with other viewers in real-time
          </p>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              {message.type === 'message' && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={`/avatars/${message.username}.jpg`} />
                  <AvatarFallback className="text-xs">
                    {message.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className="flex-1 min-w-0">
                {message.type === 'message' ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {message.displayName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm break-words">{message.message}</p>
                  </>
                ) : (
                  <p className={getMessageStyle(message.type)}>
                    {message.message}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isLive ? "Type a message..." : "Join the discussion..."}
            className="flex-1"
            disabled={!isConnected}
          />
          <Button type="submit" size="sm" disabled={!newMessage.trim() || !isConnected}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
        {!isConnected && (
          <p className="text-xs text-muted-foreground mt-2">
            Connecting to chat...
          </p>
        )}
      </div>
    </div>
  );
}