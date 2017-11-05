/*
Title: onBoarding.ts
Author: Dillon Pulliam
Date: 7/3/2017

Purpose: This code allows the user to enter in their responses to the onBoarding questions in the app and these responses are then sent and stored in the server.

Input:
    uid: This comes from local storage and is given to the app by the server originally.
    birthday
    cycleLength
    periodLength
    birthControlType
    lastPeriod
    status
    time
    pregnant
    reproductiveDisorder

Output:
    Success:
        onBoarding questions columns changed for user.
        Success message sent to the app
        App is then linked back to the main page.

    Failure:
        Failure message sent to the app. This could either be that the server didn't recieve the data or that the user failed to fill out a necessary field for
        data to be sent.
*/

//Imports needed for correct initialization.
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';

@Component({
    selector: 'page-onBoarding',
    templateUrl: 'onBoarding.html'
})
export class OnBoardingPage {
    // initializing variables and their types 
    birthday: string;   
    cycleLength: string = '1';
    periodLength: string = '1';   
    birthControl: string[];   //A string array of unknown size
    lastPeriod: string;
    status: string;
    time: string;
    pregnant: string;
    reproductiveDisorders: string;    //Will be "None" if the toggleDisorders button is false.

    //Boolean toggle button for whether or not the user has a reproductive disorder and needs to enter in additonal info
    toggleDisorders: boolean = false;

    //just added the private storage stuff to this.
    constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private http: Http, private storage: Storage) {
    }

    //This function is called if our toggle button is true to allow the user to enter in their reproductive disorder
    public Show() {
        var reproductiveDisorders = document.getElementById('reproductiveDisorders');
        reproductiveDisorders.style.visibility = 'visible';
    }

    //This function is called if our toggle button is false hiding the reporductive disorder input field
    public Hide() {
        var reproductiveDisorders = document.getElementById('reproductiveDisorders');
        reproductiveDisorders.style.visibility = 'hidden';
    }

    //Function used for our toggle button to either show or hide the reproductive disorder input field and allow for user input.
    public ToggleDisorders() {
        console.log("ToggleDisorders Loading....");
        if (this.toggleDisorders == false) {
            //Toggle button is changed from false to true
            this.toggleDisorders = true;
            console.log(this.toggleDisorders);
            if (this.toggleDisorders == true) {
                //If the toggle button is pressed to true then our show function is called to allow the user to enter in a reproductive disorder.
                this.Show();
            }
        } else {
            this.toggleDisorders = false;
            //Toggle button is changed from true to false
            console.log(this.toggleDisorders);
            if (this.toggleDisorders == false) {
                //If the toggle button is not pressed to true then our hide function is called to hide the reproductive disorder input field.
                this.Hide();
            }
        }
    }

    //Function called if the submit button is pressed. 
    //Properly stores all variables and will send data to the server.
    //If a form field is missing an error message will be returned asking the user to go back through the form and fill it out properly.
    public SubmitForm() { // Form submitted to the server for email deployment. 
        this.storage.get('uid').then((data) => {
        
                var uid = data;

                //Function to see if the birthControl array contains any hormonal birth control types
                //If a hormonal birth control type is used returns hormonal, if not returns not hormonal.
                function DetermineType(bc: string[]) {
                    if (bc == undefined)
                    { return "No Answer"; }
                    else if (bc.length == 0)
                    { return "No Answer"; }
                    else if (bc.indexOf("The Pill") > -1)
                    { return "Hormonal"; }
                    else if (bc.indexOf("IUD (Intrauterine Device)") > -1)
                    { return "Hormonal"; }
                    else if (bc.indexOf("Contraceptive Implant") > -1)
                    { return "Hormonal"; }
                    else if (bc.indexOf("Contraceptive Injections") > -1)
                    { return "Hormonal"; }
                    else if (bc.indexOf("Vaginal Ring") > -1)
                    { return "Hormonal"; }
                    else if (bc.indexOf("The Patch") > -1)
                    { return "Hormonal"; }
                    else if (bc.indexOf("Other (would include emergency contraceptive/morning after pills, sterilization)") > -1)
                    { return "Hormonal"; }
                    else
                    { return "Not Hormonal"; }
                };

                //Getting all the variables entered in by the user and storing them properly
                var birthday = this.birthday;
                var cycleLength = this.cycleLength;
                var periodLength = this.periodLength;
                var birthControl = this.birthControl;
                var lastPeriod = this.lastPeriod;
                var status = this.status;
                var time = this.time;
                var pregnant = this.pregnant;
                var reproductiveDisorder;

                //reproductiveDisorder is set to "None" if the toggle button is false indicating that the user has no reproductive disorders
                if (this.toggleDisorders == true) {
                    reproductiveDisorder = this.reproductiveDisorders;
                }
                else {
                    reproductiveDisorder = "None";
                }

                //birthControlType is the variable sent to server and it is determined through the DetermineType function which takes in the birthControl string array.
                var birthControlType = DetermineType(birthControl);

                //for debugging purposes
                console.log(uid);
                console.log(birthday);
                console.log(cycleLength);
                console.log(periodLength);
                console.log(birthControl);
                console.log(lastPeriod);
                console.log(status);
                console.log(time);
                console.log(pregnant);
                console.log(reproductiveDisorder);
                console.log(birthControlType);

                var form_object = {  // this  is the form object sent to the server. json format
                    uid: uid,
                    birthday: birthday,
                    cycleLength: cycleLength,
                    periodLength: periodLength,
                    birthControlType: birthControlType,
                    lastPeriod: lastPeriod,
                    status: status,
                    time: time,
                    pregnant: pregnant,
                    reproductiveDisorder: reproductiveDisorder
                };

                // A check to make sure that all the data is filled in before the user submits the form.
                //If any data is missing then an error message is output to the screen asking the user to go back through the form and fill out the missing field.
                if ((birthday == '' ||
                    cycleLength == '' ||
                    periodLength == '' ||
                    lastPeriod == '' ||
                    status == '' ||
                    time == '' ||
                    pregnant == '' ||
                    birthControlType == 'No Answer')
                    || (birthday == undefined
                        || cycleLength == undefined
                        || periodLength == undefined
                        || birthControl == undefined
                        || lastPeriod == undefined
                        || status == undefined
                        || time == undefined
                        || pregnant == undefined)) {
                    if ((birthday == '') || (birthday == undefined)) {
                        this.customalert("Please fill out the birthday question", "Cannot Submit");
                    }
                    if ((cycleLength == '') || (cycleLength == undefined)) {
                        this.customalert("Please fill out the cycle length question", "Cannot Submit");
                    }
                    if ((periodLength == '') || (periodLength == undefined)) {
                        this.customalert("Please fill out the period length question", "Cannot Submit");
                    }
                    if (birthControlType == 'No Answer') {
                        this.customalert("Please fill out the birth control type question", "Cannot Submit");
                    }
                    if ((lastPeriod == '') || (lastPeriod == undefined)) {
                        this.customalert("Please fill out the last period date question", "Cannot Submit");
                    }
                    if ((status == '') || (status == undefined)) {
                        this.customalert("Please fill out the relationship status question", "Cannot Submit");
                    }
                    if ((time == '') || (time == undefined)) {
                        this.customalert("Please fill out the time of the day to respond to daily questions question", "Cannot Submit");
                    }
                    if ((pregnant == '') || (pregnant == undefined)) {
                        this.customalert("Please fill out if you are intending to become pregnant or not question", "Cannot Submit");
                    }
                }
                else {
                    //A check to see if the toggle button has been pressed and to ensure the user has entered in some reroductive disorder before the form can be submitted.
                    //If not an error message is output to the user.
                    if (this.toggleDisorders == true) {
                        if ((reproductiveDisorder == '') || (reproductiveDisorder == undefined)) {
                            this.customalert("Please fill out the reproductive disorder question as you said 'yes' to having a disorder", "Cannot Submit");
                        }
                        else {
                            //storing the repsonses to the onBoarding questions in local storage
                            this.storage.set('birthday', birthday);
                            this.storage.set('cycleLength', cycleLength);
                            this.storage.set('periodLength', periodLength);
                            this.storage.set('birthControl', birthControl);
                            this.storage.set('birthControlType', birthControlType);
                            this.storage.set('lastPeriod', lastPeriod);
                            this.storage.set('status', status);
                            this.storage.set('time', time);
                            this.storage.set('pregnant', pregnant);
                            this.storage.set('reproductiveDisorder', reproductiveDisorder);

                            this.post_onBoarding(form_object);
                            //This can be used to check the value of all variables and ensure that everything is being stored correctly.
                            /*this.customalert("Variables: " + birthday + " " + cycleLength + " " + periodLength + " " + birthControlType + " " + lastPeriod + " "
                                + status + " " + time + " " + pregnant + " " + reproductiveDisorder, "Error");*/
                        }
                    }
                    else {
                        //storing the repsonses to the onBoarding questions in local storage
                        //Variable names in local storage: birthday, cycleLength, periodLength
                        this.storage.set('birthday', birthday);
                        this.storage.set('cycleLength', cycleLength);
                        this.storage.set('periodLength', periodLength);
                        this.storage.set('birthControl', birthControl);
                        this.storage.set('birthControlType', birthControlType);
                        this.storage.set('lastPeriod', lastPeriod);
                        this.storage.set('status', status);
                        this.storage.set('time', time);
                        this.storage.set('pregnant', pregnant);
                        this.storage.set('reproductiveDisorder', reproductiveDisorder);

                        this.post_onBoarding(form_object);
                        //This can be used to check the value of all variables and ensure that everything is being stored correctly.
                        /*this.customalert("Variables: " + birthday + " " + cycleLength + " " + periodLength + " " + birthControlType + " " + lastPeriod + " "
                            + status + " " + time + " " + pregnant + " " + reproductiveDisorder + " " + uid, "Error");*/
                    }
                }
        });
    }
  
    // post_onBoarding
    // send HTTP post request to the server to update
    // onBoard answers to user table for this uid
    // input:
    //   (see form_object above)
    //   object with all onBoard answers, uid
    // output:
    //   success: obj.error field set false by server
    //     onBoard fields updated in user table for this uid,
    //     alert to user,
    //     link back to main page of app.
    //   failure: obj.error field set to true by server
    //     alert to user 
    public post_onBoarding(onboard_data) {
        // Server chnage onBoard handler url (changeOnboard.php)
        var url = "https://luna-app.000webhostapp.com/api/v1/changeOnboard.php"
        console.log("in post onboard")

        // Submit onboarding data to server
        this.http.get(url, {params:onboard_data}).map((response) => {
                var Obj = response.json();
                console.log(Obj.error);
                console.log(Obj.message)
                if (Obj.error == false) { // successful completion
                    console.log("post onboard success");
                    this.customalert("Please navigate to the tracker page (the middle tab) and fill out your responses to the daily questions", "User Note");
                    this.customalert("Your onboard data have been successfully submitted", "Success");
                    this.navCtrl.setRoot(TabsPage); // go to tracker page
                    return true;
                } else { // get request failed
                    console.log("post onboard failure: " + Obj.message);
                    // user can do nothing about this. Error detected in
                    // changeOnboard.php. In future report to error log
                    return false;
                }
        }).subscribe();
    } // end post_onBoarding

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
