import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, FileText } from "lucide-react";

export function AlertsSection() {
  const alerts = [
    {
      id: 1,
      type: "CNH",
      message: "CNH de João Silva vence em 15 dias",
      severity: "warning" as const,
      date: "2024-08-29"
    },
    {
      id: 2,
      type: "CRLV",
      message: "CRLV do veículo ABC-1234 vencido",
      severity: "destructive" as const,
      date: "2024-08-10"
    },
    {
      id: 3,
      type: "ANTT",
      message: "ANTT de Maria Santos vence em 7 dias",
      severity: "destructive" as const,
      date: "2024-08-21"
    },
    {
      id: 4,
      type: "Vigilância",
      message: "Vigilância sanitária do veículo XYZ-5678 vence em 30 dias",
      severity: "warning" as const,
      date: "2024-09-13"
    }
  ];

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "destructive":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "default";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "destructive":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "warning":
        return <Calendar className="w-4 h-4 text-warning" />;
      default:
        return <FileText className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Alertas de Documentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border"
            >
              {getSeverityIcon(alert.severity)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={getSeverityVariant(alert.severity)} className="text-xs">
                    {alert.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{alert.date}</span>
                </div>
                <p className="text-sm text-foreground">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}