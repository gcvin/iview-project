<template>
  <div class="cropper">
    <div class="left-box">
      <Upload action v-show="!cropperSrc" :before-upload="beforeUpload">
        <div class="upload-box">
          <Icon type="ios-add"/>
          <p>添加图片</p>
        </div>
      </Upload>
      <img id="cropper-image">
    </div>
    <div class="right-box">
      <div id="preview-banner" class="preview-box banner">
        <a @click="initCropper('banner')" href="javascript:;"></a>
      </div>
      <div id="preview-cover" class="preview-box cover">
        <a @click="initCropper('cover')" href="javascript:;"></a>
      </div>
      <a
        v-if="cropperType == 'cover'"
        href="javascript:;"
        class="image-box banner"
        @click="initCropper('banner')"
      >
        <img :src="imgSrc" v-show="imgSrc">
      </a>
      <a v-else href="javascript:;" class="image-box cover" @click="initCropper('cover')">
        <img :src="imgSrc" v-show="imgSrc">
      </a>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
import '@/styles/cropper.less'

export default {
  data () {
    return {
      cropper: null,
      cropperSrc: '',
      cropperType: '',
      imgSrc: ''
    }
  },
  methods: {
    beforeUpload (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = event => {
        this.replace(event.srcElement.result)
      }
      return false
    },
    replace (src) {
      if (!this.cropper) {
        return false
      }

      this.cropper.replace(src)
      this.cropperSrc = src
      this.imgSrc = ''
    },
    initCropper (type) {
      this.cropperType = type
      this.destroyCropper()

      const image = document.getElementById('cropper-image')
      const preview = document.getElementById(`preview-${type}`)
      const height = preview.clientHeight
      const width = preview.clientWidth

      this.cropper = new Cropper(image, {
        preview: preview,
        aspectRatio: width / height
      })

      if (this.cropperSrc) {
        this.cropper.replace(this.cropperSrc)
      }
    },
    destroyCropper () {
      if (!this.cropper) {
        return false
      }

      if (this.cropperSrc) {
        const src = this.cropper.getCroppedCanvas().toDataURL()
        this.imgSrc = src
      }

      this.cropper.destroy()
    }
  },
  mounted () {
    this.initCropper('banner')
  }
}
</script>
<style lang="less" scoped>
.cropper {
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.background {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
}

.left-box {
  position: relative;
  width: 560px;
  height: 224px;

  .background;

  img {
    max-width: 100%;
    display: block;
  }

  .upload-box {
    position: absolute;
    height: 62px;
    width: 58px;
    top: 80px;
    left: 250px;
    cursor: pointer;

    i {
      font-size: 40px;
    }
  }
}

.right-box {
  margin-left: 20px;
  position: relative;

  .preview-box {
    height: 96px !important;
    overflow: hidden;

    &:not(:last-of-type) {
      margin-bottom: 32px;
    }

    a {
      display: block;
      height: 100%;
      width: 100%;
    }

    &.banner {
      width: 242px !important;
    }

    &.cover {
      width: 170px !important;
    }

    .background;
  }

  .image-box {
    position: absolute;
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

    &.cover {
      width: 170px;
      top: 128px;
    }
  }
}
</style>
