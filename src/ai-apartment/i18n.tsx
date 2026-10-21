import { createContext, useContext } from "react";

export type Lang = "id" | "en";

// Bahasa video. Default "id"; komposisi versi Inggris membungkus videonya dengan "en".
export const LangContext = createContext<Lang>("id");

export const useLang = () => useContext(LangContext);

// L(indonesia, english) mengembalikan teks sesuai bahasa video.
export const useL = () => {
  const lang = useLang();
  return <T,>(id: T, en: T): T => (lang === "en" ? en : id);
};
