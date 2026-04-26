import config from "@workspace/config-eslint"

export default [
  ...config,
  {
    ignores: ["out/**", "dist/**", "node_modules/**"],
  },
]
