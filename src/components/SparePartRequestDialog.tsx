import { useState } from "react";
import { Plus, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "@/hooks/use-toast";

interface SparePartRequest {
  id: string;
  partName: string;
  partNumber: string;
  description: string;
  quantity: number;
  estimatedPrice: number;
  supplier: string;
  urgency: string;
}

interface SparePartRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  equipmentId: string;
  equipmentName: string;
}

const SparePartRequestDialog = ({ isOpen, onOpenChange, equipmentId, equipmentName }: SparePartRequestDialogProps) => {
  const { t } = useLanguage();
  const [sparePartRequests, setSparePartRequests] = useState<SparePartRequest[]>([]);
  const [currentRequest, setCurrentRequest] = useState<Partial<SparePartRequest>>({});

  const addSparePartRequest = () => {
    if (!currentRequest.partName || !currentRequest.quantity) {
      toast({
        title: "Error",
        description: "Please fill in part name and quantity.",
        variant: "destructive"
      });
      return;
    }

    const newRequest: SparePartRequest = {
      id: Date.now().toString(),
      partName: currentRequest.partName || "",
      partNumber: currentRequest.partNumber || "",
      description: currentRequest.description || "",
      quantity: currentRequest.quantity || 1,
      estimatedPrice: currentRequest.estimatedPrice || 0,
      supplier: currentRequest.supplier || "",
      urgency: currentRequest.urgency || "medium"
    };

    setSparePartRequests(prev => [...prev, newRequest]);
    setCurrentRequest({});
    
    toast({
      title: "Spare Part Added",
      description: "Spare part request has been added to the list.",
    });
  };

  const removeSparePartRequest = (id: string) => {
    setSparePartRequests(prev => prev.filter(req => req.id !== id));
  };

  const submitAllRequests = () => {
    if (sparePartRequests.length === 0) {
      toast({
        title: "No Requests",
        description: "Please add at least one spare part request.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Spare Part Requests Submitted",
      description: `${sparePartRequests.length} spare part request(s) submitted for approval for ${equipmentName}.`,
    });
    
    setSparePartRequests([]);
    onOpenChange(false);
  };

  const getTotalEstimatedCost = () => {
    return sparePartRequests.reduce((total, req) => total + (req.estimatedPrice * req.quantity), 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Spare Parts - {equipmentName}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add New Spare Part Request */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Plus className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                Add Spare Part Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="partName">Part Name *</Label>
                <Input 
                  id="partName" 
                  placeholder="Enter part name"
                  value={currentRequest.partName || ""}
                  onChange={(e) => setCurrentRequest(prev => ({ ...prev, partName: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="partNumber">Part Number</Label>
                <Input 
                  id="partNumber" 
                  placeholder="Enter part number"
                  value={currentRequest.partNumber || ""}
                  onChange={(e) => setCurrentRequest(prev => ({ ...prev, partNumber: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Detailed description of the spare part and its use"
                  value={currentRequest.description || ""}
                  onChange={(e) => setCurrentRequest(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    min="1"
                    placeholder="1"
                    value={currentRequest.quantity || ""}
                    onChange={(e) => setCurrentRequest(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedPrice">Est. Price (SAR)</Label>
                  <Input 
                    id="estimatedPrice" 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    value={currentRequest.estimatedPrice || ""}
                    onChange={(e) => setCurrentRequest(prev => ({ ...prev, estimatedPrice: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="supplier">Preferred Supplier/Source</Label>
                <Input 
                  id="supplier" 
                  placeholder="Enter supplier name or source"
                  value={currentRequest.supplier || ""}
                  onChange={(e) => setCurrentRequest(prev => ({ ...prev, supplier: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select value={currentRequest.urgency || "medium"} onValueChange={(value) => setCurrentRequest(prev => ({ ...prev, urgency: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Can wait</SelectItem>
                    <SelectItem value="medium">Medium - Normal timeline</SelectItem>
                    <SelectItem value="high">High - Needed soon</SelectItem>
                    <SelectItem value="urgent">Urgent - Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={addSparePartRequest} className="w-full">
                <Plus className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
                Add to Request List
              </Button>
            </CardContent>
          </Card>

          {/* Current Requests List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                  Requested Parts ({sparePartRequests.length})
                </div>
                {sparePartRequests.length > 0 && (
                  <div className="text-sm font-normal">
                    Total: {getTotalEstimatedCost().toFixed(2)} SAR
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sparePartRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No spare parts requested yet</p>
                  <p className="text-sm">Add spare parts using the form on the left</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sparePartRequests.map((request, index) => (
                    <div key={request.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{request.partName}</h4>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => removeSparePartRequest(request.id)}
                        >
                          Remove
                        </Button>
                      </div>
                      {request.partNumber && (
                        <p className="text-sm text-muted-foreground">Part #: {request.partNumber}</p>
                      )}
                      {request.description && (
                        <p className="text-sm">{request.description}</p>
                      )}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Qty: {request.quantity}</div>
                        <div>Price: {request.estimatedPrice.toFixed(2)} SAR</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Urgency: </span>
                        <span className={`capitalize ${
                          request.urgency === 'urgent' ? 'text-red-600' : 
                          request.urgency === 'high' ? 'text-orange-600' : 
                          request.urgency === 'medium' ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          {request.urgency}
                        </span>
                      </div>
                      {request.supplier && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Supplier: </span>
                          {request.supplier}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center pt-4">
                    <div className="text-lg font-semibold">
                      Total Estimated Cost: {getTotalEstimatedCost().toFixed(2)} SAR
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 pt-6 border-t">
          <Button onClick={submitAllRequests} className="flex-1" disabled={sparePartRequests.length === 0}>
            Submit All Requests for Approval
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SparePartRequestDialog;