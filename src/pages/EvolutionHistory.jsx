import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trash2, Pencil, Copy, Check, Search, Stethoscope, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import EvolutionCard from "../components/EvolutionCard";

export default function EvolutionHistory() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [evolutions, setEvolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const appUser = JSON.parse(localStorage.getItem("evolua_user") || "null");

  useEffect(() => {
    if (!appUser) {
      navigate("/");
      return;
    }
    loadEvolutions();
  }, []);

  const loadEvolutions = async () => {
    setLoading(true);
    const data = await base44.entities.Evolution.filter(
      { app_user_id: appUser.id },
      "-created_date",
      100
    );
    setEvolutions(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await base44.entities.Evolution.delete(id);
    setEvolutions((prev) => prev.filter((e) => e.id !== id));
    toast({ title: "Excluída", description: "Evolução removida com sucesso.", duration: 2000 });
  };

  const handleStartEdit = (evo) => {
    setEditingId(evo.id);
    setEditText(evo.text);
  };

  const handleSaveEdit = async () => {
    await base44.entities.Evolution.update(editingId, { text: editText });
    setEvolutions((prev) =>
      prev.map((e) => (e.id === editingId ? { ...e, text: editText } : e))
    );
    setEditingId(null);
    setEditText("");
    toast({ title: "Salva", description: "Evolução atualizada com sucesso.", duration: 2000 });
  };

  const filtered = evolutions.filter((e) => {
    const q = search.toLowerCase();
    return (
      (e.patient_name || "").toLowerCase().includes(q) ||
      (e.text || "").toLowerCase().includes(q) ||
      (e.template_name || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div
        className="w-full px-5 pt-6 pb-8"
        style={{
          background: "linear-gradient(135deg, #e84393 0%, #6c5ce7 30%, #0984e3 70%, #74b9ff 100%)",
        }}
      >
        <button
          onClick={() => navigate("/app")}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-3 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <h1 className="text-xl font-extrabold text-white">Minhas Evoluções</h1>
        <p className="text-white/70 text-xs mt-0.5">{evolutions.length} evolução(ões) salva(s)</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4 pb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por paciente, modelo ou texto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-card border-border/60"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">{search ? "Nenhuma evolução encontrada." : "Nenhuma evolução salva ainda."}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((evo) => (
                <EvolutionCard
                  key={evo.id}
                  evolution={evo}
                  isEditing={editingId === evo.id}
                  editText={editText}
                  onEditTextChange={setEditText}
                  onStartEdit={handleStartEdit}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={() => setEditingId(null)}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}