/**
 * @Author: 魏巍
 * @Date:   2017-10-24T10:53:05+08:00
 * @Email:  524314430@qq.com
 * @Last modified by:   魏巍
 * @Last modified time: 2017-11-24T09:33:02+08:00
 */
export const formart_date = (phptime, fmt = 'yyyy-MM-dd hh:mm:ss') => {
  phptime = phptime.toString().length < 13 ? phptime * 1000 : phptime;
  let date = new Date(phptime);
  var o = {
    "M+": date.getMonth() + 1, //月份   
    "d+": date.getDate(), //日   
    "h+": date.getHours(), //小时   
    "m+": date.getMinutes(), //分   
    "s+": date.getSeconds(), //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}
export const is_formart_date = (phptime, fmt = 'yyyy-MM-dd hh:mm:ss') => {
  var now = new Date(phptime * 1000);
  var o = {
    "M+": now.getMonth() + 1, //月份 
    "d+": now.getDate(), //日 
    "h+": now.getHours() % 12 == 0 ? 12 : now.getHours() % 12, //小时  
    "m+": now.getMinutes(), //分 
    "s+": now.getSeconds(), //秒 
    "q+": Math.floor((now.getMonth() + 3) / 3), //季度 
    "S": now.getMilliseconds() //毫秒 
  };

  var week = {
    "0": "/u65e5",
    "1": "/u4e00",
    "2": "/u4e8c",
    "3": "/u4e09",
    "4": "/u56db",
    "5": "/u4e94",
    "6": "/u516d"
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (now.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[now.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}


/**
 * [subString 截取指定的字符串]
 * @param  {String}  [content=''] [内容]
 * @param  {Number}  [lng=50]     [截取长度]
 * @param  {Boolean} [flag=false] [是否超出隐藏]
 * @return {[type]}               [description]
 */
export const sub_string = (content, lng, flag = false) => {
  if (!content) {
    return '';
  }
  lng = lng || 20;
  flag = flag || false;
  return flag ? content.substring(0, lng) + '...' : content.substring(0, lng);
}
/**
 * [is_default 默认值]
 * @param  {[type]} content            [内容]
 * @param  {String} [str='似乎没有内容'] [替换内容]
 * @return {[type]}                    [description]
 */
export const is_default = (content, str = '似乎没有内容') => {
  if (!content) {
    return str;
  }
  return content;
}

export const is_mobile_safe = (tel) => {
  if (tel) {
    return tel.substring(0, 3) + "****" + tel.substring(8, 11);
  }
  return '';
}

/**
 * 获取服务器地址
 * @param {string} url 地址
 */
export function host(url) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const parts = host.split('.').slice(-3)
  if (parts[0] === 'www') parts.shift()
  return parts.join('.')
}
/**
 * 获取距离发布时间
 * @param {int} time 时间戳
 */
export function time_ago(time, t = 'zh') {
  const between = Date.now() / 1000 - Number(time)
  let lang = {
    zh: [
      '分钟前',
      '小时前',
      '天前'
    ],
    en: [
      'minute',
      'hour',
      'day'
    ]
  };
  if (between < 3600) {
    if (between < 60) {
      return t == 'zh' ? '刚刚' : 'a moment ago'
    }
    return pluralize(~~(between / 60), lang[t][0], t)
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), lang[t][1], t)
  } else {
    return pluralize(~~(between / 86400), lang[t][2], t)
  }
}

function pluralize(time, label, t) {
  if (t == 'zh') {
    return time + label
  }
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}
