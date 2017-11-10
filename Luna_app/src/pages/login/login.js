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
import { Http } from '@angular/http';
import { Md5 } from 'ts-md5/dist/md5';
import { CreateAccountPage } from '../createAccount/createAccount';
import { TabsPage } from '../tabs/tabs';
import { OnBoardingPage } from '../onBoarding/onBoarding';
var LoginPage = (function () {
    function LoginPage(navCtrl, navParams, alertCtrl, http, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.http = http;
        this.storage = storage;
    }
    LoginPage.prototype.Login = function () {
        var _this = this;
        // lines below grab the username and password from the form.
        var username = document.getElementsByName("username")[1].value;
        var password = document.getElementsByName("password")[1].value;
        console.log(username);
        console.log(password);
        //Hash the username and password input by the user.
        var usernameHash = Md5.hashStr(username);
        var passwordHash = Md5.hashStr(password);
        console.log(usernameHash);
        console.log(passwordHash);
        // http get requests. Gets the username and password you entered. Returns a json object with a message "User successfully logged in"
        // goes to the ReportPage is everything is okay.
        var url = "https://luna-app.000webhostapp.com/api/v1/login.php?username=" + usernameHash + "&pass=" + passwordHash;
        // this line sends to the url above
        var response;
        this.http.get(url).map(function (response) {
            var Obj = response.json();
            if (Obj.error == false && Obj.message != undefined) {
                _this.storage.set('usernameHash', usernameHash);
                _this.storage.set('passwordHash', passwordHash);
                _this.storage.set('uid', Obj.uid);
                _this.customalert("Login Successful", "Success");
                // Checks to see if user has already entered onBoarding information
                if (Obj.onboard_status == 1) {
                    // Add Onboarding Data to Local Storage
                    _this.storage.set('birthday', Obj.birthday);
                    _this.storage.set('cycleLength', Obj.cycleLength);
                    _this.storage.set('periodLength', Obj.periodLength);
                    _this.storage.set('birthControl', Obj.birthControlType);
                    _this.storage.set('lastPeriod', Obj.lastPeriod);
                    _this.storage.set('status', Obj.status);
                    _this.storage.set('time', Obj.time);
                    _this.storage.set('pregnant', Obj.pregnant);
                    _this.storage.set('reproductiveDisorder', Obj.reproductiveDisorder);
                    _this.navCtrl.setRoot(TabsPage); // go to tabs page
                }
                else {
                    // User hasn't entered onboarding info yet, redirect
                    _this.navCtrl.setRoot(OnBoardingPage); // go to onboarding page
                }
            }
            else if (Obj.message != undefined) {
                _this.customalert(Obj.message, "Error");
            }
            else {
                _this.customalert("Unknown error occurred.", "Error");
            }
        }).subscribe();
    };
    LoginPage.prototype.GoToCreateAccount = function () {
        this.navCtrl.setRoot(CreateAccountPage);
    };
    // a custom alert I have made with ionic 2. 
    LoginPage.prototype.customalert = function (s, t) {
        console.log("alert: " + s);
        var alert = this.alertCtrl.create({
            title: t,
            subTitle: s,
            buttons: ['OK']
        });
        alert.present(alert);
    };
    return LoginPage;
}());
LoginPage = __decorate([
    Component({
        selector: 'page-login',
        templateUrl: 'login.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams, AlertController, Http, Storage])
], LoginPage);
export { LoginPage };
//# sourceMappingURL=login.js.map