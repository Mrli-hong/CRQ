<template>
  <div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <div>啦啦啦啦</div>
    <CommentFooter
      :value="value"
      @handleSubmit="handleSubmit"
    ></CommentFooter>
  </div>
</template>

<script>
import { CommentFooter } from "@/components";
export default {
  components: {
    CommentFooter,
  },
  data() {
    return {
      value: "",
    };
  },
  methods: {
    handleSubmit(value) {
      console.log("点击提交", value);
    //   this.value = ''
      console.log('this.value', this.value)
    },
  },
};
</script>

<style scoped></style>
