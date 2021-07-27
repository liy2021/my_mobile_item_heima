<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <!-- slot表明这是要放到哪个插槽的内容，van-icon表明插槽的内容 -->
      <van-button
        size="small"
        slot="title"
        type="info"
        round
        icon="search"
        class="search-btn"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <!-- 这个swipeable滑动受内容区域影响。内容只有一行，只能在那一行内才有滑动效果 -->
    <van-tabs class="chanel-tabs" v-model="active" animated swipeable>
      <!-- 通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。 -->
      <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。
      通过 swipeable 属性可以开启滑动切换标签页。 -->
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <!-- 文章列表 -->
        <!-- TAB组件标签本身默认懒加载 -->
        <article-list :channel="channel" />
        <!-- 文章列表 -->
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChannelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>

    <!--/ 频道列表 -->
    <!-- 频道编辑弹出层 -->

    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <!--  <van-popup></van-popup>中的内容，会自动放到弹出层里-->
      <channel-edit
        :active="active"
        :my-channels="channels"
        @update-active="onUpdateActive"
      />
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './component/article-list'
import ChannelEdit from './component/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomePage',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {},
  methods: {
    async loadChannels () {
      try {
        // const { data } = await getUserChannels();
        // this.channels = data.data.channels;
        let channels = []
        if (this.user) {
          // 已登录，获取用户频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录，判断是否有本地的频道列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')
          // 有，就拿过来
          if (localChannels) {
            channels = localChannels
          } else {
            // 没有，获取默认频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }

        this.channels = channels
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    },
    onUpdateActive (index, isChannelEditShow = true) {
      this.active = index
      this.isChannelEditShow = isChannelEditShow
    }
  }
}
</script>

<style scoped lang="less">
// 加了scope，会给每个类名或者选择器加属性选择器。要想定义的元素样式生效，
// 就不仅要符合类名或选择器，还要有对应属性
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  //在这设置无效，在全局样式里设置管用。看上文注释。
  .van-nav-bar__title {
    max-width: none;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    color: #fff;
    .van-icon {
      font-size: 32px;
    }
  }
  //在scoped作用域中，默认只能作用到组件的根节点。
  //如果想影响得更深，使用深度操作符。
  /deep/ .chanel-tabs {
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      z-index: 1;
      left: 0;
      right: 0;
      top: 92px;
    }
    .van-tab {
      //
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
    .placeholder {
      width: 66px;
      height: 82px;
      flex-shrink: 0; //意为不参与子项目宽度计算。
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      opacity: 0.902;
      background-color: #fff;
      width: 66px;
      height: 82px;
      align-items: center;
      justify-content: center;
      i.toutiao {
        font-size: 33px;
      }
      &::before {
        content: "";
        position: absolute;
        left: 0;
        //1px,转成rem后，带小数，浏览器作为模拟器显示不出来。实际效果以手机打开为准。
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
