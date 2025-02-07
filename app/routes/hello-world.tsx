import { createFileRoute } from "@tanstack/react-router";
import * as m from "../paraglide/messages";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useLanguage } from "~/utils/i18n";
export const Route = createFileRoute("/hello-world")({
  component: RouteComponent,
});

function RouteComponent() {
  const [language] = useLanguage();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {language} {m.hello()}
      </h1>
      <h1 className="text-2xl font-bold mb-4">{m.hello()}</h1>
      <p>{m.some_flat_other_key({ name: "Eugen" })}</p>

      <div className="mt-4">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
