"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dict, type Dict, type Lang } from "@/i18n/dictionaries";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
};

const LangContext = createContext<Ctx | null>(null);

const isLang = (v: unknown): v is Lang => v === "es" || v === "en";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const saved = localStorage.getItem("laraLang");
    const next: Lang = isLang(saved) ? saved : "es";
    setLangState(next);
    document.documentElement.setAttribute("lang", next);
    if (!isLang(saved)) {
      localStorage.setItem("laraLang", next);
    }
  }, []);

  const setLang = (l: Lang) => {
    if (!isLang(l)) return;
    setLangState(l);
    localStorage.setItem("laraLang", l);
    document.documentElement.setAttribute("lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: dict[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
