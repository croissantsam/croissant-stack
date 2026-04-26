import config from "@workspace/config-eslint"
import type { Linter } from "eslint"

const mobileConfig: Array<Linter.Config> = [
  ...config,
  {
    ignores: [".expo/**", "scripts/**"],
  },
]

export default mobileConfig
