/*
Title: launch.ts
Author: Ionic 3 Calendar and additions by Dillon Pulliam
    Info on the Ionic 3 Calendar can be found at the following: https://market.ionic.io/themes/ioniccalendar
Date: 7/19/2017

Purpose: This code allows initialization/launching of the calendar feature.

Additions that still need to be made: The calendar needs it's event markers to indicate the beginning and ending dates of a cycle but this feature hasn't
been added yet.

Input:

Output:
    Calendar:
        A calendar is output to the screen in month format.
        A feature that hasn't been added yet but will be is event markers to the calendar that indicate when the user's cycle will begin and end.

    Success:
        Calendar is output to the screen.

    Failure:
        Calendar is not created successfully.
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
//imports used for initialization
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
var Launch = (function () {
    function Launch(nav, navParams, alertCtrl) {
        this.nav = nav;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
    }
    return Launch;
}());
Launch = __decorate([
    Component({
        templateUrl: 'launch.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams, AlertController])
], Launch);
export { Launch };
//# sourceMappingURL=launch.js.map