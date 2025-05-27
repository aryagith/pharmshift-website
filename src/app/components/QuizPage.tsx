"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Radio, RadioGroup, FormControlLabel, Stack } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import Image from "next/image";
import FlagIcon from '@mui/icons-material/Flag';

const questions = [
	{
		question: "What is the main function of the liver?",
		options: [
			"Produce insulin",
			"Detoxify chemicals and metabolize drugs",
			"Store calcium",
			"Regulate blood pressure",
		],
		answer: 1,
	},
	{
		question: "Which vitamin is synthesized by sunlight exposure?",
		options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
		answer: 3,
	},
	{
		question: "What is the normal pH of blood?",
		options: ["6.8", "7.4", "8.0", "7.0"],
		answer: 1,
	},
];

export default function QuizPage() {
	const [current, setCurrent] = useState(0);
	const [selected, setSelected] = useState<number | null>(null);
	const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
	const [showResult, setShowResult] = useState(false);
	const [timer, setTimer] = useState(20 * 60); // 20 minutes in seconds
	const [flagged, setFlagged] = useState<boolean[]>(Array(questions.length).fill(false));
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
		setSelected(Number(e.target.value));
	};

	const handleNext = () => {
		const updated = [...answers];
		updated[current] = selected;
		setAnswers(updated);
		setSelected(null);
		if (current < questions.length - 1) {
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
		setAnswers(Array(questions.length).fill(null));
		setSelected(null);
		setShowResult(false);
		setTimer(20 * 60);
	};

	const handleFlag = () => {
		setFlagged((prev) => {
			const updated = [...prev];
			updated[current] = !updated[current];
			return updated;
		});
	};

	const correctCount = answers.filter((a, i) => a === questions[i].answer).length;
	const minutes = Math.floor(timer / 60);
	const seconds = timer % 60;

	return (
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
			<Box sx={{ maxWidth: 1400, mx: "auto", pt: { xs: 2, md: 6 }, position: "relative", zIndex: 1 }}>
				{/* <Typography
					variant="h3"
					sx={{
						color: "#fff",
						fontWeight: 800,
						mb: 3,
						ml: 2,
						letterSpacing: 0.5,
						background: "linear-gradient(90deg, #1C4ED8 10%, #1C4ED8 90%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						fontSize: { xs: 28, md: 38 },
						textShadow: "0 2px 24px #1C4ED880",
					}}
				>
					Multiple Choice Quiz
				</Typography> */}
				<Box display={{ xs: "block", md: "flex" }} gap={4}>
					{/* Main Quiz Card */}
					<Box flex={1}>
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
										You scored {correctCount} / {questions.length}
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
									<Typography
										variant="subtitle1"
										sx={{
											color: "#fff",
											mb: 3,
											fontWeight: 700,
											fontSize: 22,
											letterSpacing: 0.2,
											display: 'flex',
											alignItems: 'center',
											gap: 2,
											position: 'relative',
										}}
									>
										<Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
											<b>Question {current + 1}:</b> {questions[current].question}
										</Box>
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
												ml: 2,
												px: 2,
												boxShadow: "none",
												transition: "background 0.2s, color 0.2s",
												display: 'flex',
												alignItems: 'center',
												gap: 1,
												'&:hover': {
													background: flagged[current] ? "#163a7a" : "#eaf1fd",
													color: flagged[current] ? "#fff" : "#1C4ED8",
												},
											}}
										>
											<FlagIcon sx={{ color: flagged[current] ? '#fff' : '#1C4ED8', mr: 1 }} />
											{flagged[current] ? "Flagged" : "Flag"}
										</Button>
									</Typography>
									<RadioGroup value={selected !== null ? selected : answers[current]} onChange={handleSelect}>
										{questions[current].options.map((opt, idx) => (
											<FormControlLabel
												key={opt}
												value={idx}
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
														}}
													>
														{String.fromCharCode(65 + idx)}. {opt}
													</Typography>
												}
												sx={{
													mb: 2.2,
													borderRadius: 3,
													pl: 1.5,
													backgroundColor: "rgba(28,78,216,0.10)", // correct prop name
													border: "1.5px solid #232336",
													transition: "background 0.2s",
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
											{current === questions.length - 1 ? "Finish" : "Next"}
										</Button>
									</Stack>
								</>
							)}
						</Paper>
					</Box>
					{/* Sidebar */}
					<Box minWidth={220} mt={{ xs: 3, md: 0 }}>
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
								width: "fit-content",
								minWidth: 220,
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
								{questions.map((_, idx) => {
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
		</Box>
	);
}
