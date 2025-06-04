"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, SpeakerSimpleNone, SpeakerSimpleLow, SpeakerSimpleHigh, SpeakerSimpleX } from "@phosphor-icons/react";
import { Howl } from "howler";
import { useInView } from "react-intersection-observer";

const tracks = [
  {
    name: "bastante e completo 2",
    src: "/sounds/bastante e completo 2.mp3",
  },
  {
    name: "Mil _ _ Sóis",
    src: "/sounds/Mil _ _ Sóis.wav",
  },
  {
    name: "teus sonhos",
    src: "/sounds/teus sonhos.wav",
  },
];

// Oscilloscope visual adapted from example/osc.js
const oscilloscopeBars = 80;
const oscilloscopeHeight = 32;
const oscilloscopeWidth = 800;

const MusicPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [oscData, setOscData] = useState<number[]>(Array(oscilloscopeBars).fill(0));
  const animationRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const { ref: sectionRef, inView } = useInView({ threshold: 0.3 });

  // Theme switching
  useEffect(() => {
    if (inView) {
      document.body.style.background = "#1e1e1e";
      document.body.style.color = "#eeeeee";
      document.documentElement.style.setProperty("--background", "#1e1e1e");
      document.documentElement.style.setProperty("--foreground", "#eeeeee");
    } else {
      document.body.style.background = "#eeeeee";
      document.body.style.color = "#1e1e1e";
      document.documentElement.style.setProperty("--background", "#eeeeee");
      document.documentElement.style.setProperty("--foreground", "#1e1e1e");
    }
    return () => {
      document.body.style.background = "#eeeeee";
      document.body.style.color = "#1e1e1e";
      document.documentElement.style.setProperty("--background", "#eeeeee");
      document.documentElement.style.setProperty("--foreground", "#1e1e1e");
    };
  }, [inView]);

  // Setup analyser when track changes
  useEffect(() => {
    let cleaned = false;
    // Cleanup previous context and nodes
    if (audioCtxRef.current) {
      try {
        console.log('[DEBUG] Tentando fechar audioCtxRef. State:', audioCtxRef.current.state);
        if (audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close();
          console.log('[DEBUG] audioCtxRef fechado com sucesso.');
        } else {
          console.log('[DEBUG] audioCtxRef já estava fechado.');
        }
      } catch (e) {
        console.error('[DEBUG] Erro ao fechar audioCtxRef:', e);
      }
      audioCtxRef.current = null;
    }
    if (analyserRef.current) {
      try {
        console.log('[DEBUG] Tentando desconectar AnalyserNode. Inputs:', analyserRef.current.numberOfInputs);
        if (analyserRef.current.numberOfInputs > 0) {
          analyserRef.current.disconnect();
          console.log('[DEBUG] AnalyserNode desconectado.');
        }
      } catch (e) {
        console.error('[DEBUG] Erro ao desconectar AnalyserNode:', e);
      }
      analyserRef.current = null;
    }
    if (sourceRef.current) {
      try {
        console.log('[DEBUG] Tentando desconectar SourceNode. Outputs:', sourceRef.current.numberOfOutputs);
        if (sourceRef.current.numberOfOutputs > 0) {
          sourceRef.current.disconnect();
          console.log('[DEBUG] SourceNode desconectado.');
        }
      } catch (e) {
        console.error('[DEBUG] Erro ao desconectar SourceNode:', e);
      }
      sourceRef.current = null;
    }
    if (!audioRef.current) return;
    // Pause and reset audio element
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    // Create new context and analyser
    let ctx: AudioContext | null = null;
    let source: MediaElementAudioSourceNode | null = null;
    let analyser: AnalyserNode | null = null;
    try {
      ctx = new window.AudioContext();
      source = ctx.createMediaElementSource(audioRef.current);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
      sourceRef.current = source;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      audioCtxRef.current = ctx;
    } catch (e) {
      // Silencia erros de contexto já fechado/desconectado
    }
    setIsPlaying(false);
    setSeek(0);
    setDuration(0);
    setTimeout(() => {
      if (!cleaned) audioRef.current?.load();
    }, 0);
    return () => {
      cleaned = true;
      // Só fecha ctx se for diferente do audioCtxRef global (evita duplo close)
      try {
        if (ctx && ctx !== audioCtxRef.current && ctx.state !== 'closed') ctx.close();
      } catch (e) {
        console.error('[DEBUG] Erro ao fechar ctx no cleanup:', e);
      }
      try {
        if (analyser && analyser.numberOfInputs > 0) analyser.disconnect();
      } catch (e) {}
      try {
        if (source && source.numberOfOutputs > 0) source.disconnect();
      } catch (e) {}
    };
  }, [currentTrack]);

  // Play/pause logic
  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }, [isPlaying]);

  // Seek logic
  const handleSeek = (seconds: number) => {
    if (!audioRef.current) return;
    let newSeek = audioRef.current.currentTime + seconds;
    newSeek = Math.max(0, Math.min(newSeek, duration));
    audioRef.current.currentTime = newSeek;
    setSeek(newSeek);
  };

  // Next/prev track
  const handleNext = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  }, []);
  const handlePrev = useCallback(() => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  }, []);

  // Volume logic
  const handleVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
      setIsMuted(v === 0);
    }
  };
  const handleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => handleNext();
    const onTimeUpdate = () => setSeek(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [handleNext]);

  // Oscilloscope logic: use analyser data if available
  const getOscilloscopeData = () => {
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
      return Array.from(dataArrayRef.current).map(v => (v / 255) * oscilloscopeHeight);
    }
    // fallback: sine wave
    const bars = [];
    const amplitude = (isMuted ? 0 : volume) * (oscilloscopeHeight / 2 - 2);
    for (let i = 0; i < oscilloscopeBars; i++) {
      const x = (i / oscilloscopeBars) * Math.PI * 2;
      bars.push(Math.sin(x) * amplitude + oscilloscopeHeight / 2);
    }
    return bars;
  };

  // Update seek and oscilloscope
  const animate = () => {
    setOscData(getOscilloscopeData());
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, volume, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  // Format time
  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  // Volume icon logic
  let VolumeIcon = SpeakerSimpleNone;
  if (isMuted || volume === 0) VolumeIcon = SpeakerSimpleX;
  else if (volume > 0.66) VolumeIcon = SpeakerSimpleHigh;
  else if (volume > 0.33) VolumeIcon = SpeakerSimpleLow;
  else VolumeIcon = SpeakerSimpleNone;

  return (
    <div ref={sectionRef} className="flex flex-col justify-center items-center h-[100vh] w-[90vw] relative bg-[#1e1e1e] text-[#eeeeee] transition-colors duration-500">
      <audio
        ref={audioRef}
        src={tracks[currentTrack].src}
        preload="auto"
        style={{ display: 'none' }}
        crossOrigin="anonymous"
      />
      <div className="flex flex-col items-center h-[620px] place-content-between">
        <div className="flex flex-col items-center justify-center">
          <p className="" style={{ fontFamily: "var(--font-tertiary)" }}>
            Músicas
          </p>
          <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-primary)" }}>
            Músicas produzidas por mim!
          </p>
        </div>
        <div></div>
        {/* Oscilloscope */}
        <div className="flex items-center h-[32px] w-[800px] bg-transparent overflow-visible">
          <svg width={oscilloscopeWidth} height={oscilloscopeHeight} style={{ display: 'block', overflow: 'visible' }}>
            <polyline
              fill="none"
              stroke="#eeeeee"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={oscData.map((y, i) => `${(i * oscilloscopeWidth) / oscilloscopeBars},${y}`).join(' ')}
            />
          </svg>
        </div>
        <div className="flex flex-col gap-[120px] items-center w-full">
          <div className="flex items-center gap-3 font-2xl font-bold">
            <div className="h-[40px] w-[40px] bg-[#eeeeee] rounded-[10px]" />
            <p className="" style={{ fontFamily: "var(--font-primary)", color: "#eeeeee" }}>
              {tracks[currentTrack].name}
            </p>
          </div>
          <div className="flex place-content-between items-center w-full">
            <p style={{ fontFamily: "var(--font-primary)", color: "#eeeeee" }}>{formatTime(seek)} / {formatTime(duration)}</p>
            <div className="flex gap-8 font-2xl items-center">
              <button onClick={() => handleSeek(-15)} className="transition hover:scale-110"><p style={{ fontFamily: "var(--font-primary)", color: "#eeeeee" }}>-15s</p></button>
              <button onClick={handlePrev} className="transition hover:scale-110"><SkipBack size={40} color="#eeeeee" /></button>
              <button onClick={handlePlayPause} className="transition hover:scale-110">
                {isPlaying ? <Pause size={40} color="#eeeeee" /> : <Play size={40} color="#eeeeee" />}
              </button>
              <button onClick={handleNext} className="transition hover:scale-110"><SkipForward size={40} color="#eeeeee" /></button>
              <button onClick={() => handleSeek(15)} className="transition hover:scale-110"><p style={{ fontFamily: "var(--font-primary)", color: "#eeeeee" }}>+15s</p></button>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleMute} className="transition hover:scale-110"><VolumeIcon size={40} color="#eeeeee" /></button>
              <input
                id="default-range"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={e => handleVolume(Number(e.target.value))}
                className="w-[120px] h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
