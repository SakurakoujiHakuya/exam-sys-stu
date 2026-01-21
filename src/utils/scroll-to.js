// easeInOutQuad 缓动函数
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t * t + b;
  }
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

// requestAnimationFrame for Smart Animating
const requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

/**
 * 移动滚动位置
 * @param {number} amount - 滚动到的位置
 */
function move(amount) {
  document.documentElement.scrollTop = amount;
  document.body.parentNode.scrollTop = amount;
  document.body.scrollTop = amount;
}

/**
 * 获取当前滚动位置
 * @returns {number} 当前滚动位置
 */
function position() {
  return (
    document.documentElement.scrollTop ||
    document.body.parentNode.scrollTop ||
    document.body.scrollTop
  );
}

/**
 * 平滑滚动到指定位置
 * @param {number} to - 目标滚动位置
 * @param {number} duration - 动画持续时间（毫秒）
 * @param {Function} callback - 动画完成后的回调函数
 */
export function scrollTo(to, duration, callback) {
  const start = position();
  const change = to - start;
  const increment = 20;
  let currentTime = 0;
  duration = typeof duration === 'undefined' ? 500 : duration;
  
  const animateScroll = function () {
    // 增加时间
    currentTime += increment;
    // 使用二次缓动函数计算当前值
    const val = Math.easeInOutQuad(currentTime, start, change, duration);
    // 移动页面
    move(val);
    // 如果动画未完成，继续
    if (currentTime < duration) {
      requestAnimFrame(animateScroll);
    } else {
      if (callback && typeof callback === 'function') {
        // 动画完成，执行回调
        callback();
      }
    }
  };
  
  animateScroll();
}
