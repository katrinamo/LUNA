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
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
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

    //spinner variables. true when displaying.
    loading;
    isLoading: boolean=true;

    constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private http: Http, private storage: Storage, public loadingCtrl: LoadingController) {
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
        this.presentLoadingCustom();
        this.http.get(url).map((response) => {
                this.dismissLoadingCustom();
                var Obj = response.json();
                console.log(response.json());
                console.log('last period start date ' + Obj.lastPeriodStartDate);
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
                this.storage.set('period_start_date', Obj.lastPeriodStartDate);
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
}
