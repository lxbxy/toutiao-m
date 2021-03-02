<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- onCancel 取消事件 -->
    <form class="search-from" action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText" />

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />

    <!-- 搜索历史记录 -->
    <search-history
      v-else
      :SearchHistories="SearchHistories"
      @clear-search-histiries="SearchHistories = []"
      @search="onSearch"
    />
  </div>
</template>

<script>
import SearchHistory from "./components/search-history";
import SearchResult from "./components/search-result";
import SearchSuggestion from "./components/search-suggestion";
import {setItem,getItem} from '@/utils/storage'
export default {
  name: "SearchIndex",
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion,
  },
  data() {
    return {
      searchText: "",
      isResultShow: false,
      SearchHistories: getItem('TOUTIAO_SEARCH_HISTORIES')||[],
    };
  },
  watch: {
    SearchHistories(value) {
      setItem('TOUTIAO_SEARCH_HISTORIES',value)
    },
  },
  created() {},
  computed: {},
  methods: {
    onSearch(val) {
      // 更新文本框内容
      this.searchText = val;

      // 储存搜索历史记录
      //要求  不要有重复的历史记录 最新的排在最前面
      const index = this.SearchHistories.indexOf(val);

      if (index !== -1) {
        this.SearchHistories.splice(index, 1);
      }
      this.SearchHistories.unshift(val);

      //渲染搜索结果
      this.isResultShow = true;
    },
    onCancel() {
      this.$router.back();
    },
  },
};
</script>

<style lang='less' scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-from {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1;
  }
}
</style>