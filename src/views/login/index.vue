<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bav" title="登录">
      <van-icon slot="left" name="cross" @click="$router.back()"></van-icon>
    </van-nav-bar>

    <!-- 登陆表单 -->
    <van-form @submit="onSubmit" ref="LoginFrom">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFromRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFromRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <!-- #button 是solt='button'的缩写 -->
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            class="send-sms-btn"
            native-type="button"
            round
            size="small"
            type="default"
            @click="onSendSms"
            v-else
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-warp">
        <van-button class="login-btn" block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from "@/api/user";
export default {
  name: "index",
  data() {
    return {
      //表单数据对象
      user: {
        mobile: "15225409411",
        code: "246810",
      },
      //表单验证规则对象
      userFromRules: {
        mobile: [
          { required: true, message: "手机号不能为空" },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: "手机号格式错误" },
        ],
        code: [
          { required: true, message: "验证码不能为空" },
          { pattern: /^\d{6}$/, message: "验证码格式错误" },
        ],
      },
      //是否展示倒计时
      isCountDownShow: false,
    };
  },
  created() {},
  methods: {
    async onSubmit() {
      // 1 获取表单数据
      const user = this.user;
      // 2 表单验证
      this.$toast.loading({
        message: "登录中...",
        forbidClick: true, //禁用背景点击
        duration: 0, //持续时间  为0时持续展示
      });
      // 3 提交表单请求登录
      try {
        const { data } = await login(user);
        this.$store.commit("setUser", data.data);
        this.$toast.success("登陆成功");

        // 登陆成功跳转回原来的页面
        this.$router.back();
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail("手机号或验证码错误");
        } else {
          this.$toast.fail("登录失败，请稍后重试");
        }
      }
      // 4 根据响应结果进行后续操作
    },
    async onSendSms() {
      // 1.校验手机号
      try {
        await this.$refs.LoginFrom.validate("mobile"); //调用validate手动校验
      } catch (err) {
        return console.log("验证失败", err);
      }
      // 2. 验证通过 显示倒计时
      this.isCountDownShow = true;
      // 3. 发送验证码
      try {
        await sendSms(this.user.mobile);
        this.$toast.success("发送成功");
      } catch (err) {
        this.isCountDownShow = false;
        if (err.response.status === 429) {
          this.$toast.fail("发送频繁,稍后重试");
        } else {
          this.$toast.fail("发送失败,稍后重试");
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  .page-nav-bav {
    background-color: #3296fa;
    .van-nav-bar__title,
    .van-icon {
      color: #fff;
    }
  }
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152;
    height: 46px;
    line-height: 40px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-warp {
    margin: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
