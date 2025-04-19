Component({
    properties: {
        show: {
            type: Boolean,
            value: false
        },
        availableTags: {
            type: Array,
            value: []
        },
        availableEmojis: {
            type: Array,
            value: [
                { id: '1', path: '/static/svg/emoji/emoji_u1f60a.svg' },
                { id: '2', path: '/static/svg/emoji/emoji_u1f60d.svg' },
                { id: '3', path: '/static/svg/emoji/emoji_u1f60e.svg' },
                { id: '4', path: '/static/svg/emoji/emoji_u1f61b.svg' },
                { id: '5', path: '/static/svg/emoji/emoji_u1f62d.svg' }
            ]
        },
        currentTags: {
            type: Array,
            value: []
        },
        currentEmojis: {
            type: Array,
            value: []
        }
    },

    data: {
        selectedTags: [],
        selectedEmojis: [],
        newTagName: '',
        isCreatingTag: false
    },

    observers: {
        'currentTags': function (currentTags) {
            this.setData({
                selectedTags: currentTags.map(tag => tag.id)
            });
        },
        'currentEmojis': function (currentEmojis) {
            this.setData({
                selectedEmojis: currentEmojis.map(emoji => emoji.id)
            });
        }
    },

    methods: {
        onClose() {
            this.setData({
                isCreatingTag: false,
                newTagName: ''
            });
            this.triggerEvent('close');
        },

        onTagSelect(e) {
            const tagId = e.currentTarget.dataset.id;
            const selectedTags = this.data.selectedTags;
            const index = selectedTags.indexOf(tagId);

            if (index > -1) {
                selectedTags.splice(index, 1);
            } else {
                selectedTags.push(tagId);
            }

            this.setData({ selectedTags });

            const selectedTag = this.data.availableTags.find(tag => tag.id === tagId);
            this.triggerEvent('tagselect', { tag: selectedTag });
            this.onClose();
        },

        onEmojiSelect(e) {
            const emojiId = e.currentTarget.dataset.id;
            const selectedEmojis = this.data.selectedEmojis;
            const index = selectedEmojis.indexOf(emojiId);

            if (index > -1) {
                selectedEmojis.splice(index, 1);
            } else {
                selectedEmojis.push(emojiId);
            }

            this.setData({ selectedEmojis });

            const selectedEmoji = this.data.availableEmojis.find(emoji => emoji.id === emojiId);
            this.triggerEvent('emojiselect', { emoji: selectedEmoji });
            this.onClose();
        },

        onStartCreateTag() {
            this.setData({
                isCreatingTag: true
            });
        },

        onNewTagInput(e) {
            this.setData({
                newTagName: e.detail.value
            });
        },

        onCreateTag() {
            if (!this.data.newTagName) return;

            const newTag = {
                id: Date.now().toString(),
                name: this.data.newTagName
            };

            this.triggerEvent('createtag', { tag: newTag });
            this.onClose();
        }
    }
}); 