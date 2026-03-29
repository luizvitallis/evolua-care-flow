import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Pencil, Copy, Check, X, Save, Stethoscope, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

const PROFILE_LABELS = {
  medico: { label: "Evolução Médica", icon: Stethoscope, color: "#0984e3" },
  enfermeiro: { label: "Evolução de Enfermagem", icon: Heart, color: "#00b894" },
};

const ENV_LABELS = {
  atencao_primaria: "Atenção Primária",
  ambiente_hospitalar: "Hospitalar",
};

export default function EvolutionCard({
  evolution,
  isEditing,
  editText,
  onEditTextChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) {
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { toast } = useToast();

  const profileInfo = PROFILE_LABELS[evolution.profile] || PROFILE_LABELS.medico;
  const ProfileIcon = profileInfo.icon;
  const envLabel = ENV_LABELS[evolution.environment] || "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(evolution.text);
    setCopied(true);
    toast({ title: "Copiado!", duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

  const date = new Date(evolution.created_date);
  const dateStr = date.toLocaleDateString("pt-BR");
  const timeStr = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-2xl bg-card shadow-sm border border-border/50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: profileInfo.color }}
          >
            <ProfileIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">{profileInfo.label}</p>
            <p className="text-[10px] text-muted-foreground">
              {envLabel}{evolution.patient_name ? ` · ${evolution.patient_name}` : ""} · {dateStr} {timeStr}
            </p>
          </div>
        </div>
        <TooltipProvider delayDuration={300}>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={handleCopy} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>Copiar</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => onStartEdit(evolution)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Editar</TooltipContent>
            </Tooltip>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => onDelete(evolution.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-destructive/10 hover:bg-destructive/20 transition-colors">
                      <Check className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Confirmar exclusão</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={() => setConfirmDelete(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Cancelar</TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => setConfirmDelete(true)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Excluir</TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              className="min-h-[200px] resize-none rounded-xl bg-background border-border/60 text-sm font-inter"
            />
            <div className="flex gap-2">
              <Button onClick={onSaveEdit} size="sm" className="gap-1.5 rounded-lg font-semibold">
                <Save className="w-3.5 h-3.5" />
                Salvar
              </Button>
              <Button onClick={onCancelEdit} variant="outline" size="sm" className="rounded-lg">
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap text-xs text-foreground font-inter leading-relaxed max-h-48 overflow-y-auto">
            {evolution.text}
          </pre>
        )}
      </div>
    </motion.div>
  );
}