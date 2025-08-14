import { SidebarTrigger } from "@/components/ui/sidebar";
import { Truck } from "lucide-react";

export function AppHeader() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-4 shadow-card">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Truck className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Giannone Transportes</h1>
            <p className="text-sm text-muted-foreground">Sistema de Agregados</p>
          </div>
        </div>
      </div>
    </header>
  );
}