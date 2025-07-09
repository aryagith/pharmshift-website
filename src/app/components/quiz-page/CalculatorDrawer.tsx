'use client';

import React, { useState } from 'react';
import { Box, IconButton, Button, useMediaQuery, Paper } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalculateIcon from '@mui/icons-material/Calculate';
import CalculatorComponent from './CalculatorComponent';

export default function CalculatorDrawer() {
  const [open, setOpen] = useState(false);
  const DRAWER_WIDTH = 400;
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const fabZIndex = 1300;

  // Helper for vertical centering
  const verticalCenter = {
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: fabZIndex,
  };

  // FAB Button (bottom right) for mobile
  const fabButton = (icon: React.ReactNode, onClick: () => void) => (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 24, md: 40 },
        right: { xs: 24, md: 64 },
        zIndex: fabZIndex,
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
        onClick={onClick}
      >
        {icon}
      </Button>
    </Box>
  );

  // When closed
  if (!open) {
    if (isSmallScreen) {
      // Mobile: FAB with calculator icon
      return fabButton(<CalculateIcon sx={{ fontSize: 36 }} />, () => setOpen(true));
    }
    // Desktop: FAB with calculator icon (optional, or could use vertical center button)
    return fabButton(<CalculateIcon sx={{ fontSize: 36 }} />, () => setOpen(true));
  }

  // When open
  return (
    <Box
      sx={{
        position: 'fixed',
        top: { xs: 80, sm: 64 },
        right: 0,
        zIndex: fabZIndex,
        width: { xs: '100%', sm: DRAWER_WIDTH },
        maxWidth: '100vw',
        transition: 'all 0.3s cubic-bezier(.4,2,.5,1)',
        boxShadow: '-12px 0 40px 0 rgba(0,0,0,0.25)',
        bgcolor: 'rgba(10,10,10,0.85)', // jet black frosted glass
        borderTopLeftRadius: 32,
        borderBottomLeftRadius: 32,
        border: '1.5px solid rgba(255,255,255,0.18)', // glass-like border
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pb: 4,
      }}
    >
      {/* Mobile: FAB arrow at bottom right to close */}
      {isSmallScreen && fabButton(<ArrowForwardIosIcon sx={{ fontSize: 32 }} />, () => setOpen(false))}
      {/* Desktop: Arrow on left edge to close */}
      {!isSmallScreen && (
        <IconButton
          onClick={() => setOpen(false)}
          sx={{
            position: 'absolute',
            top: '50%',
            left: -28, // Overlap half the button for seamless join
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(10, 18, 38, 0.96)', // Match drawer background
            color: '#fff',
            borderTopLeftRadius: 28,
            borderBottomLeftRadius: 28,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            width: 56,
            height: 56,
            boxShadow: 'none',
            border: '2px solid rgba(10, 18, 38, 0.96)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': { bgcolor: '#163a7a' },
            p: 0,
            zIndex: 2,
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}
      {/* Calculator UI */}
      <CalculatorComponent />
    </Box>
  );
}
