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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
//Imports needed for correct initialization.
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
var OnBoardingPage = (function () {
    //just added the private storage stuff to this.
    function OnBoardingPage(navCtrl, navParams, alertCtrl, http, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.http = http;
        this.storage = storage;
        this.cycleLength = '1';
        this.periodLength = '1';
        //Boolean toggle button for whether or not the user has a reproductive disorder and needs to enter in additonal info
        this.toggleDisorders = false;
    }
    //This function is called if our toggle button is true to allow the user to enter in their reproductive disorder
    OnBoardingPage.prototype.Show = function () {
        var reproductiveDisorders = document.getElementById('reproductiveDisorders');
        reproductiveDisorders.style.visibility = 'visible';
    };
    //This function is called if our toggle button is false hiding the reporductive disorder input field
    OnBoardingPage.prototype.Hide = function () {
        var reproductiveDisorders = document.getElementById('reproductiveDisorders');
        reproductiveDisorders.style.visibility = 'hidden';
    };
    //Function used for our toggle button to either show or hide the reproductive disorder input field and allow for user input.
    OnBoardingPage.prototype.ToggleDisorders = function () {
        console.log("ToggleDisorders Loading....");
        if (this.toggleDisorders == false) {
            //Toggle button is changed from false to true
            this.toggleDisorders = true;
            console.log(this.toggleDisorders);
            if (this.toggleDisorders == true) {
                //If the toggle button is pressed to true then our show function is called to allow the user to enter in a reproductive disorder.
                this.Show();
            }
        }
        else {
            this.toggleDisorders = false;
            //Toggle button is changed from true to false
            console.log(this.toggleDisorders);
            if (this.toggleDisorders == false) {
                //If the toggle button is not pressed to true then our hide function is called to hide the reproductive disorder input field.
                this.Hide();
            }
        }
    };
    //Function called if the submit button is pressed. 
    //Properly stores all variables and will send data to the server.
    //If a form field is missing an error message will be returned asking the user to go back through the form and fill it out properly.
    OnBoardingPage.prototype.SubmitForm = function () {
        var _this = this;
        this.storage.get('uid').then(function (data) {
            var uid = data;
            //Function to see if the birthControl array contains any hormonal birth control types
            //If a hormonal birth control type is used returns hormonal, if not returns not hormonal.
            function DetermineType(bc) {
                if (bc == undefined) {
                    return "No Answer";
                }
                else if (bc.length == 0) {
                    return "No Answer";
                }
                else if (bc.indexOf("The Pill") > -1) {
                    return "Hormonal";
                }
                else if (bc.indexOf("IUD (Intrauterine Device)") > -1) {
                    return "Hormonal";
                }
                else if (bc.indexOf("Contraceptive Implant") > -1) {
                    return "Hormonal";
                }
                else if (bc.indexOf("Contraceptive Injections") > -1) {
                    return "Hormonal";
                }
                else if (bc.indexOf("Vaginal Ring") > -1) {
                    return "Hormonal";
                }
                else if (bc.indexOf("The Patch") > -1) {
                    return "Hormonal";
                }
                else if (bc.indexOf("Other (would include emergency contraceptive/morning after pills, sterilization)") > -1) {
                    return "Hormonal";
                }
                else {
                    return "Not Hormonal";
                }
            }
            ;
            //Getting all the variables entered in by the user and storing them properly
            var birthday = _this.birthday;
            var cycleLength = _this.cycleLength;
            var periodLength = _this.periodLength;
            var birthControl = _this.birthControl;
            var lastPeriod = _this.lastPeriod;
            var status = _this.status;
            var time = _this.time;
            var pregnant = _this.pregnant;
            var reproductiveDisorder;
            //reproductiveDisorder is set to "None" if the toggle button is false indicating that the user has no reproductive disorders
            if (_this.toggleDisorders == true) {
                reproductiveDisorder = _this.reproductiveDisorders;
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
            var form_object = {
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
                var missingDataArray = new Array();
                if ((birthday == '') || (birthday == undefined)) {
                    missingDataArray.push("birthday question");
                }
                if ((cycleLength == '') || (cycleLength == undefined)) {
                    missingDataArray.push("cycle length question");
                }
                if ((periodLength == '') || (periodLength == undefined)) {
                    missingDataArray.push("period length question");
                }
                if (birthControlType == 'No Answer') {
                    missingDataArray.push("birth control type question");
                }
                if ((lastPeriod == '') || (lastPeriod == undefined)) {
                    missingDataArray.push("last period date question");
                }
                if ((status == '') || (status == undefined)) {
                    missingDataArray.push("relationship status question");
                }
                if ((time == '') || (time == undefined)) {
                    missingDataArray.push("time of day question");
                }
                if ((pregnant == '') || (pregnant == undefined)) {
                    missingDataArray.push("pregnancy question");
                }
                var missingDataAlert = "Please fill out the ";
                for (var i = 0; i < missingDataArray.length; i++) {
                    missingDataAlert = missingDataAlert.concat(missingDataArray[i]);
                    if (i != (missingDataArray.length - 1)) {
                        missingDataAlert = missingDataAlert.concat(", ");
                    }
                }
                _this.customalert(missingDataAlert, "Cannot Submit");
            }
            else {
                //A check to see if the toggle button has been pressed and to ensure the user has entered in some reroductive disorder before the form can be submitted.
                //If not an error message is output to the user.
                if (_this.toggleDisorders == true) {
                    if ((reproductiveDisorder == '') || (reproductiveDisorder == undefined)) {
                        _this.customalert("Please fill out the reproductive disorder question as you said 'yes' to having a disorder", "Cannot Submit");
                    }
                    else {
                        //storing the repsonses to the onBoarding questions in local storage
                        _this.storage.set('birthday', birthday);
                        _this.storage.set('cycleLength', cycleLength);
                        _this.storage.set('periodLength', periodLength);
                        _this.storage.set('birthControl', birthControl);
                        _this.storage.set('birthControlType', birthControlType);
                        _this.storage.set('lastPeriod', lastPeriod);
                        _this.storage.set('status', status);
                        _this.storage.set('time', time);
                        _this.storage.set('pregnant', pregnant);
                        _this.storage.set('reproductiveDisorder', reproductiveDisorder);
                        _this.post_onBoarding(form_object);
                        //This can be used to check the value of all variables and ensure that everything is being stored correctly.
                        /*this.customalert("Variables: " + birthday + " " + cycleLength + " " + periodLength + " " + birthControlType + " " + lastPeriod + " "
                            + status + " " + time + " " + pregnant + " " + reproductiveDisorder, "Error");*/
                    }
                }
                else {
                    //storing the repsonses to the onBoarding questions in local storage
                    //Variable names in local storage: birthday, cycleLength, periodLength
                    _this.storage.set('birthday', birthday);
                    _this.storage.set('cycleLength', cycleLength);
                    _this.storage.set('periodLength', periodLength);
                    _this.storage.set('birthControl', birthControl);
                    _this.storage.set('birthControlType', birthControlType);
                    _this.storage.set('lastPeriod', lastPeriod);
                    _this.storage.set('status', status);
                    _this.storage.set('time', time);
                    _this.storage.set('pregnant', pregnant);
                    _this.storage.set('reproductiveDisorder', reproductiveDisorder);
                    _this.post_onBoarding(form_object);
                    //This can be used to check the value of all variables and ensure that everything is being stored correctly.
                    /*this.customalert("Variables: " + birthday + " " + cycleLength + " " + periodLength + " " + birthControlType + " " + lastPeriod + " "
                        + status + " " + time + " " + pregnant + " " + reproductiveDisorder + " " + uid, "Error");*/
                }
            }
        });
    };
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
    OnBoardingPage.prototype.post_onBoarding = function (onboard_data) {
        var _this = this;
        // Server change onBoard handler url (changeOnboard.php)
        var url = "http://myluna.org/api/v1/changeOnboard.php";
        console.log("in post onboard");
        // Submit onboarding data to server
        this.http.get(url, { params: onboard_data }).map(function (response) {
            var Obj = response.json();
            console.log(Obj.error);
            console.log(Obj.message);
            if (Obj.error == false) {
                console.log("post onboard success");
                _this.customalert("Please navigate to the tracker page (the middle tab) and fill out your responses to the daily questions", "User Note");
                _this.customalert("Your onboard data have been successfully submitted", "Success");
                _this.navCtrl.setRoot(TabsPage); // go to tracker page
                return true;
            }
            else {
                console.log("post onboard failure: " + Obj.message);
                // user can do nothing about this. Error detected in
                // changeOnboard.php. In future report to error log
                return false;
            }
        }).subscribe();
    }; // end post_onBoarding
    // a custom alert for ionic 2. 
    OnBoardingPage.prototype.customalert = function (s, t) {
        console.log("alert: " + s);
        var alert = this.alertCtrl.create({
            title: t,
            subTitle: s,
            buttons: ['OK']
        });
        alert.present(alert);
    };
    return OnBoardingPage;
}());
OnBoardingPage = __decorate([
    Component({
        selector: 'page-onBoarding',
        templateUrl: 'onBoarding.html'
    }),
    __metadata("design:paramtypes", [NavController, NavParams, AlertController, Http, Storage])
], OnBoardingPage);
export { OnBoardingPage };
//# sourceMappingURL=onBoarding.js.map
