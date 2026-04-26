import config from "@workspace/config-eslint"

export default [
  ...config,
  {
    ignores: [".output/**", "dist/**", "node_modules/**", ".vinxi/**"],
  },
]
