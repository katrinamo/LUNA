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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
var SettingsPage = SettingsPage_1 = (function () {
    function SettingsPage(navCtrl, navParams, alertCtrl, http, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.http = http;
        this.storage = storage;
        //Boolean toggle buttons used in the HTML page.
        this.toggleDisorderUpdate = false;
        this.toggleBirthControlUpdate = false;
        this.toggleStatusUpdate = false;
        this.toggleTimeUpdate = false;
        this.togglePregnantUpdate = false;
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
    //This function is called if our toggle button is true to allow the user to enter in their reproductive disorder
    SettingsPage.prototype.ShowDisorder = function () {
        var reproductiveDisorderUpdate = document.getElementById('reproductiveDisorderUpdate');
        reproductiveDisorderUpdate.style.visibility = 'visible';
    };
    //This function is called if our toggle button is true to allow the user to enter in their birth control
    SettingsPage.prototype.ShowBirthControl = function () {
        var birthControlUpdate1 = document.getElementById('birthControlUpdate1');
        birthControlUpdate1.style.visibility = 'visible';
    };
    //This function is called if our toggle button is true to allow the user to enter in their relationship status
    SettingsPage.prototype.ShowStatus = function () {
        var statusUpdate1 = document.getElementById('statusUpdate1');
        statusUpdate1.style.visibility = 'visible';
    };
    //This function is called if our toggle button is true to allow the user to enter in their time to enter in responses to daily questions
    SettingsPage.prototype.ShowTime = function () {
        var timeUpdate1 = document.getElementById('timeUpdate1');
        timeUpdate1.style.visibility = 'visible';
    };
    //This function is called if our toggle button is true to allow the user to enter in their intention on whether or not to become pregnant
    SettingsPage.prototype.ShowPregnant = function () {
        var pregnantUpdate1 = document.getElementById('pregnantUpdate1');
        pregnantUpdate1.style.visibility = 'visible';
    };
    //This function is called if a toggle button is true to allow the user to make an update request to the server.
    SettingsPage.prototype.ShowButton = function () {
        var updateButton = document.getElementById('updateButton');
        updateButton.style.visibility = 'visible';
    };
    //This function is called if our toggle button is false hiding the reproductive disorder field
    SettingsPage.prototype.HideDisorder = function () {
        var reproductiveDisorderUpdate = document.getElementById('reproductiveDisorderUpdate');
        reproductiveDisorderUpdate.style.visibility = 'hidden';
    };
    //This function is called if our toggle button is false hiding the birth control field
    SettingsPage.prototype.HideBirthControl = function () {
        var birthControlUpdate1 = document.getElementById('birthControlUpdate1');
        birthControlUpdate1.style.visibility = 'hidden';
    };
    //This function is called if our toggle button is set to false hiding the relationship status field
    SettingsPage.prototype.HideStatus = function () {
        var statusUpdate1 = document.getElementById('statusUpdate1');
        statusUpdate1.style.visibility = 'hidden';
    };
    //This function is called if our toggle button is false hiding the time of day to input responses to daily questions field
    SettingsPage.prototype.HideTime = function () {
        var timeUpdate1 = document.getElementById('timeUpdate1');
        timeUpdate1.style.visibility = 'hidden';
    };
    //This function is called if our toggle button is false hiding the intention to be pregnant or not field
    SettingsPage.prototype.HidePregnant = function () {
        var pregnantUpdate1 = document.getElementById('pregnantUpdate1');
        pregnantUpdate1.style.visibility = 'hidden';
    };
    //This function is called is our toggle button is false hiding the post update button
    SettingsPage.prototype.HideButton = function () {
        var updateButton = document.getElementById('updateButton');
        updateButton.style.visibility = 'hidden';
    };
    //Function used for our toggle button to either show or hide the reproductive disorder input field and allow for user input.
    SettingsPage.prototype.ToggleDisorderUpdate = function () {
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
    };
    //Function used for our toggle button to either show or hide the birth control input field and allow for user input.
    SettingsPage.prototype.ToggleBirthControlUpdate = function () {
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
                if (this.toggleStatusUpdate == false && this.toggleTimeUpdate == false && this.togglePregnantUpdate == false && this.toggleDisorderUpdate == false) {
                    //If no toggle button is pressed to true then hide the submit button to the server called update feature.
                    this.HideButton();
                }
            }
        }
    };
    //Function used for our toggle button to either show or hide the relationship status input field and allow for user input.
    SettingsPage.prototype.ToggleStatusUpdate = function () {
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
    };
    //Function used for our toggle button to either show or hide the time of the day to input questions field and allow for user input.
    SettingsPage.prototype.ToggleTimeUpdate = function () {
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
    };
    //Function used for our toggle button to either show or hide the intention to be pregnant or not input field and allow for user input.
    SettingsPage.prototype.TogglePregnantUpdate = function () {
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
    };
    //Function that is called when the user presses the update button.
    //This function will output an error message if a certain field is missing info and has not yet been filled in.
    //If the update form is completed then the function will send the data to the server.
    SettingsPage.prototype.UpdateForm = function () {
        var _this = this;
        //The following lines of code just load in the most recent answers to the onBoarding questions (called the settings) from local storage.
        //This is necessary because any field that is not updated is still sent to the server with the most recent response to that question.
        //This helped to make server side code easier since our forms sent are the exact same for this file as for onBoarding.ts
        this.storage.get('uid').then(function (data) {
            _this.storage.get('birthday').then(function (data1) {
                _this.storage.get('cycleLength').then(function (data2) {
                    _this.storage.get('periodLength').then(function (data3) {
                        _this.storage.get('birthControl').then(function (data4) {
                            _this.storage.get('lastPeriod').then(function (data5) {
                                _this.storage.get('status').then(function (data6) {
                                    _this.storage.get('time').then(function (data7) {
                                        _this.storage.get('pregnant').then(function (data8) {
                                            _this.storage.get('reproductiveDisorder').then(function (data9) {
                                                _this.storage.get('birthControlType').then(function (data10) {
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
                                                    //Getting all the variables entered in by the user and storing them properly.
                                                    //If the toggle button is true then the the variable is set to the input field.
                                                    //If the toggle button is not pressed then the variable is set to its old value from local storage.
                                                    var birthControl;
                                                    if (_this.toggleBirthControlUpdate == true) {
                                                        birthControl = _this.birthControlUpdateResult;
                                                    }
                                                    else {
                                                        birthControl = data4;
                                                    }
                                                    var status;
                                                    if (_this.toggleStatusUpdate == true) {
                                                        status = _this.statusUpdateResult;
                                                    }
                                                    else {
                                                        status = data6;
                                                    }
                                                    var time;
                                                    if (_this.toggleTimeUpdate == true) {
                                                        time = _this.timeUpdateResult;
                                                    }
                                                    else {
                                                        time = data7;
                                                    }
                                                    var pregnant;
                                                    if (_this.togglePregnantUpdate == true) {
                                                        pregnant = _this.pregnantUpdateResult;
                                                    }
                                                    else {
                                                        pregnant = data8;
                                                    }
                                                    var reproductiveDisorder;
                                                    if (_this.toggleDisorderUpdate == true) {
                                                        reproductiveDisorder = _this.reproductiveDisorderUpdate;
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
                                                    var form_object = {
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
                                                    if (((status == '' && _this.toggleStatusUpdate == true) ||
                                                        (time == '' && _this.toggleTimeUpdate == true) ||
                                                        (pregnant == '' && _this.togglePregnantUpdate == true) ||
                                                        (reproductiveDisorder == '' && _this.toggleDisorderUpdate == true) ||
                                                        (birthControlType == 'No Answer' && _this.toggleBirthControlUpdate == true))
                                                        || ((birthControl == undefined && _this.toggleBirthControlUpdate == true)
                                                            || (reproductiveDisorder == undefined && _this.toggleDisorderUpdate == true)
                                                            || (status == undefined && _this.toggleStatusUpdate == true)
                                                            || (time == undefined && _this.toggleTimeUpdate == true)
                                                            || (pregnant == undefined && _this.togglePregnantUpdate == true))) {
                                                        if (birthControlType == 'No Answer' && _this.ToggleBirthControlUpdate) {
                                                            _this.customalert("Please fill out the birth control question since its update button is toggled", "Cannot Update");
                                                        }
                                                        if (((status == '') || (status == undefined)) && _this.toggleStatusUpdate == true) {
                                                            _this.customalert("Please fill out the relationship status question since its update button is toggled", "Cannot Update");
                                                        }
                                                        if (((time == '') || (time == undefined)) && _this.toggleTimeUpdate == true) {
                                                            _this.customalert("Please fill out the time of the day you want to respond to daily questions since its update button is toggled", "Cannot Update");
                                                        }
                                                        if (((pregnant == '') || (pregnant == undefined)) && _this.togglePregnantUpdate == true) {
                                                            _this.customalert("Please fill out if you are intending to become pregnant or not since its update button is toggled", "Cannot Update");
                                                        }
                                                        if (((reproductiveDisorder == '') || (reproductiveDisorder == undefined)) && _this.toggleDisorderUpdate == true) {
                                                            _this.customalert("Please fill out the reproductive disorder question since its update button is toggled", "Cannot Update");
                                                        }
                                                    }
                                                    else {
                                                        //Updating the responses stored in local storage
                                                        _this.storage.set('birthControl', birthControl);
                                                        _this.storage.set('birthControlType', birthControlType);
                                                        _this.storage.set('status', status);
                                                        _this.storage.set('time', time);
                                                        _this.storage.set('pregnant', pregnant);
                                                        _this.storage.set('reproductiveDisorder', reproductiveDisorder);
                                                        _this.post_update(form_object);
                                                        //This can be used to check the value of all variables and ensure that everything is being stored correctly.
                                                        /*this.customalert("Variables: " + data1 + " " + data2 + " " + data3 + " " + birthControlType + " " + data5 + " "
                                                            + status + " " + time + " " + pregnant + " " + reproductiveDisorder, "Error");*/
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    };
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
    SettingsPage.prototype.post_update = function (onboard_data) {
        var _this = this;
        // Server chnage onBoard handler url (changeOnboard.php)
        var url = "https://luna-app.000webhostapp.com/api/v1/changeOnboard.php";
        console.log("in post update");
        this.http.get(url, { params: onboard_data }).map(function (response) {
            var Obj = response.json();
            console.log(Obj.error);
            console.log(Obj.message);
            if (Obj.error == false) {
                // get request success
                console.log("post update success");
                _this.customalert("Your onboard data has been successfully updated", "Success");
                _this.navCtrl.pop(SettingsPage_1); // go back to the settings login page as updates have been made.
                //Pops the settings page off the top of the stack as it was popped on top of settingsLogin when username and password were input.
                return true;
            }
            else {
                // get request failed
                console.log("post update failure: " + Obj.message);
                _this.customalert("Failure to update your onboard data", "Failure");
                return false;
            }
        }).subscribe();
    }; // end post_update
    // a custom alert for ionic 2. 
    SettingsPage.prototype.customalert = function (s, t) {
        console.log("alert: " + s);
        var alert = this.alertCtrl.create({
            title: t,
            subTitle: s,
            buttons: ['OK']
        });
        alert.present(alert);
    };
    return SettingsPage;
}());
SettingsPage = SettingsPage_1 = __decorate([
    Component({
        selector: 'page-settings',
        templateUrl: 'settings.html'
    }),
    __metadata("design:paramtypes", [NavController, NavParams, AlertController, Http, Storage])
], SettingsPage);
export { SettingsPage };
var SettingsPage_1;
//# sourceMappingURL=settings.js.map