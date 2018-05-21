/**
 * File: f:\vue\workonline.com\src\store\mutations.js
 * Created Date: '2018-01-25 4:24:18
 * Author: 魏巍
 * -----
 * Last Modified: '2018-05-18 4:17:34
 * Modified By: 魏巍
 * -----
 * Copyright (c) 2018 魏巍
 * ------------------------------------
 * Javascript will save your soul!
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
    SET_NAVBAR
} from './mutation-type'

const state = {
    loading: false,
    logined: null,
    header: true,
    footer: true,
    loadingText: '请稍后...',
    navbar: [],
};

const mutations = {
    /*loading*/
    [HIDE_LOADING](state) {
        state.loading = false;
    },
    [SHOW_LOADING](state) {
        state.loading = true;
    },
    [STE_LOADING_TEXT](state, text) {
        state.loadingText = text || '请稍后...';
    },
    [SET_LOGIN](state, userInfo) {
        state.logined = userInfo;
    },
    [SHOW_HEADER](state) {
        state.header = true
    },
    [SHOW_FOOTER](state) {
        state.footer = true
    },
    [HIDE_HEADER](state) {
        state.header = false
    },
    [HIDE_FOOTER](state) {
        state.footer = false
    },
    [SET_NAVBAR](state, navbar) {
        state.navbar = navbar
    }
};

const getters = {
    getLoadingState(state) {
        return state.loading;
    },
    getLoginedState(state) {
        return JSON.parse(sessionStorage.getItem('logined'));
    },
    getHeaderState(state) {
        return state.header;
    },
    getFooterState(state) {
        return state.footer;
    },
    getLoadingTextState(state) {
        return state.loadingText;
    },
    getNavbarState(state) {
        return state.navbar;
    }
};

export default {
    state,
    mutations,
    getters
}
