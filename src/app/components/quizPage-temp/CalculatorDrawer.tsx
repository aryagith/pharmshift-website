'use client';

import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { Box, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalculateIcon from '@mui/icons-material/Calculate';
import CalculatorComponent from './CalculatorComponent';

export default function CalculatorDrawer() {
  const [open, setOpen] = useState(false);
  const DRAWER_WIDTH = 400;
  const nodeRef = useRef(null);

  // FAB Button when closed
  if (!open) {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 24, md: 40 },
          right: { xs: 24, md: 64 },
          zIndex: 9999,
        }}
      >
        <Button
          sx={{
            borderRadius: '50%',
            bgcolor: '#1C4ED8',
            color: '#fff',
            boxShadow: '0 2px 16px #1C4ED880',
            width: 72,
            height: 72,
            minWidth: 0,
            p: 0,
            '&:hover': { bgcolor: '#163a7a' },
          }}
          onClick={() => setOpen(true)}
        >
          <CalculateIcon sx={{ fontSize: 36 }} />
        </Button>
      </Box>
    );
  }

  // Draggable Calculator Drawer
  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="body"
      defaultPosition={{ x: window.innerWidth - DRAWER_WIDTH, y: 40 }}
      handle=".drag-handle"
    >
      <Box
        ref={nodeRef}
        sx={{
          position: 'fixed',
          top: 40,
          zIndex: 12000,
          width: DRAWER_WIDTH,
          transition: 'all 0.3s cubic-bezier(.4,2,.5,1)',
          boxShadow: '-12px 0 40px 0 rgba(28,78,216,0.18)',
          bgcolor: 'rgba(10, 18, 38, 0.96)',
          borderTopLeftRadius: 32,
          borderBottomLeftRadius: 32,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pb: 4,
          cursor: 'move',
        }}
      >
        {/* Drag/Close Area */}
        <Box
          className="drag-handle"
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            p: 1.5,
            pr: 2,
            cursor: 'grab',
          }}
        >
          <IconButton
            size="large"
            sx={{ color: '#fff' }}
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Calculator UI */}
        <CalculatorComponent />
      </Box>
    </Draggable>
  );
}
