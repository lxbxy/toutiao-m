<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from "@/api/search";
export default {
  name: "SearchResult",
  props: {
    searchText: {
      type: String,
      requires: true,
    },
  },

  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false,
    };
  },
  created() {},
  computed: {},
  methods: {
    async onLoad() {
      try {
        //  1 请求获取数据
        const { data } = await getSearchResult({
          page: this.page, //页码
          per_page: this.perPage, // 每页大小
          q: this.searchText, // 搜索关键词
        });
        //  2 将数据添加到数组列表中
        const { results } = data.data;
        this.list.push(...results);

        //  3 将本次加载中的loading关闭
        this.loading = false;

        // 4判断数据是否加载完毕
        if (results.length) {
          // 若果没有加载完毕 更新获取下一页的数据
          this.page++;
        } else {
          // 如果加载完毕 将加载状态设置为true
          this.finished = true;
        }
      } catch (err) {
        this.error = true;
        this.loading = true;
      }
    },
  },
  components: {},
};
</script>

<style lang='less' scoped>
</style>