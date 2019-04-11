<template lang="html">
  <div class="upload">
    <!-- <div class="upload-list" v-for="item in uploadList" :key="item.uid">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      ref="upload"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png','gif']"
      :max-size="2048"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      multiple
      type="drag"
      name="image"
      action="/ajax/qnupload"
      style="display:inline-block;width:58px;">
      <div style="width:58px;height:58px;line-height:58px;">
        <Icon type="ios-camera" size="20" style="line-height:58px;"></Icon>
      </div>
    </Upload>
    <Modal title="查看图片" v-model="visible">
      <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal> -->
    <vpaper/>
  </div>
</template>

<script>
// import vpaper from '@/components/paper'
import vpaper from '@/vpaper'
import Vue from 'vue'
Vue.use(vpaper)
export default {
  data () {
    return {
      defaultList: [],
      imgUrl: '',
      visible: false,
      uploadList: []
    }
  },
  // components: {
  //   vpaper
  // },
  methods: {
    handleView (url) {
      this.imgUrl = url
      this.visible = true
    },
    handleRemove (file) {
      this.$http
        .get('/ajax/qndelete', {
          params: {
            key: file.key
          }
        })
        .then(res => {
          if (res.data.success) {
            const fileList = this.$refs.upload.fileList
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
          } else {
            this.$Message.info(res.data.msg.name)
          }
        })
    },
    handleSuccess (res, file) {
      file.url = res.data.src
      file.key = res.data.key
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc:
          '文件 ' +
          file.name +
          ' 格式不正确，请上传 jpg、png、jpeg 或 git 格式的图片。'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5
      if (!check) {
        this.$Notice.warning({
          title: '最多只能上传 5 张图片。'
        })
      }
      return check
    }
  },
  mounted () {
    this.$http
      .get('/ajax/qnlist')
      .then(res => {
        this.defaultList = res.data.data
        // setTimeout(_ => {
        //   this.uploadList = this.$refs.upload.fileList
        // }, 0)
      })
      .catch(() => {
        this.$Message.error('获取七牛云图片出错！')
      })
  }
}
</script>

<style lang="css" scoped>
.upload {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.upload-list img {
  width: 100%;
  height: 100%;
}
.upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.upload-list:hover .upload-list-cover {
  display: block;
}
.upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
