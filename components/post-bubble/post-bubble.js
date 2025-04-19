// components/post-bubble/post-bubble.js
Component({
    properties: {
        avatarUrl: String,
        username: String,
        date: String,
        images: Array,
        text: String,
        tags: {
            type: Array,
            value: [
                {
                    key: "精华",
                    count: 2,
                    active: false
                },
                {
                    key: "优秀",
                    count: 3,
                    active: false
                },
                {
                    key: "帅帅帅",
                    count: 5,
                    active: false
                }
            ]
        },
        stickers: {
            type: Array,
            value: [
                {
                    key: "emoji_u1f60a",
                    count: 2,
                    active: false
                },
                {
                    key: "emoji_u1f60b",
                    count: 3,
                    active: false
                },
                {
                    key: "emoji_u1f60c",
                    count: 5,
                    active: false
                }
            ]
        },
    },

    data: {
        currentIndex: 0, // 当前图片的索引
        showInteractionSelector: false
    },
    methods: {
        // 监听轮播图切换事件
        onSwiperChange(event) {
            this.setData({
                currentIndex: event.detail.current,
            });
        },
        onTagClick(e) {
            const { index } = e.currentTarget.dataset;
            const tags = [...this.data.tags];
            const tag = tags[index];

            tag.active = !tag.active;
            if (tag.active) {
                tag.count += 1;
            } else {
                tag.count -= 1;
            }

            this.setData({ tags });
        },
        onStickerClick(e) {
            const { index } = e.currentTarget.dataset;
            const stickers = [...this.data.stickers];
            const sticker = stickers[index];

            sticker.active = !sticker.active;
            if (sticker.active) {
                sticker.count += 1;
            } else {
                sticker.count -= 1;
            }

            this.setData({ stickers });
        },
        onAddInteraction() {
            this.setData({
                showInteractionSelector: true
            });
        },
        onInteractionSelectorClose() {
            this.setData({
                showInteractionSelector: false
            });
        },
        onCreateTag(e) {
            const newTag = e.detail.tag;
            const tags = [...this.data.tags, {
                key: newTag.name,
                count: 0,
                active: false
            }];
            this.setData({ tags });
            this.triggerEvent('tagschange', { tags });
        },
        onInteractionSelectorConfirm(e) {
            const selectedTags = e.detail.tags;
            const selectedEmojis = e.detail.emojis;

            const tags = selectedTags.map(tag => ({
                key: tag.name,
                count: 0,
                active: false
            }));

            const stickers = selectedEmojis.map(emoji => ({
                key: emoji,
                count: 0,
                active: false
            }));

            this.setData({
                tags,
                stickers,
                showInteractionSelector: false
            });

            this.triggerEvent('tagschange', { tags });
            this.triggerEvent('emojischange', { emojis: selectedEmojis });
        }
    }
});
