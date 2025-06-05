import React, { useState, useRef, useEffect } from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { Box, Paper, Button, IconButton } from "@mui/material";
import CalculatorComponent from "./CalculatorComponent";
import CloseIcon from "@mui/icons-material/Close";
import CalculateIcon from "@mui/icons-material/Calculate";

export default function CalculatorDrawer() {
    const [open, setOpen] = useState(false);
    const DRAWER_WIDTH = 400; // Width of the drawer when open
    // FAB Button
    if (!open) {
        return (
            <Box
                sx={{
                    position: "fixed",
                    bottom: { xs: 24, md: 40 },
                    right: { xs: 24, md: 64 },
                    zIndex: 9999,
                }}
            >
                <Button
                    sx={{
                        borderRadius: "50%",
                        bgcolor: "#1C4ED8",
                        color: "#fff",
                        boxShadow: "0 2px 16px #1C4ED880",
                        width: 72,
                        height: 72,
                        minWidth: 0,
                        p: 0,
                        "&:hover": { bgcolor: "#163a7a" },
                    }}
                    onClick={() => setOpen(true)}
                >
                    <CalculateIcon sx={{ fontSize: 36 }} />
                </Button>
            </Box>
        );
    }
    else {
        return (
            <Box
                sx={{
                    position: "fixed",
                    top: 40,
                    right: 0,
                    width: DRAWER_WIDTH,
                    zIndex: 12000,
                    transition: "all 0.3s cubic-bezier(.4,2,.5,1)",
                    boxShadow: "-12px 0 40px 0 rgba(28,78,216,0.18)",
                    bgcolor: "rgba(10, 18, 38, 0.96)",
                    borderTopLeftRadius: 32,
                    borderBottomLeftRadius: 32,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pb: 4,
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        p: 1.5,
                        pr: 2,
                    }}
                >
                    <IconButton
                        size="large"
                        sx={{ color: "#fff" }}
                        onClick={() => setOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <CalculatorComponent />
            </Box>
        );
    }
}
   