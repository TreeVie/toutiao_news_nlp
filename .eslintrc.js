module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "node": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "root": true,
    "globals": {
      "moment":true,
      "React": true,
      "ReactDOM": true,
      "echarts":true
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion":6,
        "sourceType":"module",
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true,
            "modules":true
        }
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        // "linebreak-style": [
        //     "error",
        //     "windows"
        // ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": "off",
        "no-console": "off",
        "no-unused-vars": "off"
    }
};