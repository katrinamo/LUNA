﻿/*
Title: createAccount.ts
Author:  Dillon Pulliam
Date: 7/7/2017

Purpose: This code is for the initial create account screen that is only accessed the very first time the user accesses the app. This page will ask the user to enter their
random ID sent to their uky email to verify that they are a UK student. It will also ask the user to create a username and password which must be entered
in to change any app settings. The app will send all this data to the server and the server will send back a uid to store within the local storage component of
the app. Note that this page should only be accessed the very first time the user opens the app and is bypassed all other times.

Input:
    emailID: This is the random string sent to the user's UKY email address to verify they are a UK student.
    username: a random username created by the user. A hashed version is then sent to the server and stored in local storage
    password: a random password created by the user. A hashed version is then sent to the server and stored in local storage.

Output:
    Success:
        New user added to the database and hashed username and password are stored.
        Success message sent to the app along with a uid.
        App is then linked back to onBoarding questions page.

    Failure:
        Failure message sent to the app. This could either be that the server didn't recieve the data or that the user failed to fill out a necessary field for
        data to be sent.
*/

import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Md5 } from 'ts-md5/dist/md5'; 
import { OnBoardingPage } from '../onBoarding/onBoarding';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-createAccount',
    templateUrl: 'createAccount.html'
})
export class CreateAccountPage {

    //spinner variables. true when displaying.
    loading;
    isLoading: boolean=true;

    constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private http: Http, private storage: Storage, public loadingCtrl: LoadingController) {
        //alert("Please note: any information taken is for research purposes only.")
	this.storage.clear();

        this.customalert("Please note: any information taken is for research purposes only.", "Luna");

        //for debugging purposes
        //this.storage.set('uid', '');

        this.storage.get('uid').then((data) => {
            if ((data == '') || (data == undefined)) {
                //Do nothing as we want the createAccount page to execute for a first time user.
            }
            else {
                //This will be executed if a uid is already stored in local storage indicating that we do not have a first time user
                //Therefore we will skip the login and daily questions page and jump straight to our main page of the app.
                this.customalert("Please navigate to the tracker page (the middle tab) and fill out your responses to the daily questions.", "User Note");
                this.navCtrl.setRoot(TabsPage); // go to tracker page               
            }
        });

    }

    public CreateAccount() {
        // lines below grab the username and password from the form. 
        var username = (<HTMLInputElement>document.getElementsByName("username")[1]).value;
        var password = (<HTMLInputElement>document.getElementsByName("password")[1]).value;
        var emailID = (<HTMLInputElement>document.getElementsByName("emailID")[1]).value;

        //For debugging purposes
        console.log(username);
        console.log(password);
        console.log(emailID);

        //check to make sure data is entered in correctly to all fields.
        if ((username == ''
            && password == ''
            && emailID == '')
            || (username == undefined
            && password == undefined
            && emailID == undefined))
        {
            this.customalert("Please fill out the username, password, and random email ID fields", "Cannot Submit");
        }
        else if ((username == ''
            && password == '')
            || (username == undefined
            && password == undefined))
        {
            this.customalert("Please fill out the username and password fields", "Cannot Submit");
        }
        else if ((username == ''
            && emailID == '')
            || (username == undefined
                && emailID == undefined))
        {
            this.customalert("Please fill out the username and random email ID fields", "Cannot Submit");
        }
        else if ((password == ''
            && emailID == '')
            || (password == undefined
                && emailID == undefined))
        {
            this.customalert("Please fill out the password and random email ID fields", "Cannot Submit");
        }
        else if ((password == '')
            || (password == undefined))
        {
            this.customalert("Please fill out the password field", "Cannot Submit");
        }
        else if ((username == '')
            || (username == undefined))
        {
            this.customalert("Please fill out the username field", "Cannot Submit");
        }
        else if ((emailID == '')
            || (emailID == undefined))
        {
            this.customalert("Please fill out the random email ID field", "Cannot Submit");
        }
        else
        {
            //for security reason we ask that both username and password are 8 characters or greater.
            if ((username.length < 8) && (password.length < 8))
            {
                this.customalert("Please make sure both username and password are 8 characters or greater", "Cannot Submit");
            }
            else if (username.length < 8)
            {
                this.customalert("Please make sure the username is 8 characters or greater", "Cannot Submit");
            }
            else if (password.length < 8)
            {
                this.customalert("Please make sure the password is 8 characters or greater", "Cannot Submit");
            }
            else
            {
                //Hash the username and password.
                var usernameHash = Md5.hashStr(username);
                var passwordHash = Md5.hashStr(password);
                
                //store the hashed username and password in local storage
                this.storage.set('usernameHash', usernameHash);
                this.storage.set('passwordHash', passwordHash);

                //send data to the server.
                this.check_EmailID(emailID, usernameHash, passwordHash);

                //for debugging purposes the following code can be used to see what is stored in all variables.
                //this.customalert("Variables: " + emailID + " " + username + " " + password + " " + usernameHash + " " + passwordHash, "Results");
            }
        }
    }

    public check_EmailID(emailID, usernameHash, passwordHash)
    {
        // http get requests. Gets the username and password you entered. Returns a json object with a message "User successfully logged in"
        // goes to the ReportPage is everything is okay. 
        var url = "http://myluna.org/api/v1/auth.php?emailID=" + emailID + "&username=" + usernameHash + "&pass=" + passwordHash;
        // this line sends to the url above
	var response;
    this.presentLoadingCustom();
	this.http.get(url).map((response) => {
        this.dismissLoadingCustom();
		var Obj = response.json();
		if (response.status == 200 && Obj.error == false && /*Obj.message == "User email random ID found"*/ Obj.message != undefined) {
			//This should work to store the uid as long as it is correctly passed back from the server in the object message component
                	this.storage.set('uid', Obj.message);

                	//after this we should get something back from the server giving us the uid which will then be stored in local storage on the app.
                	//Then we can jump to the onBoarding questions page of the app.

                	this.customalert("Please fill out your responses to the onBoarding questions as your responses are crucial for proper app execution", "User Note");
                	this.navCtrl.setRoot(OnBoardingPage); // go to onBoarding questions page
		}
		else if (Obj.message != undefined) {
			this.customalert(Obj.message, "Error");
		}
		else {
			this.customalert("User email random ID not found. Please be sure the email random ID was entered in correctly", "Error");
		}

            }).subscribe();

    }

    public GoToLogin() {
	    this.navCtrl.setRoot(LoginPage);
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
