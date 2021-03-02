<template>
  <div class="home-container">
    <van-nav-bar class="page-nav-bav" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="mini"
        round
        icon="search"
        to="/search"
      >
        搜索
      </van-button>
    </van-nav-bar>

    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 文章列表 -->
        <article-list ref="article-list" :channel="channel" />
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
    <!-- /频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
      :style="{ height: '100%' }"
      close-icon-position="top-left"
    >
      <channel-edit
        @update-active="onUpdateActive"
        :active="active"
        :my-channels="channels"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from "@/api/user";
import ArticleList from "./components/article-list";
import channelEdit from "./components/channel-edit";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage.js";

export default {
  name: "HomeIndex",
  components: {
    ArticleList,
    channelEdit,
  },
  data() {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false,
    };
  },
  created() {
    this.loadChannels();
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async loadChannels() {
      try {
        // const { data } = await getUserChannels();
        // this.channels = data.data.channels;
        let channels = [];

        if (this.uer) {
          const { data } = await getUserChannels();
          channels = data.data.channels;
        } else {
          // 未登录
          const localChannels = getItem("TOUTIAO_CHANNELS");
          if (localChannels) {
            // 有本地频道数据，则使用
            channels = localChannels;
          } else {
            // 没有本地频道数据，则请求获取默认推荐的频道列表
            const { data } = await getUserChannels();
            channels = data.data.channels;
          }

          this.channels = channels
        }
      } catch (err) {
        this.$toast("获取列表失败");
      }
    },
    onUpdateActive(index, isChennelEditShow = true) {
      this.active = index;
      this.isChannelEditShow = isChennelEditShow;
    },
  },
};
</script>

<style lang='less' scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
  }
  .van-icon {
    color: #fff;
    font-size: 32px;
  }
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
    }
    .van-tab {
      min-width: 200px;
      font-size: 30px;
      color: #777;
      border-right: 1px solid #edeff3;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
      bottom: 8px;
    }
    .placeholder {
      flex-shrink: 0; //此元素不参与flex的
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &::before {
        content: "";
        position: absolute;
        left: 0;
        width: 3px;
        height: 100%;
        background-image: url("~@/assets/gradient-gray-line.png");
        background-size: contain;
      }
    }
  }
}
</style>


