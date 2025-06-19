"use client";

import React, { useState } from "react";
import { Box, Paper, Typography, Button, Stack, TextField } from "@mui/material";

const buttonValues = [
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "=", "+"],
  ["C"]
];

export default function CalculatorComponent() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = (val: string) => {
    setError(null);

    if (val === "C") {
      setExpression("");
      setResult(null);
      return;
    }
    if (val === "=") {
      try {
        // eslint-disable-next-line no-eval
        const evalResult = eval(expression);
        setResult(evalResult.toString());
      } catch {
        setError("Invalid expression");
        setResult(null);
      }
      return;
    }
    if (result !== null) {
      setExpression(val.match(/[0-9.]/) ? val : result + val);
      setResult(null);
      return;
    }
    setExpression((prev) => prev + val);
  };

  return (
    <Box
      sx={{
        maxWidth: 420,
        mx: "auto",
        pt: { xs: 3, md: 5 },
        px: { xs: 1, md: 2 },
        position: "relative",
        zIndex: 1,
      }}
    >
      <Paper
        sx={{
          p: { xs: 2.5, md: 5 },
          borderRadius: "22px",
          bgcolor: "rgba(10, 18, 38, 0.72)",
          backdropFilter: "blur(32px) saturate(180%)",
          WebkitBackdropFilter: "blur(32px) saturate(180%)",
          border: "1.5px solid rgba(255,255,255,0.13)",
          boxShadow: "0 12px 48px 0 rgba(28,78,216,0.18)",
          color: "#fff",
          overflow: "hidden",
          transition: "background 0.3s",
          width: "100%",
          mb: 4,
        }}
        elevation={0}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#1C4ED8",
            mb: 2,
            fontWeight: 800,
            letterSpacing: 0.5,
            textShadow: "0 2px 24px #1C4ED880",
            textAlign: "center",
          }}
        >
          Calculator
        </Typography>

        <Box
          sx={{
            bgcolor: "rgba(28,78,216,0.13)",
            borderRadius: 3,
            px: 2,
            py: 1.8,
            mb: 3,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 0.5,
            color: "#fff",
            textAlign: "right",
            border: "1.5px solid #232336",
            minHeight: 56,
          }}
        >
          {result !== null ? result : expression || "0"}
          {error && (
            <Typography
              variant="subtitle2"
              sx={{ color: "#f44", fontWeight: 700, mt: 1, textAlign: "right" }}
            >
              {error}
            </Typography>
          )}
        </Box>

        <Stack spacing={2}>
          {buttonValues.map((row, i) => (
            <Stack key={i} direction="row" spacing={2} justifyContent="center">
              {row.map((val) => (
                <Button
                  key={val}
                  variant={["+", "-", "*", "/", "="].includes(val) ? "contained" : "outlined"}
                  onClick={() => handleClick(val)}
                  sx={{
                    background:
                      val === "="
                        ? "linear-gradient(90deg, #1C4ED8 10%, #1C4ED8 90%)"
                        : ["+", "-", "*", "/"].includes(val)
                        ? "rgba(28,78,216,0.18)"
                        : "rgba(28,78,216,0.10)",
                    color:
                      val === "="
                        ? "#fff"
                        : ["+", "-", "*", "/"].includes(val)
                        ? "#1C4ED8"
                        : "#fff",
                    borderColor: val === "=" ? "#1C4ED8" : "#232336",
                    fontWeight: 700,
                    fontSize: 20,
                    minWidth: 62,
                    minHeight: 62,
                    borderRadius: 3,
                    boxShadow:
                      val === "="
                        ? "0 2px 16px #1C4ED880"
                        : "none",
                    transition: "background 0.2s, color 0.2s",
                    "&:hover": {
                      background:
                        val === "="
                          ? "#1C4ED8"
                          : ["+", "-", "*", "/"].includes(val)
                          ? "rgba(28,78,216,0.28)"
                          : "#1C4ED8",
                      color: "#fff",
                    },
                  }}
                >
                  {val}
                </Button>
              ))}
            </Stack>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
