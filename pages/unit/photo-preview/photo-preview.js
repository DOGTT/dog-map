// pages/unit/photo-preview/photo-preview.js
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    currentPhoto: {
      type: String,
      value: '',
    },
    photoIndex: {
      type: Number,
      value: null,
    },
  },

  methods: {
    // 关闭预览
    closePreview() {
      this.triggerEvent('close');
    },

    // 设置为首图
    setAsCover() {
      this.triggerEvent('setCover', { index: this.data.photoIndex });
      this.closePreview();
    },

    // 删除照片
    deletePhoto() {
      this.triggerEvent('delete', { index: this.data.photoIndex });
      this.closePreview();
    },
  },
});