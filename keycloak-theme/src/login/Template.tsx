import { useState, useEffect } from "react";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";

import { Button } from "@/components/ui/button";
import { LanguagesIcon, SunIcon, MoonIcon } from "lucide-react";
import { BdLogo } from "@/components/ui/BdLogo";

const getThemeFromCookie = (): "light" | "dark" | null => {
  const match = document.cookie.match(new RegExp('(^| )vite-ui-theme=([^;]+)'));
  if (match && (match[2] === "dark" || match[2] === "light")) {
    return match[2] as "light" | "dark";
  }
  return null;
};

const getLangFromCookie = (): string | null => {
  const match = document.cookie.match(new RegExp('(^| )vite-ui-lang=([^;]+)'));
  if (match) return match[2];
  return null;
};

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const { kcContext, i18n, children } = props;
  const { locale } = kcContext;
  const { msg } = i18n;

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const cookieTheme = getThemeFromCookie();
    if (cookieTheme) return cookieTheme;
    
    const stored = localStorage.getItem("vite-ui-theme");
    if (stored === "dark" || stored === "light") return stored;
    
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("vite-ui-theme", theme);
    document.cookie = `vite-ui-theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  }, [theme]);

  useEffect(() => {
    const cookieLang = getLangFromCookie();
    const currentLang = locale?.currentLanguageTag;

    if (cookieLang && currentLang && cookieLang !== currentLang) {
      const targetLocale = locale?.supported.find(l => l.languageTag === cookieLang);
      if (targetLocale) {
        window.location.href = targetLocale.url;
      }
    } 
    else if (currentLang) {
      document.cookie = `vite-ui-lang=${currentLang}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [locale]);

  const FRONTEND_URL = window.location.origin.includes("localhost")
    ? "http://localhost:5173"
    : window.location.origin;

  return (
    <div className="bg-background text-foreground grid min-h-[100dvh] grid-rows-[auto_1fr_auto] font-sans antialiased">
      
      {/* HEADER */}
      <header className={`bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full backdrop-blur transition-all duration-200 ${isScrolled ? "border-b shadow-sm" : "border-b shadow-sm"}`}>
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          
          <div className="flex items-center gap-4">
            <a href={FRONTEND_URL} className="text-primary flex items-center gap-2 text-2xl font-bold tracking-tight transition-opacity hover:opacity-80">
              <BdLogo className="h-20 w-20" />
              BoatDelivery
            </a>
          </div>

          {/* NAWIGACJA DESKTOPOWA */}
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="bg-border mx-2 h-6 w-px hidden sm:block"></div>

            {locale?.supported && locale.supported.length > 1 && (
              <div className="relative">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="cursor-pointer"
                  onClick={() => setIsLangOpen(!isLangOpen)}
                >
                  <LanguagesIcon className="h-5 w-5" />
                </Button>

                {isLangOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-background shadow-lg z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
                      {locale.supported.map((l) => (
                        <a 
                          key={l.languageTag}
                          href={l.url} 
                          onClick={() => {
                            document.cookie = `vite-ui-lang=${l.languageTag}; path=/; max-age=31536000; SameSite=Lax`;
                          }}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            kcContext.locale?.currentLanguageTag === l.languageTag 
                              ? "font-bold text-primary bg-muted" 
                              : "text-foreground hover:text-primary hover:bg-muted/50"
                          }`}
                        >
                          {l.label}
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              className="cursor-pointer"
              onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>

            <div className="bg-border mx-2 h-6 w-px hidden sm:block"></div>
          </div>

        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex flex-1 items-center justify-center">
        <div className="w-full flex justify-center">
            {children}
        </div>
      </main>

      <footer className="bg-muted/40 border-t py-6 text-center">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} BoatDelivery. {msg("allRightsReserved")}
        </p>
      </footer>
    </div>
  );
}