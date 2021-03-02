<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestion"
      :key="index"
      @click="$emit('search',text)"
    >
     <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
    <!-- 使用v-html指令可以绑定渲染带有 HTML 标签的字符串 -->
  </div>
</template>

<script>
import { getSearchSuggestion } from "@/api/search.js";

//按需加载 只会把使用到的成员进行加载
import { debounce } from "lodash";
export default {
  name: "SearchSuggestion",
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      suggestion: [], // 联想建议数据列表
    };
  },
  watch: {
    searchText: {
      //当searchText发生变化 就会调用handler函数
      //   handler(value) {
      //     this.loadSearchSuggestion(value);
      //   },

      //debounce 函数
      // 参数1 一个函数
      // 参数2 延迟时间 单位毫秒
      // 返回值 防抖之后的函数
      handler: debounce(function (value) {
        this.loadSearchSuggestion(value);
      }, 200), // 该回调将会在侦听开始之后被立即调用
      immediate: true,
    },
  },
  created() {},
  computed: {},
  methods: {
    async loadSearchSuggestion(q) {
      try {
        const { data } = await getSearchSuggestion(q);
        this.suggestion = data.data.options;
      } catch (err) {
        this.$toast("获取数据失败,请稍后重试");
      }
    },
    highlight(text) {
      const highlightStr = `<span class="active" red">${this.searchText}</span>`;
      // 正则表达式 中间的内容都会当作匹配字符来使用 而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式 则手动 new RegExp
      // RegExp 正则表达式构造函数
      // 参数1： 匹配模式字符串 它会根据这个字符串创建正则对象
      const reg = new RegExp(this.searchText, "gi");
      return text.replace(reg, highlightStr);
    },
  },
  components: {},
};
</script>

<style lang='less' scoped>
.search-suggestion {
  /deep/span.active {
    color: deeppink ;
  }
}
</style>