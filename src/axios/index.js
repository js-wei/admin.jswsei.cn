/**
 * File: g:\vue\admin.jswsei.cn\src\axios\index.js
 * Created Date: '2018-08-19 9:36:13
 * Author: 魏巍
 * -----
 * Last Modified: '2019-01-19 2:24:36
 * Modified By: 魏巍
 * -----
 * Copyright (c) 2018 魏巍
 * ------------------------------------
 * Javascript will save your soul!
 */

import axios from 'axios'
import code from '@/code'
import qs from 'qs'
import store from '@/store'
import { Message, MessageBox } from 'element-ui'

axios.defaults.baseURL = process.env.baseUrl

// 过滤OPTINS
axios.interceptors.request.use(function (config) {
  store.commit('SHOW_LOADING')
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  let token = store.getters.getTokenState
  if (token) {
    config.headers.Authorization = token
  }
  if (config.method === 'post') {
    config.data = qs.stringify({
      ...config.data
    })
  }
  return config
}, function (error) {
  store.commit('HIDE_LOADING')
  return Promise.reject(error)
})

axios.interceptors.response.use(
  response => {
    let data = response.data
    store.commit('HIDE_LOADING')
    if (data.code !== 200 && data.status !== 1) {
      if (data.code === 207) {
        MessageBox(code[data.code], '友情提示', 'confirm').then(_ => {
          store.commit('LOGOUT')
          location.href = '/login'
        }).catch(_ => {})
      }
    }
    if (data.code === 200 && data.status === 1) {
      Message({
        message: data.msg,
        type: 'success'
      })
    }
    return data
  },
  error => {
    store.commit('HIDE_LOADING')
    return Promise.reject(error.response.data)
  }
)

export default axios
