/// <reference types="vinxi/types/client" />
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/start'
import { createRouter } from './router'
import { applyLanguageOnClient } from "./utils/i18n";

const router = createRouter()

applyLanguageOnClient()

hydrateRoot(document, <StartClient router={router} />)
