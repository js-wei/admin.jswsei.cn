/**
 * File: g:\vue\admin.jswsei.cn\src\i18n\i18n.js
 * Created Date: '2018-07-15 11:11:19
 * Author: 魏巍
 * -----
 * Last Modified: '2018-07-15 11:13:27
 * Modified By: 魏巍
 * -----
 * Copyright (c) 2018 魏巍
 * ------------------------------------
 * Javascript will save your soul!
 */

import Vue from 'vue'
import locale from 'element-ui/lib/locale'
import VueI18n from 'vue-i18n'
import messages from './langs'
Vue.use(VueI18n)
// 从localStorage中拿到用户的语言选择，如果没有，那默认中文。
const i18n = new VueI18n({
  locale: localStorage.lang || 'cn',
  messages
})
locale.i18n((key, value) => i18n.t(key, value)) // 为了实现element插件的多语言切换

export default i18n
