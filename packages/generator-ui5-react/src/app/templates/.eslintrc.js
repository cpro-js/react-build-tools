module.exports = {
  extends: ["react-app", "react-app/jest"],
  ignorePatterns: ["src/generated"],
  rules: {
    "react-hooks/exhaustive-deps": 0,
  },
};
