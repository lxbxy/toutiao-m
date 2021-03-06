<template>
  <!-- 只有在可视范围内 才会检查滚动位置触发 onload -->
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :error="error"
    error-text="加载失败,请点击重试"
    :immediate-check="false"
  >
    <!-- <van-cell
      v-for="(item, index) in list"
      :key="index"
      :title="item.content"
    /> -->
    <comment-item
      v-for="(item, index) in list"
      :comment="item"
      :key="index"
      @reply-click="$emit('reply-click', $event)"
    />
  </van-list>
</template>

<script>
import { getComments } from "@/api/comment";
import CommentItem from "./comment-item";
export default {
  name: "CommentList",
  components: {
    CommentItem,
  },
  props: {
    source: {
      type: [Number, String, Object],
      requrired: true,
    },
    list: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      //自定义[rop数据验证
      validator(value) {
        return ["a", "c"].includes(value);
      },
      default: "a",
    },
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, //获取下一页数据的标记
      limit: 10,
      error: false,
    };
  },
  created() {
    this.loading = true;
    this.onLoad();
  },
  computed: {},
  methods: {
    async onLoad() {
      try {
        // 1 请求获取数据
        const { data } = await getComments({
          type: this.type, //评论类型
          source: this.source.toString(), // 源id
          offset: this.offset, // 获取
          limit: this.limit,
        });
        // console.log(data);

        // 2 将数据添加到列表中
        const { results } = data.data;
        this.list.push(...results);

        // 3 将loading设置为false
        this.loading = false;

        // 把文章评论的总数量传递到外部
        this.$emit("onload-success", data.data);

        // 4 判断是否还有数据
        if (results.length) {
          //  有的话更新获取下一页的数据页码
          this.offset = data.data.last_id;
        } else {
          // 没有的话就将finied 设置结束
          this.finished = true;
        }
      } catch (err) {
        this.error = true;
        this.loading = false;
      }
    },
  },
};
</script>

<style lang='less' scoped>
</style>