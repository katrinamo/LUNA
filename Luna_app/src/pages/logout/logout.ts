/*
Title: logout.ts
Author: Sydney Norman
Date: 11/7/2017

Purpose: This code asks the user if they would like to logout.

*/

import { Component } from '@angular/core';
import { App, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-logout',
    templateUrl: 'logout.html',
})
export class LogoutPage {

    constructor(public appCtrl: App, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private storage: Storage) {
    }

    public Logout() {
	this.storage.clear();
    //this.navCtrl.parent.goToRoot();
    this.appCtrl.getRootNav().setRoot(LoginPage);
 	console.log("Logout Successful");
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
