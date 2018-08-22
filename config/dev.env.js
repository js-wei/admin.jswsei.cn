'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  baseUrl: '"http://tp5.com/admin"',
  uploadUrl: '"http://tp5.com/posts/"'
})
