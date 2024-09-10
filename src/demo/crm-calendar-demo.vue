<template>
    <div style="width:350px">
        <crm-calendar nextIsChoosed :changeDateCallBack="changeDateCallBack" :extendInfoParams="extendInfoParams"
            :dateStatus="dateStatus" dateStatusField="daily_status" dateDotName="评论点赞" dateDotField="upvote_flag">
        </crm-calendar>
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
            extendInfoParams: { "creator_flag": "1" },
            dateStatus: [{ name: "草稿", value: '1', color: '#6c59e5' }, { name: "已提交", value: '2', color: '#1ac52c' }, { name: "未提交", value: '3', color: 'red' }]
        }
    },
    methods: {
        changeDateCallBack(e, ext) {
            console.log(e, ext)
        }
    }
}
</script>
