<template>
    <div style="width:350px">
        <!-- <crm-calendar nextIsChoosed :changeDateCallBack="changeDateCallBack" :extendInfoParams="extendInfoParams"
            :dateStatus="dateStatus" dateStatusField="daily_status" dateDotName="评论点赞" dateDotField="upvote_flag">
        </crm-calendar> -->
        <button @click="handleClick">点击</button>
        <crm-calendar v-model="date"></crm-calendar>
    </div>
</template>
<script>
import CrmCalendar from '../components/crm-calendar/index.vue'

export default {
    name: "CrmCalendarDemo",
    components: {
        CrmCalendar
    },
    data() {
        return {
            date: new Date(),
            extendInfoParams: { "creator_flag": "1" },
            dateStatus: [{ name: "草稿", value: '1', color: '#6c59e5' }, { name: "已提交", value: '2', color: '#1ac52c' }, { name: "未提交", value: '3', color: 'red' }]
        }
    },
    methods: {
        changeDateCallBack(e, ext) {
            console.log(e, ext)
        },
        handleClick() {
            this.date = new Date(2018, 11, 24, 10, 33, 30, 0)
        }
    }
}
</script>
