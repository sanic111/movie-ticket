import { useTranslation } from "react-i18next";
import { useMatches } from "react-router-dom";
import { useEffect } from "react";
import type { RouteHandle } from "@/route/router";

export function usePageTitle() {
  const { t, i18n } = useTranslation();
  const matches = useMatches();

 useEffect(() => {
  const currentMatch = matches[matches.length - 1];
  const handle = currentMatch?.handle as RouteHandle;
  const titleKey = handle?.titleKey;

  console.log("Current match:", currentMatch);
  console.log("Handle from route:", handle);
  console.log("Title key:", titleKey);

  if (titleKey) {
    const translatedTitle = t(titleKey);
    console.log("Translated title:", translatedTitle);
    document.title = translatedTitle;
  }
}, [matches, t, i18n.language]);

}