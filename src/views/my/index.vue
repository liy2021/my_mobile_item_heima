<template>
  <div class="my-container">
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image
            class="avatar"
            round
            fit="cover"
            :src="userInfo.photo"
          />
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button round size="mini">编辑资料</van-button>
        </div>
      </div>
      <div class="base-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}} </span>
          <span class="text"> 头条 </span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text"> 关注 </span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text"> 粉丝 </span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text"> 获赞 </span>
        </div>
      </div>
    </div>
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 宫格导航 -->
    <van-grid :column-num="2" class="grid-nav md-9" clickable>
      <!-- <van-grid-item><i><span></span> </van-grid-item>中，只能都写slot具名插槽。如果有一个不写，默认为默认插槽，且具名插槽失效。-->
      <van-grid-item class="grid-item"
        ><i slot="icon" class="toutiao toutiao-shoucang"></i
        ><span slot="text" class="text">收藏</span></van-grid-item
      >
      <van-grid-item class="grid-item"
        ><i slot="icon" class="toutiao toutiao-lishi"></i
        ><span slot="text" class="text">历史</span></van-grid-item
      >
    </van-grid>
    <!-- /宫格导航 -->
    <!-- 消息通知 -->
    <!-- van-cell-group,这个类有个白色背景，导致外边距看不出来，要想要效果，去掉 <van-cell-group> </van-cell-group>-->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link class="md-9" />
    <van-cell
      v-if="user"
      title="退出登录"
      class="lgout-cell"
      clickable
      @click="onLogout"
    />
    <!-- /消息通知 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyPage',
  components: {},
  props: {},
  data () {
    return {
      userInfo: {

      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    if (this.user) {
      this.loadUserInfo()
    }
  },
  mounted () {},
  methods: {
    onLogout () {
      // 在组件中需要通过this.$dialog调用弹窗组件。
      this.$dialog.confirm({
        title: '确认退出吗'
      })
        .then(() => {
          // on confirm
          // 清除登录状态，清理容器的状态，清理本地存储的状态。setUser函数可以直接做到。
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
          console.log('取消执行这里?')
        })
    },
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        console.log(data)
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取数据失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  > .header {
    height: 361px;
    // css中使用@别名，前面加~。
    background: url("~@/assets/banner.png") no-repeat;
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        height: 132px;
        width: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .base-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
          margin-right: 23px;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .base-stats {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5293;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .lgout-cell {
    text-align: center;
    color: #d86262;
  }
  .md-9 {
    margin-bottom: 9px;
  }
}
</style>
