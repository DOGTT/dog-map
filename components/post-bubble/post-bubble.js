// components/post-bubble/post-bubble.js
Component({
  properties: {
    avatarUrl: String,
    username: String,
    date: String,
    tags: Array,
    images: Array,
    text: String,
    reactions: Array
  },

  methods: {
    onReactionTap(e) {
      const index = e.currentTarget.dataset.index;
      this.triggerEvent('reactiontap', { index });
    }
  }
});