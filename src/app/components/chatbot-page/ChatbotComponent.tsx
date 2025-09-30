import React, { useRef, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Stack,
} from '@mui/material';
import { Mic, Person, SmartToy } from '@mui/icons-material';
import { useVoiceChat } from '../../../hooks/useVoiceChat';
import { resampleAudio } from '../../../lib/resampleAudio';


interface ChatbotComponentProps {
  width?: number | string;
  height?: number | string;
  chat?: ChatHistoryItem;
  onSendMessage?: (input: string) => void;
}

// Example chat history data structure
interface ChatHistoryItem {
  id: string;
  title: string;
  messages: { sender: 'user' | 'bot'; text: string }[];
}

export default function ChatbotComponent({ width = 500, height = 500, chat, onSendMessage }: ChatbotComponentProps) {
  // If chat and onSendMessage are provided, use them; otherwise, use internal state
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(
    [
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
    ]
  );
  const [selectedChatId, setSelectedChatId] = useState<string>('1');
  const [input, setInput] = useState('');
  const { isRecording, status, toggleRecording } = useVoiceChat('ws://localhost:8000/ws/audio');


  // Find the selected chat
  const selectedChat = chat || chatHistory.find(chat => chat.id === selectedChatId);
  const messages = selectedChat ? selectedChat.messages : [];

  // Send message handler
  const handleSend = async () => {
    if (!input.trim() || !selectedChat) return;
    if (onSendMessage) {
      onSendMessage(input);
      setInput('');
      return;
    }
    // Add user message with correct sender type (internal state fallback)
    const updatedChats = chatHistory.map(chat =>
      chat.id === selectedChatId
        ? { ...chat, messages: [...chat.messages, { sender: 'user' as 'user', text: input }] }
        : chat
    );
    setChatHistory(updatedChats);
    setInput('');
    // TODO: Call API and add bot response
  };

  // Start a new chat
  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newChat: ChatHistoryItem = { id: newId, title: 'New chat', messages: [] };
    setChatHistory([{ ...newChat }, ...chatHistory]);
    setSelectedChatId(newId);
  };

  // Delete chat handler
  const handleDeleteChat = (id: string) => {
    setChatHistory(prev => {
      const filtered = prev.filter(chat => chat.id !== id);
      // If the deleted chat was selected, select the next available chat or none
      if (id === selectedChatId) {
        setSelectedChatId(filtered.length > 0 ? filtered[0].id : '');
      }
      return filtered;
    });
  };

  return (
    <Paper
      sx={{
        p: 2,
        minHeight: height,
        height: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(28,78,216,0.13)',
        boxShadow: '0 8px 32px 0 rgba(28,78,216,0.18)',
        border: '1.5px solid rgba(28,78,216,0.18)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 4,
      }}
    >
      <Typography variant="h5" gutterBottom>
        PharmShift AI Chatbot
      </Typography>
      <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
        {messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
            Hello! Ask me any pharmacy-related question.
          </Typography>
        ) : (
          messages.map((msg, idx) => (
            <Stack
              key={idx}
              direction={msg.sender === 'user' ? 'row-reverse' : 'row'}
              spacing={1}
              sx={{ mb: 1, alignItems: 'flex-end' }}
            >
              {/* Profile Icon */}
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: msg.sender === 'user' ? '#1C4ED8' : '#eee',
                  color: msg.sender === 'user' ? '#fff' : '#1C4ED8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  boxShadow: msg.sender === 'user' ? '0 2px 8px #1C4ED880' : '0 2px 8px #eee8',
                  mr: msg.sender === 'user' ? 0 : 1,
                  ml: msg.sender === 'user' ? 1 : 0,
                }}
              >
                {msg.sender === 'user' ? <Person fontSize="inherit" /> : <SmartToy fontSize="inherit" />}
              </Box>
              <Box
                sx={{
                  bgcolor: msg.sender === 'user' ? '#1C4ED8' : '#eee',
                  color: msg.sender === 'user' ? '#fff' : '#222',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: '75%',
                  wordBreak: 'break-word',
                }}
              >
                {msg.text}
              </Box>
            </Stack>
          ))
        )}
      </Box>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          fullWidth
          size="small"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          sx={{
            minWidth: 80,
            minHeight: 44,
            borderRadius: 22,
            px: 0,
            py: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: 0.5,
          }}
        >
          Send
        </Button>
        <Button
          onClick={toggleRecording}
          variant="contained"
          sx={{
            minWidth: 44,
            minHeight: 44,
            borderRadius: '50%',
            backgroundColor: isRecording ? '#D81C1C' : undefined,
          }}
        >
          <Mic />
        </Button>

      </Stack>
    </Paper>
  );
}
