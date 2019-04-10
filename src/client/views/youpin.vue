<template lang="html">
  <div class="youpin">
    <div class="filter">
      <RadioGroup v-model="sort" @on-change="getGoods">
          <Radio label="count">销量优先</Radio>
          <Radio label="score">好评优先</Radio>
      </RadioGroup>
      <span>销量不低于：<InputNumber v-model="count" @on-change="getGoods" :min="0" size="small"/>&nbsp;</span>
      <span>好评不低于：<InputNumber v-model="score" @on-change="getGoods" :min="0" size="small"/>&nbsp;</span>
      <Select v-model="category" placeholder="请选择类目" style="width:120px" size="small" @on-change="getGoods">
        <Option value="all">全部类目</Option>
        <Option v-for="item in categories" :key="item" :value="item">{{ item }}</Option>
      </Select>
    </div>
    <div class="goods">
      <a v-for="good in goods" :key="good.id" :href="good.url" target="_blank" class="good">
        <div class="image">
          <img :src="good.img" :alt="good.name">
        </div>
        <p class="name" :title="good.name">{{ good.name }}</p>
        <p>好评：{{ good.score }}% 销量：{{ good.count }}</p>
        <p>￥{{ good.price }}</p>
      </a>
    </div>
    <Page :total="total" @on-change="getGoods" :current.sync="page" :page-size="12"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      page: 1,
      goods: [],
      total: 0,
      sort: 'count',
      count: 0,
      score: 0,
      category: 'all',
      categories: [
        '有品推荐',
        '家用电器',
        '智能家庭',
        '电视影音',
        '家具家装',
        '居家餐厨',
        '运动户外',
        '出行车品',
        '手机电脑',
        '数码配件',
        '服装配饰',
        '鞋靴箱包',
        '日用文创',
        '饮食酒水',
        '洗护美妆',
        '医疗健康',
        '母婴亲子',
        '宠物生活'
      ]
    }
  },
  created () {
    this.getGoods()
  },
  methods: {
    getGoods () {
      const { page, sort, count, score, category } = this
      this.$http.get('/goods/get-goods', {
        params: { page, sort, count, score, category }
      }).then(res => {
        this.goods = res.data.goods
        this.total = res.data.total
      })
    }
  }
}
</script>

<style lang="less" scoped>
.youpin {
  min-height: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  background: url(../images/bg-right.png) center right no-repeat #F2F2F2;

  .filter {
    height: 50px;
    line-height: 50px;
  }

  .goods {
    width: 1080px;
    margin: 0 auto;
    overflow: hidden;
  }

  .ivu-page {
    margin-top: 10px;
  }

  .good {
    position: relative;
    float: left;
    width: 266px;
    padding-bottom: 10px;
    margin-left: 5px;
    margin-bottom: 5px;
    background: #fff;
    transition: all .4s;
    line-height: 18px;

    &:nth-of-type(4n+1) {
      margin-left: 0;
    }

    &:hover {
      box-shadow: 0 2px 20px rgba(0,0,0,.1);
      transform: translate3d(0,-2px,0);
    }

    .image {
      width: 100%;
      height: 195px;
      text-align: center;
      background: #fff;
      overflow: hidden;

      img {
        width: 195px;
        height: auto;
      }
    }

    .name {
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
  }
}
</style>
