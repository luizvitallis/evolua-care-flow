import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Plus, ArrowLeft, Users, Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";
import UserFormDialog from "../components/admin/UserFormDialog";
import UserTable from "../components/admin/UserTable";

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError("");
    const found = await base44.entities.AppUser.filter({ username: loginUsername.trim().toLowerCase() });
    if (found.length === 0) {
      setAdminError("Usuário não encontrado.");
      return;
    }
    const user = found[0];
    if (user.password !== loginPassword) {
      setAdminError("Senha incorreta.");
      return;
    }
    if (user.app_role !== "admin") {
      setAdminError("Acesso negado. Apenas administradores.");
      return;
    }
    setAdminUser(user);
    setAuthenticated(true);
  };

  const loadUsers = async () => {
    setLoading(true);
    const data = await base44.entities.AppUser.list("-created_date", 100);
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) loadUsers();
  }, [authenticated]);

  const handleSaveUser = async (userData) => {
    if (editingUser) {
      await base44.entities.AppUser.update(editingUser.id, userData);
      toast({ title: "Usuário atualizado com sucesso!" });
    } else {
      const existing = await base44.entities.AppUser.filter({ username: userData.username.toLowerCase() });
      if (existing.length > 0) {
        toast({ title: "Erro", description: "Já existe um usuário com esse nome.", variant: "destructive" });
        return;
      }
      await base44.entities.AppUser.create({ ...userData, username: userData.username.toLowerCase() });
      toast({ title: "Usuário criado com sucesso!" });
    }
    setShowForm(false);
    setEditingUser(null);
    loadUsers();
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`Deseja realmente excluir o usuário "${user.full_name}"?`)) return;
    await base44.entities.AppUser.delete(user.id);
    toast({ title: "Usuário excluído." });
    loadUsers();
  };

  const handleToggleActive = async (user) => {
    await base44.entities.AppUser.update(user.id, { is_active: !user.is_active });
    loadUsers();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div
          className="w-full pt-12 pb-16 px-6 flex flex-col items-center"
          style={{
            background: "linear-gradient(135deg, #e84393 0%, #6c5ce7 30%, #0984e3 70%, #74b9ff 100%)",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-white">Painel Administrativo</h2>
          <p className="text-white/70 text-sm mt-1">Acesso exclusivo para administradores</p>
        </div>

        <div className="flex-1 flex flex-col items-center px-4 -mt-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="rounded-2xl bg-card shadow-lg shadow-black/5 border border-border/50 p-6 space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Usuário</Label>
                  <Input
                    placeholder="Nome de usuário"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="h-12 rounded-xl bg-background border-border/60"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Senha</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Senha"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="h-12 pr-12 rounded-xl bg-background border-border/60"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {adminError && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {adminError}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-12 font-bold rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg, #e84393, #6c5ce7, #0984e3)" }}
                >
                  Acessar
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div
        className="w-full px-5 pt-6 pb-10"
        style={{
          background: "linear-gradient(135deg, #e84393 0%, #6c5ce7 30%, #0984e3 70%, #74b9ff 100%)",
        }}
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gerenciar Usuários
              </h1>
              <p className="text-white/70 text-xs">{users.length} usuário(s) cadastrado(s)</p>
            </div>
          </div>
          <Button
            onClick={() => { setEditingUser(null); setShowForm(true); }}
            className="gap-2 font-bold rounded-xl text-white border-0"
            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo</span>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-5 pb-8">
        <div className="rounded-2xl bg-card shadow-lg shadow-black/5 border border-border/50 p-4 sm:p-5">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <UserTable
              users={users}
              onEdit={handleEdit}
              onDelete={handleDeleteUser}
              onToggleActive={handleToggleActive}
            />
          )}
        </div>

        {showForm && (
          <UserFormDialog
            user={editingUser}
            onSave={handleSaveUser}
            onClose={() => { setShowForm(false); setEditingUser(null); }}
          />
        )}
      </div>
    </div>
  );
}