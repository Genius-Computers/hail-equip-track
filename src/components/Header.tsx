import { Building, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

const Header = () => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t("header.title")}</h1>
              <p className="text-sm text-muted-foreground">{t("header.subtitle")}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {t("language.switch")}
            </Button>
            <div className={`text-right ${isRTL ? "text-left" : "text-right"}`}>
              <p className="text-sm font-medium text-foreground">{t("header.department")}</p>
              <p className="text-xs text-muted-foreground">{t("header.facility")}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;