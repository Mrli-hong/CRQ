<template>
    <div :class="prefixCls">
        <div :class="[prefixCls + '-header']">
            <slot name="header" :date="i18nDate">
                <div :class="[prefixCls + '-title']">{{ i18nDate }}</div>
                <div v-if="validatedRange.length === 0" :class="[prefixCls + '-button-group']">
                    <h-button-group>
                        <h-button size="small" @click="selectDate('prev-month')">
                            上一月
                        </h-button>
                        <h-button size="small" @click="selectDate('today')">
                            今天
                        </h-button>
                        <h-button size="small" @click="selectDate('next-month')">
                            下一月
                        </h-button>
                    </h-button-group>
                </div>
            </slot>
        </div>

        <div v-show="showDateTable">
            <div v-if="validatedRange.length === 0" :class="[prefixCls + '-body']">
                <date-table :date="date" :selected-day="realSelectedDay" :disabled-date="disabledDate"
                    :not-change-select-date="notChangeSelectDate" @pick="pickDay" :size="size">
                    <template #date-cell="data">
                        <slot name="date-cell" v-bind="data"></slot>
                    </template>
                </date-table>
            </div>
            <div v-else :class="[prefixCls + '-body']">
                <date-table v-for="(range_, index) in validatedRange" :key="index" :date="range_[0]"
                    :selected-day="realSelectedDay" :disabled-date="disabledDate" :range="range_"
                    :hide-header="index !== 0" @pick="pickDay" :size="size">
                    <template #date-cell="data">
                        <slot name="date-cell" v-bind="data"></slot>
                    </template>
                </date-table>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from "dayjs";
import DateTable from "./dateTable.vue";

// const prefixCls = "crm-calendar";
const lang = "zh-cn";
const now = dayjs().locale(lang);

export default {
    name: "Calendar",

    components: {
        DateTable,
    },

    props: {
        value: [Date, String, Number],
        size: [String],
        showDateTable: {
            type: Boolean,
            default: true,
        },
        disabledDate: {
            type: Function,
        },
        range: {
            type: Array,
            validator(range) {
                if (Array.isArray(range)) {
                    return (
                        range.length === 2 &&
                        range.every(
                            (item) =>
                                typeof item === "string" ||
                                typeof item === "number" ||
                                item instanceof Date
                        )
                    );
                } else {
                    return true;
                }
            },
        },
    },

    data() {
        return {
            selectedDay: "",
            notChangeSelectDate: false,
            prefixCls: "crm-calendar",
            // now: new Date()
        };
    },

    computed: {
        // if range is valid, we get a two-digit array
        validatedRange() {
            if (!this.range) return [];
            const rangeArrDayjs = this.range.map((_) => dayjs(_).locale(lang));
            const [startDayjs, endDayjs] = rangeArrDayjs;
            if (startDayjs.isAfter(endDayjs)) {
                console.warn("end time should be greater than start time");
                return [];
            }
            if (startDayjs.isSame(endDayjs, "month")) {
                // same month
                return this.calculateValidatedDateRange(startDayjs, endDayjs);
            } else {
                // two months
                if (startDayjs.add(1, "month").month() !== endDayjs.month()) {
                    console.warn(
                        "start time and end time interval must not exceed two months"
                    );
                    return [];
                }
                return this.calculateValidatedDateRange(startDayjs, endDayjs);
            }
        },

        date() {
            if (!this.value) {
                return (
                    this.realSelectedDay ||
                    (this.validatedRange.value ? this.validatedRange[0][0] : now)
                );
            } else {
                return dayjs(this.value).locale(lang);
            }
        },

        i18nDate() {
            return `${this.date.year()} 年 ${this.date.format("M")} 月`;
        },

        realSelectedDay: {
            get() {
                if (!this.value) return this.selectedDay;
                return this.date;
            },
            set(val) {
                if (!val) return;
                this.selectedDay = val;
                const date = new Date(val);
                this.$emit("input", date);
            },
        },

        prevMonthDayjs() {
            return this.date.subtract(1, "month").date(1);
        },

        nextMonthDayjs() {
            return this.date.add(1, "month").date(1);
        },

        prevYearDayjs() {
            return this.date.subtract(1, "year").date(1);
        },

        nextYearDayjs() {
            return this.date.add(1, "year").date(1);
        },
    },

    methods: {
        pickDay(day, notChangeSelectDate = false, isFromSelectDate = false) {
            const disabledDateFn =
                typeof this.disabledDate === "function" && this.disabledDate;
            const isDisabled = disabledDateFn && disabledDateFn(day.$d || day);
            if (!isDisabled || isFromSelectDate) {
                if (notChangeSelectDate) {
                    this.notChangeSelectDate = true;
                } else {
                    this.notChangeSelectDate = false;
                    this.$emit("on-click", day);
                }
                this.realSelectedDay = day;
            }
        },

        selectDate(type, notChangeSelectDate = false) {
            const dateMap = {
                "prev-month": this.prevMonthDayjs,
                "next-month": this.nextMonthDayjs,
                "prev-year": this.prevYearDayjs,
                "next-year": this.nextYearDayjs,
                today: now,
            };

            const day = dateMap[type];

            if (!day.isSame(this.date, "day")) {
                if (notChangeSelectDate) {
                    this.pickDay(day, true, true);
                } else {
                    this.pickDay(day, false, true);
                }
            }
        },

        calculateValidatedDateRange(startDayjs, endDayjs) {
            const firstDay = startDayjs.startOf("week");
            const lastDay = endDayjs.endOf("week");
            const firstMonth = firstDay.get("month");
            const lastMonth = lastDay.get("month");

            // Current mouth
            if (firstMonth === lastMonth) {
                return [[firstDay, lastDay]];
            }
            // Two adjacent months
            else if ((firstMonth + 1) % 12 === lastMonth) {
                return this.adjacentMonth(firstDay, lastDay);
            }
            // Three consecutive months (compatible: 2021-01-30 to 2021-02-28)
            else if (
                firstMonth + 2 === lastMonth ||
                (firstMonth + 1) % 11 === lastMonth
            ) {
                return this.threeConsecutiveMonth(firstDay, lastDay);
            }
            // Other cases
            else {
                console.warn(
                    "start time and end time interval must not exceed two months"
                );
                return [];
            }
        },

        adjacentMonth(start, end) {
            const firstMonthLastDay = start.endOf("month");
            const lastMonthFirstDay = end.startOf("month");

            // Whether the last day of the first month and the first day of the last month is in the same week
            const isSameWeek = firstMonthLastDay.isSame(lastMonthFirstDay, "week");
            const lastMonthStartDay = isSameWeek
                ? lastMonthFirstDay.add(1, "week")
                : lastMonthFirstDay;

            return [
                [start, firstMonthLastDay],
                [lastMonthStartDay.startOf("week"), end],
            ];
        },

        threeConsecutiveMonth(start, end) {
            const firstMonthLastDay = start.endOf("month");
            const secondMonthFirstDay = start.add(1, "month").startOf("month");

            // Whether the last day of the first month and the second month is in the same week
            const secondMonthStartDay = firstMonthLastDay.isSame(
                secondMonthFirstDay,
                "week"
            )
                ? secondMonthFirstDay.add(1, "week")
                : secondMonthFirstDay;

            const secondMonthLastDay = secondMonthStartDay.endOf("month");
            const lastMonthFirstDay = end.startOf("month");

            // Whether the last day of the second month and the last day of the last month is in the same week
            const lastMonthStartDay = secondMonthLastDay.isSame(
                lastMonthFirstDay,
                "week"
            )
                ? lastMonthFirstDay.add(1, "week")
                : lastMonthFirstDay;

            return [
                [start, firstMonthLastDay],
                [secondMonthStartDay.startOf("week"), secondMonthLastDay],
                [lastMonthStartDay.startOf("week"), end],
            ];
        },
    },
};
</script>

<style lang="scss" scoped>
$calendar-prefix: 'crm-calendar';

.#{$calendar-prefix} {
    background-color: transparent;

    .#{$calendar-prefix}-header {
        display: flex;
        justify-content: space-between;
    }

    .#{$calendar-prefix}-title {
        color: #333;
        align-self: center;
    }

    .#{$calendar-prefix}-body {
        padding: 5px 0;
    }

    ::v-deep .#{$calendar-prefix}-table {
        table-layout: fixed;
        width: 100%;

        thead th {
            padding: 4px 0;
            color: #606266;
            font-weight: normal;
            border: none;
        }

        &:not(.is-range) {

            td.prev,
            td.next {
                color: #999999;
            }
        }

        td {
            border-bottom: 1px solid #ebeef5;
            border-right: 1px solid #ebeef5;
            vertical-align: top;
        }

        tr:first-child td {
            border-top: 1px solid #ecf5ff;
        }

        tr td:first-child {
            border-left: 1px solid #ecf5ff;
        }

        .#{$calendar-prefix}-day {
            box-sizing: border-box;
            padding: 8px;
            height: 100px;

            &:hover {
                background-color: #ecf5ff;
            }
        }

        .date-cell {
            display: flex;
            justify-content: space-between;
        }

        .date-cell-lunar {
            color: #999999;
        }

        .#{$calendar-prefix}-day-is-selected {
            background-color: #ecf5ff;
        }

        .#{$calendar-prefix}-day-is-disabled {
            background-color: #f7f7f7;
            color: #c3cbd6;
            cursor: not-allowed;

            &:hover {
                .#{$calendar-prefix}-day:hover {
                    background-color: #f7f7f7;
                }
            }
        }

        .#{$calendar-prefix}-day-is-today .date-cell-solar {
            background-color: #2c68ff;
            text-align: center;
            border-radius: 3px;
            width: 22px;
            height: 22px;
            line-height: 22px;
            color: #fff !important;
        }
    }
}
</style>
