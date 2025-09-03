import { Calendar, MapPin, Wrench, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Equipment {
  id: string;
  machineName: string;
  partNumber: string;
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
  maintenanceInterval: string;
  sparePartsNeeded: boolean;
  sparePartsApproved?: boolean;
  status: 'good' | 'due' | 'overdue';
}

interface EquipmentCardProps {
  equipment: Equipment;
  onScheduleMaintenance: (id: string) => void;
  onUpdateSpares: (id: string) => void;
}

const EquipmentCard = ({ equipment, onScheduleMaintenance, onUpdateSpares }: EquipmentCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return <Badge className="bg-secondary text-secondary-foreground"><CheckCircle className="h-3 w-3 mr-1" />Up to Date</Badge>;
      case 'due':
        return <Badge className="bg-warning text-warning-foreground"><AlertTriangle className="h-3 w-3 mr-1" />Due Soon</Badge>;
      case 'overdue':
        return <Badge className="bg-destructive text-destructive-foreground"><AlertTriangle className="h-3 w-3 mr-1" />Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getDaysUntilMaintenance = () => {
    const nextDate = new Date(equipment.nextMaintenance);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntilMaintenance();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{equipment.machineName}</CardTitle>
          {getStatusBadge(equipment.status)}
        </div>
        <p className="text-sm text-muted-foreground">Part: {equipment.partNumber}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2" />
          {equipment.location}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Last Maintenance</p>
            <p className="font-medium">{equipment.lastMaintenance}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Next Maintenance</p>
            <p className="font-medium">{equipment.nextMaintenance}</p>
            {daysUntil <= 7 && daysUntil > 0 && (
              <p className="text-warning text-xs">In {daysUntil} days</p>
            )}
            {daysUntil <= 0 && (
              <p className="text-destructive text-xs font-medium">Overdue by {Math.abs(daysUntil)} days</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Wrench className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Every {equipment.maintenanceInterval}</span>
          </div>
        </div>

        {equipment.sparePartsNeeded && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium mb-1">Spare Parts Required</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Status: {equipment.sparePartsApproved ? 'Approved' : 'Pending Approval'}
              </p>
              {!equipment.sparePartsApproved && (
                <Button size="sm" variant="outline" onClick={() => onUpdateSpares(equipment.id)}>
                  Request Approval
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={() => onScheduleMaintenance(equipment.id)}>
            <Calendar className="h-4 w-4 mr-1" />
            Schedule Maintenance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentCard;