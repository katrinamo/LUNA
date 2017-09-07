/*
Title: settings.ts
Author: Dillon Pulliam
Date: 7/16/2017

Purpose: This code allows the user to view and/or update their responses to the onBoarding questions in the app.
These updated responses are then sent and stored in the server.

Input:
    uid: This comes from local storage and is given to the app by the server originally.
    birthday: same as original
    cycleLength: same as original
    periodLength: same as original
    birthControlType: can be updated
    lastPeriod: same as original
    status: can be updated
    time: can be updated
    pregnant: can be updated
    reproductiveDisorder: can be updated

Output:
    Success:
        onBoarding questions columns are updated for user.
        Success message sent to the app
        App is then linked back to the main page.

    Failure:
        Failure message sent to the app. This could either be that the server didn't recieve the data or that the user failed to fill out a necessary field for
        data to be sent.
*/

import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [HTTP]
})
export class SettingsPage {

    //Variables used to hold the parameters passed in from settingsLogin.ts
    //These variables hold the original or latest update to the onBoarding Questions
    public birthdayParam;
    public cycleLengthParam;
    public periodLengthParam;
    public birthControlParam;
    public birthControlTypeParam;
    public lastPeriodParam;
    public statusParam;
    public timeParam;
    public pregnantParam;
    public reproductiveDisorderParam;

    constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public http: HTTP, private storage: Storage) {
        
        //Getting parameters passed in from settingsLogin.ts and saving them in the proper variables
        this.birthdayParam = navParams.get("birthdayPassed");
        this.cycleLengthParam = navParams.get("cycleLengthPassed");
        this.periodLengthParam = navParams.get("periodLengthPassed");
        this.birthControlParam = navParams.get("birthControlPassed");
        this.birthControlTypeParam = navParams.get("birthControlTypePassed");
        this.lastPeriodParam = navParams.get("lastPeriodPassed");
        this.statusParam = navParams.get("statusPassed");
        this.timeParam = navParams.get("timePassed");
        this.pregnantParam = navParams.get("pregnantPassed");
        this.reproductiveDisorderParam = navParams.get("reproductiveDisorderPassed");
    }

     // initializing variables and their types if the user makes any adjustments to their settings.
    birthControlUpdateResult: string[];   
    statusUpdateResult: string;
    timeUpdateResult: string;
    pregnantUpdateResult: string;
    reproductiveDisorderUpdate: string;   

    //Boolean toggle buttons used in the HTML page.
    toggleDisorderUpdate: boolean = false;
    toggleBirthControlUpdate: boolean = false;
    toggleStatusUpdate: boolean = false;
    toggleTimeUpdate: boolean = false;
    togglePregnantUpdate: boolean = false;

    //This function is called if our toggle button is true to allow the user to enter in their reproductive disorder
    public ShowDisorder() {
        var reproductiveDisorderUpdate = document.getElementById('reproductiveDisorderUpdate');
        reproductiveDisorderUpdate.style.visibility = 'visible';
    }

    //This function is called if our toggle button is true to allow the user to enter in their birth control
    public ShowBirthControl() {
        var birthControlUpdate1 = document.getElementById('birthControlUpdate1');
        birthControlUpdate1.style.visibility = 'visible';
    }

    //This function is called if our toggle button is true to allow the user to enter in their relationship status
    public ShowStatus() {
        var statusUpdate1 = document.getElementById('statusUpdate1');
        statusUpdate1.style.visibility = 'visible';
    }

    //This function is called if our toggle button is true to allow the user to enter in their time to enter in responses to daily questions
    public ShowTime() {
        var timeUpdate1 = document.getElementById('timeUpdate1');
        timeUpdate1.style.visibility = 'visible';
    }

    //This function is called if our toggle button is true to allow the user to enter in their intention on whether or not to become pregnant
    public ShowPregnant() {
        var pregnantUpdate1 = document.getElementById('pregnantUpdate1');
        pregnantUpdate1.style.visibility = 'visible';
    }

    //This function is called if a toggle button is true to allow the user to make an update request to the server.
    public ShowButton() {
        var updateButton = document.getElementById('updateButton');
        updateButton.style.visibility = 'visible';
    }

    //This function is called if our toggle button is false hiding the reproductive disorder field
    public HideDisorder() {
       var reproductiveDisorderUpdate = document.getElementById('reproductiveDisorderUpdate');
       reproductiveDisorderUpdate.style.visibility = 'hidden';
    }

    //This function is called if our toggle button is false hiding the birth control field
    public HideBirthControl() {
        var birthControlUpdate1 = document.getElementById('birthControlUpdate1');
        birthControlUpdate1.style.visibility = 'hidden';
    }

    //This function is called if our toggle button is set to false hiding the relationship status field
    public HideStatus() {
        var statusUpdate1 = document.getElementById('statusUpdate1');
        statusUpdate1.style.visibility = 'hidden';
    }

    //This function is called if our toggle button is false hiding the time of day to input responses to daily questions field
    public HideTime() {
        var timeUpdate1 = document.getElementById('timeUpdate1');
        timeUpdate1.style.visibility = 'hidden';
    }

    //This function is called if our toggle button is false hiding the intention to be pregnant or not field
    public HidePregnant() {
        var pregnantUpdate1 = document.getElementById('pregnantUpdate1');
        pregnantUpdate1.style.visibility = 'hidden';
    }

    //This function is called is our toggle button is false hiding the post update button
    public HideButton() {
        var updateButton = document.getElementById('updateButton');
        updateButton.style.visibility = 'hidden';
    }

    //Function used for our toggle button to either show or hide the reproductive disorder input field and allow for user input.
    public ToggleDisorderUpdate() {
        console.log("ToggleDisorders Loading....");
        if (this.toggleDisorderUpdate == false) {
            //Toggle button is changed from false to true
            this.toggleDisorderUpdate = true;
            console.log(this.toggleDisorderUpdate);
            if (this.toggleDisorderUpdate == true) {
                //If the toggle button is pressed to true then our show function is called to allow the user to enter in a reproductive disorder.
                this.ShowDisorder();
                this.ShowButton();
            } 
        }
        else {
            this.toggleDisorderUpdate = false;
            //Toggle button is changed from true to false
            console.log(this.toggleDisorderUpdate);
            if (this.toggleDisorderUpdate == false) {
                //If the toggle button is not pressed to true then our hide function is called to hide the reproductive disorder input field.
                this.HideDisorder();
                if (this.toggleStatusUpdate == false && this.toggleTimeUpdate == false && this.togglePregnantUpdate == false && this.toggleBirthControlUpdate == false) {
                    //If no toggle button is pressed to true then hide the submit button to the server called update feature.
                    this.HideButton();
                }
            }
         }
    }

    //Function used for our toggle button to either show or hide the birth control input field and allow for user input.
    public ToggleBirthControlUpdate() {
        console.log("ToggleBirthControl Loading....");
        if (this.toggleBirthControlUpdate == false) {
            //Toggle button is changed from false to true
            this.toggleBirthControlUpdate = true;
            console.log(this.toggleBirthControlUpdate);
            if (this.toggleBirthControlUpdate == true) {
                //If the toggle button is pressed to true then our show function is called to allow the user to enter in birth control.
                this.ShowBirthControl();
                this.ShowButton();
            }
        }
        else {
            this.toggleBirthControlUpdate = false;
            //Toggle button is changed from true to false
            console.log(this.toggleBirthControlUpdate);
            if (this.toggleBirthControlUpdate == false) {
                //If the toggle button is not pressed to true then our hide function is called to hide the birth control input field.
                this.HideBirthControl();
                if (this.toggleStatusUpdate == false && this.toggleTimeUpdate == false && this.togglePregnantUpdate == false && this.toggleDisorderUpdate == false)
                {
                    //If no toggle button is pressed to true then hide the submit button to the server called update feature.
                    this.HideButton();
                }
            }
        }
    }

    //Function used for our toggle button to either show or hide the relationship status input field and allow for user input.
    public ToggleStatusUpdate() {
        console.log("ToggleStatus Loading....");
        if (this.toggleStatusUpdate == false) {
            //Toggle button is changed from false to true
            this.toggleStatusUpdate = true;
            console.log(this.toggleStatusUpdate);
            if (this.toggleStatusUpdate == true) {
                //If the toggle button is pressed to true then our show function is called to allow the user to enter in birth control.
                this.ShowStatus();
                this.ShowButton();
            }
        }
        else {
            this.toggleStatusUpdate = false;
            //Toggle button is changed from true to false
            console.log(this.toggleStatusUpdate);
            if (this.toggleStatusUpdate == false) {
                //If the toggle button is not pressed to true then our hide function is called to hide the relationship status input field.
                this.HideStatus();
                if (this.toggleBirthControlUpdate == false && this.toggleTimeUpdate == false && this.togglePregnantUpdate == false && this.toggleDisorderUpdate == false) {
                    //If no toggle button is pressed to true then hide the submit button to the server called update feature.
                    this.HideButton();
                }
            }
        }
    }

    //Function used for our toggle button to either show or hide the time of the day to input questions field and allow for user input.
    public ToggleTimeUpdate() {
        console.log("ToggleTime Loading....");
        if (this.toggleTimeUpdate == false) {
            //Toggle button is changed from false to true
            this.toggleTimeUpdate = true;
            console.log(this.toggleTimeUpdate);
            if (this.toggleTimeUpdate == true) {
                //If the toggle button is pressed to true then our show function is called to allow the user to enter in time of the day to input daily questions.
                this.ShowTime();
                this.ShowButton();
            }
        }
        else {
            this.toggleTimeUpdate = false;
            //Toggle button is changed from true to false
            console.log(this.toggleTimeUpdate);
            if (this.toggleTimeUpdate == false) {
                //If the toggle button is not pressed to true then our hide function is called to hide the time to enter daily questions input field.
                this.HideTime();
                if (this.toggleStatusUpdate == false && this.toggleBirthControlUpdate == false && this.togglePregnantUpdate == false && this.toggleDisorderUpdate == false) {
                    //If no toggle button is pressed to true then hide the submit button to the server called update feature.
                    this.HideButton();
                }
            }
        }
    }

    //Function used for our toggle button to either show or hide the intention to be pregnant or not input field and allow for user input.
    public TogglePregnantUpdate() {
        console.log("TogglePregnant Loading....");
        if (this.togglePregnantUpdate == false) {
            //Toggle button is changed from false to true
            this.togglePregnantUpdate = true;
            console.log(this.togglePregnantUpdate);
            if (this.togglePregnantUpdate == true) {
                //If the toggle button is pressed to true then our show function is called to allow the user to enter in if they are intending to become pregnant or not.
                this.ShowPregnant();
                this.ShowButton();
            }
        }
        else {
            this.togglePregnantUpdate = false;
            //Toggle button is changed from true to false
            console.log(this.togglePregnantUpdate);
            if (this.togglePregnantUpdate == false) {
                //If the toggle button is not pressed to true then our hide function is called to hide the intention to become pregnant or not input field.
                this.HidePregnant();
                if (this.toggleStatusUpdate == false && this.toggleTimeUpdate == false && this.toggleBirthControlUpdate == false && this.toggleDisorderUpdate == false) {
                    //If no toggle button is pressed to true then hide the submit button to the server called update feature.
                    this.HideButton();
                }
            }
        }
    }

    //Function that is called when the user presses the update button.
    //This function will output an error message if a certain field is missing info and has not yet been filled in.
    //If the update form is completed then the function will send the data to the server.
    public UpdateForm() { // Form submitted to the server for email deployment. 
        //The following lines of code just load in the most recent answers to the onBoarding questions (called the settings) from local storage.
        //This is necessary because any field that is not updated is still sent to the server with the most recent response to that question.
        //This helped to make server side code easier since our forms sent are the exact same for this file as for onBoarding.ts
        this.storage.get('uid').then((data) => {
            this.storage.get('birthday').then((data1) => {
                this.storage.get('cycleLength').then((data2) => {
                    this.storage.get('periodLength').then((data3) => {
                        this.storage.get('birthControl').then((data4) => {
                            this.storage.get('lastPeriod').then((data5) => {
                                this.storage.get('status').then((data6) => {
                                    this.storage.get('time').then((data7) => {
                                        this.storage.get('pregnant').then((data8) => {
                                            this.storage.get('reproductiveDisorder').then((data9) => {
                                                this.storage.get('birthControlType').then((data10) => {

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

                                                    //Getting all the variables entered in by the user and storing them properly.
                                                    //If the toggle button is true then the the variable is set to the input field.
                                                    //If the toggle button is not pressed then the variable is set to its old value from local storage.
                                                    var birthControl;
                                                    if (this.toggleBirthControlUpdate == true) {
                                                        birthControl = this.birthControlUpdateResult;
                                                    }
                                                    else {
                                                        birthControl = data4;
                                                    }

                                                    var status;
                                                    if (this.toggleStatusUpdate == true) {
                                                        status = this.statusUpdateResult;
                                                    }
                                                    else {
                                                        status = data6;
                                                    }

                                                    var time;
                                                    if (this.toggleTimeUpdate == true) {
                                                        time = this.timeUpdateResult;
                                                    }
                                                    else {
                                                        time = data7;
                                                    }

                                                    var pregnant;
                                                    if (this.togglePregnantUpdate == true) {
                                                        pregnant = this.pregnantUpdateResult;
                                                    }
                                                    else {
                                                        pregnant = data8;
                                                    }

                                                    var reproductiveDisorder;
                                                    if (this.toggleDisorderUpdate == true) {
                                                        reproductiveDisorder = this.reproductiveDisorderUpdate;
                                                    }
                                                    else {
                                                        reproductiveDisorder = data9;
                                                    }

                                                    //birthControlType is the variable sent to server and it is determined through the DetermineType function which takes in the birthControl string array.
                                                    var birthControlType = DetermineType(birthControl);

                                                    //for debugging purposes
                                                    console.log(uid);
                                                    console.log(birthControl);
                                                    console.log(status);
                                                    console.log(time);
                                                    console.log(pregnant);
                                                    console.log(reproductiveDisorder);
                                                    console.log(birthControlType);

                                                    var form_object = {  // this  is the form object sent to the server. json format
                                                        uid: uid,
                                                        birthday: data1,
                                                        cycleLength: data2,
                                                        periodLength: data3,
                                                        birthControlType: birthControlType,
                                                        lastPeriod: data5,
                                                        status: status,
                                                        time: time,
                                                        pregnant: pregnant,
                                                        reproductiveDisorder: reproductiveDisorder
                                                    };

                                                    // A check to make sure that all the data is filled in before the user submits the form.
                                                    //If any data is missing then an error message is output to the screen asking the user to go back through the form and fill out the missing field.
                                                    if (((status == '' && this.toggleStatusUpdate == true) ||
                                                        (time == '' && this.toggleTimeUpdate == true) ||
                                                        (pregnant == '' && this.togglePregnantUpdate == true) ||
                                                        (reproductiveDisorder == '' && this.toggleDisorderUpdate == true) ||
                                                        (birthControlType == 'No Answer' && this.toggleBirthControlUpdate == true))
                                                        || ((birthControl == undefined && this.toggleBirthControlUpdate == true)
                                                            || (reproductiveDisorder == undefined && this.toggleDisorderUpdate == true)
                                                            || (status == undefined && this.toggleStatusUpdate == true)
                                                            || (time == undefined && this.toggleTimeUpdate == true)
                                                            || (pregnant == undefined && this.togglePregnantUpdate == true))) {
                                                        if (birthControlType == 'No Answer' && this.ToggleBirthControlUpdate) {
                                                            this.customalert("Please fill out the birth control question since its update button is toggled", "Cannot Update");
                                                        }
                                                        if (((status == '') || (status == undefined)) && this.toggleStatusUpdate == true) {
                                                            this.customalert("Please fill out the relationship status question since its update button is toggled", "Cannot Update");
                                                        }
                                                        if (((time == '') || (time == undefined)) && this.toggleTimeUpdate == true) {
                                                            this.customalert("Please fill out the time of the day you want to respond to daily questions since its update button is toggled", "Cannot Update");
                                                        }
                                                        if (((pregnant == '') || (pregnant == undefined)) && this.togglePregnantUpdate == true) {
                                                            this.customalert("Please fill out if you are intending to become pregnant or not since its update button is toggled", "Cannot Update");
                                                        }
                                                        if (((reproductiveDisorder == '') || (reproductiveDisorder == undefined)) && this.toggleDisorderUpdate == true) {
                                                            this.customalert("Please fill out the reproductive disorder question since its update button is toggled", "Cannot Update");
                                                        }
                                                    }
                                                    else {
                                                        //Updating the responses stored in local storage
                                                        this.storage.set('birthControl', birthControl);
                                                        this.storage.set('birthControlType', birthControlType);
                                                        this.storage.set('status', status);
                                                        this.storage.set('time', time);
                                                        this.storage.set('pregnant', pregnant);
                                                        this.storage.set('reproductiveDisorder', reproductiveDisorder);

                                                        this.post_update(form_object);
                                                        //This can be used to check the value of all variables and ensure that everything is being stored correctly.
                                                        /*this.customalert("Variables: " + data1 + " " + data2 + " " + data3 + " " + birthControlType + " " + data5 + " "
                                                            + status + " " + time + " " + pregnant + " " + reproductiveDisorder, "Error");*/
                                                    }
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    // post_update
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
    public post_update(onboard_data) {
        // Server chnage onBoard handler url (changeOnboard.php)
        var url = "https://luna-app.000webhostapp.com/api/v1/changeOnboard.php"
        console.log("in post update")
        var P1 = this.http.post(url, onboard_data, {})
            .then(function (data) {
                // This function handles 200 HTTP return code, but
                // changeOnboard may still report error (error=true)
                var Obj = JSON.parse(data.data);  // log the response
                console.log(Obj.error);
                console.log(Obj.message);
                if (Obj.error == false) {  // successful completion
                    console.log("post update success");
                    return true;
                } else {
                    console.log("post update failure: " + Obj.message);
                    // user can do nothing about this. Error detected in
                    // changeOnboard.php. In future report to error log 
                    return false;
                }
            }, function (response) {
                // this function handles server (500) error
                console.log("post update server failure");
                return false;
            });
        // wait for post (then clause) to complete 
        // Promise.all waits until response from server for post request
        // data will be true (success) or false
        Promise.all([P1]).then(data => {
            if (data[0]) { // then clause reported success/failure
                this.customalert("Your onboard data has been successfully updated", "Success");
                this.navCtrl.pop(SettingsPage); // go back to the settings login page as updates have been made. 
                //Pops the settings page off the top of the stack as it was popped on top of settingsLogin when username and password were input. 
            } else {
                this.customalert("Failure to update your onboard data", "Failure");
            }
        });
    } // end post_update

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

