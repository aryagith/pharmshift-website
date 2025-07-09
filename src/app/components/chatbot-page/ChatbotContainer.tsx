import React, { useState } from 'react';
import ChatbotComponent from './ChatbotComponent';
import ChatHistory from './ChatHistory';
import { Box } from '@mui/material';

interface ChatHistoryItem {
  id: string;
  title: string;
  messages: { sender: 'user' | 'bot'; text: string }[];
}

const ChatbotContainer: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    {
      id: '1',
      title: 'Insulin dosing',
      messages: [
        { sender: 'user', text: 'How do I dose insulin?' },
        { sender: 'bot', text: 'Insulin dosing depends on several factors...' },
      ],
    },
    {
      id: '2',
      title: 'Acid-base balance',
      messages: [
        { sender: 'user', text: 'Explain acid-base balance.' },
        { sender: 'bot', text: 'Acid-base balance refers to...' },
      ],
    },
  ]);
  const [selectedChatId, setSelectedChatId] = useState<string>('1');

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newChat: ChatHistoryItem = { id: newId, title: 'New chat', messages: [] };
    setChatHistory([{ ...newChat }, ...chatHistory]);
    setSelectedChatId(newId);
  };

  const handleDeleteChat = (id: string) => {
    setChatHistory(prev => {
      const filtered = prev.filter(chat => chat.id !== id);
      if (id === selectedChatId) {
        setSelectedChatId(filtered.length > 0 ? filtered[0].id : '');
      }
      return filtered;
    });
  };

  const handleSelectChat = (id: string) => setSelectedChatId(id);

  const selectedChat = chatHistory.find(chat => chat.id === selectedChatId);

  const handleSendMessage = (input: string) => {
    if (!input.trim() || !selectedChat) return;
    setChatHistory(prev =>
      prev.map(chat =>
        chat.id === selectedChatId
          ? { ...chat, messages: [...chat.messages, { sender: 'user', text: input }] }
          : chat
      )
    );
    // TODO: Add bot response logic here if needed
  };

  return (
    <Box sx={{ width: 1100, mx: 'auto', mt: 6, display: 'flex', height: 700 }}>
      <ChatHistory
        chatHistory={chatHistory}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      <ChatbotComponent
        width={880}
        height={700}
        chat={selectedChat}
        onSendMessage={handleSendMessage}
      />
    </Box>
  );
};

export default ChatbotContainer;
