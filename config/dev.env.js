'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  baseUrl: '"http://api.jswei.cn/admin"',
  uploadUrl: '"http://api.jswei.cn/posts/"'
})
