// index.js
Page({
  data: {
    // ...其他数据保持不变...
    lastScrollTime: 0,    // 最后滚动时间戳
    lastScrollDir: 'none' // 最后滚动方向
  },

  // 优化后的滚动处理
  handleScroll(e) {
    const now = Date.now()
    const { scrollTop } = e.detail
    const {
      stickyThreshold,
      tabbarHeight,
      lastScroll,
      isSticky,
      lastScrollDir
    } = this.data

    // 1. 计算滚动方向和速度
    const direction = scrollTop > lastScroll ? 'down' : 'up'
    const delta = Math.abs(scrollTop - lastScroll)
    const speed = delta / (now - this.data.lastScrollTime || 1)

    // 2. 更新滚动记录
    this.setData({
      lastScroll: scrollTop,
      lastScrollTime: now,
      lastScrollDir: direction
    })

    // 3. 智能吸顶控制逻辑
    if (direction === 'down') {
      // 向下滚动处理
      if (scrollTop >= stickyThreshold) {
        this.setData({
          isSticky: true,
          tabbarOffset: 0
        })
      } else {
        const progress = Math.min(scrollTop / stickyThreshold, 1)
        this.setData({
          isSticky: false,
          tabbarOffset: -tabbarHeight * (1 - progress)
        })
      }
    } else {
      // 向上滚动处理（重点修复部分）
      if (scrollTop <= 0) {
        // 到达顶部完全复位
        this.setData({
          isSticky: false,
          tabbarOffset: 0
        })
      } else if (scrollTop < stickyThreshold) {
        // 在阈值范围内动态调整
        const progress = scrollTop / stickyThreshold
        const shouldSticky = progress > 0.6 && speed < 2 // 速度阈值控制
        
        this.setData({
          isSticky: shouldSticky,
          tabbarOffset: shouldSticky ? 
            0 : 
            -tabbarHeight * (1 - progress)
        })
      } else {
        // 超过阈值保持固定
        this.setData({ isSticky: true })
      }
    }
  },

  // 新增惯性滚动处理
  handleScrollEnd() {
    const { scrollTop, stickyThreshold } = this.data
    
    // 如果滚动停止在阈值附近，自动吸附到最近位置
    if (scrollTop > stickyThreshold * 0.4 && scrollTop < stickyThreshold) {
      this.setData({
        scrollTop: scrollTop > stickyThreshold * 0.6 ? 
          stickyThreshold : 
          0,
        transition: 'transform 0.3s ease-out'
      })
    }
  }
})