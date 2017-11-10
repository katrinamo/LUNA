/*
Title: tabs.ts
Author: Dillon Pulliam
Date: 7/20/2017

Purpose: This code creates and properly links our 3 tabs for main app execution

Input:

Output:
    Success:
        3 tabs are successfully created and linked in the app

    Failure:
        3 tabs are not successfully created and linked in the app.
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
import { Storage } from '@ionic/storage';
import { SettingsLoginPage } from '../settingsLogin/settingsLogin';
import { TrackerPage } from '../tracker/tracker';
import { Launch } from '../launch/launch';
import { LogoutPage } from '../logout/logout';
var TabsPage = (function () {
    function TabsPage(storage) {
        this.storage = storage;
        // this tells the tabs component which pages should be each tab's root Page
        //The following lines of code can be used to easily display the onBoarding page within the tabs or the page that can be used to display a user's uid.
        //tab1Root: any = OnBoardingPage;
        //tab1Root: any = DisplayUIDPage;
        this.tab1Root = Launch;
        this.tab2Root = TrackerPage;
        this.tab3Root = SettingsLoginPage;
        this.tab4Root = LogoutPage;
    }
    return TabsPage;
}());
TabsPage = __decorate([
    Component({
        templateUrl: 'tabs.html'
    }),
    __metadata("design:paramtypes", [Storage])
], TabsPage);
export { TabsPage };
//# sourceMappingURL=tabs.js.map