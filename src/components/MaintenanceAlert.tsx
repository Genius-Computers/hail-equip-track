import { AlertTriangle, Clock, Wrench } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Equipment {
  id: string;
  machineName: string;
  location: string;
  nextMaintenance: string;
  status: 'good' | 'due' | 'overdue';
}

interface MaintenanceAlertProps {
  equipment: Equipment[];
}

const MaintenanceAlert = ({ equipment }: MaintenanceAlertProps) => {
  const dueSoon = equipment.filter(eq => eq.status === 'due');
  const overdue = equipment.filter(eq => eq.status === 'overdue');

  if (dueSoon.length === 0 && overdue.length === 0) {
    return (
      <Alert className="border-secondary bg-secondary/10">
        <Wrench className="h-4 w-4" />
        <AlertTitle>All Equipment Current</AlertTitle>
        <AlertDescription>
          All equipment maintenance schedules are up to date.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {overdue.length > 0 && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-destructive">Overdue Maintenance</AlertTitle>
          <AlertDescription>
            {overdue.length} equipment item{overdue.length > 1 ? 's' : ''} overdue for maintenance.
          </AlertDescription>
        </Alert>
      )}

      {dueSoon.length > 0 && (
        <Alert className="border-warning bg-warning/10">
          <Clock className="h-4 w-4" />
          <AlertTitle className="text-warning">Maintenance Due Soon</AlertTitle>
          <AlertDescription>
            {dueSoon.length} equipment item{dueSoon.length > 1 ? 's' : ''} due for maintenance within 7 days.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Maintenance Schedule Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...overdue, ...dueSoon].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{item.machineName}</p>
                  <p className="text-sm text-muted-foreground">{item.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.nextMaintenance}</p>
                  <Badge variant={item.status === 'overdue' ? 'destructive' : 'secondary'}>
                    {item.status === 'overdue' ? 'Overdue' : 'Due Soon'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceAlert;