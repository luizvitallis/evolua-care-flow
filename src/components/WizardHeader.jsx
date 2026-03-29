import { Activity } from "lucide-react";

export default function WizardHeader({ currentStep, totalSteps }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #e84393, #6c5ce7, #0984e3)",
          }}
        >
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">Evolua</h1>
          <p className="text-[11px] text-muted-foreground -mt-0.5">Evolução clínica</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full overflow-hidden bg-border"
          >
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: i < currentStep ? "100%" : i === currentStep ? "50%" : "0%",
                background: i <= currentStep
                  ? "linear-gradient(90deg, #e84393, #0984e3)"
                  : "transparent",
              }}
            />
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground mt-1.5">
        Etapa {currentStep + 1} de {totalSteps}
      </p>
    </div>
  );
}