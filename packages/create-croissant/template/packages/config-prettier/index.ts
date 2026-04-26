import type { Config } from "prettier"

const config: Config = {
  endOfLine: "lf",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 80,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["cn", "cva"],
}

export default config
