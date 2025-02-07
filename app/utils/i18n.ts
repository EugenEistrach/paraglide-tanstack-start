import { createServerFn } from "@tanstack/start";
import {
  type AvailableLanguageTag,
  availableLanguageTags,
} from "../paraglide/runtime";
import { getWebRequest, setCookie } from "@tanstack/start/server";
import { useMatch, useRouter } from "@tanstack/react-router";

export const DEFAULT_LANGUAGE: AvailableLanguageTag = "en";

export const readLanguageFromHtmlLangAttribute = () => {
  const language = document.documentElement.lang;
  if (isSupportedLanguage(language)) {
    return language;
  }
  return DEFAULT_LANGUAGE;
};

export const getLanguageFromRequest = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getWebRequest();
    if (!request) return DEFAULT_LANGUAGE;

    const cookie = request.headers.get("cookie");
    const cookieLanguage = cookie
      ?.split("; ")
      .find((row: string) => row.startsWith("language="));
    const language = cookieLanguage?.split("=")[1];

    // if we have cookie language we take from there
    if (language && isSupportedLanguage(language)) {
      return language;
    }

    // Parse accept-language header if no valid cookie language
    const acceptLanguage = request?.headers.get("accept-language");
    if (acceptLanguage) {
      // Split into individual language tags and their quality values
      const languages = acceptLanguage.split(",").map((lang) => {
        const [tag, quality = "q=1"] = lang.trim().split(";");
        return {
          tag: tag.trim(),
          quality: parseFloat(quality.split("=")[1]),
        };
      });

      // Sort by quality value
      languages.sort((a, b) => b.quality - a.quality);

      // Find the first supported language
      for (const { tag } of languages) {
        if (isSupportedLanguage(tag)) {
          return tag;
        }
      }
    }

    // or we fallback to the default language
    return DEFAULT_LANGUAGE;
  }
);

const setLanguage = createServerFn({ method: "POST" })
  .validator((data: { locale: string }) => data)
  .handler(async ({ data: { locale } }) => {
    setCookie("language", locale);
  });

export const useLanguage = () => {
  const router = useRouter();
  const match = useMatch({ from: "__root__" });
  const language = match?.context.language ?? DEFAULT_LANGUAGE;
  const setLanguageFn = async (language: AvailableLanguageTag) => {
    await setLanguage({ data: { locale: language } });
    await router.invalidate();
  };
  return [language, setLanguageFn] as const;
};

const isSupportedLanguage = (
  language: string | null | undefined
): language is AvailableLanguageTag => {
  if (!language) return false;
  return availableLanguageTags.includes(language.trim() as any);
};
