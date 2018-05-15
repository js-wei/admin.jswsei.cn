/**
 * File: d:\项目\workonline\src\metheds\methed.js
 * Created Date: '2018-02-02 3:05:51
 * Author: 魏巍
 * -----
 * Last Modified: '2018-05-15 5:07:17
 * Modified By: 魏巍
 * -----
 * Copyright (c) 2018 魏巍
 * ------------------------------------
 * Javascript will save your soul!
 */
export const formart_date = (phptime, fmt = 'yyyy-MM-dd hh:MM:ss') => {
  var t = new Date(phptime*1000);
  var tf = function (i) {
    return (i < 10 ? '0' : '') + i
  };
  return fmt.replace(/yyyy|MM|dd|hh|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'hh':
        return tf(t.getHours());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
    }
  });
}

export const _timestamp=()=>{
  let ts = Math.round(new Date()/1000).toString();
  return ts;
}

