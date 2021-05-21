module.exports = {
  parserOptions: {
    project: "./tsconfig.eslint.json"
  },
  extends: [
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  rules: {
    "react/react-in-jsx-scope": 0,
    "react/jsx-props-no-spreading": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "react/prop-types": 0
  }
}
