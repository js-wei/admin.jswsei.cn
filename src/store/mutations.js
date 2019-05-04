/**
 * @Author: 魏巍
 * @Date:   2018-07-08T15:25:57+08:00
 * @Email:  524314430@qq.com
 * @Filename: mutations.js
 * @Last modified by:   魏巍
 * @Last modified time: 2019-05-05T00:08:59+08:00
 * @Copyright: free
 */

import {
    HIDE_LOADING,
    SHOW_LOADING,
    SET_LOGIN,
    SHOW_HEADER,
    SHOW_FOOTER,
    HIDE_HEADER,
    HIDE_FOOTER,
    STE_LOADING_TEXT,
    SET_NAVBAR,
    SET_ACTIVE_NAVBAR,
    SET_TOKEN
} from './mutation-type'

const state = {
  loading: false,
  logined: null,
  header: true,
  footer: true,
  loadingText: '请稍后...',
  navbar: [],
  activeBar: null,
  token: null
}

const mutations = {
  [SET_TOKEN] (state, token) {
    state.token = token
  },
  [HIDE_LOADING] (state) {
    state.loading = false
  },
  [SHOW_LOADING] (state) {
    state.loading = true
  },
  [STE_LOADING_TEXT] (state, text) {
    state.loadingText = text || '请稍后...'
  },
  [SET_LOGIN] (state, userInfo) {
    state.logined = userInfo
  },
  [SHOW_HEADER] (state) {
    state.header = true
  },
  [SHOW_FOOTER] (state) {
    state.footer = true
  },
  [HIDE_HEADER] (state) {
    state.header = false
  },
  [HIDE_FOOTER] (state) {
    state.footer = false
  },
  [SET_NAVBAR] (state, navbar) {
    state.navbar = navbar
  },
  [SET_ACTIVE_NAVBAR] (state, navbar) {
    state.activeBar = navbar
  }
}

const getters = {
  getLoadingState (state) {
    return state.loading
  },
  getLoginedState (state) {
    return state.logined
  },
  getHeaderState (state) {
    return state.header
  },
  getFooterState (state) {
    return state.footer
  },
  getLoadingTextState (state) {
    return state.loadingText
  },
  getNavbarState (state) {
    return state.navbar
  },
  getActiveBarState (state) {
    return state.activeBar
  },
  getTokenState (state) {
    return state.token
  }
}

export default {
  state,
  mutations,
  getters
}
