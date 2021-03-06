<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <input type="file" hidden ref="file" @change="onFileChange" />

    <!-- 个人信息 -->
    <van-cell
      title="头像"
      is-link
      class="photo-cell"
      center
      @click="$refs.file.click()"
    >
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      @click="isUpdateNameShow = true"
      :value="user.name"
      is-link
    ></van-cell>
    <van-cell
      title="性别"
      @click="isUpdateGenderShow = true"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
    ></van-cell>
    <van-cell
      @click="isUpdateBirthDayShow = true"
      title="生日"
      :value="user.birthday"
      is-link
    ></van-cell>

    <!-- 编辑昵称弹框 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%"
      position="bottom"
    >
      <update-name
        v-model="user.name"
        @close="isUpdateNameShow = false"
      ></update-name>
    </van-popup>

    <!-- 编辑性别弹框 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <update-gender
        v-if="isUpdateGenderShow"
        @close="isUpdateGenderShow = false"
        v-model="user.gender"
      ></update-gender>
    </van-popup>

    <!-- 编辑生日弹框 -->
    <van-popup v-model="isUpdateBirthDayShow" position="bottom">
      <update-birthday
        v-if="isUpdateBirthDayShow"
        v-model="user.birthday"
        @close="isUpdateBirthDayShow = false"
      ></update-birthday>
    </van-popup>

    <!-- 编辑头像弹框 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height: 100%"
    >
      <update-photo
        v-if="isUpdatePhotoShow"
        @close="isUpdatePhotoShow = false"
        :img="img"
        @update-photo="user.photo = $event"
      ></update-photo>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import UpdateName from "./components/update-name";
import UpdateGender from "./components/update-gender";
import UpdateBirthday from "./components/update-birthday";
import UpdatePhoto from "./components/update-photo";
export default {
  name: "UserProfile",
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto,
  },
  data() {
    return {
      user: {},
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthDayShow: false,
      isUpdatePhotoShow: false,
      img: null, //预览图片
    };
  },
  created() {
    this.loadUserProfile();
  },
  computed: {},
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile();
        this.user = data.data;
      } catch (err) {
        this.$toast("获取信息失败");
      }
    },
    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0];
      //基于文件对象获取blob数据
      this.img = window.URL.createObjectURL(file);
      //展示预览图片弹出层
      this.isUpdatePhotoShow = true;

      // 如果选了同一个文件chang事件不会被触发
      this.$refs.file.value = "";
    },
  },
};
</script>

<style lang='less' scoped>
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }

  .photo-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
  }
}
</style>