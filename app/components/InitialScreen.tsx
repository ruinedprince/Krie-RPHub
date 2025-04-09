"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Html, useProgress } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import gsap from "gsap";

function Model({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const gltf = useGLTF("/models/wireless_gaming_headset.glb");
  const ref = useRef<THREE.Object3D | null>(null);
  const animationCompleted = useRef(false); // Variável de controle

  // Animação inicial com GSAP
  useEffect(() => {
    if (ref.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          animationCompleted.current = true;
        },
      });

      // Animação de surgimento (posição, rotação e opacidade)
      tl.fromTo(
        ref.current.position,
        { y: -10 }, // Posição inicial (fora da tela)
        { y: 0, duration: 1.5, ease: "power2.inOut" } // Posição final
      ).fromTo(
        ref.current.rotation,
        { x: 0, y: 0, z: 0 }, // Rotação inicial
        {
          x: Math.PI / -32, // Rotação final no eixo X com +360º
          y: Math.PI / -4 + 2 * Math.PI, // Rotação final no eixo Y
          z: Math.PI / 16, // Rotação final no eixo Z
          duration: 1.5,
          ease: "power2.inOut",
        },
        "<" // Inicia ao mesmo tempo que a posição
      );
    }
  }, []);

  // Atualiza a rotação com base na posição do mouse
  useFrame(() => {
    if (ref.current && animationCompleted.current) {
      ref.current.rotation.x = Math.PI / -32 + mousePosition.y * 0.05; // Eixo X
      ref.current.rotation.y = Math.PI / -4 + mousePosition.x * 0.05; // Eixo Y
    }
  });

  return (
    <primitive
      ref={ref}
      object={gltf.scene}
      scale={[1, 1, 1]} // Tamanho do modelo
      rotation={[Math.PI / -32, Math.PI / -4, Math.PI / 16]} // Rotação inicial
    />
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <p>Carregando... {Math.round(progress)}%</p>
    </Html>
  );
}

export default function InitialScreen() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  // Animação inicial de opacidade com GSAP
  useEffect(() => {
    if (canvasContainerRef.current) {
      gsap.fromTo(
        canvasContainerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: "power2.inOut" }
      );
    }
  }, []);

  // Função para capturar a posição do mouse
  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window; // Use 'window' diretamente para obter as dimensões
    setMousePosition({
      x: (clientX / innerWidth) * 2 - 1, // Normaliza para valores entre -1 e 1
      y: (clientY / innerHeight) * 2 - 1, // Normaliza para valores entre -1 e 1
    });
  };

  return (
    <div className="h-[200vh]" onMouseMove={handleMouseMove}>
      <div
        className="relative w-[90vw] h-[90vh] justify-center-safe grid grid-flow-col grid-rows-4"
        style={{ marginTop: "5vh" }}
      >
        {/* Texto superior */}
        <div className="absolute flex justify-end items-center w-[90vw] h-[90vh]">
          <p
            className="text-[320px] text-[#bebebe] leading-none select-none"
            style={{
              fontFamily: "var(--font-secondary)",
              display: "inline-block",
              whiteSpace: "nowrap",
              margin: 0,
              padding: 0,
            }}
          >
            ruinedprince
          </p>
        </div>

        {/* Modelo 3D */}
        <div
          ref={canvasContainerRef}
          className="absolute flex justify-center items-center w-[90vw] h-full"
        >
          <Canvas>
            <ambientLight intensity={10} />
            <directionalLight
              position={[10, 6, 1]}
              intensity={15}
              color="#eeeeee"
            />
            <Suspense fallback={<Loader />}>
              <Model mousePosition={mousePosition} />
            </Suspense>
          </Canvas>
        </div>

        {/* Texto inferior */}
        <div className="absolute flex justify-end items-center w-[90vw] h-[90vh]">
          <p
            className="text-9xl text-[#eeeeee] leading-none"
            style={{
              fontFamily: "var(--font-tertiary)",
            }}
          >
            RUINEDPRINCE
          </p>
        </div>
      </div>
      <div
        className="fixed grid grid-cols-2 grid-rows-2 w-[90vw] h-[90vh]"
        style={{
          top: "5vh",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <p
          className="text-2xl leading-none tracking-[24px] select-none"
          style={{
            fontFamily: "var(--font-secondary)",
            margin: 0,
            padding: 0,
            lineHeight: "1",
          }}
        >
          KRIE
        </p>

        <div className="flex justify-end items-start gap-[60px]">
          <button
            className="bg-transparent text-[24px] font-primary leading-none transition-colors ease-in-out duration-300 hover:text-[#bebebe] active:text-[#eeeeee] active:transition-none"
            style={{ fontFamily: "var(--font-primary)" }}
          >
            Sobre
          </button>
          <button
            className="bg-transparent text-[24px] font-primary leading-none transition-colors ease-in-out duration-300 hover:text-[#bebebe] active:text-[#eeeeee] active:transition-none"
            style={{ fontFamily: "var(--font-primary)" }}
          >
            Projetos
          </button>
          <button
            className="bg-transparent text-[24px] font-primary leading-none transition-colors ease-in-out duration-300 hover:text-[#bebebe] active:text-[#eeeeee] active:transition-none"
            style={{ fontFamily: "var(--font-primary)" }}
          >
            Músicas
          </button>
          <button className="w-[32px] h-[24px] bg-transparent leading-none transition-colors ease-in-out duration-300 hover:text-[#bebebe] active:text-[#eeeeee] active:transition-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              className="w-full h-full fill-current"
            >
              <path d="M224 128a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8ZM40 72h176a8 8 0 0 0 0-16H40a8 8 0 0 0 0 16Zm176 112H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Z" />
            </svg>
          </button>
        </div>

        <div className="flex items-end gap-2">
          <p
            className="text-2xl leading-none select-none underline"
            style={{
              fontFamily: "var(--font-secondary)",
            }}
          >
            the
          </p>
          <p
            className="text-2xl leading-none select-none underline"
            style={{
              fontFamily: "var(--font-primary)",
              marginBottom: "2px",
            }}
          >
            /'ru:.ind prins/
          </p>
          <p
            className="text-2xl leading-none select-none underline"
            style={{
              fontFamily: "var(--font-secondary)",
            }}
          >
            's hub
          </p>
        </div>
      </div>
    </div>
  );
}
