'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"/apis"',
  // BASE_API: '"http://192.168.0.200:7060/idcloud"',
  WEIXIN_LOGIN_URL:null
})
