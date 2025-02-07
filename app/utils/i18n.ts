import { createServerFn } from '@tanstack/start'
import {
	type AvailableLanguageTag,
	availableLanguageTags,
  setLanguageTag,
} from '../paraglide/runtime'
import { getWebRequest, setCookie } from '@tanstack/start/server'
import { redirect } from '@tanstack/react-router'

export const DEFAULT_LANGUAGE: AvailableLanguageTag = "en"

export const applyLanguageOnClient = () => {
  const languageFromCookie = readLanguageFromCookie()

  if (languageFromCookie && isSupportedLanguage(languageFromCookie)) {
    setLanguageTag(() => normalizeLanguage(languageFromCookie))
  }
}

export const applyLanguageOnServer = (request: Request) => {
  const cookieLanguage = readLanguageFromRequest(request)

  // if we have cookie we take from there
  if (cookieLanguage && isSupportedLanguage(cookieLanguage)) {
    // providing a callback here so this will be re-evaluated on demand
    const lang = normalizeLanguage(cookieLanguage)
    setLanguageTag(() => lang)
    return lang
  }

  // otherwise we check for the accept-language header
  if (!cookieLanguage) {
    const acceptLanguage = request?.headers.get('accept-language')
    if (acceptLanguage && isSupportedLanguage(acceptLanguage)) {
      const lang = normalizeLanguage(acceptLanguage)
      setLanguageTag(() => lang)
      return lang
    }
  }

   // or we fallback to the default language
  setLanguageTag(() => DEFAULT_LANGUAGE)
  return DEFAULT_LANGUAGE
}

export const updateLocale = createServerFn({ method: 'POST' })
	.validator((data: { locale: string }) => data)
	.handler(async ({ data: { locale } }) => {

    const request = getWebRequest()

    const referrer = request?.headers.get('referer') ?? '/'

		setCookie('language', locale)
	})



const isSupportedLanguage = (
	language: string | null | undefined,
): language is AvailableLanguageTag => {
	if (!language) return false

	if (availableLanguageTags.includes(language as any)) {
		return true
	}

	const [baseLanguage] = language.split('-')
	if (!baseLanguage) return false

	return availableLanguageTags.includes(baseLanguage.toLowerCase() as any)
}


// Translate more complex language tags to the base language e.g. en-US -> en
// Fallback to default language if the language is not supported
const normalizeLanguage = (
	language: string | null | undefined,
): AvailableLanguageTag => {
	if (!language) return DEFAULT_LANGUAGE

	if (availableLanguageTags.includes(language as any)) {
		return language as AvailableLanguageTag
	}

	const [baseLanguage] = language.split('-')
	if (!baseLanguage) return DEFAULT_LANGUAGE

	const normalizedBase = baseLanguage.toLowerCase()
	if (availableLanguageTags.includes(normalizedBase as any)) {
		return normalizedBase as AvailableLanguageTag
	}

	return DEFAULT_LANGUAGE
}

const readLanguageFromCookie = () => {
  const cookie = document.cookie
  const language = cookie.split('; ').find(row => row.startsWith('language='))
  return language ? language.split('=')[1] : DEFAULT_LANGUAGE
}

const readLanguageFromRequest = (request: Request) => {
  if (!request) return null
  const cookie = request.headers.get('cookie')
  const language = cookie?.split('; ').find((row: string) => row.startsWith('language='))
  return language ? language.split('=')[1] : null
}
