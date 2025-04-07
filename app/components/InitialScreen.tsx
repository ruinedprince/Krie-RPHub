export default function InitialScreen() {
  return (
    <div className="h-[200vh]">
      <div
        className="relative w-[90vw] h-[90vh] justify-center-safe grid grid-flow-col grid-rows-4"
        style={{ marginTop: "5vh" }}
      >
        <div
          className="absolute flex justify-end items-center w-[90vw] h-[90vh]">
            <p className="text-[320px] text-[#bebebe] leading-none"
            style={{
              fontFamily: "var(--font-secondary)",
            }}>
              ruinedprince
            </p>
        </div>
        <div
          className="absolute flex justify-end items-center w-[90vw] h-[90vh]">
            <p className="text-9xl text-[#eeeeee] leading-none"
            style={{
              fontFamily: "var(--font-tertiary)",
            }}>
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
