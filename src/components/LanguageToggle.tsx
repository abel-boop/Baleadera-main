import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-foreground hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
      aria-label={language === 'en' ? 'Change to Amharic' : 'Change to English'}
    >
      {language === 'en' ? 'አማ' : 'EN'}
    </Button>
  );
};
