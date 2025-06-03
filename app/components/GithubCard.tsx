// GithubCard.tsx
import { useState, useEffect } from "react";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr";

export default function GithubCard() {
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
        <div className="flex items-center gap-5">
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