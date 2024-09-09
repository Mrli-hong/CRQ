<template>
    <div class="small-calendar">
        <!-- 日历头部 -->
        <Calendar ref="calendarRef" v-model="dateValue" size="small" @on-click="clickCalendarDay">
            <template #header="{ }">
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
                <div class="date-cell">
                    <span class="date-cell-solar">{{ data.isToday || data.date.getDate() }}</span>
                </div>
            </template>
        </Calendar>
        <!-- 日历尾部 -->
    </div>
</template>
<script>
import Calendar from './calendar.vue'

export default {
    name: "CrmCalendar",
    components: {
        Calendar
    },
    computed: {
        year() {
            return this.dateValue.getFullYear();
        },
        month() {
            return this.dateValue.getMonth() + 1;
        },
    },
    data() {
        return {
            dateValue: new Date(),
        }
    },
    methods: {
        clickCalendarDay(e) { console.log(e) }
    }
}
</script>

<style lang="scss" scoped>
.small-calendar {
    height: calc(100% - 38px);
    width: 100%;
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    align-content: space-between;

    .calendar-header {
        display: flex;
        align-items: center;
        width: 100%;
        border-bottom: 1px solid #f1f1f1;
        margin-bottom: 5px;

        .today-top {
            color: #495060;
            width: 26px;
            margin-right: 24px;
            cursor: pointer;
        }

        .calendar-change-date {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 248px;
            margin-right: 50px;

            .date-text {
                font-size: 12px;
                color: #495060;
                line-height: 32px;
            }

            i {
                cursor: pointer;
                color: #9ea7b4;
            }
        }
    }

    .submit-number-line-box {
        width: 100%;
        height: 36px;
    }

    .submit-number-line {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f4f8ff;
        border-radius: 4px;
        padding: 10px 13px;
        margin-top: 25px;

        .text-line {
            display: flex;
            color: #999;

            .submit-number {
                margin-left: 7px;
                color: #333;
            }

            .not-submit-number {
                margin: 0 7px;
                color: #ff4a4a;
            }
        }
    }

    .calendar-footer {
        width: 100%;
        margin-top: 55px;
        font-size: 14px;

        .date-state-wrap {
            margin-bottom: 70px;
        }

        .date-statistic-wrap {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;

            .statistic-info {
                color: #2c68ff;
                padding: 4px 12px;
                border: 1px solid #2c68ff;
                border-radius: 4px;

                .statistic-info-btn {
                    cursor: pointer;
                }

                i {
                    font-size: 14px;
                }

                span {
                    display: inline-block;
                    font-size: 12px;
                    line-height: 14px;
                }
            }
        }

        .date-state {
            color: #999;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-top: 7px;

            .box {
                width: 8px;
                height: 8px;
                border-radius: 1px;
                margin-right: 12px;
            }

            .draft,
            .underling {
                background: #77a4e2;
            }

            .submit {
                background: #1ac52c;
            }

            .not-submit {
                background: #ff4a4a;
            }

            .like-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin: 2px 12px 0 0;
                background: #ff991d;
            }

            .export {
                display: flex;
                color: #2c68ff;
                cursor: pointer;

                .export-icon {
                    width: 16px;
                    height: 16px;
                    background-size: 100%;
                    background-image: url(/hswealth-mkm/img/export.52f5c65b.png);
                    background-position: 50%;
                    background-repeat: no-repeat;
                    margin: 1px 5px 0;
                }
            }
        }
    }

    ::v-deep .crm-calendar-table {
        .crm-calendar-day {
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;

            &-is-selected {
                background-color: #fff;

                .small-calendar-date {
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    background-color: #ff4a4a;
                    color: #fff;
                }

                .is-today {
                    color: #fff;
                    background-color: #ff4a4a;
                }

                .is-submit-class {
                    color: #fff;
                    background-color: #1ac52c;
                }

                .is-draft-class,
                .is-partial-submission-class {
                    color: #fff;
                    background-color: #77a4e2;
                }

                .is-not-submit-class {
                    color: #fff;
                    background-color: #ff4a4a;
                }

                .is-disabled-date-class {
                    background-color: #f7f7f7;
                    color: #c3cbd6;
                }
            }

            &:hover {
                background-color: #fff;
                cursor: pointer;
            }

            &-is-disabled {
                background-color: #fff;
            }
        }

        tr
    }

    .small-calendar-date {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        &:hover {
            cursor: pointer;
        }

        .is-today {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            color: #ff4a4a;
        }

        .is-submit-class {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            color: #1ac52c;
        }

        .is-draft-class,
        .is-partial-submission-class {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            color: #77a4e2;
        }

        .is-not-submit-class {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            color: #ff4a4a;
        }

        .is-disabled-date-class {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            background-color: #f7f7f7;
            color: #c3cbd6;
            cursor: not-allowed;

            &:hover {
                cursor: not-allowed;
            }
        }

        .is-review-like-dot {
            position: absolute;
            right: 0;
            top: 0;
            width: 6px;
            height: 6px;
            background: #ff991d;
            border-radius: 4px;
        }
    }
}
</style>