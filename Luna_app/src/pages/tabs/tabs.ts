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

//imports needed for correct initialization.
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SettingsLoginPage } from '../settingsLogin/settingsLogin';
import { TrackerPage } from '../tracker/tracker';
import { Launch } from '../launch/launch';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
    // this tells the tabs component which pages should be each tab's root Page

    //The following lines of code can be used to easily display the onBoarding page within the tabs or the page that can be used to display a user's uid.
    //tab1Root: any = OnBoardingPage;
    //tab1Root: any = DisplayUIDPage;

    tab1Root: any = Launch;
    tab2Root: any = TrackerPage;
    tab3Root: any = SettingsLoginPage;

    constructor(private storage: Storage) {
  }
}
