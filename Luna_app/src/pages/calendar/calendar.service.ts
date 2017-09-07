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


@Injectable()
export class CalendarService {
  constructor() {
    console.log('CalendarService');
  }

  getEvents(day) {
    let events = [
      /* The following can be used to add events to the bottom of the calendar for specific days.
        {
        name: 'Plan for weekend'
      },
      {
        name:'Book Tickets for Movie'
      },
      {
        name:'Meeting at 4 pm'
      },
      {
        name:'Dinner Party '
      }
      */
    ]

    return events;
  }
}
