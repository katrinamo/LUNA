/*
Title: app.module.ts
Author: Dillon Pulliam
Date: 7/20/2017

Purpose: This code helps to properly create and initialize the app.

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
//imports needed for correct initialization
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage'; //added for localStorage
import { MyApp } from './app.component';
import { OnBoardingPage } from '../pages/onBoarding/onBoarding';
import { SettingsPage } from '../pages/settings/settings';
import { SettingsLoginPage } from '../pages/settingsLogin/settingsLogin';
import { TrackerPage } from '../pages/tracker/tracker';
import { LoginPage } from '../pages/login/login';
import { DisplayUIDPage } from '../pages/displayUID/displayUID';
import { CalendarComponent } from '../pages/calendar/calendar';
import { CalendarService } from '../pages/calendar/calendar.service';
import { Launch } from '../pages/launch/launch';
import { TabsPage } from '../pages/tabs/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    NgModule({
        declarations: [
            MyApp,
            OnBoardingPage,
            SettingsPage,
            SettingsLoginPage,
            TrackerPage,
            LoginPage,
            DisplayUIDPage,
            Launch,
            CalendarComponent,
            TabsPage
        ],
        imports: [
            BrowserModule,
            HttpModule,
            IonicStorageModule.forRoot(),
            IonicModule.forRoot(MyApp, {
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                monthShortNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                dayShortNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'],
            })
        ],
        bootstrap: [IonicApp],
        entryComponents: [
            MyApp,
            OnBoardingPage,
            SettingsPage,
            SettingsLoginPage,
            TrackerPage,
            LoginPage,
            DisplayUIDPage,
            Launch,
            CalendarComponent,
            TabsPage
        ],
        providers: [StatusBar, SplashScreen, { provide: ErrorHandler, useClass: IonicErrorHandler }, CalendarService]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map