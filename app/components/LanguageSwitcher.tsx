import { availableLanguageTags, type AvailableLanguageTag } from "../paraglide/runtime";
import { updateLocale } from "../utils/i18n";

const LANGUAGE_NAMES: Record<AvailableLanguageTag, string> = {
  en: "English",
  de: "Deutsch",
};

export function LanguageSwitcher() {
  return (
    <div className="flex gap-2">
      {availableLanguageTags.map((lang) => (
        <button
          key={lang}
          onClick={() => {
            updateLocale({ data: { locale: lang } }).then(() => {
              window.location.reload();
            });
          }}
          className="px-3 py-1.5 text-sm font-medium rounded-md
            bg-gray-100 hover:bg-gray-200
            dark:bg-gray-800 dark:hover:bg-gray-700
            transition-colors"
          aria-label={`Switch to ${LANGUAGE_NAMES[lang]}`}
        >
          {LANGUAGE_NAMES[lang]}
        </button>
      ))}
    </div>
  );
}
