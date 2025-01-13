// components/avatar-editer/avatar-editer.js

const app = getApp();
const {
    cropImage
} = require('../../utils/canvas');

Component({

    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: Boolean,
            value: false,
        },
        avatar: {
            type: String,
            value: '',
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        avatarNew: undefined
    },

    /**
     * 组件的方法列表
     */
    methods: {
        closePreview() {
            this.triggerEvent('close');
        },

        avatarUpdate() {
            const _this = this;
            wx.chooseMedia({
                count: 1,
                mediaType: ['image'], // 只允许选择图片
                sourceType: ['album', 'camera'], // 可以从相册选择或拍摄
                success(res) {
                    console.log(res);
                    let avatarUrl = res.tempFiles[0].tempFilePath;

                    cropImage({
                        ctx: _this,
                        canvasId: "#avatarCropper",
                        tempFilePath: avatarUrl,
                        width: 640,
                        height: 640
                    }).then((resPath) => {
                        console.log('image crop done:', resPath);
                        // todo: upload

                        _this.setData({
                            avatarNew: resPath
                        })
                        _this.triggerEvent('update', resPath);
                    }).catch((err) => {
                        console.error('image crop fail:', err);
                    });
                },
                fail(err) {
                    console.error('Media selection failed:', err);
                },
            });

        }

    }
})