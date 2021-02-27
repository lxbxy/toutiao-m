<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1000"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
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
import { getArticle } from "@/api/article";
import ArticleItem from "../../../components/article-item";
export default {
  name: "ArticleList",
  components: {
    ArticleItem,
  },
  props: {
    //接收父组件传递过来的数据channel
    channel: {
      type: Object,
      required: true, //这个数据是必须的
    },
  },
  data() {
    return {
      list: [], //存储列表数据
      loading: false, //控制加载中 loading 状态
      finished: false, //控制数据加载结束状态
      timestamp: null, //请求获取下一页的时间戳
      error: false, //控制失败的提示状态
      isreFreshLoading: false, //控制下拉的刷新状态
      refreshSuccessText: "刷新成功", // 下拉刷新提示文本
    };
  },
  methods: {
    //初始化或滚动到底部之后会触发 onLoad 事件
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data } = await getArticle({
          channel_id: this.channel.id, //频道ID
          //请求第一页数据 当前最新时间戳
          timestamp: this.timestamp || Date.now(),
          with_top: 1,
        });

        //模拟随机失败的情况
        //  if(Math.random()>0.5) {
        //      JSON.parse('dfsfsdfds')
        //  }

        const { results } = data.data;
        //把请求到的数据放到list数组中
        this.list.push(...results);

        // 3. 数据加载结束之后的状态
        this.loading = false;
        // 判断数据是否全部加载完成
        if (results.length) {
          this.timestamp = data.data.pre_timestamp;
        } else {
          this.finished = true;
        }
      } catch (err) {
        //   展示错误提示状态
        this.error = true;

        //请求失败了 loading 也需要关闭
        this.loading = false;
      }
    },

    //下拉刷新触发该函数
    async onRefresh() {
      try {
        // 请求获取数据
        const { data } = await getArticle({
          channel_id: this.channel.id, //频道ID
          //请求第一页数据 当前最新时间戳
          timestamp: Date.now(),
          with_top: 1,
        });

        //模拟随机失败的情况
        //  if(Math.random()>0.2) {
        //      JSON.parse('dfsfsdfds')
        //  }

        // 将数据追加到列表顶部
        const { results } = data.data;
        this.list.unshift(...results);

        // 关闭下拉刷新的 loading 状态
        this.isreFreshLoading = false;
        this.refreshSuccessText = `刷新成功,更新了${results.length}条数据`;
      } catch (err) {
        this.isreFreshLoading = false;
        this.refreshSuccessText = "刷新失败";
      }
    },
  },
  computed: {},
  watch: {},
  created() {},
};
</script>

<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>