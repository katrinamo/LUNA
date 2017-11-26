/*
Title: login.ts
Author: Sydney Norman
Date: 11/7/2017

Purpose: This code asks the user for their username and password in order to be able to jump to the main application.

Input:
    username: Hashed and compared to the hashed version of the username stored in local storage when the original login page was accessed
    password: Hashed and compared to the hashed version of the password stored in local storage when the original login page was accessed

Output:
    Success:
        Username and password hashed versions match those stored in database.

    Failure:
        Error message sent to the user that the hashed version of username or password didn't match and the settings page is not accessed.
*/

import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers } from '@angular/http';
import { Md5 } from 'ts-md5/dist/md5';
import { CreateAccountPage } from '../createAccount/createAccount';
import { TabsPage } from '../tabs/tabs';
import { OnBoardingPage } from '../onBoarding/onBoarding';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private http: Http, private storage: Storage) {
    }

    public Login() {
	// lines below grab the username and password from the form.
	var username = (<HTMLInputElement>document.getElementsByName("username")[1]).value;
	var password = (<HTMLInputElement>document.getElementsByName("password")[1]).value;

	console.log(username);
	console.log(password);

	//Hash the username and password input by the user.
	var usernameHash = Md5.hashStr(username);
	var passwordHash = Md5.hashStr(password);	

	console.log(usernameHash);
	console.log(passwordHash);

	// http get requests. Gets the username and password you entered. Returns a json object with a message "User successfully logged in"
        // goes to the ReportPage is everything is okay.
        var url = "http://myluna.org/api/v1/login.php?username=" + usernameHash + "&pass=" + passwordHash;
        // this line sends to the url above
        var response;
        this.http.get(url).map((response) => {

                var Obj = response.json();
                if (Obj.error == false && Obj.message != undefined) {
                        this.storage.set('usernameHash', usernameHash);
			this.storage.set('passwordHash', passwordHash);
			this.storage.set('uid', Obj.uid);

			this.customalert("Login Successful", "Success");

			// Checks to see if user has already entered onBoarding information
			if (Obj.onboard_status == 1) {
				// Add Onboarding Data to Local Storage
				this.storage.set('birthday', Obj.birthday);
				this.storage.set('cycleLength', Obj.cycleLength);
				this.storage.set('periodLength', Obj.periodLength);
				this.storage.set('birthControl', Obj.birthControlType);
				this.storage.set('lastPeriod', Obj.lastPeriod);
				this.storage.set('status', Obj.status);
				this.storage.set('time', Obj.time);
				this.storage.set('pregnant', Obj.pregnant);
				this.storage.set('reproductiveDisorder', Obj.reproductiveDisorder);
				this.navCtrl.setRoot(TabsPage); // go to tabs page
			}
			else {
				// User hasn't entered onboarding info yet, redirect
                        	this.navCtrl.setRoot(OnBoardingPage); // go to onboarding page
			}
                }
                else if (Obj.message != undefined) {
                	this.customalert(Obj.message, "Error");
		}
		else {
			this.customalert("Unknown error occurred.", "Error");
		}

            }).subscribe();

    }

    public GoToCreateAccount() {
	this.navCtrl.setRoot(CreateAccountPage);
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
