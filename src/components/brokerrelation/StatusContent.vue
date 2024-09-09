<template>
 <div class="state-block" :style="'padding-top:'+StatusText.paddingTop+';'">
    <img :src="StatusText.imgurl" alt="" class="inline-block" width="64px" height="38px" />
    <div class="fn-font-12 mg-t-5" style="color: #999;">{{StatusText.title}}</div>
    <slot name="downbtn"></slot>
 </div>
</template>

<script>
  export default {
    name: 'StatusContent',
    props: {
      StatusText: {
        paddingTop: {
          type: String,
          default: 'auto'
        },
        imgurl: {
          type: String,
          default: require('../../common/styles/images/empty.png')
        },
        title: {
          type: String,
          default: ''
        },
        des: {
          type: String,
          default: ''
        },
        textWidth: {
          type: String,
          default: ''
        }
      }
    },
    data() {
      return {
      };
    },
    methods: {
    }
  };
</script>

<style scoped lang="scss">
.state-block {
  text-align: center;
}
</style>
