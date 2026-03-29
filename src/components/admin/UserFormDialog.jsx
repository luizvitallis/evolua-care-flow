import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function UserFormDialog({ user, onSave, onClose }) {
  const [form, setForm] = useState({
    username: user?.username || "",
    password: user?.password || "",
    full_name: user?.full_name || "",
    profile: user?.profile || "medico",
    app_role: user?.app_role || "usuario",
    is_active: user?.is_active ?? true,
    subscription_status: user?.subscription_status || "active",
    subscription_expires: user?.subscription_expires || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-card rounded-2xl border border-border/50 shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-extrabold mb-6">{user ? "Editar Usuário" : "Novo Usuário"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Nome Completo</Label>
            <Input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} required placeholder="Nome do profissional" className="h-11 rounded-xl bg-background border-border/60" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Nome de Usuário</Label>
            <Input value={form.username} onChange={(e) => update("username", e.target.value.toLowerCase().trim())} required placeholder="usuario.login" disabled={!!user} className="h-11 rounded-xl bg-background border-border/60" />
            {!user && <p className="text-xs text-muted-foreground">Será usado para login (sem espaços)</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Senha</Label>
            <Input value={form.password} onChange={(e) => update("password", e.target.value)} required placeholder="Senha de acesso" className="h-11 rounded-xl bg-background border-border/60" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Perfil Profissional</Label>
            <Select value={form.profile} onValueChange={(v) => update("profile", v)}>
              <SelectTrigger className="h-11 rounded-xl bg-background border-border/60"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="medico">Médico(a)</SelectItem>
                <SelectItem value="enfermeiro">Enfermeiro(a)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Tipo de Acesso</Label>
            <Select value={form.app_role} onValueChange={(v) => update("app_role", v)}>
              <SelectTrigger className="h-11 rounded-xl bg-background border-border/60"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="usuario">Usuário</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Status da Assinatura</Label>
            <Select value={form.subscription_status} onValueChange={(v) => update("subscription_status", v)}>
              <SelectTrigger className="h-11 rounded-xl bg-background border-border/60"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="trial">Teste</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="expired">Expirada</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Validade da Assinatura</Label>
            <Input type="date" value={form.subscription_expires} onChange={(e) => update("subscription_expires", e.target.value)} className="h-11 rounded-xl bg-background border-border/60" />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label className="font-semibold">Conta Ativa</Label>
            <Switch checked={form.is_active} onCheckedChange={(v) => update("is_active", v)} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11 rounded-xl">Cancelar</Button>
            <Button
              type="submit"
              className="flex-1 h-11 rounded-xl font-bold text-white"
              style={{ background: "linear-gradient(135deg, #e84393, #6c5ce7, #0984e3)" }}
            >
              {user ? "Salvar" : "Criar Usuário"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}