/*
Title: displayUID.ts
Author: Dillon Pulliam
Date: 7/20/2017

Purpose: This code creates a button that can be pressed which will output the UID of the user to the screen.
This code is not actually used in the app but is a debugging feature where this page can replace calendar or some other page
if its suspected that the app is having issues storing and retreiving a users UID from local storage.

Input:
    None

Output:
    An alert to the user displaying their UID.

    Success:
        UID output to the screen when the button is pressed.

    Failure:
        UID is not output to the screen when the button is pressed.
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
//imports needed for app initialization.
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
var DisplayUIDPage = (function () {
    function DisplayUIDPage(navCtrl, navParams, alertCtrl, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
    }
    DisplayUIDPage.prototype.ShowVariables = function () {
        var _this = this;
        this.storage.get('uid').then(function (data) {
            var uid = data;
            _this.customalert(uid, 'Variables');
        });
    };
    // a custom alert I have made with ionic 2. 
    DisplayUIDPage.prototype.customalert = function (s, t) {
        console.log("alert: " + s);
        var alert = this.alertCtrl.create({
            title: t,
            subTitle: s,
            buttons: ['OK']
        });
        alert.present(alert);
    };
    return DisplayUIDPage;
}());
DisplayUIDPage = __decorate([
    Component({
        selector: 'page-displayUID',
        templateUrl: 'displayUID.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams, AlertController, Storage])
], DisplayUIDPage);
export { DisplayUIDPage };
//# sourceMappingURL=displayUID.js.map