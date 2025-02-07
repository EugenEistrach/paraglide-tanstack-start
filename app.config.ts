import { defineConfig } from "@tanstack/start/config";
import tsConfigPaths from "vite-tsconfig-paths";
import { paraglide } from "@inlang/paraglide-vite";

export default defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      paraglide({
        project: "./project.inlang", // Path to your inlang project
        outdir: "./app/paraglide", // Where generated files will be placed
      }),
    ],
  },
});
