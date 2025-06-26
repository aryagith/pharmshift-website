import { Suspense } from "react";
import QuizResultsPage from "../components/QuizResultsPage";
import { Box, CircularProgress } from "@mui/material";

export default function QuizResultsPageWrapper() {
  return (
    <Suspense
      fallback={
        <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
          <CircularProgress size={64} thickness={5} color="primary" />
        </Box>
      }
    >
      <QuizResultsPage />
    </Suspense>
  );
}
