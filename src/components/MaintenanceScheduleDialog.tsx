import { useState } from "react";
import { Calendar, Clock, Plus, Wrench } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "@/hooks/use-toast";
import SparePartRequestDialog from "./SparePartRequestDialog";

interface MaintenanceScheduleDialogProps {
  equipmentId: string;
  equipmentName: string;
}

const MaintenanceScheduleDialog = ({ equipmentId, equipmentName }: MaintenanceScheduleDialogProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [needsNewSparePart, setNeedsNewSparePart] = useState(false);
  const [isSparePartDialogOpen, setIsSparePartDialogOpen] = useState(false);

  const handleSchedule = () => {
    toast({
      title: "Maintenance Scheduled",
      description: `Maintenance has been scheduled for ${equipmentName} with detailed assessment.`,
    });
    setIsOpen(false);
  };

  const handleSparePartRequest = () => {
    setIsSparePartDialogOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
            {t("equipment.scheduleMaintenance")}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Maintenance - {equipmentName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Scheduling */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Schedule Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduledDate">Scheduled Date</Label>
                    <Input id="scheduledDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="scheduledTime">Scheduled Time</Label>
                    <Input id="scheduledTime" type="time" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="estimatedDuration">Estimated Duration (hours)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">30 minutes</SelectItem>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="8">8 hours (Full day)</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Problem Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Problem Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="problem">Problem Description</Label>
                  <Textarea 
                    id="problem" 
                    placeholder="Describe the current problem or maintenance requirement..."
                    className="min-h-[100px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="assessment">Technical Assessment</Label>
                  <Textarea 
                    id="assessment" 
                    placeholder="Provide technical assessment of the equipment condition..."
                    className="min-h-[100px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="recommendation">Maintenance Recommendation</Label>
                  <Textarea 
                    id="recommendation" 
                    placeholder="Recommend specific maintenance actions or procedures..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Spare Parts Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Spare Parts Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="needsSpareParts" 
                    checked={needsNewSparePart}
                    onCheckedChange={(checked) => setNeedsNewSparePart(checked === true)}
                  />
                  <Label htmlFor="needsSpareParts">This maintenance requires new spare parts</Label>
                </div>
                
                {needsNewSparePart && (
                  <div className="bg-muted p-4 rounded-lg space-y-4">
                    <p className="text-sm text-muted-foreground">
                      If you need to request new spare parts for this maintenance, click the button below to submit a spare part request.
                    </p>
                    <Button variant="outline" onClick={handleSparePartRequest}>
                      <Plus className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
                      Request New Spare Parts
                    </Button>
                  </div>
                )}

                <div>
                  <Label htmlFor="existingSpareParts">Existing Spare Parts to Use</Label>
                  <Textarea 
                    id="existingSpareParts" 
                    placeholder="List any existing spare parts that will be used in this maintenance..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Technician Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technician Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="assignedTechnician">Assigned Technician</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ahmad-salem">Ahmad Salem</SelectItem>
                      <SelectItem value="fatima-ali">Fatima Ali</SelectItem>
                      <SelectItem value="omar-hassan">Omar Hassan</SelectItem>
                      <SelectItem value="sara-mohamed">Sara Mohamed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea 
                    id="additionalNotes" 
                    placeholder="Any additional notes or special instructions for the technician..."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSchedule} className="flex-1">
                <Wrench className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
                Schedule Maintenance
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SparePartRequestDialog 
        isOpen={isSparePartDialogOpen}
        onOpenChange={setIsSparePartDialogOpen}
        equipmentId={equipmentId}
        equipmentName={equipmentName}
      />
    </>
  );
};

export default MaintenanceScheduleDialog;