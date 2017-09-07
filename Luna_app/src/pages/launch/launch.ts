/*
Title: launch.ts
Author: Ionic 3 Calendar and additions by Dillon Pulliam
    Info on the Ionic 3 Calendar can be found at the following: https://market.ionic.io/themes/ioniccalendar
Date: 7/19/2017

Purpose: This code allows initialization/launching of the calendar feature. 

Additions that still need to be made: The calendar needs it's event markers to indicate the beginning and ending dates of a cycle but this feature hasn't
been added yet.

Input:

Output:
    Calendar:
        A calendar is output to the screen in month format.
        A feature that hasn't been added yet but will be is event markers to the calendar that indicate when the user's cycle will begin and end.

    Success:
        Calendar is output to the screen.

    Failure:
        Calendar is not created successfully.
*/

//imports used for initialization
import { Component } from '@angular/core'
import { NavController, NavParams, AlertController } from 'ionic-angular';

@Component({
    templateUrl: 'launch.html', 
})
export class Launch {

    constructor(private nav: NavController, public navParams: NavParams, private alertCtrl: AlertController) {

    }
}
