"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

export default function QuizResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizAttemptId = searchParams.get("quizAttemptId");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quizAttemptId) return;
    fetch(`/api/quiz-attempts/results?quizAttemptId=${quizAttemptId}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      });
  }, [quizAttemptId]);

  if (!quizAttemptId) {
    return <Box p={4}><Typography color="error">No quiz attempt specified.</Typography></Box>;
  }

  if (loading) {
    return <Box p={4}><Typography>Loading results...</Typography><LinearProgress sx={{ mt: 2 }} /></Box>;
  }

  if (!results) {
    return <Box p={4}><Typography color="error">Results not found.</Typography></Box>;
  }

  const { quizTitle, questions, correctCount, percentage } = results;

  return (
    <Box minHeight="100vh" bgcolor="#050509" p={0}>
      <Box maxWidth={900} mx="auto" pt={6} px={2}>
        <Typography variant="h4" fontWeight={800} color="#1C4ED8" mb={2}>
          {quizTitle}
        </Typography>
        <Typography variant="h5" fontWeight={700} mb={1}>
          Your Score: {correctCount} / {questions.length} ({percentage}%)
        </Typography>
        <LinearProgress variant="determinate" value={percentage} sx={{ height: 10, borderRadius: 5, mb: 4, bgcolor: '#232336' }} />
        <TableContainer component={Paper} sx={{ bgcolor: 'rgba(10, 18, 38, 0.85)', color: '#fff', borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#1C4ED8', fontWeight: 700, fontSize: 18 }}>#</TableCell>
                <TableCell sx={{ color: '#1C4ED8', fontWeight: 700, fontSize: 18 }}>Question</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Your Answer</TableCell>
                <TableCell sx={{ color: '#1C4ED8', fontWeight: 700, fontSize: 18 }}>Correct Answer</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((q: any, idx: number) => (
                <TableRow key={q.id}>
                  <TableCell sx={{ color: '#1C4ED8', fontWeight: 700, fontSize: 16 }}>{idx + 1}</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>{q.text}</TableCell>
                  <TableCell sx={{ color: q.isCorrect ? '#1abe55' : '#f44', fontWeight: 700, fontSize: 16 }}>{q.userOptionText || "No answer"}</TableCell>
                  <TableCell sx={{ color: '#1C4ED8', fontWeight: 700, fontSize: 16 }}>{q.correctOptionText}</TableCell>
                  <TableCell sx={{ color: q.isCorrect ? '#1abe55' : '#f44', fontWeight: 700, fontSize: 16 }}>{q.isCorrect ? "✔" : "✘"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" sx={{ mt: 4, fontWeight: 700, fontSize: 18, borderRadius: 3 }} onClick={() => router.push("/quizselection")}>Back to Quizzes</Button>
      </Box>
    </Box>
  );
}
