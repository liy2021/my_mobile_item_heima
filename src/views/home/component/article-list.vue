<template>
  <div class="article-list">
    <!-- List 组件通过 loading 和 finished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。若数据已全部加载完毕，则直接将 finished 设置成 true 即可。 -->
    <!--
      List 列表组件：瀑布流滚动加载，用于展示长列表。

      List 组件通过 loading 和 finished 两个变量控制加载状态，
      当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 自动设置成 true，此时可以发起异步操作并更新数据，
      数据更新完毕后，将 loading 设置成 false 即可。
      若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

      - load 事件：
        + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
        + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。

      - loading 属性：控制加载中的 loading 状态
        + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
        + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件

      - finished 属性：控制加载结束的状态
        + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
        + 所有数据加载结束，finished 为 true，此时不会触发 load 事件
     -->
    <van-pull-refresh
      v-model="isREfreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <!-- .sync传子组件数据 -->
        <article-item v-for="(article, index) in list" :key="index" :article="article" />
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  props: {
    channel: {
      type: Object,
      require: true
    }
  },
  components: { ArticleItem },
  data () {
    return {
      channels: [],
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中loading数据
      finished: false, // 控制数据加载完毕的状态
      timestamp: null, // 请求下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isREfreshLoading: false, // 控制下拉刷新的loading状态
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 异步更新数据
    async onLoad () {
      try {
        // 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          // 简单理解，请求数据的页码
          // 请求第一页数据，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳

          timestamp: this.timestamp || Date.now(),
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // if (Math.random() > 0.5) {
        //   JSON.parse('jjjjhh')
        // }
        const { results } = data.data // data.data也是个对象。
        // 数组展开操作符
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，将finished设置为true。不再加载更多
          this.finished = true
        }
      } catch (err) {
        console.log('请求失败', err)
        this.loading = false // 请求失败，关闭loading效果
        this.error = true // 开启错误提示
      }
      //     // 加载状态结束
      //     // 数据全部加载完成
    },
    // 当下拉刷新的时候会触发调用该函数
    async onRefresh () {
      // 请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          // 简单理解，请求数据的页码
          // 请求第一页数据，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳

          timestamp: Date.now(), // 下拉刷新，每次传递最新的数据。
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // 将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)

        // 关闭下拉刷新的loading状态
        this.isREfreshLoading = false
        // 更新下拉刷新成功提示的文本
        // if (Math.random() > 0.5) {
        //   JSON.parse('jjjjhh')
        // }
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.isREfreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  //放文章的地方只设置了宽，没有高，flex布局，一行占一个。包裹flex容器的父元素显示高为0（错）
  height: 79vh;
  overflow-y: auto;
  //上面两行代码，给.article-list盒子设置了滚动效果，解决了页面记住滚动位置的问题。
}
</style>
