import { useState, useMemo } from "react";
import Header from "@/components/Header";
import EquipmentCard from "@/components/EquipmentCard";
import AddEquipmentForm from "@/components/AddEquipmentForm";
import MaintenanceAlert from "@/components/MaintenanceAlert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

// Sample data for demonstration
const initialEquipment = [
  {
    id: "1",
    machineName: "HVAC Unit A1",
    partNumber: "AC-2024-001",
    location: "Engineering Building - Floor 2",
    lastMaintenance: "2024-02-15",
    nextMaintenance: "2024-03-15",
    maintenanceInterval: "1 month",
    sparePartsNeeded: true,
    sparePartsApproved: false,
    status: "due" as const
  },
  {
    id: "2", 
    machineName: "Generator Unit B2",
    partNumber: "GEN-2024-002",
    location: "Science Building - Basement",
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-10",
    maintenanceInterval: "1 month",
    sparePartsNeeded: false,
    sparePartsApproved: false,
    status: "overdue" as const
  },
  {
    id: "3",
    machineName: "Chiller System C1",
    partNumber: "CHILL-2024-003", 
    location: "Administration Building - Roof",
    lastMaintenance: "2024-02-01",
    nextMaintenance: "2024-08-01",
    maintenanceInterval: "6 months",
    sparePartsNeeded: true,
    sparePartsApproved: true,
    status: "good" as const
  }
];

const Index = () => {
  const { t } = useLanguage();
  const [equipment, setEquipment] = useState(initialEquipment);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Calculate equipment status based on dates
  const updateEquipmentStatus = (equipmentList: typeof equipment) => {
    return equipmentList.map(item => {
      const nextDate = new Date(item.nextMaintenance);
      const today = new Date();
      const diffTime = nextDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let status: 'good' | 'due' | 'overdue';
      if (diffDays < 0) {
        status = 'overdue';
      } else if (diffDays <= 7) {
        status = 'due';
      } else {
        status = 'good';
      }
      
      return { ...item, status };
    });
  };

  const filteredEquipment = useMemo(() => {
    const updatedEquipment = updateEquipmentStatus(equipment);
    
    return updatedEquipment.filter(item => {
      const matchesSearch = item.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [equipment, searchTerm, statusFilter]);

  const handleAddEquipment = (newEquipment: any) => {
    setEquipment(prev => [...prev, newEquipment]);
  };

  const handleScheduleMaintenance = (id: string) => {
    const item = equipment.find(eq => eq.id === id);
    toast({
      title: t("toast.maintenanceScheduled"),
      description: t("toast.maintenanceScheduledDesc", { name: item?.machineName }),
    });
  };

  const handleUpdateSpares = (id: string) => {
    setEquipment(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, sparePartsApproved: true }
          : item
      )
    );
    toast({
      title: t("toast.sparePartsApproved"),
      description: t("toast.sparePartsApprovedDesc"),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <AddEquipmentForm onAddEquipment={handleAddEquipment} />
            
            <MaintenanceAlert equipment={updateEquipmentStatus(equipment)} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t("search.placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rtl:pl-4 rtl:pr-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("filter.byStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("filter.allEquipment")}</SelectItem>
                    <SelectItem value="good">{t("filter.upToDate")}</SelectItem>
                    <SelectItem value="due">{t("filter.dueSoon")}</SelectItem>
                    <SelectItem value="overdue">{t("filter.overdue")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEquipment.map((item) => (
                <EquipmentCard
                  key={item.id}
                  equipment={item}
                  onScheduleMaintenance={handleScheduleMaintenance}
                  onUpdateSpares={handleUpdateSpares}
                />
              ))}
            </div>

            {filteredEquipment.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t("search.noResults")}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
