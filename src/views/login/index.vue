<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <!-- slot表明这是要放到哪个插槽的内容，van-icon表明插槽的内容 -->
      <van-icon name="cross" slot="left" @click="$router.back()" />
    </van-nav-bar>
    <!-- form表单 -->
    <!-- 表单验证：
        1给van-field 组件配置 rules 验证规则
          参考文档：https://youzan.github.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
        2当表单提交的时候会自动触发表单验证
           如果验证通过，会触发 submit 事件
           如果验证失败，不会触发 submit -->
    <van-form ref="loginForm" @submit="onSubmit">
      <!-- van-field实际上是个输入框 -->
      <!--type和maxlength实际是给input表单做设置，因为vant也是给组件做封装 -->
      <van-field
        v-model="user.mobile"
        name="mobile"
        maxlength="11"
        type="number"
        :rules="userFormRules.mobile"
        placeholder="请输入手机号"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        type="number"
        name="code"
        maxlength="6"
        :rules="userFormRules.code"
        placeholder="请输入验证码"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <!-- time倒计时时间 -->
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            native-type="button"
            class="send-sms-btn"
            round
            size="small"
            type="default"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user.js'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            // 验证规则可以很多
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false // 是否展示倒计时
    }
  },
  methods: {
    async onSubmit () {
      // 获取表单数据
      const user = this.user
      // 表单验证
      // 必须通过this.$toast.loading来调用Toast.loading
      this.$toast.loading({
        message: '登录中',
        forbidClick: true, // 执行轻提示时，禁用背景点击
        duration: 0 //
      })
      // 提交表单请求
      try {
        const { data } = await login(user)
        console.log('登录成功', data)
        this.$store.commit('setUser', data.data)
        this.$toast.success('成功文案')
        // 不严谨
        this.$router.back()
      } catch (err) {
        // console.log(err.response);
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
    },
    async onSendSms () {
      console.log('onSendSms')
      // 1. 校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
        console.log('验证成功')
        // 不想嵌套写代码，把后面程序写在try catch后面。但要保证catch有return。
      } catch (err) {
        return console.log('验证失败', err)
        // 因为在try里只想有一行代码，验证通过后的程序想写在try  catch后面，不想在里面嵌套。
        // 所以在这里放了个return，如果验证失败，卸载后面的代码不执行。
      }

      // 2. 验证通过，显示倒计时
      this.isCountDownShow = true
      // 3. 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        console.log(err)
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 158px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
