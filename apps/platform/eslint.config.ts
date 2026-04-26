import config from "@workspace/config-eslint"
import type { Linter } from "eslint"

const platformConfig: Array<Linter.Config> = [
  ...config,
  {
    ignores: [".output/**", "dist/**", "node_modules/**", ".vinxi/**"],
  },
]

export default platformConfig
