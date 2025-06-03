"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Html, useProgress } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { UserCircle, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";

export default function InitialScreen() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

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
    <div className="h-[100vh]" onMouseMove={handleMouseMove}>
      <div
        className="relative w-[90vw] h-[90vh] justify-center-safe flex flex-col items-center"
        style={{ marginTop: "5vh" }}
      >
        <div className="flex flex-col justify-center items-center z-10">
          <p
            className=""
            style={{
              fontFamily: "var(--font-tertiary)",
            }}
          >
            Atualizações
          </p>

          <p
            className="font-bold text-2xl mb-[80px]"
            style={{
              fontFamily: "var(--font-primary)",
            }}
          >
            Minhas últimas atividades
          </p>
          <div className="flex flex-col">
            <div className="bg-transparent p-5 rounded-[20px] transition-shadow duration-750 ease-in-out flex flex-col gap-5 [box-shadow:0px_8px_12px_6px_#eeeeee,0px_4px_4px_0px_#eeeeee] hover:bg-[#eeeeee] hover:shadow-2xl hover:shadow-stone-950">
              <div className="h-[360px] w-[360px] bg-[#1e1e1e] rounded-[20px] duration-750 transition-shadow hover:shadow-2xl hover:shadow-stone-950" ></div>
              <div className="flex place-content-between items-center">
                <div className="flex gap-5 items-center">
                  <UserCircle size={40} />
                  <p
                    className="text-2xl"
                    style={{
                      fontFamily: "var(--font-primary)",
                    }}
                  >
                    @usuário
                  </p>
                </div>
                <LinkedinLogo size={40} className="cursor-pointer"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
