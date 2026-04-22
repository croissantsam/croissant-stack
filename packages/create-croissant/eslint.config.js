import { tanstackConfig } from "@tanstack/eslint-config"

export default [
  {
    ignores: ["dist", "template"],
  },
  ...tanstackConfig,
]
