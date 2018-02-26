module.exports = {
  root: true,
  parserOptions: {
    sourceType: "module",
    parser: "babel-eslint"
  },
  env: {
    browser: true
  },
  extends: ["plugin:vue/recommended"],
  plugins: ["vue", "prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        semi: false,
        printWidth: 120
      }
    ],
    "vue/max-attributes-per-line": "off"
  }
}
