import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface AddEquipmentFormProps {
  onAddEquipment: (equipment: any) => void;
}

const AddEquipmentForm = ({ onAddEquipment }: AddEquipmentFormProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    machineName: '',
    partNumber: '',
    location: '',
    maintenanceInterval: '',
    lastMaintenance: '',
    sparePartsNeeded: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.machineName || !formData.partNumber || !formData.location || !formData.maintenanceInterval) {
      toast({
        title: t("toast.error"),
        description: t("toast.fillRequired"),
        variant: "destructive"
      });
      return;
    }

    const lastDate = new Date(formData.lastMaintenance || new Date());
    const nextDate = new Date(lastDate);
    
    // Calculate next maintenance date based on interval
    const intervalDays = {
      '1 week': 7,
      '2 weeks': 14,
      '1 month': 30,
      '3 months': 90,
      '6 months': 180,
      '1 year': 365
    }[formData.maintenanceInterval] || 30;
    
    nextDate.setDate(lastDate.getDate() + intervalDays);

    const newEquipment = {
      id: Date.now().toString(),
      ...formData,
      nextMaintenance: nextDate.toLocaleDateString(),
      lastMaintenance: lastDate.toLocaleDateString(),
      sparePartsApproved: false,
      status: 'good' as const
    };

    onAddEquipment(newEquipment);
    setFormData({
      machineName: '',
      partNumber: '',
      location: '',
      maintenanceInterval: '',
      lastMaintenance: '',
      sparePartsNeeded: false
    });
    setIsOpen(false);
    
    toast({
      title: t("toast.success"),
      description: t("toast.equipmentAdded"),
    });
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full">
        <Plus className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
        {t("form.addNewEquipment")}
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("form.addNewEquipment")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="machineName">{t("form.machineName")} {t("form.required")}</Label>
              <Input
                id="machineName"
                value={formData.machineName}
                onChange={(e) => setFormData({...formData, machineName: e.target.value})}
                placeholder="e.g., HVAC Unit A1"
                required
              />
            </div>
            <div>
              <Label htmlFor="partNumber">{t("form.partNumber")} {t("form.required")}</Label>
              <Input
                id="partNumber"
                value={formData.partNumber}
                onChange={(e) => setFormData({...formData, partNumber: e.target.value})}
                placeholder="e.g., AC-2024-001"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">{t("form.location")} {t("form.required")}</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g., Engineering Building - Floor 2"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maintenanceInterval">{t("form.maintenanceInterval")} {t("form.required")}</Label>
              <Select onValueChange={(value) => setFormData({...formData, maintenanceInterval: value})} required>
                <SelectTrigger>
                  <SelectValue placeholder={t("form.selectInterval")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 week">{t("form.everyWeek")}</SelectItem>
                  <SelectItem value="2 weeks">{t("form.every2Weeks")}</SelectItem>
                  <SelectItem value="1 month">{t("form.everyMonth")}</SelectItem>
                  <SelectItem value="3 months">{t("form.every3Months")}</SelectItem>
                  <SelectItem value="6 months">{t("form.every6Months")}</SelectItem>
                  <SelectItem value="1 year">{t("form.everyYear")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lastMaintenance">{t("form.lastMaintenanceDate")}</Label>
              <Input
                id="lastMaintenance"
                type="date"
                value={formData.lastMaintenance}
                onChange={(e) => setFormData({...formData, lastMaintenance: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="sparePartsNeeded"
              checked={formData.sparePartsNeeded}
              onCheckedChange={(checked) => setFormData({...formData, sparePartsNeeded: checked})}
            />
            <Label htmlFor="sparePartsNeeded">{t("form.sparePartsRequired")}</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">{t("form.addEquipment")}</Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              {t("form.cancel")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEquipmentForm;