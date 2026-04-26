import config from "@workspace/config-eslint"
import type { Linter } from "eslint"

const desktopConfig: Array<Linter.Config> = [
  ...config,
  {
    ignores: ["out/**", "dist/**", "node_modules/**"],
  },
]

export default desktopConfig
