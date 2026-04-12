import { useState } from "react";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";

import { Button } from "@/components/ui/button";
import { LanguagesIcon } from "lucide-react";
import { BdLogo } from "@/components/ui/BdLogo";

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const { kcContext, i18n, children } = props;
  const { locale } = kcContext;
  const { msg } = i18n;

  const [isLangOpen, setIsLangOpen] = useState(false);

  const FRONTEND_URL = window.location.origin.includes("localhost")
    ? "http://localhost:5173"
    : window.location.origin;

  return (
    <div className="bg-slate-50 text-slate-900 flex min-h-screen flex-col font-sans">
      
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm h-16 flex items-center px-4 md:px-8">
        <div className="container mx-auto flex w-full items-center justify-between">
          
          <a href={FRONTEND_URL} className="flex items-center gap-2.5 text-[#0F172A] text-2xl font-extrabold tracking-tight hover:opacity-80 transition">
            <BdLogo className="h-10 w-10" />
            BoatDelivery
          </a>

          {locale?.supported && locale.supported.length > 1 && (
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-slate-100 relative z-50"
                onClick={() => setIsLangOpen(!isLangOpen)}
              >
                <LanguagesIcon className="h-5 w-5 text-slate-600" />
              </Button>

              {isLangOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsLangOpen(false)}
                  ></div>

                  <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-slate-200 bg-white shadow-lg z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
                    {locale.supported.map((l) => (
                      <a 
                        key={l.languageTag}
                        href={l.url} 
                        className={`block px-4 py-2 text-sm transition-colors ${
                          kcContext.locale?.currentLanguageTag === l.languageTag 
                            ? "font-bold text-[#0F172A] bg-slate-50" 
                            : "text-slate-600 hover:text-[#0F172A] hover:bg-slate-100"
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

        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full flex justify-center">
            {children}
        </div>
      </main>

      <footer className="bg-white border-t py-6 text-center relative z-10">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} BoatDelivery. {msg("allRightsReserved")}
        </p>
      </footer>
    </div>
  );
}