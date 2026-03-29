import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { User } from "lucide-react";

export default function PatientInfoForm({ patientInfo, onChange, ambiente }) {
  const showAdmissao = ambiente === "ambiente_hospitalar";
  const diasInternacao = useMemo(() => {
    if (!patientInfo.dataAdmissao) return null;
    const admDate = new Date(patientInfo.dataAdmissao);
    const now = new Date();
    const diffTime = now.getTime() - admDate.getTime();
    const days = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    return days;
  }, [patientInfo.dataAdmissao]);

  const handleChange = (field, value) => {
    onChange({ ...patientInfo, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card shadow-sm shadow-black/5 border border-border/50 p-5 space-y-4"
    >
      <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #6c5ce7, #a29bfe)" }}
        >
          <User className="w-3.5 h-3.5 text-white" />
        </div>
        Dados do Paciente
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="nome" className="text-xs text-muted-foreground">Nome do Paciente</Label>
          <Input
            id="nome"
            placeholder="Nome completo"
            value={patientInfo.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            className="h-11 rounded-xl bg-background border-border/60"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="idade" className="text-xs text-muted-foreground">Idade</Label>
          <Input
            id="idade"
            type="number"
            placeholder="Anos"
            min="0"
            max="150"
            value={patientInfo.idade}
            onChange={(e) => handleChange("idade", e.target.value)}
            className="h-11 rounded-xl bg-background border-border/60"
          />
        </div>

        {showAdmissao && (
          <div className="space-y-1.5">
            <Label htmlFor="dataAdmissao" className="text-xs text-muted-foreground">Data de Admissão</Label>
            <Input
              id="dataAdmissao"
              type="date"
              value={patientInfo.dataAdmissao}
              onChange={(e) => handleChange("dataAdmissao", e.target.value)}
              className="h-11 rounded-xl bg-background border-border/60"
            />
            {diasInternacao !== null && (
              <p className="text-xs text-primary font-bold mt-1">
                {diasInternacao}º dia de internação
              </p>
            )}
          </div>
        )}

        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="diagnostico" className="text-xs text-muted-foreground">Diagnóstico</Label>
          <Input
            id="diagnostico"
            placeholder="Diagnóstico principal"
            value={patientInfo.diagnostico}
            onChange={(e) => handleChange("diagnostico", e.target.value)}
            className="h-11 rounded-xl bg-background border-border/60"
          />
        </div>
      </div>
    </motion.div>
  );
}