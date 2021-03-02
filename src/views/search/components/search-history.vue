<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histiries')">完全删除</span>
        &nbsp;&nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in SearchHistories"
      :key="index"
      @click="onSearchItem(item, index)"
    >
      <van-icon v-if="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "SearchHistory",
  props: {
    //props 数据
    // 如果是普通数据 绝对不能修改
    // 即使改了也不会传到父组件
    // 如果是引用数据类型
    // 可以修改 例如[].push
    // 不能重新赋值
    SearchHistories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isDeleteShow: false,
    };
  },
  created() {},
  computed: {},
  methods: {
    onSearchItem(item, index) {
      if (this.isDeleteShow) {
        // 删除状态 删除历史记录数据
        this.SearchHistories.splice(index, 1);
      } else {
        //非删除状态  直接进入搜索
        this.$emit("search", item);
      }
    },
  },
};
</script>

<style lang='less' scoped>
</style>