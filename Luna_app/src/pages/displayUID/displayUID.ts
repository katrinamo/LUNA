/*
Title: displayUID.ts
Author: Dillon Pulliam
Date: 7/20/2017

Purpose: This code creates a button that can be pressed which will output the UID of the user to the screen.
This code is not actually used in the app but is a debugging feature where this page can replace calendar or some other page
if its suspected that the app is having issues storing and retreiving a users UID from local storage.

Input:
    None

Output:
    An alert to the user displaying their UID.

    Success:
        UID output to the screen when the button is pressed.

    Failure:
        UID is not output to the screen when the button is pressed.
*/

//imports needed for app initialization.
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-displayUID',
    templateUrl: 'displayUID.html',
})
export class DisplayUIDPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private storage: Storage) {

    }

    ShowVariables()
    {
        this.storage.get('uid').then((data) => {
            var uid = data;

            this.customalert(uid, 'Variables');
        });
    }

    // a custom alert I have made with ionic 2. 
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