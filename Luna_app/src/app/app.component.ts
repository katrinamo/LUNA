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

//imports needed for correct initialization
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { Launch } from '../pages/launch/launch';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //@ViewChild(Nav) nav: Nav;

 
     rootPage = LoginPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    //public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Login Page', component: LoginPage },
      { title: 'Launch page', component: Launch }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
/*
  openPage(page) {
    // close the menu when clicking a link from the menu
    //this.menu.close();
    // navigate to the new page if it is not the current page
    //this.nav.setRoot(page.component);
  }
  */
}

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
*/    // DEBUG
