/*
Title: tracker.ts
Author: Dillon Pulliam
Date: 7/3/2017

Purpose: This code allows the user to enter in their responses to the daily questions in the app and these responses are then sent and stored in the server.

Input:
    uid: This comes from local storage and is given to the app by the server originally.
    date: Today's date
    onPeriod
    sexualInterest 
    sexualActivityNumber
    emotionalCloseness
    sexualRelationship
    sexualLife
    sexualArousal
    sexualArousalConfidence
    lubrication
    lubricationMaintain
    difficulty
    satisfaction
    discomfort

Output:
    Success:
        Tracker daily questions column added and answers stored for the current day for user.
        Success message sent to the app
        App is then linked back to the main page.

    Failure:
        Failure message sent to the app. This could either be that the server didn't recieve the data or that the user failed to fill out a necessary field for
        data to be sent.
*/

//imports needed for correct initialization.
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-tracker',
    templateUrl: 'tracker.html'
})
export class TrackerPage {
    //Variables used and their corresponding type
    onPeriod: string;
    sexualInterest: string = '1';   
    sexualActivityNumber: string;   
    emotionalCloseness: string;   
    sexualRelationship: string;   
    sexualLife: string;   
    sexualArousal: string;
    sexualArousalConfidence: string;   
    lubrication: string;   
    lubricationMaintain: string;   
    difficulty: string;   
    satisfaction: string;  
    discomfort: string;   

    //Boolean variables used for the toggle buttons
    toggleSexualActivity: boolean = false;
    toggleStimulation: boolean = false;
    toggleIntercourse: boolean = false;

    //Variables used for the Statistics tab
    avgCycleLengthString: string = "You do not currently have any completed Periods on record. Continue using the app to see your average cycle length.";

    constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private http: Http, private storage: Storage) {
    }

    //While page is loading, query the server for the user's statistics using their uid.
    ionViewDidEnter() {
        console.log("Page loading...");
        this.storage.get('uid').then((data) => {
            var uid = data;
            var form_object = {  // this is the form object sent to the server.
                    uid: uid,
            }
            console.log(uid);
            this.get_statistics(form_object);
        });

    }
    
    //Function used to show the 2nd set of daily questions if the first toggle button has been set to true
    public Show() {
        var sexualActivityNumber = document.getElementById('sexualActivityNumber');
        var emotionalCloseness = document.getElementById('emotionalCloseness');
        var sexualRelationship = document.getElementById('sexualRelationship');
        var sexualLife = document.getElementById('sexualLife');
        var sexualArousal = document.getElementById('sexualArousal');
        var sexualArousalConfidence = document.getElementById('sexualArousalConfidence');
        var lubrication = document.getElementById('lubrication');
        var lubricationMaintain = document.getElementById('lubricationMaintain');
        var stimulation = document.getElementById('stimulation');
        var Note1 = document.getElementById('Note1');
        var Note2 = document.getElementById('Note2');
        var Note3 = document.getElementById('Note3');
        var Note4 = document.getElementById('Note4');
        var Note5 = document.getElementById('Note5');
        var Note6 = document.getElementById('Note6');
        var Note7 = document.getElementById('Note7');
        var Note8 = document.getElementById('Note8');
        var Note9 = document.getElementById('Note9');
        var Note10 = document.getElementById('Note10');
        var Note11 = document.getElementById('Note11');
        var Note12 = document.getElementById('Note12');
        var Note13 = document.getElementById('Note13');
        var Note14 = document.getElementById('Note14');
        var Note15 = document.getElementById('Note15');
        var Note16 = document.getElementById('Note16');
        var Note17 = document.getElementById('Note17');
        var Note18 = document.getElementById('Note18');
        var Note19 = document.getElementById('Note19');
        var Note20 = document.getElementById('Note20');
        var Note21 = document.getElementById('Note21');

        sexualActivityNumber.style.visibility = 'visible';
        emotionalCloseness.style.visibility = 'visible';
        sexualRelationship.style.visibility = 'visible';
        sexualLife.style.visibility = 'visible';
        sexualArousal.style.visibility = 'visible';
        sexualArousalConfidence.style.visibility = 'visible';
        lubrication.style.visibility = 'visible';
        lubricationMaintain.style.visibility = 'visible';
        stimulation.style.visibility = 'visible';
        Note1.style.visibility = 'visible';
        Note2.style.visibility = 'visible';
        Note3.style.visibility = 'visible';
        Note4.style.visibility = 'visible';
        Note5.style.visibility = 'visible';
        Note6.style.visibility = 'visible';
        Note7.style.visibility = 'visible';
        Note8.style.visibility = 'visible';
        Note9.style.visibility = 'visible';
        Note10.style.visibility = 'visible';
        Note11.style.visibility = 'visible';
        Note12.style.visibility = 'visible';
        Note13.style.visibility = 'visible';
        Note14.style.visibility = 'visible';
        Note15.style.visibility = 'visible';
        Note16.style.visibility = 'visible';
        Note17.style.visibility = 'visible';
        Note18.style.visibility = 'visible';
        Note19.style.visibility = 'visible';
        Note20.style.visibility = 'visible';
        Note21.style.visibility = 'visible';
    }

    //Function used to show the 3rd set of daily questions if the 2nd toggle button has been set to true.
    public Show1() {
        var difficulty = document.getElementById('difficulty');
        var satisfaction = document.getElementById('satisfaction');
        var intercourse = document.getElementById('intercourse');
        var Note22 = document.getElementById('Note22');
        var Note23 = document.getElementById('Note23');
        var Note24 = document.getElementById('Note24');
        var Note25 = document.getElementById('Note25');
        var Note26 = document.getElementById('Note26');

        difficulty.style.visibility = 'visible';
        satisfaction.style.visibility = 'visible';
        intercourse.style.visibility = 'visible';
        Note22.style.visibility = 'visible';
        Note23.style.visibility = 'visible';
        Note24.style.visibility = 'visible';
        Note25.style.visibility = 'visible';
        Note26.style.visibility = 'visible';
    }

    //Function used to show the 4th set of daily questions if the 3rd toggle button has been set to true.
    public Show2() {
        var discomfort = document.getElementById('discomfort');
        var Note27 = document.getElementById('Note27');
        var Note28 = document.getElementById('Note28');

        discomfort.style.visibility = 'visible';
        Note27.style.visibility = 'visible';
        Note28.style.visibility = 'visible';
    }

    //Function used to hide the 2nd set of daily questions if the 1st toggle button is set to false
    public Hide() {
        var sexualActivityNumber = document.getElementById('sexualActivityNumber');
        var emotionalCloseness = document.getElementById('emotionalCloseness');
        var sexualRelationship = document.getElementById('sexualRelationship');
        var sexualLife = document.getElementById('sexualLife');
        var sexualArousal = document.getElementById('sexualArousal');
        var sexualArousalConfidence = document.getElementById('sexualArousalConfidence');
        var lubrication = document.getElementById('lubrication');
        var lubricationMaintain = document.getElementById('lubricationMaintain');
        var stimulation = document.getElementById('stimulation');
        var Note1 = document.getElementById('Note1');
        var Note2 = document.getElementById('Note2');
        var Note3 = document.getElementById('Note3');
        var Note4 = document.getElementById('Note4');
        var Note5 = document.getElementById('Note5');
        var Note6 = document.getElementById('Note6');
        var Note7 = document.getElementById('Note7');
        var Note8 = document.getElementById('Note8');
        var Note9 = document.getElementById('Note9');
        var Note10 = document.getElementById('Note10');
        var Note11 = document.getElementById('Note11');
        var Note12 = document.getElementById('Note12');
        var Note13 = document.getElementById('Note13');
        var Note14 = document.getElementById('Note14');
        var Note15 = document.getElementById('Note15');
        var Note16 = document.getElementById('Note16');
        var Note17 = document.getElementById('Note17');
        var Note18 = document.getElementById('Note18');
        var Note19 = document.getElementById('Note19');
        var Note20 = document.getElementById('Note20');
        var Note21 = document.getElementById('Note21');

        sexualActivityNumber.style.visibility = 'hidden';
        emotionalCloseness.style.visibility = 'hidden';
        sexualRelationship.style.visibility = 'hidden';
        sexualLife.style.visibility = 'hidden';
        sexualArousal.style.visibility = 'hidden';
        sexualArousalConfidence.style.visibility = 'hidden';
        lubrication.style.visibility = 'hidden';
        lubricationMaintain.style.visibility = 'hidden';
        stimulation.style.visibility = 'hidden';
        Note1.style.visibility = 'hidden';
        Note2.style.visibility = 'hidden';
        Note3.style.visibility = 'hidden';
        Note4.style.visibility = 'hidden';
        Note5.style.visibility = 'hidden';
        Note6.style.visibility = 'hidden';
        Note7.style.visibility = 'hidden';
        Note8.style.visibility = 'hidden';
        Note9.style.visibility = 'hidden';
        Note10.style.visibility = 'hidden';
        Note11.style.visibility = 'hidden';
        Note12.style.visibility = 'hidden';
        Note13.style.visibility = 'hidden';
        Note14.style.visibility = 'hidden';
        Note15.style.visibility = 'hidden';
        Note16.style.visibility = 'hidden';
        Note17.style.visibility = 'hidden';
        Note18.style.visibility = 'hidden';
        Note19.style.visibility = 'hidden';
        Note20.style.visibility = 'hidden';
        Note21.style.visibility = 'hidden';
    }

    //Function used to hide the 3rd set of daily questions if the 2nd toggle button is set to false.
    public Hide1() {
        var difficulty = document.getElementById('difficulty');
        var satisfaction = document.getElementById('satisfaction');
        var intercourse = document.getElementById('intercourse');
        var Note22 = document.getElementById('Note22');
        var Note23 = document.getElementById('Note23');
        var Note24 = document.getElementById('Note24');
        var Note25 = document.getElementById('Note25');
        var Note26 = document.getElementById('Note26');

        difficulty.style.visibility = 'hidden';
        satisfaction.style.visibility = 'hidden';
        intercourse.style.visibility = 'hidden';
        Note22.style.visibility = 'hidden';
        Note23.style.visibility = 'hidden';
        Note24.style.visibility = 'hidden';
        Note25.style.visibility = 'hidden';
        Note26.style.visibility = 'hidden';
    }

    //Function used to hide the 4th set of daily questions if the 3rd toggle button is set to false.
    public Hide2() {
        var discomfort = document.getElementById('discomfort');
        var Note27 = document.getElementById('Note27');
        var Note28 = document.getElementById('Note28');

        discomfort.style.visibility = 'hidden';
        Note27.style.visibility = 'hidden';
        Note28.style.visibility = 'hidden';
    }

    //Function used to show the correct submit button.
    public ShowSubmit1() {
        var Submit1 = document.getElementById('Submit1');

        Submit1.style.visibility = 'visible';
    }

    //Function used to show the correct submit button.
    public ShowSubmit2() {
        var Submit2 = document.getElementById('Submit2');

        Submit2.style.visibility = 'visible';
    }

    //Function used to show the correct submit button.
    public ShowSubmit3() {
        var Submit3 = document.getElementById('Submit3');

        Submit3.style.visibility = 'visible';
    }

    //Function used to show the correct submit button.
    public ShowSubmit4() {
        var Submit4 = document.getElementById('Submit4');

        Submit4.style.visibility = 'visible';
    }

    //Function used to show the correct submit button.
    public HideSubmit1() {
        var Submit1 = document.getElementById('Submit1');

        Submit1.style.visibility = 'hidden';
    }

    //Function used to show the correct submit button.
    public HideSubmit2() {
        var Submit2 = document.getElementById('Submit2');

        Submit2.style.visibility = 'hidden';
    }

    //Function used to show the correct submit button.
    public HideSubmit3() {
        var Submit3 = document.getElementById('Submit3');

        Submit3.style.visibility = 'hidden';
    }

    //Function used to show the correct submit button.
    public HideSubmit4() {
        var Submit4 = document.getElementById('Submit4');

        Submit4.style.visibility = 'hidden';
    }

    //Function that allows the 3rd toggle button to be toggled on and off either showing or hiding the 4th set of daily questions.
    public ToggleIntercourse() {
        console.log("ToggleIntercourse Loading....");
        if (this.toggleIntercourse == false) {
            //Toggle button goes from false to true
            this.toggleIntercourse = true;
            console.log(this.toggleIntercourse);
            if (this.toggleIntercourse == true) {
                //Outputting the correct info to the screen based on the toggle button being set to true.
                //Also initializes variables correctly.
                this.Show2();
                this.ShowSubmit4();
                this.HideSubmit1();
                this.HideSubmit2();
                this.HideSubmit3();
                this.discomfort = '1';
            }
        } else {
            this.toggleIntercourse = false;
            //Toggle button goes from true to false
            console.log(this.toggleIntercourse);
            if (this.toggleIntercourse == false) {
                //Hiding the correct features of the html page based on this toggle button being false.
                this.Hide2();
                this.ShowSubmit3();
                this.HideSubmit1();
                this.HideSubmit2();
                this.HideSubmit4();
            }
        }
    }

    //Function that allows the 2nd toggle button to be toggled on and off either showing or hiding the 3rd set of daily questions.
    public ToggleStimulation() {
        console.log("ToggleStimulation Loading....");
        if (this.toggleStimulation == false) {
            //Toggle button goes from false to true
            this.toggleStimulation = true;
            console.log(this.toggleStimulation);
            if (this.toggleStimulation == true) {
                //Making visible the correct portions of the html page based on this button being true
                this.Show1();
                this.difficulty = '1';
                this.satisfaction = '1';
                //A check on the later toggle button so if it is still set to true the correct features will be visible or hidden
                if (this.toggleIntercourse == true) {
                    this.Show2();
                    this.ShowSubmit4();
                    this.HideSubmit1();
                    this.HideSubmit2();
                    this.HideSubmit3();
                    this.discomfort = '1';
                }
                else {
                    this.Hide2();
                    this.ShowSubmit3();
                    this.HideSubmit1();
                    this.HideSubmit2();
                    this.HideSubmit4();
                }
                //end new
            }
        } else {
            this.toggleStimulation = false;
            //Toggle button goes from true to false
            console.log(this.toggleStimulation);
            if (this.toggleStimulation == false) {
                //Hiding the correct features of the app based on this toggle button being false
                this.Hide1();
                this.Hide2();
                this.ShowSubmit2();
                this.HideSubmit1();
                this.HideSubmit3();
                this.HideSubmit4();
            }
        }
    }

    //Function that allows the 1st toggle button to be toggled on and off either showing or hiding the 2nd set of daily questions.
    public ToggleSexualActivity() {
        console.log("ToggleSexualActivity Loading....");
        if (this.toggleSexualActivity == false) {
            //Toggle button goes from false to true
            this.toggleSexualActivity = true;
            console.log(this.toggleSexualActivity);
            if (this.toggleSexualActivity == true) {
                //Making visible the correct features of the app based on this toggle button being true
                //Also initializes the range components to an initial value of 1.
                this.Show();
                this.sexualActivityNumber = '1';
                this.emotionalCloseness = '1';
                this.sexualRelationship = '1';
                this.sexualLife = '1';
                this.sexualArousal = '1';
                this.sexualArousalConfidence = '1';
                this.lubrication = '1';
                this.lubricationMaintain = '1';
                //A check on the 2nd toggle button so if it was set to true or false at an earlier time and remains so its elements will be made visiible or hidden
                if (this.toggleStimulation == true) {
                    this.Show1();
                    this.difficulty = '1';
                    this.satisfaction = '1';
                    //A check on the 3rd toggle button so if it was set to true or false at an earlier time and remains so its elements will be made visiible or hidden
                    if (this.toggleIntercourse == true) {
                        this.Show2();
                        this.ShowSubmit4();
                        this.HideSubmit1();
                        this.HideSubmit2();
                        this.HideSubmit3();
                        this.discomfort = '1';
                    }
                    else {
                        this.Hide2();
                        this.ShowSubmit3();
                        this.HideSubmit1();
                        this.HideSubmit2();
                        this.HideSubmit4();
                    }
                }
                else {
                    this.Hide1();
                    this.Hide2();
                    this.ShowSubmit2();
                    this.HideSubmit1();
                    this.HideSubmit3();
                    this.HideSubmit4();
                }
            }
        } else {
            this.toggleSexualActivity = false;
            //Toggle button goes from true to false
            console.log(this.toggleSexualActivity);
            if (this.toggleSexualActivity == false) {
                //Hiding the correct elements of the html page based on this button being false
                this.Hide();
                this.Hide1();
                this.Hide2();
                this.ShowSubmit1();
                this.HideSubmit2();
                this.HideSubmit3();
                this.HideSubmit4();
            }
        }
    }

    //Function that is called when the user presses the submit button.
    //This function will output an error message if a certain field is missing info and has not yet been filled in.
    //If the form is completed then the function will send the data to the server.
    //Also, send the period length for a user when they have answered yes to daily questions for their period, then no.
    public SubmitForm() { // Form submitted to the server for email deployment. 
        //Get the uid from local storage
        this.storage.get('uid').then((data) => {
            var uid = data;

            //Variables used and getting the results entered in by the user.
            var onPeriod = this.onPeriod;
            var sexualInterest = this.sexualInterest;

            //Getting the date
            var today = new Date();

            //Getting the day and putting it into the correct format.
            var day = today.getDate();
            var dayString;
            if (day < 10) {
                dayString = '0' + day.toFixed(0);
            }
            else {
                dayString = day.toFixed(0);
            }

            //Getting the month and putting it into the correct format.
            var month = today.getMonth() + 1; //January is 0!
            var monthString;
            if (month < 10) {
                monthString = '0' + month.toFixed(0);
            }
            else {
                monthString = month.toFixed(0);
            }

            //Getting the year and putting it into the correct format.
            var year = today.getFullYear();
            var yearString = year.toFixed(0);

            //Putting the date variable into its final and correct format
            var date = yearString + "-" + monthString + "-" + dayString;

            //Note: All these variables have a check on them so that if the user checks a toggle button and fills in the form but then goes back and 
            //unchecks the toggle button the data is not stored and sent to the server but instead is replaced with the words undefined or the correct value
            //so the server doesn't get wrong data.
            var sexualActivityNumber;
            if (this.toggleSexualActivity == true) {
                sexualActivityNumber = this.sexualActivityNumber;
            }
            else {
                //sexualActivityNumber = undefined;
                sexualActivityNumber = "0";
            }

            var emotionalCloseness;
            if (this.toggleSexualActivity == true) {
                emotionalCloseness = this.emotionalCloseness;
            }
            else {
                emotionalCloseness = "undefined";
            }

            var sexualRelationship;
            if (this.toggleSexualActivity == true) {
                sexualRelationship = this.sexualRelationship;
            }
            else {
                sexualRelationship = "undefined";
            }

            var sexualLife;
            if (this.toggleSexualActivity == true) {
                sexualLife = this.sexualLife;
            }
            else {
                sexualLife = "undefined";
            }

            var sexualArousal;
            if (this.toggleSexualActivity == true) {
                sexualArousal = this.sexualArousal;
            }
            else {
                sexualArousal = "undefined";
            }

            var sexualArousalConfidence;
            if (this.toggleSexualActivity == true) {
                sexualArousalConfidence = this.sexualArousalConfidence;
            }
            else {
                sexualArousalConfidence = "undefined";
            }

            var lubrication;
            if (this.toggleSexualActivity == true) {
                lubrication = this.lubrication;
            }
            else {
                lubrication = "undefined";
            }

            var lubricationMaintain;
            if (this.toggleSexualActivity == true) {
                lubricationMaintain = this.lubricationMaintain;
            }
            else {
                lubricationMaintain = "undefined";
            }

            var difficulty;
            if (this.toggleSexualActivity == true) {
                if (this.toggleStimulation == true) {
                    difficulty = this.difficulty;
                }
                else {
                    difficulty = "undefined";
                }
            }
            else {
                difficulty = "undefined";
            }

            var satisfaction;
            if (this.toggleSexualActivity == true) {
                if (this.toggleStimulation == true) {
                    satisfaction = this.satisfaction;
                }
                else {
                    satisfaction = "undefined";
                }
            }
            else {
                satisfaction = "undefined";
            }

            var discomfort;
            if (this.toggleSexualActivity == true) {
                if (this.toggleStimulation == true) {
                    if (this.toggleIntercourse == true) {
                        discomfort = this.discomfort;
                    }
                    else {
                        discomfort = "undefined";
                    }
                }
                else {
                    discomfort = "undefined";
                }
            }
            else {
                discomfort = "undefined";
            }

            //For debugging purposes
            console.log(uid);
            console.log(date);
            console.log(onPeriod);
            console.log(sexualInterest);
            console.log(sexualActivityNumber);
            console.log(emotionalCloseness);
            console.log(sexualRelationship);
            console.log(sexualLife);
            console.log(sexualArousal);
            console.log(sexualArousalConfidence);
            console.log(lubrication);
            console.log(lubricationMaintain);
            console.log(difficulty);
            console.log(satisfaction);
            console.log(discomfort);

            

            //try to pull up the user's period start date and end date.
            this.storage.get('period_start_date').then((start_date) => {
                //if the period isn't set, and they report they are on their period...
                if (onPeriod == 'Yes' && start_date == undefined) {
                    //set the start date for the user's period to today.
                    this.storage.set('period_start_date', date);
                    console.log('period start date saved.');
                //if the period is set, and they report they aren't on their period...
                } else if (onPeriod == 'No' && start_date != undefined && start_date != date) {
                    //store today as their end date - it looks like they have a period to report.
                    this.storage.set('period_end_date', date);
                    console.log('period end date saved!');
                    this.periodAlertForm(uid, start_date, date);
                }
            });


            //Varaibles sent to the server.
            //Note that all variables are sent as strings.
            var form_object = {  // this  is the form object sent to the server.
                uid: uid,
                date: date,
                onPeriod: onPeriod,
                sexualInterest: sexualInterest,
                sexualActivityNumber: sexualActivityNumber,
                emotionalCloseness: emotionalCloseness,
                sexualRelationship: sexualRelationship,
                sexualLife: sexualLife,
                sexualArousal: sexualArousal,
                sexualArousalConfidence: sexualArousalConfidence,
                lubrication: lubrication,
                lubricationMaintain: lubricationMaintain,
                difficulty: difficulty,
                satisfaction: satisfaction,
                discomfort: discomfort
            };

            // This is how the page is submitted.
            //Note that if the user leads out specific fields that need to be filled out then the page will not submit and an error message will be sent to the user.
            if ((sexualInterest == '' || onPeriod == '')
                || (sexualInterest == undefined || onPeriod == undefined)) {
                this.customalert("Please go back through the form and fill out if you are on currently on your period or not.", "Cannot Submit");
            }
            else {
                if (this.toggleSexualActivity == true) {
                    if ((sexualActivityNumber == ''
                        || emotionalCloseness == ''
                        || sexualRelationship == ''
                        || sexualLife == ''
                        || sexualArousal == ''
                        || sexualArousalConfidence == ''
                        || lubrication == ''
                        || lubricationMaintain == '')
                        || (sexualActivityNumber == undefined
                            || emotionalCloseness == undefined
                            || sexualRelationship == undefined
                            || sexualLife == undefined
                            || sexualArousal == undefined
                            || sexualArousalConfidence == undefined
                            || lubrication == undefined
                            || lubricationMaintain == undefined)) {
                        this.customalert("Please go back through the form and fill out missing fields.", "Cannot Submit");
                        //The above error will never occur since variables are initialized to "1".
                    }
                    else {
                        if (this.toggleStimulation == true) {
                            if ((difficulty == ''
                                || satisfaction == '')
                                || (difficulty == undefined
                                    || satisfaction == undefined)) {
                                this.customalert("Please go back through the form and fill out missing fields.", "Cannot Submit");
                                //The above error will never occur since variables are initialized to "1".
                            }
                            else {
                                if (this.toggleIntercourse == true) {
                                    if ((discomfort == '')
                                        || (discomfort == undefined)) {
                                        this.customalert("Please go back through the form and fill out missing fields.", "Cannot Submit");
                                        //The above error will never occur since variables are initialized to "1".
                                    }
                                    else {
                                        this.post_tracker(form_object);
                                        // This can be used to print out varaibles and ensure everything is storing properly.
                                        /*this.customalert("Variables: " + onPeriod + " " + sexualInterest + " " + sexualActivityNumber + " " + emotionalCloseness + " " + sexualRelationship + " " + sexualLife + " "
                                            + sexualArousal + " " + sexualArousalConfidence + " " + lubrication + " " + lubricationMaintain + " " + difficulty + " " + satisfaction + " " + discomfort, "Error");
                                        */
                                    }
                                }
                                else {
                                    this.post_tracker(form_object);
                                    // This can be used to print out varaibles and ensure everything is storing properly.
                                    /*this.customalert("Variables: " + onPeriod + " " + sexualInterest + " " + sexualActivityNumber + " " + emotionalCloseness + " " + sexualRelationship + " " + sexualLife + " "
                                        + sexualArousal + " " + sexualArousalConfidence + " " + lubrication + " " + lubricationMaintain + " " + difficulty + " " + satisfaction + " " + discomfort, "Error");
                                    */
                                }
                            }
                        }
                        else {
                            this.post_tracker(form_object);
                            // This can be used to print out varaibles and ensure everything is storing properly.
                            /*this.customalert("Variables: " + onPeriod + " " + sexualInterest + " " + sexualActivityNumber + " " + emotionalCloseness + " " + sexualRelationship + " " + sexualLife + " "
                                + sexualArousal + " " + sexualArousalConfidence + " " + lubrication + " " + lubricationMaintain + " " + difficulty + " " + satisfaction + " " + discomfort, "Error");
                            */
                        }
                    }
                }
                else {
                    this.post_tracker(form_object);
                    // This can be used to print out varaibles and ensure everything is storing properly.
                    /*this.customalert("Variables: " + onPeriod + " " + sexualInterest + " " + sexualActivityNumber + " " + emotionalCloseness + " " + sexualRelationship + " " + sexualLife + " "
                        + sexualArousal + " " + sexualArousalConfidence + " " + lubrication + " " + lubricationMaintain + " " + difficulty + " " + satisfaction + " " + discomfort + " " + date + " " + uid, "Error");*/
                }
            }
        });
    }

    // post_tracker
    // send HTTP post request to the server to add 
    // daily questions answers to entry table for this uid
    // input:
    //   (see form_object above)
    //   object with all daily question answers, uid, date
    // output:
    //   success: obj.error field set false by server
    //     answers added to entry table, alert to user,
    //     link back to main page of app.
    //   failure: obj.error field set to true by server
    //     alert to user 
    public post_tracker(tracker_data) {
        // Server daily questions handler url (addDaily.php)
        var url = "https://luna-app.000webhostapp.com/api/v1/addDaily.php"
        console.log("in post tracker")

        this.http.get(url, {params:tracker_data}).map((response) => {
                var Obj = response.json();
                console.log(Obj.error);
                console.log(Obj.message);
                if (Obj.error == false) {
                        // get request success
                        console.log("post tracker success");
                        this.customalert("Your daily questions have been successfully submitted", "Success");
                        this.customalert("If birth control, relationship status, or any other settings have changed please navigate to the settings tab and update them.", "User Note");
                        console.log(response);
                        return true;
                } else {
                        // get request failed
                        console.log("post tracker failure: " + Obj.message);
                        this.customalert("Failure to submit your daily questions", "Failure");
                        return false;
                }
        }).subscribe();

    }   // end post_tracker

    
    

    

    // a custom alert for ionic 2. 
    public customalert(s: string, t: string) {
        console.log("alert: " + s);
        let alert = this.alertCtrl.create({
            title: t,
            subTitle: s,
            buttons: ['OK']
        });
        alert.present(alert);
    }

    // an alert with date fields
    public periodAlertForm(uid: string, start_date: string, end_date: string){

        let prompt = this.alertCtrl.create({
          title: "It appears you\'ve finished your period.",
          message: "Please verify that these fields look correct. They are important to finding your average cycle length.",
          inputs: [
          {
            name: 'PeriodStartDate',
            placeholder: 'Start Date',
            value: start_date,
            type: "date"
          },
          {
            name: 'PeriodEndDate',
            placeholder: 'End Date',
            value: end_date,
            type: "date"
          },
          ],
          buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
              this.customalert("Your daily questions have not been submitted. Please try again.", "Submission Cancelled");
            }
          },
          {
            text: 'OK',
            handler: data => {
              var form_object = {  // this  is the form object sent to the server.
                uid: uid,
                mens_start: data.PeriodStartDate,
                mens_end: data.PeriodEndDate
              };
              console.log(data.PeriodStartDate);
              console.log(data.PeriodEndDate);
              console.log(uid);
              console.log("Saved!");
              this.post_period(form_object);
            }
          }
          ]
        });

        prompt.present(prompt);
  }


      // post_period
    // send HTTP post request to the server to add 
    // a period for this uid
    // preconditions:
    //   user has entered in a daily question that they were on their period, and then they entered that they were not.
    // input:
    //   a form object with mens_start, mens_end, and uid
    // output:
    //   success: obj.error field set false by server
    //     period added to Period table.
    //   failure: obj.error field set to true by server
    //     alert to user, ask to report questions.
    public post_period(period_data) {
        // Server daily questions handler url (addDaily.php)
        var url = "https://luna-app.000webhostapp.com/api/v1/addPeriod.php"
        console.log("in post period")
        

        this.http.get(url, {params:period_data}).map((response) => {
                var Obj = response.json();
                console.log(Obj.error);
                console.log(Obj.message);
                if (Obj.error == false) {
                        // get request success
                        console.log("post period success");
                        this.customalert("Your period has been successfully submitted.", "Success");
                        //remove the locally stored start and end dates; they'll be stored next time the user reports a period.
                        this.storage.remove('period_start_date');
                        this.storage.remove('period_end_date');
                        console.log(response);
                        return true;
                } else {
                        // get request failed
                        console.log("post tracker failure: " + Obj.message);
                        this.customalert("Failure to submit your period. Please try again.", "Failure");
                        return false;
                }
        }).subscribe();

    }   // end post_period

          // get_statistics
    // send HTTP post request to the server to get statistics for the current user.
    // preconditions:
    //   none.
    // input:
    //   a form object with uid.
    // output:
    //   success: obj.error field set false by server
    //     user statistics successfully returned.
    //   failure: obj.error field set to true by server
    //     alert to user, ask to report questions.
    public get_statistics(statistics_data) {
        // Server daily questions handler url (addDaily.php)
        var url = "https://luna-app.000webhostapp.com/api/v1/getUserStats.php"
        console.log("in get statistics")
        

        this.http.get(url, {params:statistics_data}).map((response) => {
                var Obj = response.json();
                console.log(Obj.error);
                console.log(Obj.message);
                if (Obj.error == false) {
                        // get request success
                        console.log("get statistics success");
                        this.avgCycleLengthString = "User's average cycle length: "+Obj.average_cycle_length;
                        console.log(response);
                        return true;
                } else {
                        // get request failed
                        console.log("get statistics failure: " + Obj.message);
                        return false;
                }
        }).subscribe();

    }   // end post_period
}
