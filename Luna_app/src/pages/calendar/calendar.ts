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

import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import {Slides} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import {CalendarService} from './calendar.service';
import { Http, Headers } from '@angular/http';

import moment from 'moment';

const NUM_OF_DAYS = 7;


@Component({
  selector: 'calendar',
  templateUrl: 'calendar.html'
})
export class CalendarComponent {
  //Spinner declaration and boolean
    isLoading: boolean=true;
    loading;

  @ViewChild('mySlider') slider: Slides;
  public weekNames:Array<String>;
  public selectedDate:any;
  public today:any;
  public events:Array<any> = [];
  public months:Array<any> = [];
  constructor(public navCtrl: NavController, private calendarService:CalendarService, private storage: Storage, public loadingCtrl: LoadingController, private alertCtrl: AlertController, private http: Http) {
    this.weekNames = ['S','M', 'T', 'W', 'T', 'F', 'S'];
    this.today = moment();
    console.log("Tristan Calendar Page loading...");
        this.storage.get('uid').then((data) => {
            console.log(data);
            var uid = data;
            var form_object = {  // this is the form object sent to the server.
                    uid: uid,
            }
            console.log(uid);
            this.get_statistics(form_object);
        });
  }

  setTimeToZero(dateLocal) {
    return dateLocal.day(0).hour(0).minute(0).second(0).millisecond(0);
  }

  createWeek(forDateObj) {
    let weekDays = [],count = 0;
    while(count < NUM_OF_DAYS) {
      weekDays.push(forDateObj);
      forDateObj = forDateObj.clone();
      forDateObj.add(1, 'd');
      count++;
    }
    return weekDays;
  }

  createMonth(monthObj,forMonthObj) {
    monthObj.weeks = [];
    let month = forMonthObj.clone(),done=true;

    while(done) {
      monthObj.weeks.push({ days: this.createWeek(month.clone()) });
      monthObj.weeks.push({});
      month.add(1, 'w');
      if(month.month() !== monthObj.selectedMonth.month()) {
        done=false;
      }
    }
  }

  initPrev(month){
    let monthObj = {};
    monthObj['selectedMonth'] = month;
    this.initMonth(monthObj);
    this.months.unshift(monthObj);
    this.months.pop();
  }

  initMonth(monthObj) {
    monthObj.selectedDate = monthObj.selectedMonth.clone();
    monthObj.current = monthObj.selectedDate.clone();
    let startMonth = monthObj.selectedDate.clone();
    startMonth.date(1);
    this.setTimeToZero(startMonth.day(0));
    this.createMonth(monthObj,startMonth);
    this.events = this.calendarService.getEvents(this.selectedDate);
  }

  init(month){
    let monthObj = {};
    monthObj['selectedMonth'] = month;
    this.initMonth(monthObj);
    this.months.push(monthObj);
  }



  ngOnInit() {


    let currentMonth = moment();
    let prevMonth = currentMonth.clone().month(currentMonth.month() - 1);
    let nextMonth = currentMonth.clone().month(currentMonth.month() + 1);

    this.init(prevMonth);
    this.init(currentMonth);
    this.init(nextMonth);
    this.selectedDate = moment();
  }

  select(monthObj,day,rowIndex) {
    if(day.isSame(monthObj.selectedDate) && monthObj.selectedRowIndex !== -1){
      monthObj.selectedRowIndex = -1;
    } else {
      monthObj.selectedRowIndex = rowIndex;
    }
    monthObj.selectedDate = day;
    this.selectedDate = day;
    //CalendarService.getEvents(day); //Use this to fetch events for the selected day
  }

  handleSlideView() {
    let activeIndex = this.slider.getActiveIndex();
    let activeMonth = this.months[activeIndex].selectedMonth;
    this.selectedDate = activeMonth;
    let nextMonth = activeMonth.clone().month(activeMonth.month() + 1);
    let prevMonth = activeMonth.clone().month(activeMonth.month() - 1);
    if(activeIndex === 0) {
      this.initPrev(prevMonth);
      this.slider.slideTo(1, 0, false);
    } else if(activeIndex === (this.months.length - 1)) {
      this.init(nextMonth);
      this.months.shift();
      this.slider.slideTo(this.months.length - 2, 0, false);
    }
  }

  onSlideChanged() {
    this.handleSlideView();
  }

           // get_statistics
    // send HTTP post request to the server to get statistics for the current user.
    // preconditions:
    //   none.
    // input:
    //   a form object with uid.
    // output:
    //   success: obj.error field set false by server
    //     user statistics successfully returned.
    //   failure: obj.error field set to true by server
    //     alert to user, ask to report questions.
    public get_statistics(statistics_data) {
        this.presentLoadingCustom();
        // Server daily questions handler url (addDaily.php)
        var url = "http://myluna.org/api/v1/getUserStats.php"
        console.log("in get statistics")
        

        this.http.get(url, {params:statistics_data}).map((response) => {
                this.dismissLoadingCustom()
                var Obj = response.json();
                console.log(Obj.error);
                console.log(Obj.message);
                if (Obj.error == false) {
                        // get request success
                        console.log("get statistics success");
                        this.storage.set('cycle_length', Obj.average_cycle_length);
                        this.storage.set('period_length', Obj.average_period_length);
                        console.log(response);
                        return true;
                } else {
                        // get request failed
                        console.log("get statistics failure: " + Obj.message);
                        return false;
                }
        }).subscribe();

    }   // end post_period

      // presentLoadingCustom()
    // Display a custom spinner to indicate that the app is communicating with the server.
    // preconditions:
    //   none.
    // input:
    //   none.
    // output:
    //   none.
    // postconditions:
    //   the 'loading' datamember will be set to a new loading control, and will display on the screen with a 10 second timeout.
    presentLoadingCustom() {
      this.isLoading=true;
      this.loading = this.loadingCtrl.create({
        spinner: 'ios',
        content: `
          <div class="custom-spinner-container">
            <div class="custom-spinner-box">Loading...</div>
          </div>`
       });

       setTimeout(() => {
            if (this.isLoading == true) {
                this.isLoading=false;
                this.loading.dismiss();
                this.customalert('Please ensure you have an internet connection and try again.', 'Timeout: Could not connect to server');
            }
       }, 10000);

       this.loading.present();

    } //end presentLoadingCustom

      // dismissLoadingCustom()
    // Dismiss the custom spinner to indicate that the app is no longer communicating with the server.
    // preconditions:
    //   'loading' datamember should be set to a loading control.
    // input:
    //   none.
    // output:
    //   none.
    // postconditions:
    //   the 'loading' datamember will be dismissed.
    dismissLoadingCustom() {
        this.loading.dismiss();
        this.isLoading=false;
    }

    // a custom alert for ionic 2. 
    public customalert(s: string, t: string) {
        console.log("alert: " + s);
        let alert = this.alertCtrl.create({
            title: t,
            subTitle: s,
            buttons: ['OK']
        });
        alert.present(alert);
    }

}
