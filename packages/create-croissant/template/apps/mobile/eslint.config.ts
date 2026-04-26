import config from "@workspace/config-eslint"

export default [
  ...config,
  {
    ignores: [".expo/**", "scripts/**"],
  },
]
