import { useState } from "react";
import { Plus, Package, Edit, Trash2, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "@/hooks/use-toast";

interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  description: string;
  quantity: number;
  price: number;
  source: string;
  status: 'available' | 'low-stock' | 'out-of-stock' | 'on-order';
  lastUpdated: string;
}

const SparePartsManager = () => {
  const { t } = useLanguage();
  const [spareParts, setSpareParts] = useState<SparePart[]>([
    {
      id: "1",
      name: "HVAC Filter",
      partNumber: "FLT-001",
      description: "High efficiency air filter for HVAC systems",
      quantity: 15,
      price: 25.50,
      source: "ACE Hardware Supply",
      status: "available",
      lastUpdated: "2024-02-20"
    },
    {
      id: "2", 
      name: "Generator Belt",
      partNumber: "BLT-GEN-002",
      description: "Replacement belt for backup generators",
      quantity: 2,
      price: 45.00,
      source: "Generator Parts Co.",
      status: "low-stock",
      lastUpdated: "2024-02-18"
    },
    {
      id: "3",
      name: "Chiller Coil",
      partNumber: "COIL-CH-003", 
      description: "Evaporator coil for chiller systems",
      quantity: 0,
      price: 850.00,
      source: "HVAC Solutions Ltd",
      status: "on-order",
      lastUpdated: "2024-02-15"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<SparePart | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status: string, quantity: number) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-secondary text-secondary-foreground"><CheckCircle className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" />Available</Badge>;
      case 'low-stock':
        return <Badge className="bg-warning text-warning-foreground"><AlertTriangle className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" />Low Stock</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-destructive text-destructive-foreground"><AlertTriangle className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" />Out of Stock</Badge>;
      case 'on-order':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"><Clock className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" />On Order</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredParts = spareParts.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPart = () => {
    toast({
      title: "Spare Part Added",
      description: "New spare part has been added to inventory.",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditPart = (part: SparePart) => {
    setEditingPart(part);
  };

  const handleDeletePart = (id: string) => {
    setSpareParts(prev => prev.filter(part => part.id !== id));
    toast({
      title: "Spare Part Deleted",
      description: "Spare part has been removed from inventory.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Spare Parts Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
              Add Spare Part
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Spare Part</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Part Name</Label>
                <Input id="name" placeholder="Enter part name" />
              </div>
              <div>
                <Label htmlFor="partNumber">Part Number</Label>
                <Input id="partNumber" placeholder="Enter part number" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="price">Price (SAR)</Label>
                  <Input id="price" type="number" step="0.01" placeholder="0.00" />
                </div>
              </div>
              <div>
                <Label htmlFor="source">Source/Supplier</Label>
                <Input id="source" placeholder="Enter supplier name" />
              </div>
              <Button onClick={handleAddPart} className="w-full">
                Add Spare Part
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search spare parts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParts.map((part) => (
          <Card key={part.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{part.name}</CardTitle>
                {getStatusBadge(part.status, part.quantity)}
              </div>
              <p className="text-sm text-muted-foreground">{part.partNumber}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{part.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Quantity</p>
                  <p className="font-medium">{part.quantity}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-medium">{part.price} SAR</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">Source</p>
                <p className="text-sm font-medium">{part.source}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleEditPart(part)}>
                  <Edit className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" />
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeletePart(part.id)}>
                  <Trash2 className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredParts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No spare parts found</p>
        </div>
      )}
    </div>
  );
};

export default SparePartsManager;