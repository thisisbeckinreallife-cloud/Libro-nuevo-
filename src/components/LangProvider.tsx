"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dict, type Dict, type Lang } from "@/i18n/dictionaries";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
};

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const saved = (localStorage.getItem("laraLang") as Lang | null) ?? "es";
    setLangState(saved);
    document.documentElement.setAttribute("lang", saved);
  }, []);

  const setLang = (l: Lang) => {
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
