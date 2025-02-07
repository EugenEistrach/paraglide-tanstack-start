/// <reference types="vinxi/types/client" />
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/start";
import { createRouter } from "./router";
import { setLanguageTag } from "~/paraglide/runtime";
import { readLanguageFromHtmlLangAttribute } from "./utils/i18n";

const router = createRouter();

setLanguageTag(() => readLanguageFromHtmlLangAttribute());

hydrateRoot(document, <StartClient router={router} />);
