/**
 * @Author: 魏巍
 * @Date:   2018-07-08T15:25:57+08:00
 * @Email:  524314430@qq.com
 * @Filename: actions.js
 * @Last modified by:   魏巍
 * @Last modified time: 2019-05-05T00:08:28+08:00
 * @Copyright: free
 */

import * as types from './mutation-type'

export default{
  hideLoading: ({commit}) => {
    commit(types.HIDE_LOADING)
  },
  showLoading: ({commit}) => {
    commit(types.SHOW_LOADING)
  },
  setLogin: ({commit}, userInfo) => {
    commit(types.SET_LOGIN, userInfo)
  }
}
