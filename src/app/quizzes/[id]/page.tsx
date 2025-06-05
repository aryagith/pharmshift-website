"use client";

import React, { use, useEffect, useState } from "react";
import QuizComponent from "../../components/QuizPage/QuizComponent";
import { Box, CircularProgress } from "@mui/material";
import CalculatorDrawer from "../../components/QuizPage/CalculatorDrawer";

// 'params' is now a promise, so unwrap it
export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Unwrap!

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/quizzes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setQuiz(data);
        setLoading(false);
      });
  }, [id]);

  if (loading || !quiz) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
  <>
  <QuizComponent quiz={quiz} />
  <CalculatorDrawer />
  </>
);
}
