/*
Title: logout.ts
Author: Sydney Norman
Date: 11/7/2017

Purpose: This code asks the user if they would like to logout.

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
import { LoginPage } from '../login/login';
var LogoutPage = (function () {
    function LogoutPage(navCtrl, navParams, alertCtrl, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
    }
    LogoutPage.prototype.Logout = function () {
        this.storage.clear();
        this.navCtrl.setRoot(LoginPage);
        console.log("Logout Successful");
    };
    // a custom alert I have made with ionic 2. 
    LogoutPage.prototype.customalert = function (s, t) {
        console.log("alert: " + s);
        var alert = this.alertCtrl.create({
            title: t,
            subTitle: s,
            buttons: ['OK']
        });
        alert.present(alert);
    };
    return LogoutPage;
}());
LogoutPage = __decorate([
    Component({
        selector: 'page-logout',
        templateUrl: 'logout.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams, AlertController, Storage])
], LogoutPage);
export { LogoutPage };
//# sourceMappingURL=logout.js.map