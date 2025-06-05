"use client";

import { List } from "@phosphor-icons/react";

export default function OverlayMenu() {
  return (
    <div
      className="fixed grid grid-cols-2 grid-rows-2 w-[90vw] h-[90vh] z-100 m-0 p-0"
      style={{
        top: "5vh",
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none", // Permite clicar nos elementos abaixo do overlay
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

      {/* Só esta div recebe eventos de clique */}
      <div
        className="flex justify-end items-start gap-[60px]"
        style={{ pointerEvents: "auto" }}
      >
        <button
          className="bg-transparent text-[24px] font-primary leading-none transition-colors ease-in-out duration-300 hover:text-[#bebebe] active:text-[#eeeeee] active:transition-none cursor-pointer"
          style={{ fontFamily: "var(--font-primary)" }}
        >
          Sobre
        </button>
        <button
          className="bg-transparent text-[24px] font-primary leading-none transition-colors ease-in-out duration-300 hover:text-[#bebebe] active:text-[#eeeeee] active:transition-none cursor-pointer"
          style={{ fontFamily: "var(--font-primary)" }}
        >
          Projetos
        </button>
        <button
          className="bg-transparent text-[24px] font-primary leading-none transition-colors ease-in-out duration-300 hover:text-[#bebebe] active:text-[#eeeeee] active:transition-none cursor-pointer"
          style={{ fontFamily: "var(--font-primary)" }}
        >
          Músicas
        </button>
        <button className="w-[32px] h-[24px] bg-transparent leading-none transition-colors ease-in-out duration-300 hover:text-[#bebebe] active:text-[#eeeeee] active:transition-none cursor-pointer">
          <List size={32} />
        </button>
      </div>

      <div className="flex items-end gap-2">
        <p
          className="text-2xl leading-none select-none"
          style={{
            fontFamily: "var(--font-secondary)",
          }}
        >
          the{" "}
        </p>
        <span
          className="text-2xl"
          style={{
            fontFamily: "var(--font-primary)",
          }}
        >
          /'ru:.ind prins/
        </span>
        <p
          className="text-2xl leading-none select-none"
          style={{
            fontFamily: "var(--font-secondary)",
          }}
        >
          's hub
        </p>
      </div>
    </div>
  );
}
