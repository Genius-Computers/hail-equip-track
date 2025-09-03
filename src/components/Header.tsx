import { Building } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Equipment Maintenance System</h1>
              <p className="text-sm text-muted-foreground">University of Ha'il</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Maintenance Department</p>
            <p className="text-xs text-muted-foreground">Facility Management</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;