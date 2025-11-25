import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { AlertsSection } from "@/components/dashboard/AlertsSection";
import { useAgregados } from "@/hooks/useAgregados";
import { useMemo } from "react";
import { 
  Users, 
  Truck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Calendar 
} from "lucide-react";

export default function Dashboard() {
  const { agregados, getAgregadosAtivos, getAgregadosInativos, getAgregadosComAlerta, loading } = useAgregados();

  const stats = useMemo(() => {
    if (loading) {
      return [
        {
          title: "Total de Agregados",
          value: "...",
          description: "Carregando...",
          icon: Users,
          variant: "default" as const
        },
        {
          title: "Agregados Ativos",
          value: "...",
          description: "Carregando...",
          icon: CheckCircle,
          variant: "success" as const
        },
        {
          title: "Agregados Inativos",
          value: "...",
          description: "Carregando...",
          icon: XCircle,
          variant: "destructive" as const
        },
        {
          title: "Documentos Vencendo",
          value: "...",
          description: "Carregando...",
          icon: AlertTriangle,
          variant: "warning" as const
        },
        {
          title: "Frota Total",
          value: "...",
          description: "Carregando...",
          icon: Truck,
          variant: "default" as const
        },
        {
          title: "Esporádicos do Mês",
          value: "...",
          description: "Carregando...",
          icon: Calendar,
          variant: "default" as const
        }
      ];
    }

    const totalAgregados = agregados.length;
    const agregadosAtivos = getAgregadosAtivos();
    const agregadosInativos = getAgregadosInativos();
    const documentosVencendo = getAgregadosComAlerta();
    const esporadicos = agregados.filter(a => a.esporadico);
    
    const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    return [
      {
        title: "Total de Agregados",
        value: totalAgregados,
        description: "Cadastrados no sistema",
        icon: Users,
        variant: "default" as const
      },
      {
        title: "Agregados Ativos",
        value: agregadosAtivos.length,
        description: "Em operação",
        icon: CheckCircle,
        variant: "success" as const,
        trend: { value: Math.round((agregadosAtivos.length / totalAgregados) * 100), isPositive: true }
      },
      {
        title: "Agregados Inativos",
        value: agregadosInativos.length,
        description: "Fora de operação",
        icon: XCircle,
        variant: "destructive" as const,
        trend: { value: Math.round((agregadosInativos.length / totalAgregados) * 100), isPositive: false }
      },
      {
        title: "Documentos Vencendo",
        value: documentosVencendo.length,
        description: "Próximos 30 dias",
        icon: AlertTriangle,
        variant: "warning" as const
      },
      {
        title: "Frota Total",
        value: totalAgregados,
        description: "Veículos cadastrados",
        icon: Truck,
        variant: "default" as const
      },
      {
        title: "Esporádicos do Mês",
        value: esporadicos.length,
        description: currentMonth,
        icon: Calendar,
        variant: "default" as const,
        trend: { value: Math.round((esporadicos.length / totalAgregados) * 100), isPositive: true }
      }
    ];
  }, [agregados, getAgregadosAtivos, getAgregadosInativos, getAgregadosComAlerta, loading]);

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