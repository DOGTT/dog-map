// components/post-bubble/post-bubble.js
Component({
	properties: {
		avatarUrl: String,
		username: String,
		date: String,
		tags: Array,
		images: Array,
		text: String,
		reactions: Array,
	},

	data: {
		currentIndex: 0, // 当前图片的索引
	},
	methods: {
		// 监听轮播图切换事件
		onSwiperChange(event) {
			this.setData({
				currentIndex: event.detail.current,
			});
		},
		onReactionTap(e) {
			const index = e.currentTarget.dataset.index;
			this.triggerEvent('reactiontap', {
				index
			});
		}
	}
});
