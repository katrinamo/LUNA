/*
Title: logout.ts
Author: Sydney Norman
Date: 11/7/2017

Purpose: This code asks the user for their username and password in order to be able to jump to the main application.

*/

import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers } from '@angular/http';
import { Md5 } from 'ts-md5/dist/md5';
import { CreateAccountPage } from '../createAccount/createAccount';
//This will eventually be changed to our calendar!!!
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-logout',
    templateUrl: 'logout.html',
})
export class LogoutPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private http: Http, private storage: Storage) {
    }

    public Logout() {
	this.storage.clear();
 	this.navCtrl.setRoot(LoginPage);
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
