/*
Title: app.components.ts
Author: Dillon Pulliam
Date: 7/20/2017

Purpose: This code helps to properly create and initialize the app and also sets the beginning page that the app opens up in.

Input:
    None

Output:
    None

    Success:
        App is created successfully

    Failure:
        App fails to be created and launch.
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
//imports needed for correct initialization
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { Launch } from '../pages/launch/launch';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
var MyApp = (function () {
    function MyApp(platform, 
        //public menu: MenuController,
        statusBar, splashScreen) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        //@ViewChild(Nav) nav: Nav;
        this.rootPage = LoginPage;
        this.initializeApp();
        // set our app's pages
        this.pages = [
            { title: 'Login Page', component: LoginPage },
            { title: 'Launch page', component: Launch }
        ];
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    return MyApp;
}());
MyApp = __decorate([
    Component({
        templateUrl: 'app.html'
    }),
    __metadata("design:paramtypes", [Platform,
        StatusBar,
        SplashScreen])
], MyApp);
export { MyApp };
/*      DEBUG
export class MyApp {
    rootPage = LoginPage;

    //Below can be used for debugging if you want the app to initially open up in a specific page
    //rootPage = TabsPage;
    //rootPage = OnBoardingPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.StatusBar.styleDefault();
      this.Splashscreen.hide();
    });
  }
}
*/ // DEBUG
//# sourceMappingURL=app.component.js.map