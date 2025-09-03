import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Sidebar } from "@/components/Layout/Sidebar";
import { Dashboard } from "@/components/Dashboard/Dashboard";
import { TaskBoard } from "@/components/Tasks/TaskBoard";
import { ClientList } from "@/components/CRM/ClientList";
import { ContractEditor } from "@/components/Contracts/ContractEditor";
import { ReportsPage } from "@/components/Reports/ReportsPage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "tasks":
        return <TaskBoard />;
      case "crm":
        return <ClientList />;
      case "contracts":
        return <ContractEditor />;
      case "reports":
        return <ReportsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
