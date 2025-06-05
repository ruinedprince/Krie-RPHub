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

// --- CONFIGURAÇÕES DO OSCILOSCÓPIO ---
const oscilloscopeBars = 128; // Número de barras (resolução horizontal do gráfico)
const oscilloscopeHeight = 128; // Altura máxima da onda (ajuste aqui para aumentar/diminuir a amplitude visual)
const oscilloscopeWidth = 800; // Largura fixa do osciloscópio (em pixels)

// Função para interpolar cores hexadecimais
function lerpColor(a: string, b: string, t: number) {
  // Remove o #
  a = a.replace('#', '');
  b = b.replace('#', '');
  const ah = [parseInt(a.substring(0,2),16),parseInt(a.substring(2,4),16),parseInt(a.substring(4,6),16)];
  const bh = [parseInt(b.substring(0,2),16),parseInt(b.substring(2,4),16),parseInt(b.substring(4,6),16)];
  const rh = ah.map((av, i) => Math.round(av + (bh[i] - av) * t));
  return `#${rh.map(x => x.toString(16).padStart(2,'0')).join('')}`;
}

const MusicPlayer: React.FC = () => {
  // --- ESTADOS PRINCIPAIS ---
  const [currentTrack, setCurrentTrack] = useState(0); // Índice da música atual
  const [isPlaying, setIsPlaying] = useState(false); // Se está tocando
  const [seek, setSeek] = useState(0); // Posição atual da música (segundos)
  const [duration, setDuration] = useState(0); // Duração total da música (segundos)
  const [volume, setVolume] = useState(1); // Volume (0 a 1)
  const [isMuted, setIsMuted] = useState(false); // Se está mutado
  const [oscData, setOscData] = useState<number[]>(Array(oscilloscopeBars).fill(0)); // Dados do osciloscópio
  const { ref: sectionInViewRef, inView, entry } = useInView({ threshold: 0 });
  const sectionDomRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [themeProgress, setThemeProgress] = useState(0); // 0 = tema claro, 1 = tema escuro (transição)

  // --- CORES DO TEMA ---
  const lightBg = "#eeeeee"; // Cor de fundo clara
  const darkBg = "#1e1e1e"; // Cor de fundo escura
  const lightFg = "#1e1e1e"; // Cor de texto clara
  const darkFg = "#eeeeee"; // Cor de texto escura

  // --- TRANSIÇÃO DE TEMA BASEADA NO SCROLL ---
  useEffect(() => {
    function onScroll() {
      // Calcula o quanto da seção está visível na tela e ajusta themeProgress
      if (!sectionDomRef.current) return;
      const rect = sectionDomRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Quando o topo da seção entra na tela, progress começa a aumentar
      // Quando o bottom da seção sai da tela, progress = 1
      const sectionHeight = rect.height;
      const visible = Math.max(0, Math.min(rect.bottom, windowH) - Math.max(rect.top, 0));
      let progress = 0;
      if (rect.top < windowH && rect.bottom > 0) {
        progress = visible / Math.min(windowH, sectionHeight);
      }
      // Ajusta para 0~1 conforme a seção entra/saí
      setThemeProgress(progress);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    setTimeout(onScroll, 100); // inicializa
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // --- INTERPOLAÇÃO DE CORES NO BODY E ROOT ---
  useEffect(() => {
    const bg = lerpColor(lightBg, darkBg, themeProgress);
    const fg = lerpColor(lightFg, darkFg, themeProgress);
    document.body.style.background = bg;
    document.body.style.color = fg;
    document.documentElement.style.setProperty("--background", bg);
    document.documentElement.style.setProperty("--foreground", fg);
    return () => {
      document.body.style.background = lightBg;
      document.body.style.color = lightFg;
      document.documentElement.style.setProperty("--background", lightBg);
      document.documentElement.style.setProperty("--foreground", lightFg);
    };
  }, [themeProgress]);

  // --- SETUP E LIMPEZA DO AUDIO CONTEXT E ANALYSER ---
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

  // --- CONTROLES DE PLAY/PAUSE ---
  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }, [isPlaying]);

  // --- CONTROLES DE SEEK (AVANÇAR/VOLTAR) ---
  const handleSeek = (seconds: number) => {
    if (!audioRef.current) return;
    let newSeek = audioRef.current.currentTime + seconds;
    newSeek = Math.max(0, Math.min(newSeek, duration));
    audioRef.current.currentTime = newSeek;
    setSeek(newSeek);
  };

  // --- TROCA DE FAIXA (PRÓXIMA/ANTERIOR) ---
  const handleNext = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  }, []);
  const handlePrev = useCallback(() => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  }, []);

  // --- CONTROLES DE VOLUME E MUTE ---
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

  // --- EVENTOS DO ÁUDIO (play, pause, ended, timeupdate, loadedmetadata) ---
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

  // --- DADOS DO OSCILOSCÓPIO (ATUALIZAÇÃO DINÂMICA) ---
  const getOscilloscopeData = () => {
    if (analyserRef.current && dataArrayRef.current && isPlaying) {
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
      // Garante que sempre use oscilloscopeWidth
      return Array.from(dataArrayRef.current).slice(0, oscilloscopeBars).map(v => (v / 255) * oscilloscopeHeight);
    }
    // fallback: linha reta
    const bars = [];
    const center = oscilloscopeHeight / 2;
    for (let i = 0; i < oscilloscopeBars; i++) {
      bars.push(center);
    }
    return bars;
  };

  // --- RELAXAMENTO SUAVE DO OSCILOSCÓPIO AO PAUSAR ---
  useEffect(() => {
    let relaxId: number | null = null;
    let delayTimeout: number | null = null;
    let startTime: number | null = null;
    let initialData: number[] = [];
    const duration = 2000; // 2 segundos
    const delay = 1000; // 1 segundo

    function easeInExpo(t: number) {
      return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
    }

    function relaxAnim(ts: number) {
      if (startTime === null) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(1, elapsed / duration);
      const ease = easeInExpo(t);
      const center = oscilloscopeHeight / 2;
      setOscData(prev => prev.map((y, i) => {
        // Interpola do valor inicial para o centro
        return initialData[i] + (center - initialData[i]) * ease;
      }));
      if (t < 1) {
        relaxId = requestAnimationFrame(relaxAnim);
      }
    }

    if (!isPlaying) {
      delayTimeout = window.setTimeout(() => {
        // Salva o estado inicial antes de começar a animar
        initialData = [...oscData];
        startTime = null;
        relaxId = requestAnimationFrame(relaxAnim);
      }, delay);
    }
    return () => {
      if (relaxId) cancelAnimationFrame(relaxId);
      if (delayTimeout) clearTimeout(delayTimeout);
    };
  }, [isPlaying]);

  // --- ANIMAÇÃO DO OSCILOSCÓPIO (FRAME A FRAME) ---
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

  // --- LIMPEZA FINAL AO DESTRUIR COMPONENTE ---
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  // --- FORMATAÇÃO DO TEMPO (mm:ss) ---
  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  // --- LÓGICA DO ÍCONE DE VOLUME ---
  let VolumeIcon = SpeakerSimpleNone;
  if (isMuted || volume === 0) VolumeIcon = SpeakerSimpleX;
  else if (volume > 0.66) VolumeIcon = SpeakerSimpleHigh;
  else if (volume > 0.33) VolumeIcon = SpeakerSimpleLow;
  else VolumeIcon = SpeakerSimpleNone;

  // --- CORES INTERPOLADAS PARA ELEMENTOS ---
  const bgColor = lerpColor(lightBg, darkBg, themeProgress);
  const fgColor = lerpColor(lightFg, darkFg, themeProgress);

  // --- RENDERIZAÇÃO DO COMPONENTE ---
  return (
    <div
      ref={el => { sectionInViewRef(el); sectionDomRef.current = el; }}
      className="flex flex-col justify-center items-center h-[100vh] w-[90vw] relative transition-colors duration-500"
      style={{ color: fgColor }}
    >
      {/* Elemento de áudio nativo (invisível) */}
      <audio
        ref={audioRef}
        src={tracks[currentTrack].src}
        preload="auto"
        style={{ display: 'none' }}
        crossOrigin="anonymous"
      />
      <div className="flex flex-col items-center h-[620px] place-content-between">
        {/* Títulos */}
        <div className="flex flex-col items-center justify-center">
          <p className="" style={{ fontFamily: "var(--font-tertiary)", color: fgColor }}>
            Músicas
          </p>
          <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-primary)", color: fgColor }}>
            Músicas produzidas por mim!
          </p>
        </div>
        <div></div>
        {/* Osciloscópio visual */}
        <div className="flex items-center h-[64px] w-[800px] bg-transparent overflow-visible">
          <svg width={oscilloscopeWidth} height={oscilloscopeHeight} style={{ display: 'block', overflow: 'visible' }}>
            <polyline
              fill="none"
              stroke={fgColor}
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={oscData.map((y, i) => `${(i * oscilloscopeWidth) / (oscilloscopeBars - 1)},${y}`).join(' ')}
            />
          </svg>
        </div>
        {/* Controles e informações da faixa */}
        <div className="flex flex-col gap-[120px] items-center w-full">
          <div className="flex items-center gap-3 font-2xl font-bold">
            {/* Quadrado colorido e nome da faixa */}
            <div className="h-[40px] w-[40px] rounded-[10px]" style={{ background: fgColor }} />
            <p className="" style={{ fontFamily: "var(--font-primary)", color: fgColor }}>
              {tracks[currentTrack].name}
            </p>
          </div>
          {/* Controles de tempo, navegação e volume */}
          <div className="flex place-content-between items-center w-full">
            <p style={{ fontFamily: "var(--font-primary)", color: fgColor }}>{formatTime(seek)} / {formatTime(duration)}</p>
            <div className="flex gap-8 font-2xl items-center">
              {/* Botões de seek e navegação */}
              <button onClick={() => handleSeek(-15)} className="transition hover:scale-110 cursor-pointer"><p style={{ fontFamily: "var(--font-primary)", color: fgColor }}>-15s</p></button>
              <button onClick={handlePrev} className="transition hover:scale-110 cursor-pointer"><SkipBack size={40} color={fgColor} /></button>
              <button onClick={handlePlayPause} className="transition hover:scale-110 cursor-pointer">
                {isPlaying ? <Pause size={40} color={fgColor} /> : <Play size={40} color={fgColor} />}
              </button>
              <button onClick={handleNext} className="transition hover:scale-110 cursor-pointer"><SkipForward size={40} color={fgColor} /></button>
              <button onClick={() => handleSeek(15)} className="transition hover:scale-110 cursor-pointer"><p style={{ fontFamily: "var(--font-primary)", color: fgColor }}>+15s</p></button>
            </div>
            <div className="flex items-center gap-4">
              {/* Controle de volume */}
              <button onClick={handleMute} className="transition hover:scale-110 cursor-pointer"><VolumeIcon size={40} color={fgColor} /></button>
              <input
                id="default-range"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={e => handleVolume(Number(e.target.value))}
                className="w-[120px] h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: lerpColor("#888888", fgColor, themeProgress), accentColor: fgColor }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
