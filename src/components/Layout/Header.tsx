import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, Settings, Users } from "lucide-react";
import nexaLogo from "@/assets/nexa-logo.png";
import { Link } from "react-router-dom";
export const Header = () => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img src={nexaLogo} alt="Nexa" className="h-8 w-auto" />
          <h1 className="text-xl font-semibold text-foreground">Sistema de Gestão Nexa</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 w-64 bg-muted rounded-lg border border-input focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        
        <Link to="/auth" className="text-sm text-primary hover:underline">
          Entrar
        </Link>
        
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">N</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};