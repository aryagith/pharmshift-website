import React from 'react';
import { Paper, Typography, Button, Divider, List, ListItem, ListItemButton, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ChatHistoryItem {
  id: string;
  title: string;
  messages: { sender: 'user' | 'bot'; text: string }[];
}

interface ChatHistoryProps {
  chatHistory: ChatHistoryItem[];
  selectedChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

const sidebarWidth = 220;

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chatHistory,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}) => (
  <Paper
    sx={{
      width: sidebarWidth,
      minWidth: sidebarWidth,
      maxWidth: sidebarWidth,
      mr: 2,
      p: 2,
      background: 'rgba(28,78,216,0.13)',
      boxShadow: '0 8px 32px 0 rgba(28,78,216,0.18)',
      border: '1.5px solid rgba(28,78,216,0.18)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: 4,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
      Chat History
    </Typography>
    <Button
      variant="contained"
      color="primary"
      sx={{ mb: 2, borderRadius: 2, fontWeight: 700 }}
      onClick={onNewChat}
    >
      New chat
    </Button>
    <Divider sx={{ mb: 1 }} />
    <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
      {chatHistory.map(chat => (
        <ListItem key={chat.id} disablePadding
          secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => onDeleteChat(chat.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          }
        >
          <ListItemButton
            selected={chat.id === selectedChatId}
            onClick={() => onSelectChat(chat.id)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemText
              primary={chat.title}
              primaryTypographyProps={{
                fontWeight: chat.id === selectedChatId ? 700 : 500,
                color: chat.id === selectedChatId ? '#1C4ED8' : 'inherit',
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Paper>
);

export default ChatHistory;
