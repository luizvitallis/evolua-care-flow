import { Edit2, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusLabels = {
  trial: "Teste",
  active: "Ativa",
  expired: "Expirada",
  cancelled: "Cancelada",
};

const statusColors = {
  trial: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  expired: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
};

const profileLabels = {
  medico: "Médico(a)",
  enfermeiro: "Enfermeiro(a)",
};

const roleLabels = {
  admin: "Admin",
  usuario: "Usuário",
};

const roleColors = {
  admin: "bg-purple-100 text-purple-700",
  usuario: "bg-slate-100 text-slate-600",
};

export default function UserTable({ users, onEdit, onDelete, onToggleActive }) {
  if (users.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-semibold">Nenhum usuário cadastrado</p>
        <p className="text-sm mt-1">Clique em "Novo" para começar</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Desktop view */}
      <div className="hidden md:block rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left text-xs font-semibold text-muted-foreground p-3">Nome</th>
              <th className="text-left text-xs font-semibold text-muted-foreground p-3">Usuário</th>
              <th className="text-left text-xs font-semibold text-muted-foreground p-3">Perfil</th>
              <th className="text-left text-xs font-semibold text-muted-foreground p-3">Acesso</th>
              <th className="text-left text-xs font-semibold text-muted-foreground p-3">Assinatura</th>
              <th className="text-left text-xs font-semibold text-muted-foreground p-3">Ativo</th>
              <th className="text-right text-xs font-semibold text-muted-foreground p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                <td className="p-3 text-sm font-semibold">{user.full_name}</td>
                <td className="p-3 text-sm text-muted-foreground">{user.username}</td>
                <td className="p-3 text-sm">{profileLabels[user.profile] || user.profile}</td>
                <td className="p-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${roleColors[user.app_role] || "bg-slate-100 text-slate-600"}`}>
                    {roleLabels[user.app_role] || "Usuário"}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColors[user.subscription_status] || "bg-gray-100 text-gray-700"}`}>
                    {statusLabels[user.subscription_status] || user.subscription_status}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => onToggleActive(user)}>
                    {user.is_active
                      ? <Check className="w-5 h-5 text-green-600" />
                      : <X className="w-5 h-5 text-red-500" />
                    }
                  </button>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(user)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-2">
        {users.map((user) => (
          <div key={user.id} className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-sm">{user.full_name}</p>
                <p className="text-xs text-muted-foreground">@{user.username}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[user.subscription_status] || "bg-gray-100 text-gray-700"}`}>
                {statusLabels[user.subscription_status] || user.subscription_status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{profileLabels[user.profile]}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${roleColors[user.app_role] || "bg-slate-100 text-slate-600"}`}>
                  {roleLabels[user.app_role] || "Usuário"}
                </span>
                <span className="flex items-center gap-1">
                  {user.is_active ? <Check className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-red-500" />}
                  {user.is_active ? "Ativo" : "Inativo"}
                </span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(user)} className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}