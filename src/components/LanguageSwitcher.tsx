import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="language-switcher">
      <button
        onClick={() => handleLanguageChange("vi")}
        className={`btn ${i18n.language === 'vi' ? 'active' : ''}`}
        aria-label="Chuyển sang tiếng Việt"
        type="button"
      >
        🇻🇳
      </button>
      
      <span>|</span>
      
      <button
        onClick={() => handleLanguageChange("en")}
        className={`btn ${i18n.language === 'en' ? 'active' : ''}`}
        aria-label="Switch to English"
        type="button"
      >
        🇺🇸
      </button>
    </div>
  );
}