<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        class="edit-btn"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <!-- v-bind:class语法
      一个对象，对象中的key表示要作用的CSS类名
      对象中的value要计算出布尔值。值为true，作用该类名，值为false，不作用该类名。 -->
        <!-- 如果用vant组件，外围会多个盒子包裹，而且这个盒子还有一些定位效果，如果用h5标签，不会多盒子。 -->
        <van-icon
          v-show="isEdit && !fixChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span slot="text" class="text" :class="{ active: index === active }">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <!-- /频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommandChannels"
        icon="plus"
        :key="index"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    //   传的属性是my-channels，接的时候竟然可以用myChannels
    myChannels: {
      // 因为传递过来的是数组，属于复杂数据类型。实际传递过来的时引用地址
      // 所以，可以修改数组里的值
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fixChannels: [0] // 不能删除模块，有可能会设置多个。
    }
  },
  computed: {
    ...mapState(['user']),
    recommandChannels () {
      // 方法一 const channels = []
      // this.allChannels.forEach((channel) => {
      //   //遍历我的频道有没有跟channel相同的
      //   const ret = this.myChannels.find((myChannel) => {
      //     return myChannel.id === channel.id;
      //   })
      //   //如果组件中不包括改频道项，手机到推荐列表中。
      //   if(!ret) {
      //     channels.push(channel)
      //   }
      // })
      // //把最终结果返回
      // return channels
      // 方法2
      // filter方法，遍历一个数组，把符合条件的元素添加到新数组中（根据返回的布尔值确定是否添加）
      return this.allChannels.filter((channel) => {
        return !this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id
        })
      })
    }
  },
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
        // console.log(data);
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      // 数据持久化处理
      if (this.user) {
        // 已登录，数据请求接口放到线上
        try {
          await addUserChannel({
            id: channel.id, // 频道id
            seq: this.myChannels.length // 序号
          })
        } catch (err) {
          console.log('请求有误', err)
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },

    onMyChannelClick (channel, index) {
      // 编辑状态，执行删除频道
      if (this.isEdit) {
        // if (index == 0) {
        //   return;
        // }
        // 第二种思路
        if (this.fixChannels.includes(channel.id)) {
          return
        }
        if (index <= this.active) {
          // 激活状态的索引减1
          this.$emit('update-active', this.active - 1, true)
        }
        // splice方法第一个参数从哪删，第二个参数是删几个，不写第二个，意为着第一个参数之后的元素都没了。
        this.myChannels.splice(index, 1)
        // 4处理持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，执行求换状态
        this.$emit('update-active', index, false)
      }
    },
    // 方法定义在尾部，调用在前。
    async deleteChannel (channel) {
      try {
        if (this.user) {
        // 已登录，数据更新到线上
          await deleteUserChannel(channel.id)
        } else {
        // 未登录，将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 86px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    // .text {
    //     font-size: 28px;
    //     color: #222;
    //     margin-top: 0;
    //   }

    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      span.active {
        color: red;
      }
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .van-grid-item__icon-wrapper {
        // 取消定位
        position: unset;
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        //在调试工具里写的尺寸，需要转成设计稿的尺寸。
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 15px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
