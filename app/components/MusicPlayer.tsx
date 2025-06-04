"use client";

import React from "react";

import { Play, SkipBack, SkipForward } from "@phosphor-icons/react";

const MusicPlayer: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[100vh] w-[90vw] relative border border-red-500">
      <div className="flex flex-col items-center h-[620px] place-content-between border border-blue-500">
        <div className="flex flex-col items-center justify-center">
          <p className="" style={{ fontFamily: "var(--font-tertiary)" }}>
            Músicas
          </p>
          <p
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-primary)" }}
          >
            Músicas produzidas por mim!
          </p>
        </div>
        <div></div>
        <div className="h-[1px] w-[800px] bg-[#1e1e1e]" />
        <div className="flex flex-col gap-[120px] items-center">
          <div className="flex items-center gap-3 font-2xl font-bold">
            <div className="h-[40px] w-[40px] bg-[#1e1e1e] rounded-[10px]" />
            <p className="" style={{ fontFamily: "var(--font-primary)" }}>
              Nome da Música
            </p>
          </div>
          <div className="flex gap-8 font-2xl items-center">
            <p style={{ fontFamily: "var(--font-primary)" }}>-15s</p>
            <SkipBack size={40} />
            <Play size={40} />
            <SkipForward size={40} />
            <p style={{ fontFamily: "var(--font-primary)" }}>+15s</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
