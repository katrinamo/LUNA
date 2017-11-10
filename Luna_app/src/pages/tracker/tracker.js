/*
Title: tracker.ts
Author: Dillon Pulliam
Date: 7/3/2017

Purpose: This code allows the user to enter in their responses to the daily questions in the app and these responses are then sent and stored in the server.

Input:
    uid: This comes from local storage and is given to the app by the server originally.
    date: Today's date
    onPeriod
    sexualInterest
    sexualActivityNumber
    emotionalCloseness
    sexualRelationship
    sexualLife
    sexualArousal
    sexualArousalConfidence
    lubrication
    lubricationMaintain
    difficulty
    satisfaction
    discomfort

Output:
    Success:
        Tracker daily questions column added and answers stored for the current day for user.
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
//imports needed for correct initialization.
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
var TrackerPage = (function () {
    function TrackerPage(navCtrl, navParams, alertCtrl, http, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.http = http;
        this.storage = storage;
        this.sexualInterest = '1';
        //Boolean variables used for the toggle buttons
        this.kissing = false;
        this.caressing = false;
        this.fondling = false;
        this.masturbation = false;
        this.oral = false;
        this.anal = false;
        this.vaginal = false;
        // ** TODO **: start this out as true! whenever selected, make all others go to false
        //             and don't allow user to type into other
        this.none = false;
        this.toggleSexualActivity = false; // Overall indicator of whether we should expand the questions
        // Based on the values of the above.
        this.toggleClimax = false;
        //Variables used for the Statistics tab
        this.avgCycleLengthString = "You do not currently have any completed Periods on record. Continue using the app to see your average cycle length.";
    }
    //While page is loading, query the server for the user's statistics using their uid.
    TrackerPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        console.log("Page loading...");
        this.storage.get('uid').then(function (data) {
            var uid = data;
            var form_object = {
                uid: uid,
            };
            console.log(uid);
            _this.get_statistics(form_object);
        });
    };
    //Function used to show the 3rd set of daily questions if the 2nd toggle button has been set to true.
    TrackerPage.prototype.Show_sexualArousalQuestion = function () {
        var sexualArousalQuestion = document.getElementById('sexualArousalQuestion');
        sexualArousalQuestion.style.display = 'inline';
    };
    //Function used to show the 4th set of daily questions if the 3rd toggle button has been set to true.
    TrackerPage.prototype.Show_orgasmQuestion = function () {
        var orgasmQuestion = document.getElementById('orgasmQuestion');
        orgasmQuestion.style.display = 'inline';
    };
    //Function used to hide the 3rd set of daily questions if the 2nd toggle button is set to false.
    TrackerPage.prototype.Hide_sexualArousalQuestion = function () {
        var sexualArousalQuestion = document.getElementById('sexualArousalQuestion');
        sexualArousalQuestion.style.display = 'none';
    };
    //Function used to hide the 4th set of daily questions if the 3rd toggle button is set to false.
    TrackerPage.prototype.Hide_orgasmQuestion = function () {
        var orgasmQuestion = document.getElementById('orgasmQuestion');
        orgasmQuestion.style.display = 'none';
    };
    //Function that allows the climax toggle button to be toggled on and off either showing or hiding the climax question.
    TrackerPage.prototype.ToggleClimax = function () {
        console.log("Climax questions toggling....");
        //Toggle button goes from false to true, making visible the correct portions of the html page based on this button being true
        if (this.toggleClimax == false) {
            this.toggleClimax = true;
            console.log(this.toggleClimax);
            this.Show_orgasmQuestion();
        }
        else {
            this.toggleClimax = false;
            this.Hide_orgasmQuestion();
        }
    };
    //Function that allows the 1st toggle button to be toggled on and off either showing or hiding the 2nd set of daily questions.
    TrackerPage.prototype.ToggleSexualActivity = function () {
        console.log("Sexual activity toggling....");
        // If at least one sexual activity is selected, show the next set of questions.
        if ((this.kissing || this.caressing || this.fondling || this.masturbation || this.oral || this.anal || this.vaginal || (this.other != '' && this.other != undefined)) && !this.none) {
            this.toggleSexualActivity = true;
            console.log(this.toggleSexualActivity);
            this.Show_sexualArousalQuestion();
        }
        else if ((this.other != '' && this.other != undefined)) {
            this.toggleSexualActivity = true;
            console.log(this.toggleSexualActivity);
            this.Show_sexualArousalQuestion();
        }
        else {
            this.toggleSexualActivity = false;
            console.log(this.toggleSexualActivity);
            this.Hide_sexualArousalQuestion();
        }
    };
    //Function that is called when the user presses the submit button.
    //This function will output an error message if a certain field is missing info and has not yet been filled in.
    //If the form is completed then the function will send the data to the server.
    //Also, send the period length for a user when they have answered yes to daily questions for their period, then no.
    TrackerPage.prototype.SubmitForm = function () {
        var _this = this;
        //Get the uid from local storage
        this.storage.get('uid').then(function (data) {
            var uid = data;
            //Variables used and getting the results entered in by the user.
            var onPeriod = _this.onPeriod;
            var sexualInterest = _this.sexualInterest;
            //Getting the date
            var today = new Date();
            //Getting the day and putting it into the correct format.
            var day = today.getDate();
            var dayString;
            if (day < 10) {
                dayString = '0' + day.toFixed(0);
            }
            else {
                dayString = day.toFixed(0);
            }
            //Getting the month and putting it into the correct format.
            var month = today.getMonth() + 1; //January is 0!
            var monthString;
            if (month < 10) {
                monthString = '0' + month.toFixed(0);
            }
            else {
                monthString = month.toFixed(0);
            }
            //Getting the year and putting it into the correct format.
            var year = today.getFullYear();
            var yearString = year.toFixed(0);
            //Putting the date variable into its final and correct format
            var date = yearString + "-" + monthString + "-" + dayString;
            //Note: All these variables have a check on them so that if the user checks a toggle button and fills in the form but then goes back and 
            //unchecks the toggle button the data is not stored and sent to the server but instead is replaced with the words undefined or the correct value
            //so the server doesn't get wrong data.
            var sexualInterest = _this.sexualInterest;
            var sexualAttitude = _this.sexualAttitude;
            var sexualArousal = _this.sexualArousal;
            var noActivity = _this.none;
            var kissingActivity = _this.kissing;
            var caressingActivity = _this.caressing;
            var fondlingActivity = _this.fondling;
            var masturbationActivity = _this.masturbation;
            var oralActivity = _this.oral;
            var analActivity = _this.anal;
            var vaginalActivity = _this.vaginal;
            var otherActivity = _this.other;
            var intensity = _this.intensity;
            // If the user did have sexual activity, put in the post. Otherwise, ignore.
            if (_this.toggleSexualActivity == true) {
                sexualArousal = _this.sexualArousal;
            }
            else {
                sexualArousal = "undefined";
                _this.toggleClimax = false;
            }
            // If the user did orgasm, put it's intensity in the post. Otherwise, ignore.
            if (_this.toggleClimax == true) {
                intensity = _this.intensity;
            }
            else {
                intensity = "undefined";
            }
            // ** TODO ** COMBINE THIS INTO ONE LINE, CHRIST!
            console.log(uid);
            console.log(date);
            console.log(onPeriod);
            console.log(sexualInterest);
            console.log(sexualAttitude);
            console.log(noActivity);
            console.log(kissingActivity);
            console.log(caressingActivity);
            console.log(fondlingActivity);
            console.log(masturbationActivity);
            console.log(oralActivity);
            console.log(analActivity);
            console.log(vaginalActivity);
            console.log(otherActivity);
            console.log(intensity);
            console.log(sexualArousal);
            //try to pull up the user's period start date and end date.
            _this.storage.get('period_start_date').then(function (start_date) {
                //if the period isn't set, and they report they are on their period...
                if (onPeriod == 'Yes' && start_date == undefined) {
                    //set the start date for the user's period to today.
                    _this.storage.set('period_start_date', date);
                    console.log('period start date saved.');
                    //if the period is set, and they report they aren't on their period...
                }
                else if (onPeriod == 'No' && start_date != undefined && start_date != date) {
                    //store today as their end date - it looks like they have a period to report.
                    _this.storage.set('period_end_date', date);
                    console.log('period end date saved!');
                    _this.periodAlertForm(uid, start_date, date);
                }
            });
            //Varaibles sent to the server.
            //Note that all variables are sent as strings.
            var form_object = {
                uid: uid,
                date: date,
                onPeriod: onPeriod,
                sexualInterest: sexualInterest,
                sexualAttitude: sexualAttitude,
                sexualArousal: sexualArousal,
                kissing: kissingActivity,
                caressing: caressingActivity,
                fondling: fondlingActivity,
                masturbation: masturbationActivity,
                oral: oralActivity,
                anal: analActivity,
                vaginal: vaginalActivity,
                none: noActivity,
                other: otherActivity,
                intensity: intensity
            };
            // This is how the page is submitted.
            //Note that if the user leads out specific fields that need to be filled out then the page will not submit and an error message will be sent to the user.
            if ((sexualInterest == '' || onPeriod == '' || sexualAttitude == '')
                || (sexualInterest == undefined || onPeriod == undefined || sexualAttitude == undefined)) {
                _this.customalert("Please go back through the form and fill out the first three questions.", "Cannot Submit");
            }
            else {
                if (_this.toggleSexualActivity == true) {
                    if (sexualArousal == '') {
                        _this.customalert("Please go back through the form and fill out missing fields.", "Cannot Submit");
                        //The above error will never occur since variables are initialized to "1".
                    }
                    else {
                        _this.post_tracker(form_object);
                    }
                }
                else {
                    _this.post_tracker(form_object);
                }
            }
        });
    };
    // post_tracker
    // send HTTP post request to the server to add 
    // daily questions answers to entry table for this uid
    // input:
    //   (see form_object above)
    //   object with all daily question answers, uid, date
    // output:
    //   success: obj.error field set false by server
    //     answers added to entry table, alert to user,
    //     link back to main page of app.
    //   failure: obj.error field set to true by server
    //     alert to user 
    TrackerPage.prototype.post_tracker = function (tracker_data) {
        var _this = this;
        // Server daily questions handler url (addDaily.php)
        var url = "https://luna-app.000webhostapp.com/api/v1/addDaily.php";
        console.log("in post tracker");
        this.http.get(url, { params: tracker_data }).map(function (response) {
            var Obj = response.json();
            console.log(Obj.error);
            console.log(Obj.message);
            if (Obj.error == false) {
                // get request success
                console.log("post tracker success");
                _this.customalert("Your daily questions have been successfully submitted", "Success");
                _this.customalert("If birth control, relationship status, or any other settings have changed please navigate to the settings tab and update them.", "User Note");
                console.log(response);
                return true;
            }
            else {
                // get request failed
                console.log("post tracker failure: " + Obj.message);
                _this.customalert("Failure to submit your daily questions", "Failure");
                return false;
            }
        }).subscribe();
    }; // end post_tracker
    // a custom alert for ionic 2. 
    TrackerPage.prototype.customalert = function (s, t) {
        console.log("alert: " + s);
        var alert = this.alertCtrl.create({
            title: t,
            subTitle: s,
            buttons: ['OK']
        });
        alert.present(alert);
    };
    // an alert with date fields
    TrackerPage.prototype.periodAlertForm = function (uid, start_date, end_date) {
        var _this = this;
        var prompt = this.alertCtrl.create({
            title: "It appears you\'ve finished your period.",
            message: "Please verify that these fields look correct. They are important to finding your average cycle length.",
            inputs: [
                {
                    name: 'PeriodStartDate',
                    placeholder: 'Start Date',
                    value: start_date,
                    type: "date"
                },
                {
                    name: 'PeriodEndDate',
                    placeholder: 'End Date',
                    value: end_date,
                    type: "date"
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                        _this.customalert("Your daily questions have not been submitted. Please try again.", "Submission Cancelled");
                    }
                },
                {
                    text: 'OK',
                    handler: function (data) {
                        var form_object = {
                            uid: uid,
                            mens_start: data.PeriodStartDate,
                            mens_end: data.PeriodEndDate
                        };
                        console.log(data.PeriodStartDate);
                        console.log(data.PeriodEndDate);
                        console.log(uid);
                        console.log("Saved!");
                        _this.post_period(form_object);
                    }
                }
            ]
        });
        prompt.present(prompt);
    };
    // post_period
    // send HTTP post request to the server to add 
    // a period for this uid
    // preconditions:
    //   user has entered in a daily question that they were on their period, and then they entered that they were not.
    // input:
    //   a form object with mens_start, mens_end, and uid
    // output:
    //   success: obj.error field set false by server
    //     period added to Period table.
    //   failure: obj.error field set to true by server
    //     alert to user, ask to report questions.
    TrackerPage.prototype.post_period = function (period_data) {
        var _this = this;
        // Server daily questions handler url (addDaily.php)
        var url = "https://luna-app.000webhostapp.com/api/v1/addPeriod.php";
        console.log("in post period");
        this.http.get(url, { params: period_data }).map(function (response) {
            var Obj = response.json();
            console.log(Obj.error);
            console.log(Obj.message);
            if (Obj.error == false) {
                // get request success
                console.log("post period success");
                _this.customalert("Your period has been successfully submitted.", "Success");
                //remove the locally stored start and end dates; they'll be stored next time the user reports a period.
                _this.storage.remove('period_start_date');
                _this.storage.remove('period_end_date');
                console.log(response);
                return true;
            }
            else {
                // get request failed
                console.log("post tracker failure: " + Obj.message);
                _this.customalert("Failure to submit your period. Please try again.", "Failure");
                return false;
            }
        }).subscribe();
    }; // end post_period
    // get_statistics
    // send HTTP post request to the server to get statistics for the current user.
    // preconditions:
    //   none.
    // input:
    //   a form object with uid.
    // output:
    //   success: obj.error field set false by server
    //     user statistics successfully returned.
    //   failure: obj.error field set to true by server
    //     alert to user, ask to report questions.
    TrackerPage.prototype.get_statistics = function (statistics_data) {
        var _this = this;
        // Server daily questions handler url (addDaily.php)
        var url = "https://luna-app.000webhostapp.com/api/v1/getUserStats.php";
        console.log("in get statistics");
        this.http.get(url, { params: statistics_data }).map(function (response) {
            var Obj = response.json();
            console.log(Obj.error);
            console.log(Obj.message);
            if (Obj.error == false) {
                // get request success
                console.log("get statistics success");
                _this.avgCycleLengthString = "User's average cycle length: " + Obj.average_cycle_length;
                console.log(response);
                return true;
            }
            else {
                // get request failed
                console.log("get statistics failure: " + Obj.message);
                return false;
            }
        }).subscribe();
    }; // end post_period
    return TrackerPage;
}());
TrackerPage = __decorate([
    Component({
        selector: 'page-tracker',
        templateUrl: 'tracker.html'
    }),
    __metadata("design:paramtypes", [NavController, NavParams, AlertController, Http, Storage])
], TrackerPage);
export { TrackerPage };
//# sourceMappingURL=tracker.js.map