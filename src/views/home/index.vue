<template>
 <div class="home-container">
     <van-nav-bar class="page-nav-bav">
         <van-button 
         class="search-btn"
         slot="title" 
         type="info"
         size="mini"
         round
         icon="search">
         搜索
         </van-button>
     </van-nav-bar>
 </div>
</template>

<script>
export default {
 name: 'HomeIndex',
 data () {
  return {

  };
 },
created(){},
 methods: {}
}
</script>

<style lang='less' scoped>
.home-container {
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
}
</style>