import type { Lang } from "@/config/site";
import ar from "./ar";
import en, { type Dictionary } from "./en";

const DICTIONARIES: Record<Lang, Dictionary> = { en, ar };

export function getDictionary(lang: Lang): Dictionary {
  return DICTIONARIES[lang];
}

export type { Dictionary };
