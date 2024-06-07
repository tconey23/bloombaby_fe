import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";


export default [
  {languageOptions: { globals: globals.browser }},
  {
    rules: {
        "no-unused-vars": "off",
        "no-undef": "off",
        "react-hooks/exhaustive-deps": "off"
    }
},
  pluginJs.configs.recommended,
  pluginReactConfig,
];
