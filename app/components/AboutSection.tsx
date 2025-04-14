"use client";

import { useEffect, useState } from "react";

export default function AboutSection() {
  const [timePassed, setTimePassed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const startDate = new Date(2004, 1, 6, 12, 15); // 6 de fevereiro de 2004, 12h15

    const updateCounter = () => {
      const now = new Date();

      // Cálculo de anos, meses e dias
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();

      // Ajuste para meses negativos
      if (months < 0) {
        years--;
        months += 12;
      }

      // Ajuste para dias negativos
      if (days < 0) {
        months--;
        const previousMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          0
        ).getDate(); // Último dia do mês anterior
        days += previousMonth;
      }

      // Cálculo de horas, minutos e segundos
      let hours = now.getHours() - startDate.getHours();
      let minutes = now.getMinutes() - startDate.getMinutes();
      let seconds = now.getSeconds() - startDate.getSeconds();

      // Ajuste para segundos negativos
      if (seconds < 0) {
        minutes--;
        seconds += 60;
      }

      // Ajuste para minutos negativos
      if (minutes < 0) {
        hours--;
        minutes += 60;
      }

      // Ajuste para horas negativas
      if (hours < 0) {
        days--;
        hours += 24;
      }

      setTimePassed({ years, months, days, hours, minutes, seconds });
    };

    // Atualiza o contador a cada segundo
    const interval = setInterval(updateCounter, 1000);

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center h-[100vh] w-[90vw] relative">
      <div className="relative top-0 left-0 w-1/2">
        <p
          className="text-xl text-justify"
          style={{
            fontFamily: "var(--font-primary)",
          }}
        >
          Oi, eu me chamo Gabriel, mas muitos me conhecem como{" "}
          <span
            style={{
              fontFamily: "var(--font-secondary)",
            }}
          >
            RuinedPrince
          </span>
          .<br />
          <br /> Sou um cara de{" "}
          <span
            style={{
              fontFamily: "var(--font-secondary)",
            }}
          >
            {timePassed.years}
          </span>{" "}
          anos,{" "}
          <span
            style={{
              fontFamily: "var(--font-secondary)",
            }}
          >
            {timePassed.months}
          </span>{" "}
          meses,{" "}
          <span
            style={{
              fontFamily: "var(--font-secondary)",
            }}
          >
            {timePassed.days}
          </span>{" "}
          dias,{" "}
          <span
            style={{
              fontFamily: "var(--font-secondary)",
            }}
          >
            {timePassed.hours}
          </span>{" "}
          horas,{" "}
          <span
            style={{
              fontFamily: "var(--font-secondary)",
            }}
          >
            {timePassed.minutes}
          </span>{" "}
          minutos e{" "}
          <span
            style={{
              fontFamily: "var(--font-secondary)",
            }}
          >
            {timePassed.seconds}
          </span>{" "}
          segundos que gosta muito de criar, independente do que seja.
          Atualmente, busco me firmar numa carreira como desenvolvedor,
          engenheiro de software, analista de dados, webdesigner ou qualquer
          outra vaga na área de tecnologia.
          <br />
          <br /> Nas horas vagas, eu também sou músico, atualmente tenho{" "}
          <span
            style={{
              fontFamily: "var(--font-secondary)",
            }}
          >
            GG
          </span>{" "}
          músicas registradas e pretendo produzir muitas outras, nos mais
          diversos gêneros.
          <br />
          <br /> Arrisco um pouco também em edições visuais, como imagem e
          vídeo, como eu disse, gosto muito de criar, não importa o que seja.
        </p>
      </div>
      <div className="relative top-0 right-0 w-1/2 h-[90vh]">
        texto
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
          sobre
        </p>
      </div>
    </div>
  );
}
