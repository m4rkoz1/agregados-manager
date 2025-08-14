import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { AlertsSection } from "@/components/dashboard/AlertsSection";
import { 
  Users, 
  Truck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Calendar 
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total de Agregados",
      value: 142,
      description: "Cadastrados no sistema",
      icon: Users,
      variant: "default" as const
    },
    {
      title: "Agregados Ativos",
      value: 118,
      description: "Em operação",
      icon: CheckCircle,
      variant: "success" as const,
      trend: { value: 5, isPositive: true }
    },
    {
      title: "Agregados Inativos",
      value: 24,
      description: "Fora de operação",
      icon: XCircle,
      variant: "destructive" as const,
      trend: { value: 2, isPositive: false }
    },
    {
      title: "Documentos Vencendo",
      value: 8,
      description: "Próximos 30 dias",
      icon: AlertTriangle,
      variant: "warning" as const
    },
    {
      title: "Frota Total",
      value: 89,
      description: "Veículos cadastrados",
      icon: Truck,
      variant: "default" as const
    },
    {
      title: "Esporádicos do Mês",
      value: 12,
      description: "Agosto 2024",
      icon: Calendar,
      variant: "default" as const,
      trend: { value: 8, isPositive: true }
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de agregados Giannone Transportes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <DashboardCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            variant={stat.variant}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsSection />
        
        <div className="space-y-4">
          <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground">
            <h3 className="text-lg font-semibold mb-2">Próximas Funcionalidades</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Relatórios automáticos por email</li>
              <li>• Integração com API dos Correios</li>
              <li>• Dashboard móvel</li>
              <li>• Controle de combustível</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}