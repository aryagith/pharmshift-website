"use client";

import React, { useState, useEffect } from "react";
import {
	Box, Typography, Button, Paper, Radio, RadioGroup, FormControlLabel, Stack
} from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import FlagIcon from '@mui/icons-material/Flag';
import Image from "next/image";
import ProtectedByLogin from "../ProtectedByLogin";

type Quiz = {
	id: string;
	title: string;
	description?: string;
	timeLimitMinutes: number;
	questions: {
		id: string;
		text: string;
		options: { id: string; text: string; isCorrect: boolean }[];
	}[];
};

const alphaLabel = (idx: number) => String.fromCharCode(65 + idx) + "."; // "A.", "B.", ...

export default function QuizComponent({ quiz }: { quiz: Quiz }) {
	const [current, setCurrent] = useState(0);
	const [selected, setSelected] = useState<string | null>(null);
	const [answers, setAnswers] = useState<(string | null)[]>(Array(quiz.questions?.length).fill(null));
	const [showResult, setShowResult] = useState(false);
	const [timer, setTimer] = useState(quiz.timeLimitMinutes * 60);
	const [flagged, setFlagged] = useState<boolean[]>(Array(quiz.questions?.length).fill(false));
	const [questionKey, setQuestionKey] = useState(0);
	const [animate, setAnimate] = useState(false);

	useEffect(() => {
		if (showResult) return;
		if (timer <= 0) {
			setShowResult(true);
			return;
		}
		const interval = setInterval(() => setTimer((t) => t - 1), 1000);
		return () => clearInterval(interval);
	}, [timer, showResult]);

	const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelected(e.target.value);
	};

	const handleNext = () => {
		const updated = [...answers];
		updated[current] = selected;
		setAnswers(updated);
		setSelected(null);
		if (current < quiz.questions?.length - 1) {
			setAnimate(true);
			setTimeout(() => {
				setCurrent((prev) => prev + 1);
				setQuestionKey((k) => k + 1);
				setAnimate(false);
			}, 200);
		} else {
			setShowResult(true);
		}
	};

	const handlePrev = () => {
		setAnimate(true);
		setTimeout(() => {
			setSelected(answers[current - 1]);
			setCurrent(current - 1);
			setQuestionKey((k) => k + 1);
			setAnimate(false);
		}, 200);
	};

	const handleJump = (idx: number) => {
		setAnimate(true);
		setTimeout(() => {
			setSelected(answers[idx]);
			setCurrent(idx);
			setQuestionKey((k) => k + 1);
			setAnimate(false);
		}, 200);
	};

	const handleRestart = () => {
		setCurrent(0);
		setAnswers(Array(quiz.questions?.length).fill(null));
		setSelected(null);
		setShowResult(false);
		setTimer(quiz.timeLimitMinutes * 60);
	};

	const handleFlag = () => {
		setFlagged((prev) => {
			const updated = [...prev];
			updated[current] = !updated[current];
			return updated;
		});
	};

	const correctCount = answers.filter((a, i) => {
		const q = quiz.questions?.[i];
		return q && q.options.find(opt => opt.id === a)?.isCorrect;
	}).length;

	const minutes = Math.floor(timer / 60);
	const seconds = timer % 60;

	return (
        <ProtectedByLogin>
		<Box minHeight="100vh" bgcolor="#050509" p={0} position="relative" overflow="hidden">
			{/* Pill background */}
			<Box
				sx={{
					position: "fixed",
					top: { xs: 60, md: 0 },
					left: 0,
					width: "100vw",
					height: "100vh",
					zIndex: 0,
					pointerEvents: "none",
					opacity: 0.18,
					filter: "blur(12px) saturate(180%)",
					background: `url('/pill.png') no-repeat center 30%/contain`,
				}}
			/>
			<Box
				sx={{
					maxWidth: 1600,
					mx: "auto",
					pt: { xs: 2, md: 6 },
					px: { xs: 1, md: 2 },
					position: "relative",
					zIndex: 1,
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
					gap: { xs: 2, md: 4 },
					alignItems: "stretch"
				}}
			>
				{/* Main Quiz Card */}
				<Box flex={{ xs: "unset", md: 3 }} minWidth={0} display="flex" alignItems="stretch">
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
							animation: animate ? 'fadeOut 0.2s' : 'fadeIn 0.5s',
							'@keyframes fadeIn': {
								from: { opacity: 0, transform: 'translateY(32px)' },
								to: { opacity: 1, transform: "none" },
							},
							'@keyframes fadeOut': {
								from: { opacity: 1, transform: "none" },
								to: { opacity: 0, transform: 'translateY(-32px)' },
							},
						}}
						elevation={0}
						key={questionKey}
					>
						{showResult ? (
							<Box textAlign="center">
								<Typography
									variant="h4"
									sx={{
										color: "#1C4ED8",
										mb: 2,
										fontWeight: 800,
										letterSpacing: 0.5,
										textShadow: "0 2px 24px #1C4ED880",
									}}
								>
									You scored {correctCount} / {quiz.questions?.length}
								</Typography>
								<Button
									onClick={handleRestart}
									variant="contained"
									sx={{
										background: "linear-gradient(90deg, #1C4ED8 10%, #1C4ED8 90%)",
										color: "#fff",
										borderRadius: 3,
										mt: 2,
										px: 5,
										fontWeight: 700,
										fontSize: 18,
										boxShadow: "0 2px 16px #1C4ED880",
									}}
								>
									Restart Quiz
								</Button>
							</Box>
						) : (
							<>
								{/* Question Number and Flag */}
								<Stack direction="row" alignItems="flex-start" mb={3} spacing={2}>
									<Typography
										variant="h4"
										sx={{
											color: "#fff",
											fontWeight: 800,
											letterSpacing: 0.2,
											lineHeight: 1,
											mr: 2,
											fontSize: { xs: 22, md: 28 },
											minWidth: 90,
											textAlign: "left"
										}}
									>
										Question {current + 1} <span style={{
											fontWeight: 500,
											fontSize: "20px",
											opacity: 0.75,
											marginLeft: 2,
										}}>/ {quiz.questions?.length}</span>
									</Typography>
									<Button
										variant={flagged[current] ? "contained" : "outlined"}
										onClick={handleFlag}
										sx={{
											background: flagged[current] ? "#1C4ED8" : "transparent",
											color: flagged[current] ? "#fff" : "#1C4ED8",
											borderColor: "#1C4ED8",
											borderWidth: 2,
											borderStyle: "solid",
											borderRadius: 3,
											fontWeight: 700,
											fontSize: 15,
											minWidth: 70,
											height: 36,
											px: 2,
											boxShadow: "none",
											transition: "background 0.2s, color 0.2s",
											display: 'flex',
											alignItems: 'center',
											gap: 1,
											mt: 0.4,
											'&:hover': {
												background: flagged[current] ? "#163a7a" : "#eaf1fd",
												color: flagged[current] ? "#fff" : "#1C4ED8",
											},
										}}
									>
										<FlagIcon sx={{ color: flagged[current] ? '#fff' : '#1C4ED8', mr: 1 }} />
										{flagged[current] ? "Flagged" : "Flag"}
									</Button>
								</Stack>
								<Typography
									variant="body1"
									sx={{
										color: "#fff",
										fontWeight: 700,
										fontSize: { xs: 19, md: 22 },
										letterSpacing: 0.2,
										mb: 2.5,
										lineHeight: 1.32,
									}}
								>
									{quiz.questions?.[current]?.text}
								</Typography>
								<RadioGroup value={selected !== null ? selected : answers[current]} onChange={handleSelect}>
									{quiz.questions?.[current]?.options.map((opt, idx) => (
										<FormControlLabel
											key={opt.id}
											value={opt.id}
											control={
												<Radio
													sx={{
														color: "#1C4ED8",
														'&.Mui-checked': { color: "#1C4ED8" },
														p: 1.2,
													}}
												/>
											}
											label={
												<Typography
													sx={{
														color: "#fff",
														fontSize: 18,
														fontWeight: 600,
														letterSpacing: 0.1,
														lineHeight: 1.28,
													}}
												>
													{alphaLabel(idx)} {opt.text}
												</Typography>
											}
											sx={{
												mb: 2.2,
												borderRadius: 3,
												pl: 1.5,
												backgroundColor: "rgba(28,78,216,0.10)",
												border: "1.5px solid #232336",
												transition: "background 0.2s",
												alignItems: "center",
												'&:hover': { backgroundColor: "rgba(28,78,216,0.18)" },
											}}
										/>
									))}
								</RadioGroup>
								<Stack direction="row" justifyContent="space-between" alignItems="center" mt={5} gap={2}>
									<Button
										variant="contained"
										onClick={handlePrev}
										disabled={current === 0}
										sx={{
											background: "rgba(28,78,216,0.13)",
											color: "#fff",
											borderRadius: 3,
											minWidth: 48,
											boxShadow: "none",
											fontWeight: 700,
											fontSize: 18,
											'&:hover': { background: "rgba(28,78,216,0.22)" },
										}}
									>
										<ArrowBackIos />
									</Button>
									<Button
										variant="contained"
										disabled={false}
										onClick={handleNext}
										sx={{
											background: "linear-gradient(90deg, #1C4ED8 10%, #1C4ED8 90%)",
											color: "#fff",
											borderRadius: 3,
											px: 7,
											fontWeight: 800,
											fontSize: 20,
											boxShadow: "0 2px 16px #1C4ED880",
										}}
									>
										{current === quiz.questions?.length - 1 ? "Finish" : "Next"}
									</Button>
								</Stack>
							</>
						)}
					</Paper>
				</Box>
				{/* Sidebar */}
				<Box
					flex={{ xs: "unset", md: 1 }}
					sx={{
						maxWidth: { xs: '100%', md: 320 },
						minWidth: { xs: '100%', md: 140 },
						mt: { xs: 3, md: 0 },
					}}
				>
					<Paper
						sx={{
							p: { xs: 2, md: 3 },
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
							variant="subtitle1"
							sx={{
								color: "#1C4ED8",
								fontWeight: 700,
								mb: 2,
								fontSize: 18,
								letterSpacing: 0.1,
							}}
						>
							Time Remaining: {minutes}:{seconds.toString().padStart(2, "0")}
						</Typography>
						<Typography
							variant="subtitle2"
							sx={{
								color: "#fff",
								fontWeight: 700,
								mb: 1.5,
								fontSize: 17,
								letterSpacing: 0.1,
							}}
						>
							Questions
						</Typography>
						<Stack direction="row" flexWrap="wrap" gap={1.2}>
							{quiz.questions?.map((_, idx) => {
								const isCurrent = current === idx;
								const isAttempted = answers[idx] !== null;
								return (
									<Box key={idx} sx={{ position: 'relative', display: 'inline-block' }}>
										<Button
											variant={isCurrent ? "contained" : "outlined"}
											onClick={() => handleJump(idx)}
											sx={{
												minWidth: 44,
												minHeight: 44,
												borderRadius: 3,
												background:
													isCurrent
														? "linear-gradient(90deg, #1C4ED8 10%, #1C4ED8 90%)"
													: isAttempted
														? "rgba(28,78,216,0.18)"
														: "rgba(28,78,216,0.10)",
												color: isCurrent ? "#fff" : "#1C4ED8",
												borderColor: isCurrent ? "#1C4ED8" : isAttempted ? "#1C4ED8" : "#232336",
												fontWeight: 700,
												fontSize: 17,
												p: 0,
												borderWidth: 2,
												borderStyle: "solid",
												boxShadow: isCurrent ? "0 0 0 3px #1C4ED880" : isAttempted ? "0 0 0 2px #1C4ED880" : "none",
												transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
												'&:hover': {
													background: isCurrent
														? "#1C4ED8"
														: isAttempted
															? "rgba(28,78,216,0.28)"
															: "#1C4ED8",
													color: "#fff",
												},
											}}
										>
											{idx + 1}
										</Button>
										{flagged[idx] && (
											<Box sx={{
												position: 'absolute',
												top: -10,
												right: -10,
												width: 24,
												height: 24,
												pointerEvents: 'none',
											}}>
												<Image src="/pill.png" alt="Flagged Pill" width={24} height={24} style={{ filter: 'drop-shadow(0 1px 4px #1C4ED880)' }} />
											</Box>
										)}
									</Box>
								);
							})}
						</Stack>
					</Paper>
				</Box>
			</Box>
		</Box>
        </ProtectedByLogin>
	);
}
