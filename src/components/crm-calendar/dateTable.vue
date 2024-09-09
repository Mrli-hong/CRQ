<template>
    <div>
        <table :class="{ 'crm-calendar-table': true, 'is-range': isInRange }" cellspacing="0" cellpadding="0">
            <thead v-if="!hideHeader">
                <th v-for="day in weekDays" :key="day">{{ day }}</th>
            </thead>

            <tbody>
                <tr v-for="(row, index) in rows" :key="index" :class="{
            'crm-calendar-table__row': true,
            'crm-calendar-table__row__hide-border': index === 0 && hideHeader,
        }">
                    <td v-for="(cell, key) in row" :key="key" :class="getCellClass(cell)" @click="handlePickDay(cell)">
                        <div class="crm-calendar-day">
                            <slot name="date-cell" :data="getSlotData(cell)">
                                <div class="date-cell">
                                    <span class="date-cell-solar">{{ cell.isToday || cell.text }}</span>
                                    <span class="date-cell-lunar">{{ getLunarDate(cell) }}</span>
                                </div>
                            </slot>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import dayjs from "dayjs";
import { sloarToLunar } from "./sloarToLunar";
import localeData from "dayjs/plugin/localeData.js";

dayjs.extend(localeData);

const lang = "zh-cn";
const firstDayOfWeek = dayjs.localeData().firstDayOfWeek();
// const now = dayjs().locale(lang);
const rangeArr = function (n) {
    return Array.apply(null, { length: n }).map((_, n) => n);
};

export default {
    props: {
        selectedDay: [Object, String], // formated date yyyy-MM-dd
        disabledDate: {
            type: Function,
        },
        notChangeSelectDate: {
            type: Boolean,
            default: false,
        },
        size: [String],
        range: {
            type: Array,
        },
        date: [Date, Object],
        hideHeader: Boolean,
    },

    data() {
        return {
            WEEK_DAYS:
                this.size === "small"
                    ? ["日", "一", "二", "三", "四", "五", "六"]
                    : ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            now: dayjs().locale(lang),
            // now: new Date()
        };
    },

    methods: {
        getFormattedDate(day, type) {
            switch (type) {
                case "prev":
                    return this.date
                        .startOf("month")
                        .subtract(1, "month")
                        .date(day);
                case "next":
                    return this.date
                        .startOf("month")
                        .add(1, "month")
                        .date(day);
                case "current":
                    return this.date.date(day);
            }
        },

        getPrevMonthLastDays(date, count) {
            const lastDay = date
                .subtract(1, "month")
                .endOf("month")
                .date();
            return rangeArr(count).map((_, index) => lastDay - (count - index - 1));
        },

        getMonthDays(date) {
            const days = date.daysInMonth();
            return rangeArr(days).map((_, index) => index + 1);
        },

        toNestedArr(days) {
            return rangeArr(days.length / 7).map((index) => {
                const start = index * 7;
                return days.slice(start, start + 7);
            });
        },

        getCellClass({ text, type, disabled }) {
            const classes = [type];
            if (disabled) {
                classes.push("crm-calendar-day-is-disabled");
            }
            if (type === "current") {
                const date = this.getFormattedDate(text, type);
                if (date.isSame(this.selectedDay, "day") && !this.notChangeSelectDate) {
                    classes.push("crm-calendar-day-is-selected");
                }

                if (date.isSame(this.now, "day")) {
                    classes.push("crm-calendar-day-is-today");
                }
            }
            return classes;
        },

        handlePickDay({ text, type }) {
            const date = this.getFormattedDate(text, type);
            this.$emit("pick", date);
        },

        getSlotData(cell) {
            const day = this.getFormattedDate(cell.text, cell.type);
            if (day.isSame(this.now, "day")) {
                cell.isToday = "今";
            }

            return {
                isSelected: day.isSame(this.selectedDay) && !this.notChangeSelectDate,
                type: `${cell.type}-month`,
                day: day.format("YYYY-MM-DD"),
                date: day.toDate(),
                isToday: cell.isToday,
                cell: cell,
                lunar: this.getLunarDate(cell),
            };
        },

        getLunarDate(date) {
            // let lunarMonth = ''
            let lunarDate = sloarToLunar(date.year, date.month, date.text).lunarDay;
            if (lunarDate === "初一") {
                // lunarMonth = sloarToLunar(date.year, date.month, date.text).lunarMonth + '月'
                lunarDate =
                    sloarToLunar(date.year, date.month, date.text).lunarMonth + "月";
            }
            return `${lunarDate}`;
        },
    },

    computed: {
        isInRange() {
            return !!this.range && !!this.range.length;
        },

        rows() {
            let days = [];
            const month = this.date.month() + 1;
            const year = this.date.year();
            const disabledDateFn =
                typeof this.disabledDate === "function" && this.disabledDate;

            if (this.isInRange) {
                const [start, end] = this.range;
                const currentMonthRange = rangeArr(end.date() - start.date() + 1).map(
                    (index) => ({
                        date: 1,
                        text: start.date() + index,
                        disabled:
                            disabledDateFn &&
                            disabledDateFn(
                                this.getFormattedDate(start.date() + index, "current")
                            ),
                        type: "current",
                    })
                );

                let remaining = currentMonthRange.length % 7;
                remaining = remaining === 0 ? 0 : 7 - remaining;
                const nextMonthRange = rangeArr(remaining).map((_, index) => ({
                    date: 2,
                    text: index + 1,
                    disabled:
                        disabledDateFn &&
                        disabledDateFn(
                            this.date
                                .startOf("month")
                                .add(1, "month")
                                .date(index + 1)
                        ),
                    type: "next",
                }));
                days = currentMonthRange.concat(nextMonthRange);
            } else {
                const firstDay = this.date.startOf("month").day();
                const prevMonthDays = this.getPrevMonthLastDays(
                    this.date,
                    (firstDay - firstDayOfWeek + 7) % 7
                ).map((day) => ({
                    year: month - 1 === 0 ? year - 1 : year,
                    month: month - 1 === 0 ? 12 : month - 1,
                    text: day,
                    disabled:
                        disabledDateFn &&
                        disabledDateFn(
                            this.date
                                .startOf("month")
                                .subtract(1, "month")
                                .date(day)
                        ),
                    type: "prev",
                }));
                const currentMonthDays = this.getMonthDays(this.date).map((day) => ({
                    year: year,
                    month: month,
                    text: day,
                    disabled: disabledDateFn && disabledDateFn(this.date.date(day)),
                    type: "current",
                }));
                days = [...prevMonthDays, ...currentMonthDays];
                const remaining = 7 - (days.length % 7 || 7);
                const nextMonthDays = rangeArr(remaining).map((_, index) => ({
                    year: month + 1 > 12 ? year + 1 : year,
                    month: month + 1 > 12 ? 1 : month + 1,
                    text: index + 1,
                    disabled:
                        disabledDateFn &&
                        disabledDateFn(
                            this.date
                                .startOf("month")
                                .add(1, "month")
                                .date(index + 1)
                        ),
                    type: "next",
                }));
                days = days.concat(nextMonthDays);
            }
            return this.toNestedArr(days);
        },

        weekDays() {
            const start = firstDayOfWeek;

            if (start === 0) {
                return this.WEEK_DAYS;
            } else {
                return this.WEEK_DAYS.slice(start).concat(
                    this.WEEK_DAYS.slice(0, start)
                );
            }
        },
    },
};
</script>