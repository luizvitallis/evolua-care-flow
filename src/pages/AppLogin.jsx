import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";

export default function AppLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const users = await base44.entities.AppUser.filter({
      username: username.trim().toLowerCase(),
    });

    if (users.length === 0) {
      setError("Usuário não encontrado.");
      setLoading(false);
      return;
    }

    const user = users[0];

    if (user.password !== password) {
      setError("Senha incorreta.");
      setLoading(false);
      return;
    }

    if (!user.is_active) {
      setError("Sua conta está desativada. Entre em contato com o administrador.");
      setLoading(false);
      return;
    }

    if (user.subscription_status === "expired" || user.subscription_status === "cancelled") {
      setError("Sua assinatura está expirada ou cancelada. Renove para continuar.");
      setLoading(false);
      return;
    }

    if (user.subscription_expires) {
      const expDate = new Date(user.subscription_expires);
      if (expDate < new Date()) {
        setError("Sua assinatura expirou. Renove para continuar usando o sistema.");
        setLoading(false);
        return;
      }
    }

    localStorage.setItem("evolua_user", JSON.stringify({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      profile: user.profile,
      app_role: user.app_role || "usuario",
      subscription_status: user.subscription_status,
    }));

    setLoading(false);
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header gradient like the reference image */}
      <div
        className="w-full pt-12 pb-16 px-6 flex flex-col items-center"
        style={{
          background: "linear-gradient(135deg, #e84393 0%, #6c5ce7 30%, #0984e3 70%, #74b9ff 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-2 mb-2"
        >
          <img
            src="https://media.base44.com/images/public/69c449b402b70173b105d075/c044e0901_Sade48.png"
            alt="Evolua"
            className="w-24 h-24 rounded-3xl object-cover border-2 border-white/30 shadow-lg shadow-black/20"
          />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Evolua</h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-white/80 text-sm"
        >
          Evolução clínica inteligente
        </motion.p>
      </div>

      {/* Form card overlapping the header */}
      <div className="flex-1 flex flex-col items-center px-4 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-sm"
        >
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="rounded-2xl bg-card shadow-lg shadow-black/5 border border-border/50 p-6 space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-semibold text-foreground">Usuário</Label>
                <Input
                  id="username"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="h-12 rounded-xl bg-background border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-12 pr-12 rounded-xl bg-background border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-xl"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 gap-2 text-base font-bold rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #e84393, #6c5ce7, #0984e3)",
                }}
                size="lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-5">
            Não tem acesso? Entre em contato com o administrador.
          </p>

          <div className="text-center mt-3">
            <Link to="/admin" className="text-xs text-primary font-semibold hover:underline">
              Painel Administrativo
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}