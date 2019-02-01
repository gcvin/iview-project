<template>
  <div class="cropper-wrapper">
    <div class="left-box">
      <Upload action="" v-show="!insideSrc" :before-upload="beforeUpload">
        <Button type="primary">上传图片</Button>
      </Upload>
      <img id="cropper-image" alt="">
    </div>
    <div class="right-box">
      <div id="preview-banner" class="preview-box banner">
        <a @click="initCropper('banner')" href="javascript:;"></a>
      </div>
      <div id="preview-face" class="preview-box face">
        <a @click="initCropper('face')" href="javascript:;"></a>
      </div>
      <a href="javascript:;" v-show="bannerSrc" class="image-box banner">
        <img :src="bannerSrc" @click="initCropper('banner')">
      </a>
      <a href="javascript:;" v-show="faceSrc" class="image-box face">
        <img :src="faceSrc" @click="initCropper('face')">
      </a>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'

export default {
  data () {
    return {
      cropper: null,
      insideSrc: '',
      faceSrc: '',
      bannerSrc: ''
    }
  },
  methods: {
    beforeUpload (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        this.replace(event.srcElement.result)
      }
      return false
    },
    replace (src) {
      this.cropper.replace(src)
      this.insideSrc = src
    },
    initImgSrc () {
      this.faceSrc = ''
      this.bannerSrc = ''
    },
    initCropper (id) {
      const imgUrls = {
        banner: 'faceSrc',
        face: 'bannerSrc'
      }

      if (this.insideSrc) {
        const url = this.cropper.getCroppedCanvas().toDataURL()
        this.initImgSrc()
        this[imgUrls[id]] = url
      }

      if (this.cropper) {
        this.cropper.destroy()
      }

      const image = document.getElementById('cropper-image')
      const preview = document.getElementById(`preview-${id}`)
      const height = preview.clientHeight
      const width = preview.clientWidth

      this.cropper = new Cropper(image, {
        preview: preview,
        checkCrossOrigin: true,
        aspectRatio: width / height
      })

      this.cropper.replace(this.insideSrc)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initCropper('banner')
    })
  }
}
</script>
<style lang="less" scoped>
.background {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC")
}

.left-box {
  display: inline-block;
  width: 560px;
  height: 224px;
  border: 1px solid #ebebeb;

  .background;

  img {
    max-width: 100%;
    display: block;
  }
}

.right-box {
  display: inline-block;
  vertical-align: top;
  margin-left: 20px;
  position: relative;

  .preview-box {
    height: 96px !important;
    border: 1px solid #ebebeb;
    overflow: hidden;
    margin-bottom: 32px;

    a {
      display: block;
      height: 100%;
      width: 100%;
    }

    &.banner {
      width: 242px !important;
    }

    &.face {
      width: 170px !important;
    }

    .background;
  }

  .image-box {
    position: absolute;
    border: 1px solid #ebebeb;
    height: 96px;
    left: 0;

    img {
      height: 100%;
      width: 100%;
    }

    &.banner {
      width: 242px;
      top: 0;
    }

    &.face {
      width: 170px;
      top: 128px;
    }
  }
}
</style>
