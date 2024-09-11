<template>
    <div class="small-calendar">
        <!-- 日历头部 -->
        <Calendar ref="calendarRef" v-model="dateValue" size="small" :disabledDate="disabledDate"
            @on-click="clickCalendarDay">
            <template #header="{}">
                <div class="calendar-header">
                    <div class="today-top" @click="selectDate('today')">
                        今天
                    </div>
                    <div class="calendar-change-date">
                        <div>
                            <h-icon name="arrow-l" title="上一年" :size="10" @on-click="selectDate('prev-year')"></h-icon>
                            <h-icon name="return" title="上一个月" :size="10" @on-click="selectDate('prev-month')"></h-icon>
                        </div>
                        <span class="date-text">{{ year }} 年 {{ month }} 月</span>
                        <div>
                            <h-icon name="enter" title="下一个月" :size="10" @on-click="selectDate('next-month')"></h-icon>
                            <h-icon name="arrow-r" title="下一年" :size="10" @on-click="selectDate('next-year')"></h-icon>
                        </div>
                    </div>
                </div>
            </template>

            <template #date-cell="{ data }">
                <div class="small-calendar-date" :class="getDateClass(data)" :style="getDateStyle(data)">
                    <div :class="getReviewLikeClass(data)"></div>
                    <div v-if="data.isToday"></div>
                    {{ data.isToday || data.date.getDate() }}
                </div>
            </template>
        </Calendar>

        <!-- 插槽 -->
        <slot></slot>

        <!-- 日历尾部 -->
        <div v-if="footerContentList.length" class="calendar-footer">
            <div class="calendar-footer-item" :key="index" v-for="(item, index) in footerContentList ">
                <div :class="{ rec: !item.isCircle, cir: item.isCircle }" :style="{ backgroundColor: item.color }">
                </div>
                <span class="calendar-footer-item-text"> {{ item.name }}</span>
            </div>
        </div>
    </div>
</template>
<script>
import Calendar from './calendar.vue'
import moment from 'moment'
import api from '../../common/api/index'

export default {
    name: "CrmCalendar",
    props: {
        value: {
            type: Date,
            default: () => new Date()
        },
        // 引入引擎的dataSourceMap
        dataSourceMap: {
            type: Object,
            default: () => { },
        },
        // 未来日期是否可选择
        nextIsChoosed: {
            type: Boolean,
            default: false
        },
        // 切换选中日期回调
        changeDateCallBack: {
            type: Function,
        },
        // 是否包含扩展信息
        isContainExtendInfo: {
            type: Boolean,
            default: false
        },
        // 日期扩展信息查询接口额外参数
        extendInfoParams: {
            type: Object,
            default: () => { }
        },
        // 日期扩展信息查询接口
        extendSearchInterface: {
            type: String,
            default: ''
        },
        // 日期状态字段
        dateStatusField: {
            type: String,
            default: ''
        },
        // 日期状态
        dateStatus: {
            type: Array,
            default: () => []
        },
        // 日期角标字段
        dateDotField: {
            type: String,
            default: ''
        },
        // 日期角标名称
        dateDotName: {
            type: String,
            default: ''
        },
    },
    components: {
        Calendar
    },
    watch: {
        value: {
            handler(val) {
                this.dateValue = val || new Date()
            },
            immediate: true
        }
    },
    computed: {
        year() {
            return this.dateValue.getFullYear();
        },
        month() {
            return this.dateValue.getMonth() + 1;
        },
        footerContentList() {
            const res = []
            this.dateStatus.forEach(item => {
                res.push({ name: item.name, color: item.color })
            })
            if (this.dateDotField) {
                res.push({ name: this.dateDotName, color: '#ff991d', isCircle: true })
            }
            return res
        }
    },
    data() {
        return {
            clickDate: new Date(),
            dateValue: new Date(),
            // 日期颜色映射
            dateStateMap: {},
            // 日期角标状态映射
            dateDotStateMap: {},
            // 日期额外参数映射
            dateExtendInfo: {}
        }
    },
    created() {
        this.getCalendarData()
    },
    methods: {
        // 禁用日期
        disabledDate(date) {
            if (this.nextIsChoosed) {
                return false
            }
            let myDate = new Date();
            let now = myDate.valueOf();
            let time = new Date(date).valueOf();
            if (now < time) {
                return true;
            } else {
                return false;
            }
        },
        // 获取本月日期
        getMonthDays(date) {
            const temp = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            const days = temp.getDate();
            return this.rangeArr(days).map((_, index) => index + 1);
        },

        rangeArr(n) {
            return Array.apply(null, { length: n }).map((_, n) => n);
        },
        // 获取当前日历点击时间范围
        getCurrentMonthRange(clickDate) {
            let days = [];
            const date = clickDate || this.dateValue;
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const currentMonthDays = this.getMonthDays(date).map((day) => ({
                year: year,
                month: month,
                text: day,
            }));

            days = currentMonthDays;

            let currentMonthRange = {
                currentMonthFirstDay: days[0],
                currentMonthLastDay: days[days.length - 1],
            };

            return currentMonthRange;
        },
        getDateStyle(date) {
            const d = moment(date.date).format("YYYYMMDD");
            if (date.isSelected) {

                // 选中的时候有状态
                return {
                    color: '#fff',
                    backgroundColor: this.dateStateMap[d] || '#2c68ff'
                }

            }
            return {
                color: this.dateStateMap[d]
            }
        },
        // 格式化年月日
        parseDate(y, m, d, format = "") {
            let mm = m < 10 ? "0" + m : "" + m;
            let dd = d < 10 ? "0" + d : "" + d;
            let str = `${y}${format}${mm}${format}${dd}`;
            return str;
        },
        resetData() {
            this.dateStateMap = {}
            this.dateDotStateMap = {}
            this.dateExtendInfo = {}
        },
        // 获取日期状态
        getCalendarData(clickDate) {
            this.resetData();
            let currentMonthRange = this.getCurrentMonthRange(clickDate);
            const firstDay = currentMonthRange.currentMonthFirstDay;
            const lastDay = currentMonthRange.currentMonthLastDay;

            let beginDate = this.parseDate(
                firstDay.year,
                firstDay.month,
                firstDay.text
            );
            let endDate = this.parseDate(lastDay.year, lastDay.month, lastDay.text);

            let formatEndDate = this.parseDate(
                lastDay.year,
                lastDay.month,
                lastDay.text,
                "-"
            );

            if (!this.nextIsChoosed) {
                let endDateIsOverToday = this.isOverToday(formatEndDate);

                let curDate = new Date();
                let year = curDate.getFullYear();
                let month = curDate.getMonth() + 1;
                let day = curDate.getDate();

                if (endDateIsOverToday) {
                    endDate = this.parseDate(year, month, day);
                }
            }

            let params = {
                start_date: beginDate,
                end_date: endDate,

            }

            params = Object.assign(params, this.extendInfoParams)

            return this.dataSourceMap && this.dataSourceMap[this.extendSearchInterface].load(params).then(res => {
                const rows = res.data.rows
                rows.forEach(row => {
                    const dateStatusFieldValue = row[this.dateStatusField]
                    const color = this.dateStatus.find(item => item.value === dateStatusFieldValue)?.color || '#333'

                    const dateDotFieldValue = row[this.dateDotField]

                    this.$set(this.dateExtendInfo, row.daily_date, row)
                    this.$set(this.dateDotStateMap, row.daily_date, dateDotFieldValue)
                    this.$set(this.dateStateMap, row.daily_date, color)
                });
            }).catch((e) => {
                this.$hMessage.error(e?.error_info || '系统异常，请联系管理员！')
            })

            // return api.post(
            //     'g/hswealth.mkm/v/getDailyReportCalenderInner',
            //     params
            // )
            //     .then((res) => {
            //         // console.log(res)
            //         const rows = res.data.rows
            //         rows.forEach(row => {
            //             const dateStatusFieldValue = row[this.dateStatusField]
            //             const color = this.dateStatus.find(item => item.value === dateStatusFieldValue)?.color || '#333'

            //             const dateDotFieldValue = row[this.dateDotField]

            //             this.$set(this.dateExtendInfo, row.daily_date, row)
            //             this.$set(this.dateDotStateMap, row.daily_date, dateDotFieldValue)
            //             this.$set(this.dateStateMap, row.daily_date, color)
            //         });
            //     })
            //     .catch((e) => {
            //         this.$hMessage.error(e?.error_info || '系统异常，请联系管理员！')
            //     })
        },

        // 点击切换日期
        selectDate(val, torRquest = true) {
            // event && event.stopPropagation();
            if (!val) return;
            let calendarRefValue = this.$refs.calendarRef;
            if (val === "today") {
                calendarRefValue.selectDate(val, false);
            } else {
                calendarRefValue.selectDate(val, true);
            }
            this.getCalendarData()

        },
        // 日期是否大于当前日期
        isOverToday(date) {
            let todayDate = new Date();
            let Now = todayDate.valueOf();
            let time = new Date(date).valueOf();
            if (Now < time) {
                return true;
            } else {
                return false;
            }
        },

        // 获取点赞评论小点样式
        getReviewLikeClass(date) {
            const d = moment(date.date).format("YYYYMMDD");
            let classStr = "";
            if (this.dateDotStateMap[d] === '1') {
                classStr = classStr + "is-review-like-dot ";
            }
            return classStr;
        },

        // 左侧日历对应状态样式添加
        getDateClass(date) {
            const d = moment(date.date).format("YYYYMMDD");
            let classStr = "";
            if (date.isToday) {
                classStr = "is-today ";
            }
            if (!this.nextIsChoosed) {
                let curIsOverToday = this.isOverToday(date.date);
                if (curIsOverToday) {
                    classStr = classStr + "is-disabled-date-class ";
                }
            }
            return classStr;
        },
        isSameYearMonth(date1, date2) {
            return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
        },
        clickCalendarDay(day) {
            // 未来日期不可点击
            if (!this.nextIsChoosed) {
                let curIsOverToday = this.isOverToday(day.$d || day);
                if (curIsOverToday) return;
            }

            this.clickDate = day.$d || day;
            const d = moment(day.$d).format("YYYYMMDD");

            // 是否产生翻页效果，如果翻页先获取翻页后的日期信息，点击时候日期的value没有改变先抛出点击事件之后在改变所以dateValue，clickDate不等
            if (!this.isSameYearMonth(this.clickDate, this.dateValue)) {
                this.getCalendarData(this.clickDate).then(() => {
                    // 点击调用回调函数传递额外参数和当前值
                    const extInfo = this.dateExtendInfo[d] || {}
                    this.changeDateCallBack && this.changeDateCallBack(d, extInfo)
                    this.$emit("input", this.clickDate);
                })
            } else {
                const extInfo = this.dateExtendInfo[d] || {}
                this.changeDateCallBack && this.changeDateCallBack(d, extInfo)
                this.$emit("input", this.clickDate);
            }



        }
    }
}
</script>

<style lang="scss" scoped>
$primary-color: #495060;
$border-color: #f1f1f1;
$highlight-color: #ff4a4a;
$submit-color: #1ac52c;
$draft-color: #77a4e2;
$disabled-color: #c3cbd6;
$bg-color: #f7f7f7;
$link-color: #2c68ff;

.small-calendar {
    .small-calendar-date {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 4px;

        .is-review-like-dot {
            position: absolute;
            right: 0;
            top: 0;
            width: 6px;
            height: 6px;
            background: #ff991d;
            border-radius: 4px;
        }

        &.is-disabled-date-class {
            background-color: #f7f7f7;
            color: #c3cbd6;
            cursor: not-allowed;
        }
    }

    .calendar-header {
        width: 100%;
        display: flex;
        border-bottom: 1px solid #f1f1f1;
        margin-bottom: 5px;
        align-items: center;
        justify-content: center;

        .today-top {
            display: flex;
            flex: 1;
            color: #495060;
            width: 26px;
            margin-left: 10px;
            cursor: pointer
        }

        .calendar-change-date {
            display: flex;
            flex: 4;
            align-items: center;
            justify-content: space-between;
            margin-right: 20px;

            .date-text {
                font-size: 12px;
                color: #495060;
                line-height: 32px
            }

            i {
                cursor: pointer;
                color: #9ea7b4;
            }
        }
    }

    ::v-deep .crm-calendar-table {
        .crm-calendar-day {
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;

            &:hover {
                background-color: #fff;
                cursor: pointer;
            }
        }

        th {
            padding: 5px 0;
            background: none;
            text-align: center;
            color: $disabled-color;
        }

        td {
            padding: 0;
            border: none;
        }

        tr:first-child td,
        tr td:first-child {
            border: none;
        }
    }

    .calendar-footer {
        padding-left: 5px;

        .calendar-footer-item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 8px;

            .calendar-footer-item-text {
                color: #999;
                font-size: 14px;
            }

            .rec {
                width: 8px;
                height: 8px;
                border-radius: 1px;
                margin-right: 12px;
            }

            .cir {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 12px;
            }
        }
    }
}
</style>