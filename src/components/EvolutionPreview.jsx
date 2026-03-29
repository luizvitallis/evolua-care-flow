import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, Download, RotateCcw, Check, CaseSensitive } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function EvolutionPreview({ text, onClear, uppercase, onToggleUppercase }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();



  const displayText = uppercase ? text.toUpperCase() : text;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayText);
    setCopied(true);
    toast({ title: "Copiado!", description: "Evolução copiada para a área de transferência.", duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([displayText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evolucao_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exportado!", description: "Arquivo baixado com sucesso.", duration: 2000 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="rounded-2xl bg-card shadow-sm shadow-black/5 border border-border/50 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CaseSensitive className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="uppercase-toggle" className="text-xs text-muted-foreground cursor-pointer">LETRAS MAIÚSCULAS</Label>
          </div>
          <Switch
            id="uppercase-toggle"
            checked={uppercase}
            onCheckedChange={onToggleUppercase}
          />
        </div>
        <pre className="whitespace-pre-wrap break-words text-sm text-foreground font-inter leading-relaxed overflow-x-hidden">
          {displayText}
        </pre>
      </div>

      <TooltipProvider delayDuration={300}>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleCopy}
                className="flex-1 h-12 gap-2 font-bold rounded-xl text-white"
                style={{ background: "linear-gradient(135deg, #0984e3, #74b9ff)" }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copiado!" : "Copiar"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copiar evolução</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleExport}
                variant="outline"
                className="h-12 gap-2 rounded-xl border-border/60"
              >
                <Download className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Exportar como arquivo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onClear}
                variant="outline"
                className="h-12 gap-2 rounded-xl border-border/60 text-muted-foreground hover:text-destructive"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Nova evolução</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </motion.div>
  );
}