import React, { useEffect, useState } from 'react';
import Pill from '../utils/Pill';
import { useVoiceChat } from '../../../hooks/useVoiceChat';

const WS_URL =
  process.env.NODE_ENV === 'development'
    ? 'ws://localhost:8000/ws/audio'
    : 'wss://pharmshift-s2s-401721326394.us-central1.run.app/ws/audio';


const S2SPageComponent: React.FC = () => {
    const [volume, setVolume] = useState(0);
    const [isAiPlayback, setIsAiPlayback] = useState(false);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [evaluation, setEvaluation] = useState<string | null>(null);
    const { isRecording, status, toggleRecording, isPlaying } = useVoiceChat(WS_URL);

    // --- 1) Status heuristic + logging ---
    useEffect(() => {
        console.debug('[S2S] status changed:', status);
        const s = (status || '').toLowerCase();
        const playingFromStatus =
            s.includes('playback') ||
            s.includes('playing') ||
            s.includes('assistant speaking') ||
            s.includes('ai speaking') ||
            s.includes('tts') ||
            s.includes('responding') ||
            s.includes('speaking');

        setIsAiPlayback(isRecording ? false : playingFromStatus);
    }, [status, isRecording]);

    // --- 2) Media element events fallback ---
    useEffect(() => {
        const onMediaPlay = (ev: Event) => {
            if (isRecording) return;
            const target = ev.target as Element | null;
            if (!target) return;
            if (target instanceof HTMLMediaElement) {
                setIsAiPlayback(true);
            }
        };

        const onMediaPauseOrEnd = (ev: Event) => {
            const target = ev.target as Element | null;
            if (!target) return;
            if (target instanceof HTMLMediaElement) {
                setIsAiPlayback(false);
            }
        };

        document.addEventListener('play', onMediaPlay, true);
        document.addEventListener('playing', onMediaPlay, true);
        document.addEventListener('pause', onMediaPauseOrEnd, true);
        document.addEventListener('ended', onMediaPauseOrEnd, true);

        return () => {
            document.removeEventListener('play', onMediaPlay, true);
            document.removeEventListener('playing', onMediaPlay, true);
            document.removeEventListener('pause', onMediaPauseOrEnd, true);
            document.removeEventListener('ended', onMediaPauseOrEnd, true);
        };
    }, [isRecording]);

    // --- 3) Manual custom events ---
    useEffect(() => {
        const onAiPlaybackStart = () => {
            if (!isRecording) setIsAiPlayback(true);
        };
        const onAiPlaybackEnd = () => setIsAiPlayback(false);

        window.addEventListener('ai-playback-start', onAiPlaybackStart as EventListener);
        window.addEventListener('ai-playback-end', onAiPlaybackEnd as EventListener);

        return () => {
            window.removeEventListener('ai-playback-start', onAiPlaybackStart as EventListener);
            window.removeEventListener('ai-playback-end', onAiPlaybackEnd as EventListener);
        };
    }, [isRecording]);

    // --- 4) Microphone volume analysis ---
    useEffect(() => {
        let audioContext: AudioContext | null = null;
        let analyser: AnalyserNode | null = null;
        let micStream: MediaStreamAudioSourceNode | null = null;
        let animationFrame: number;

        const startVolumeAnalysis = async () => {
            try {
                audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                micStream = audioContext.createMediaStreamSource(stream);
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                micStream.connect(analyser);
                const dataArray = new Uint8Array(analyser.frequencyBinCount);

                const updateVolume = () => {
                    if (analyser) {
                        analyser.getByteTimeDomainData(dataArray);
                        let sum = 0;
                        for (let i = 0; i < dataArray.length; i++) {
                            const val = (dataArray[i] - 128) / 128;
                            sum += val * val;
                        }
                        const rms = Math.sqrt(sum / dataArray.length);
                        setVolume(Math.min(1, rms * 3));
                    }
                    animationFrame = requestAnimationFrame(updateVolume);
                };
                updateVolume();
            } catch (err) {
                console.error('[S2S] failed to start mic analyser', err);
            }
        };

        if (isRecording) startVolumeAnalysis();
        else setVolume(0);

        return () => {
            if (audioContext) audioContext.close();
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [isRecording]);

    // --- 5) Initialize WebSocket connection ---
    useEffect(() => {
        const socket = new WebSocket(WS_URL);

        socket.onopen = () => console.log('[S2S] WebSocket connected');
        socket.onmessage = (event) => {
            if (event.data.startsWith('[REPORT]')) {
                const report = event.data.replace('[REPORT]', '');
                setEvaluation(report);
            } else if (event.data === '[END]') {
                console.log('[S2S] Simulation ended by backend');
                socket.close();
            }
        };

        setWs(socket);

        // Close socket when user leaves page (no report sent)
        const handleUnload = () => {
            if (socket.readyState === WebSocket.OPEN) socket.close();
        };
        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            if (socket.readyState === WebSocket.OPEN) socket.close();
        };
    }, []);

    const handleEndSimulation = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send('__END_SIMULATION__');
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                width: '100vw',
                background: '#0a0a0f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, Arial, sans-serif',
                position: 'relative',
                flexDirection: 'column',
                padding: 20,
            }}
        >
            <img
                src="/pill.png"
                alt="Blurry Pill"
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '700px',
                    height: 'auto',
                    filter: 'blur(64px) brightness(1.2)',
                    opacity: 0.45,
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            />

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 40,
                    width: '100%',
                    maxWidth: 480,
                }}
            >
                <div
                    style={{
                        width: 420,
                        height: 420,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)',
                        boxShadow: '0 8px 32px 0 #2563eb44, 0 2px 24px 0 #18181b44',
                        backdropFilter: 'blur(24px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                        border: '1.5px solid rgba(96,165,250,0.22)',
                        outline: '2px solid rgba(255,255,255,0.08)',
                        outlineOffset: '-4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px auto',
                    }}
                >
                    <Pill
                        volume={isRecording ? volume : 0}
                        isListening={isRecording}
                        isPlayback={!isRecording && isPlaying}
                        canvasHeight={800}
                        canvasWidth={800}
                    />
                </div>

                <button
                    onClick={toggleRecording}
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: isRecording
                            ? 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)'
                            : 'rgba(255,255,255,0.18)',
                        color: isRecording ? '#fff' : '#2563eb',
                        border: 'none',
                        boxShadow: '0 2px 12px #2563eb44',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 32,
                        cursor: 'pointer',
                        transition: 'background 0.22s, box-shadow 0.22s',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        margin: '0 auto 8px auto',
                    }}
                >
                    <span style={{ display: 'inline-block' }}>
                        {isRecording ? '✕' : <span style={{ fontSize: 32 }}>🎤</span>}
                    </span>
                </button>

                <button
                    onClick={handleEndSimulation}
                    style={{
                        width: 160,
                        height: 44,
                        borderRadius: 12,
                        background: 'rgba(255,0,0,0.18)',
                        color: '#ff5555',
                        fontWeight: 600,
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        fontSize: 14,
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path d="M2.5 1a.5.5 0 0 1 .5.5V2h10v-.5a.5.5 0 0 1 1 0V2h.5A1.5 1.5 0 0 1 16 3.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-11A1.5 1.5 0 0 1 1.5 2H2v-.5a.5.5 0 0 1 .5-.5zM1 3.5v11a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5zM5 5.5a.5.5 0 0 1 .5-.5h.5v6h-.5a.5.5 0 0 1-.5-.5v-5zm2 0a.5.5 0 0 1 .5-.5h.5v6h-.5a.5.5 0 0 1-.5-.5v-5zm2 0a.5.5 0 0 1 .5-.5h.5v6h-.5a.5.5 0 0 1-.5-.5v-5z" />
                    </svg>
                    End Simulation
                </button>

                {evaluation && (
                    <div
                        style={{
                            marginTop: 24,
                            padding: '24px',
                            background: '#1f2937',
                            borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#f5f5f5',
                            fontSize: 14,
                            maxHeight: '400px',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            lineHeight: 1.6,
                            width: '90%',
                            maxWidth: 700,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                        }}
                    >
                        <div style={{ fontSize: 18, fontWeight: 600, color: '#60a5fa', marginBottom: 16 }}>
                            Evaluation Report
                        </div>

                        {/* Parse evaluation text line by line */}
                        {evaluation.split('\n').map((line, index) => {
                            line = line.trim();

                            // Skip empty lines
                            if (!line) return <div key={index} style={{ margin: '4px 0' }}>&nbsp;</div>;

                            // Section headers (## or #)
                            if (line.startsWith('## ')) {
                                return (
                                    <div
                                        key={index}
                                        style={{ fontSize: 16, fontWeight: 600, color: '#93c5fd', marginTop: 16, marginBottom: 8 }}
                                    >
                                        {line.replace('## ', '')}
                                    </div>
                                );
                            }
                            if (line.startsWith('# ')) {
                                return (
                                    <div
                                        key={index}
                                        style={{ fontSize: 18, fontWeight: 700, color: '#60a5fa', marginTop: 20, marginBottom: 12 }}
                                    >
                                        {line.replace('# ', '')}
                                    </div>
                                );
                            }

                            // Bold points (**text**) → make color and weight
                            if (line.startsWith('- **')) {
                                const text = line.replace(/^- \*\*(.*)\*\*:?/, '$1');
                                return (
                                    <li
                                        key={index}
                                        style={{ marginLeft: 24, marginBottom: 6, fontWeight: 500, color: '#fbbf24', listStyleType: 'disc' }}
                                    >
                                        {text}
                                    </li>
                                );
                            }

                            // Bullet points starting with - 
                            if (line.startsWith('- ')) {
                                return (
                                    <li key={index} style={{ marginLeft: 24, marginBottom: 6, listStyleType: 'disc' }}>
                                        {line.replace('- ', '')}
                                    </li>
                                );
                            }

                            // Normal text
                            return (
                                <div key={index} style={{ marginBottom: 6 }}>
                                    {line}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default S2SPageComponent;
