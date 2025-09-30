import { useRef, useState } from 'react';
import { resampleAudio } from '../lib/resampleAudio';

export const useVoiceChat = (wsUrl: string) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [isPlaying, setIsPlaying] = useState(false); // NEW
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const setupWebSocket = () => {
    const ws = new WebSocket(wsUrl);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => setStatus('Connected');

    ws.onmessage = (event) => {
      if (typeof event.data !== 'string') {
        const audioBlob = new Blob([event.data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        // Track playback for pill animation
        audio.onplaying = () => setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
        audio.onpause = () => setIsPlaying(false);

        audio.play();
      }
    };

    ws.onerror = () => setStatus('WebSocket error');
    ws.onclose = () => setStatus('WebSocket closed');

    wsRef.current = ws;
  };

  const handleAudioBlob = async (blob: Blob) => {
    const downsampledBlob = await resampleAudio(blob, 16000);
    downsampledBlob.arrayBuffer().then((buf) => {
      wsRef.current?.send(buf);
      setStatus('Audio sent');
    });
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        setupWebSocket();
        await new Promise((res) => setTimeout(res, 1000));
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        handleAudioBlob(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setStatus('Recording...');
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      setStatus('Stopped recording');
    }
  };

  return {
    isRecording,
    status,
    toggleRecording,
    isPlaying, // NEW
  };
};
