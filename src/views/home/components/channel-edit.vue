<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        size="mini"
        round
        type="danger"
        plain
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>

    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        :text="channel.name"
        @click="onMyChanelClick(channel, index)"
      >
        <van-icon
          v-show="isEdit && !fiexdChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span slot="text" :class="{ active: index === active }" class="text">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title">频道推荐</div>
    </van-cell>

    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        icon="plus"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  AddUserChannels,
  deleteUserChannels,
} from "@/api/channel";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage.js";

export default {
  name: "channel-edit",
  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      allChannels: [], // 所有频道
      isEdit: false, //控制编辑状态的显示
      fiexdChannels: [0], //固定频道不允许删除
    };
  },
  created() {
    this.loadAllChannels();
  },
  computed: {
    // // 简化计算属性recommendChannles的计算
    recommendChannels() {
      //   // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中并返回
      return this.allChannels.filter((channel) => {
        //     // const channels = []

        //     // 数组的 find 方法：遍历数组，把符合条件的第1个元素返回
        return !this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id;
        });

        //     // return channels
      });
    },
    ...mapState(["user"]),
    // recommendChannels() {
    //   const channels = [];
    //   this.allChannels.forEach((channel) => {
    //     //遍历所有频道，如果不在我的频道中，就放入空数组channels
    //     // find 遍历数组，找到满足条件的元素项
    //     const ret = this.myChannels.find((myChannel) => {
    //       //在我的频道中查找是否有此频道
    //       return myChannel.id === channel.id;
    //     });
    //     // 如果不存在，放入空数组
    //     if (!ret) {
    //       channels.push(channel);
    //     }
    //   });
    //   // 把计算结果返回
    //   return channels;
    // },
  },
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels();
        this.allChannels = data.data.channels;
        // console.log(this.allChannels);
      } catch (err) {
        this.$toast("获取频道列表失败");
      }
    },
    async onAddChannel(channel) {
      this.myChannels.push(channel);
      //数据持久化
      if (this.user) {
        try {
          // 已登录s
          await AddUserChannels({
            id: channel.id, // 频道 id
            seq: this.myChannels.length, // 频道的 序号s
          });
          this.$toast("保存成功");
        } catch (err) {
          this.$toast("保存失败,请稍后重试");
        }
      } else {
        // 未登录
        setItem("TOUTIAO_CHANNELS", this.myChannels);
      }
    },
    onMyChanelClick(channel, index) {
      //如果是固定频道则不删除
      if (this.isEdit) {
        //删除频道项
        this.myChannels.splice(index, 1);

        if (this.fiexdChannels.includes(channel.id)) {
          return;
        }
        //编辑状态 执行删除频道
        //参数1 要删除的元素索引
        //参数2 要删除额元素个数
        if (index <= this.active) {
          // 让激活频道的索引 -1
          this.$emit("update-active", this.active - 1, true);
        }

        // 4.处理持久化
        this.deleteChannel(channel);
      } else {
        // 非编辑状态 执行切换频道
        this.$emit("update-active", index, false);
      }
    },
    async deleteChannel(channel) {
      try {
        if (this.user) {
          // 已登录 数据存到线上
          await deleteUserChannels(channel.id);
        } else {
          // 未登录 数据存到本地
          setItem("TOUTIAO_CHANNELS", this.myChannels);
        }
      } catch (err) {
        this.$toast("操作失败,请稍后重试");
      }
    },
  },
};
</script>

<style lang='less' scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/.grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__icon-wrapper {
        position: unset;
      }
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
    }
  }
  /deep/.my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/.recommend-grid {
    .van-grid-item__content {
      flex-direction: row;
      .van-icon-plus {
        font-size: 28px;
        margin-right: 6px;
      }
    }
  }
}
</style>