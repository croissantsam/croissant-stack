import { tanstackConfig } from "@tanstack/eslint-config"
import type { Linter } from "eslint"

const config: Array<Linter.Config> = tanstackConfig.map((config) => {
  const parserOptions = config.languageOptions?.parserOptions as any
  if (parserOptions?.project) {
    const { project, ...rest } = parserOptions
    return {
      ...config,
      languageOptions: {
        ...config.languageOptions,
        parserOptions: {
          ...rest,
          projectService: {
            allowDefaultProject: ["*.js", "*.mjs"],
          },
        },
      },
    }
  }
  return config
})

export default config
