

import { getDistance } from 'geolib';

// utils/formatDistance.js
export function formatDistance(distance) {
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  } else if (distance < 10000) {
    return `${(distance / 1000).toFixed(1)}km`;
  } else {
    return `${Math.round(distance / 1000)}km`;
  }
}
// /​**​
//  * 计算并格式化两点间距离
//  * @param {Object} point1 {latitude, longitude}
//  * @param {Object} point2 {latitude, longitude}
//  * @returns {string} 格式化后的距离
//  */
export function getFormattedDistance(point1, point2) {
  const distance = getDistance(point1, point2);
  return formatDistance(distance);
}
