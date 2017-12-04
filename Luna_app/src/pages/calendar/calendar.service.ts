/*
Title: calendar.service.ts
Author: Provided by the purchased Ionic 3 Calendar feature
    Info on the Ionic 3 Calendar can be found at the following: https://market.ionic.io/themes/ioniccalendar
Date: 7/19/2017

Purpose: Code creates the calendar events and markers within the calendar.
This piece of code is called by the calendar.ts file

Additions that still need to be made: The calendar needs it's event markers to indicate the beginning and ending dates of a cycle but this feature
hasn't been added yet.

Input:
    None

Output:
    Calendar:
        A calendar is output to the screen in month format.
        A feature that hasn't been added yet but will be is event markers to the calendar that indicate when the user's cycle will begin and end.
*/

import {Injectable} from '@angular/core';
import { Http, Headers } from '@angular/http';


@Injectable()
export class CalendarService {
  eventsArray = [];
  constructor(private http: Http) {
    console.log('CalendarService');
  }

  getEvents(day, uid) {
    if (day != undefined) {
      let dayString = day.format('YYYY-MM-DD');
      console.log('Selected date: ' + dayString);
      console.log('Uid: ' + uid);
      var form_object = {  // this  is the form object sent to the server.
                            uid: uid,
                            selected_date: dayString
                        };
      let something = this.get_entry(form_object);
      console.log(something);
      return this.eventsArray;
    }
      return [];
  }


  // get_entry
    // get daily entry for a user for a specified date.
    // a period for this uid
    // preconditions:
    //   user has entered in a daily question that they were on their period, and then they entered that they were not.
    // input:
    //   a form object with mens_start, mens_end, and uid
    // output:
    //   success: obj.error field set false by server
    //     period added to Period table.
    //   failure: obj.error field set to true by server
    //     alert to user, ask to report questions.
    public get_entry(entry_data) {
        // Server daily questions handler url (returnDailyEntry.php)
        var url = "http://myluna.org/api/v1/returnDailyEntry.php"
        console.log("in get entry")
        

        this.http.get(url, {params:entry_data}).map((response) => {
                var Obj = response.json();
                console.log(Obj.error);
                console.log(Obj.message);
                if (Obj.error == false) {
                        // get request success
                        console.log("get entry success");
                        console.log(response);
                        //change period start date back to null, it's been recorded.
                        this.eventsArray = [
                        { name: 'Sexual interest: '+ Obj.sexualInterest},
                        { name: 'Sexual attitude: '+ Obj.sexualAttitude},
                        { name: 'Sexual arousal: '+Obj.sexualArousal},
                        { name: 'Kissing activity: '+Obj.kissingActivity},
                        { name: 'Caressing activity: '+Obj.caressingActivity},
                        { name: 'Fondling activity: '+Obj.fondlingActivity},
                        { name: 'Masturbation activity: '+Obj.masturbationActivity},
                        { name: 'Oral Activity: '+Obj.oralActivity},
                        { name: 'Anal Activity: '+Obj.analActivity},
                        { name: 'Vaginal Activity: '+Obj.vaginalActivity},
                        { name: 'No Activity: '+Obj.noActivity},
                        { name: 'Other Activity: '+Obj.otherActivity},
                        { name: 'Intensity: '+Obj.intensity}
                        ]
                        console.log(this.eventsArray);
                        return true;
                } else {
                        // get request failed
                        console.log("get entry failure: " + Obj.message);
                        this.eventsArray=[];
                        return false;
                }
        }).subscribe();

    }   // end post_period
}
