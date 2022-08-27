"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // BASE_API: '"/apis"',
    // BASE_API: '"http://192.168.0.167:7060/idcloud"',
    target: '"http://192.168.0.45:8808/"',
    WEIXIN_LOGIN_URL: null
});