"use client";

import { useRef, useState, useEffect } from "react";
import {
  UserCircle,
  LinkedinLogo,
  GithubLogo,
  InstagramLogo,
} from "@phosphor-icons/react/dist/ssr";

interface CardAtividadeProps {
  icon: React.ReactNode;
  user: string;
  socialIcon: React.ReactNode;
  children?: React.ReactNode;
}

function CardAtividade({
  icon,
  user,
  socialIcon,
  children,
}: CardAtividadeProps) {
  return (
    <div className="bg-transparent p-5 rounded-[40px] transition-all duration-750 ease-out flex flex-col gap-5 hover:bg-[#eeeeee] hover:[box-shadow:0px_8px_12px_6px_rgba(30,30,30,0.15),0px_4px_4px_0px_rgba(30,30,30,0.3)]">
      {children ? (
        children
      ) : (
        <div className="h-[360px] w-[360px] bg-[#1e1e1e] rounded-[20px] duration-750 transition-all ease-out hover:[box-shadow:0px_8px_12px_6px_rgba(30,30,30,0.15),0px_4px_4px_0px_rgba(30,30,30,0.3)]"></div>
      )}
      <div className="flex place-content-between items-center">
        <div className="flex gap-5 items-center">
          {icon}
          <p className="text-2xl" style={{ fontFamily: "var(--font-primary)" }}>
            {user}
          </p>
        </div>
        {socialIcon}
      </div>
    </div>
  );
}

function GithubCard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/github")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data)
    return (
      <div className="flex items-center justify-center h-[420px] w-[420px]">
        Carregando...
      </div>
    );

  return (
    <div className="bg-transparent p-5 rounded-[40px] transition-all duration-750 ease-out flex flex-col items-center gap-5 hover:bg-[#eeeeee] hover:[box-shadow:0px_8px_12px_6px_rgba(30,30,30,0.15),0px_4px_4px_0px_rgba(30,30,30,0.3)] w-[420px]">
      <img
        src={data.avatar_url}
        alt="Perfil"
        className="rounded-full w-[220px] h-[220px] object-cover transition-all duration-750 ease-out hover:[box-shadow:0px_8px_12px_6px_rgba(30,30,30,0.15),0px_4px_4px_0px_rgba(30,30,30,0.3)]"
      />
      <div className="flex flex-col items-center mt-4">
        <div className="flex items-center gap-2">
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-primary)" }}
          >{`@${data.login}`}</span>
          <a href={data.html_url} target="_blank" rel="noopener noreferrer">
            <GithubLogo size={40} className="cursor-pointer" />
          </a>
        </div>
        <span
          className="text-lg text-[#bebebe] mt-1"
          style={{ fontFamily: "var(--font-secondary)" }}
        >
          {data.name || ""}
        </span>
      </div>
      <div
        className="flex flex-row gap-8 mt-6"
        style={{ fontFamily: "var(--font-primary)" }}
      >
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold">{data.public_repos}</span>
          <span className="text-sm text-[#bebebe]">Repositórios</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold">{data.followers}</span>
          <span className="text-sm text-[#bebebe]">Seguidores</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold">{data.following}</span>
          <span className="text-sm text-[#bebebe]">Seguindo</span>
        </div>
      </div>
    </div>
  );
}

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
          <p className="" style={{ fontFamily: "var(--font-tertiary)" }}>
            Atualizações
          </p>
          <p
            className="font-bold text-2xl mb-[80px]"
            style={{ fontFamily: "var(--font-primary)" }}
          >
            Minhas últimas atividades
          </p>
          <div className="flex flex-row gap-[160px]">
            <CardAtividade
              icon={<UserCircle size={40} />}
              user="@usuario"
              socialIcon={
                <InstagramLogo size={40} className="cursor-pointer" />
              }
            />
            <CardAtividade
              icon={<UserCircle size={40} />}
              user="@usuario"
              socialIcon={<LinkedinLogo size={40} className="cursor-pointer" />}
            />
            <GithubCard />
          </div>
        </div>
        <div
          className="absolute flex justify-end items-center w-[90vw] h-[90vh]"
          style={{ zIndex: -1 }}
        >
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
            Atualizacoes
          </p>
        </div>
      </div>
    </div>
  );
}
