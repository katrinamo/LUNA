/*
Title: settingsLogin.ts
Author: Dillon Pulliam
Date: 7/16/2017

Purpose: This code asks the user for their username and password in order to be able to jump to the settings page where responses and updates to
onBoarding questions can be made

Input:
    username: Hashed and compared to the hashed version of the username stored in local storage when the original login page was accessed
    password: Hashed and compared to the hashed version of the password stored in local storage when the original login page was accessed

Output:
    Success:
        Username and password hashed versions match those stored in local storage and the settings page is accessed.

    Failure:
        Error message sent to the user that the hashed version of username or password didn't match and the settings page is not accessed.
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
import { Storage } from '@ionic/storage';
import { Md5 } from 'ts-md5/dist/md5';
import { SettingsPage } from '../settings/settings';
//This will eventually be changed to our calendar!!!
/*import { OnBoardingPage } from '../onBoarding/onBoarding';
import { TrackerPage } from '../tracker/tracker';
import { TabsPage } from '../tabs/tabs';*/
var SettingsLoginPage = (function () {
    function SettingsLoginPage(navCtrl, navParams, alertCtrl, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
    }
    SettingsLoginPage.prototype.GoToSettings = function () {
        var _this = this;
        //The following lines of code get the most recent answers to the onBoarding questions (the settings) and loads the results stored in local storage.
        //These results are then passed in parameters to the the settings page once it is accessed so the currents settings can easily be output to the screen 
        //within the html page. This is a work-around for asynchronous timing issues that come with typescript.
        this.storage.get('birthday').then(function (data1) {
            _this.storage.get('cycleLength').then(function (data2) {
                _this.storage.get('periodLength').then(function (data3) {
                    _this.storage.get('birthControl').then(function (data4) {
                        _this.storage.get('lastPeriod').then(function (data5) {
                            _this.storage.get('status').then(function (data6) {
                                _this.storage.get('time').then(function (data7) {
                                    _this.storage.get('pregnant').then(function (data8) {
                                        _this.storage.get('reproductiveDisorder').then(function (data9) {
                                            _this.storage.get('usernameHash').then(function (data10) {
                                                _this.storage.get('passwordHash').then(function (data11) {
                                                    _this.storage.get('birthControlType').then(function (data12) {
                                                        //Create variables to store the seetings values from local storage in
                                                        var oldBirthday = data1;
                                                        var oldCycleLength = data2;
                                                        var oldPeriodLength = data3;
                                                        var oldBirthControl = data4;
                                                        var oldBirthControlType = data12;
                                                        var oldLastPeriod = data5;
                                                        var oldStatus = data6;
                                                        var oldTime = data7;
                                                        var oldPregnant = data8;
                                                        var oldReproductiveDisorder = data9;
                                                        var oldUsernameHash = data10;
                                                        var oldPasswordHash = data11;
                                                        // lines below grab the username and password from the form.
                                                        var username = document.getElementsByName("username")[1].value;
                                                        var password = document.getElementsByName("password")[1].value;
                                                        //For debugging purposes
                                                        console.log(username);
                                                        console.log(password);
                                                        if ((username == ''
                                                            && password == '')
                                                            || (username == undefined
                                                                && password == undefined)) {
                                                            _this.customalert("Please fill out the username and password fields", "Cannot Go To Settings");
                                                        }
                                                        else if ((password == '')
                                                            || (password == undefined)) {
                                                            _this.customalert("Please fill out the password field", "Cannot Go To Settings");
                                                        }
                                                        else if ((username == '')
                                                            || (username == undefined)) {
                                                            _this.customalert("Please fill out the username field", "Cannot Go To Settings");
                                                        }
                                                        else {
                                                            //Hash the username and password input by the user.
                                                            var usernameHash = Md5.hashStr(username);
                                                            var passwordHash = Md5.hashStr(password);
                                                            if ((usernameHash != oldUsernameHash) && (passwordHash != oldPasswordHash)) {
                                                                _this.customalert("The username and password entered are incorrect.", "Cannot Go To Settings");
                                                            }
                                                            else if (usernameHash != oldUsernameHash) {
                                                                _this.customalert("The username entered is incorrect.", "Cannot Go To Settings");
                                                            }
                                                            else if (passwordHash != oldPasswordHash) {
                                                                _this.customalert("The password entered is incorrect.", "Cannot Go To Settings");
                                                            }
                                                            else {
                                                                //everything entered in is correct.
                                                                //Push the settings page on top of the settingsLogin page and pass in the current settings values 
                                                                //as parameters which were loaded from local storage and stored in variables above.
                                                                _this.navCtrl.push(SettingsPage, {
                                                                    birthdayPassed: oldBirthday,
                                                                    cycleLengthPassed: oldCycleLength,
                                                                    periodLengthPassed: oldPeriodLength,
                                                                    birthControlPassed: oldBirthControl,
                                                                    lastPeriodPassed: oldLastPeriod,
                                                                    statusPassed: oldStatus,
                                                                    timePassed: oldTime,
                                                                    pregnantPassed: oldPregnant,
                                                                    reproductiveDisorderPassed: oldReproductiveDisorder,
                                                                    birthControlTypePassed: oldBirthControlType
                                                                });
                                                            }
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
        });
    };
    // a custom alert I have made with ionic 2. 
    SettingsLoginPage.prototype.customalert = function (s, t) {
        console.log("alert: " + s);
        var alert = this.alertCtrl.create({
            title: t,
            subTitle: s,
            buttons: ['OK']
        });
        alert.present(alert);
    };
    return SettingsLoginPage;
}());
SettingsLoginPage = __decorate([
    Component({
        selector: 'page-settingsLogin',
        templateUrl: 'settingsLogin.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams, AlertController, Storage])
], SettingsLoginPage);
export { SettingsLoginPage };
//# sourceMappingURL=settingsLogin.js.map