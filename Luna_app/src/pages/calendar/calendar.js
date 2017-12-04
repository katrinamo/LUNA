/*
Title: calendar.ts
Author: Provided by the purchased Ionic 3 Calendar feature
    Info on the Ionic 3 Calendar can be found at the following: https://market.ionic.io/themes/ioniccalendar
Date: 7/19/2017

Purpose: Code creates the calendar used within the app. Called by launch.ts file to make the calendar.

Additions that still need to be made: The calendar needs it's event markers to indicate the beginning and ending dates of a cycle but this feature
hasn't been added yet.

Input:
    None

Output:
    Calendar:
        A calendar is output to the screen in month format.
        A feature that hasn't been added yet but will be is event markers to the calendar that indicate when the user's cycle will begin and end.
*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CalendarService } from './calendar.service';
import moment from 'moment';
var NUM_OF_DAYS = 7;
var CalendarComponent = (function () {
    function CalendarComponent(navCtrl, calendarService, storage) {
        this.navCtrl = navCtrl;
        this.calendarService = calendarService;
        this.storage = storage;
        this.events = [];
        this.months = [];
        this.weekNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        this.today = moment();
    }
    CalendarComponent.prototype.setTimeToZero = function (dateLocal) {
        return dateLocal.day(0).hour(0).minute(0).second(0).millisecond(0);
    };
    CalendarComponent.prototype.createWeek = function (forDateObj) {
        var weekDays = [], count = 0;
        while (count < NUM_OF_DAYS) {
            weekDays.push(forDateObj);
            forDateObj = forDateObj.clone();
            forDateObj.add(1, 'd');
            count++;
        }
        return weekDays;
    };
    CalendarComponent.prototype.createMonth = function (monthObj, forMonthObj) {
        monthObj.weeks = [];
        var month = forMonthObj.clone(), done = true;
        while (done) {
            monthObj.weeks.push({ days: this.createWeek(month.clone()) });
            monthObj.weeks.push({});
            month.add(1, 'w');
            if (month.month() !== monthObj.selectedMonth.month()) {
                done = false;
            }
        }
    };
    CalendarComponent.prototype.initPrev = function (month) {
        var monthObj = {};
        monthObj['selectedMonth'] = month;
        this.initMonth(monthObj);
        this.months.unshift(monthObj);
        this.months.pop();
    };
    CalendarComponent.prototype.initMonth = function (monthObj) {
        monthObj.selectedDate = monthObj.selectedMonth.clone();
        monthObj.current = monthObj.selectedDate.clone();
        var startMonth = monthObj.selectedDate.clone();
        startMonth.date(1);
        this.setTimeToZero(startMonth.day(0));
        this.createMonth(monthObj, startMonth);
        this.events = this.calendarService.getEvents(this.selectedDate);
    };
    CalendarComponent.prototype.init = function (month) {
        var monthObj = {};
        monthObj['selectedMonth'] = month;
        this.initMonth(monthObj);
        this.months.push(monthObj);
    };
    CalendarComponent.prototype.ngOnInit = function () {
        var currentMonth = moment();
        var prevMonth = currentMonth.clone().month(currentMonth.month() - 1);
        var nextMonth = currentMonth.clone().month(currentMonth.month() + 1);
        this.init(prevMonth);
        this.init(currentMonth);
        this.init(nextMonth);
        this.selectedDate = moment();
    };
    CalendarComponent.prototype.select = function (monthObj, day, rowIndex) {
        if (day.isSame(monthObj.selectedDate) && monthObj.selectedRowIndex !== -1) {
            monthObj.selectedRowIndex = -1;
        }
        else {
            monthObj.selectedRowIndex = rowIndex;
        }
        monthObj.selectedDate = day;
        this.selectedDate = day;
        this.events = this.calendarService.getEvents(this.selectedDate);
        console.log("got the events!");
    };
    CalendarComponent.prototype.handleSlideView = function () {
        var activeIndex = this.slider.getActiveIndex();
        var activeMonth = this.months[activeIndex].selectedMonth;
        this.selectedDate = activeMonth;
        var nextMonth = activeMonth.clone().month(activeMonth.month() + 1);
        var prevMonth = activeMonth.clone().month(activeMonth.month() - 1);
        if (activeIndex === 0) {
            this.initPrev(prevMonth);
            this.slider.slideTo(1, 0, false);
        }
        else if (activeIndex === (this.months.length - 1)) {
            this.init(nextMonth);
            this.months.shift();
            this.slider.slideTo(this.months.length - 2, 0, false);
        }
    };
    CalendarComponent.prototype.onSlideChanged = function () {
        this.handleSlideView();
    };
    return CalendarComponent;
}());
__decorate([
    ViewChild('mySlider'),
    __metadata("design:type", Slides)
], CalendarComponent.prototype, "slider", void 0);
CalendarComponent = __decorate([
    Component({
        selector: 'calendar',
        templateUrl: 'calendar.html'
    }),
    __metadata("design:paramtypes", [NavController, CalendarService, Storage])
], CalendarComponent);
export { CalendarComponent };
//# sourceMappingURL=calendar.js.map