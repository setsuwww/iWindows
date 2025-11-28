module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  overrides: [
    {
      files: ["electron/**/*.js"],
      env: { node: true }
    }
  ]
};
