/*
Title: tracker.ts
Author: Dillon Pulliam
Date: 7/3/2017

EDITED BY: Katie Long
Date: 11/28/17

Purpose: This code allows the user to enter in their responses to the daily questions in the app and these responses are then sent and stored in the server.

Input:
    uid: This comes from local storage and is given to the app by the server originally.
    date: Today's date
    onPeriod,
    sexualInterest,
    sexualAttitude,
    sexualArousal,
    kissingActivity,
    caressingActivity,
    fondlingActivity,
    masturbationActivity,
    oralActivity,
    analActivity,
    vaginalActivity,
    noActivity,
    otherActivity,
    intensity


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
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';


@Component({
    selector: 'page-tracker',
    templateUrl: 'tracker.html'
})
export class TrackerPage {
    //Variables used and their corresponding type
    onPeriod: string;

    //Slider values coded as strings. All default to '1' so that the slider shows each of the possible selections
    sexualInterest: string = '1';
    sexualAttitude: string = '1';
    sexualArousal: string = '1';
    climax: string = '1';  
    intensity: string = '1';

    //Boolean variables used for the toggle buttons
    kissing: boolean = false;
    caressing: boolean = false;
    fondling: boolean = false;
    masturbation: boolean = false;
    oral: boolean = false;
    anal: boolean = false;
    vaginal: boolean = false;
    none: boolean = false;

    //Values for selfie collection
    descriptions: any[] = [];

    //Will catch the number of selfies the user posted
    numSelfies: string;
    public items: any[] = [];


    //String input for any other sexual activity
    other: string;

    // Overall indicator of whether we should expand the questions
    // Based on the values of the above.
    toggleSexualActivity: boolean = false;

    //If true, the html will expand to show the climax intesity question
    toggleClimax: boolean = false;

    //Variables used for the Statistics tab
    avgCycleLengthString: string = "You do not currently have any completed Periods on record. Continue using the app to see your average cycle/period length.";
    avgPeriodLengthString: string = "";

    //Spinner declaration and boolean
    isLoading: boolean=true;
    loading;

 

    constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private http: Http, private storage: Storage, public loadingCtrl: LoadingController) {
    }


    ionViewDidEnter() {
        console.log("Page loading...");
        this.storage.get('cycle_length').then((cycle_length) => {
            this.storage.get('period_length').then((period_length) => {
                console.log(cycle_length + ' ' + period_length);
                if (cycle_length != null && period_length != null) {
                    this.avgCycleLengthString = "Average cycle length: " + cycle_length;
                    this.avgPeriodLengthString = "Average period length: " + period_length;
                }
            })
        });
    }

    //Function used to show the question about sexual arousal during the indicated activities.
    public Show_sexualArousalQuestion() {
        var sexualArousalQuestion = document.getElementById('sexualArousalQuestion');
        sexualArousalQuestion.style.display = 'inline';
    }

    //Function used to show the question about orgasm intesity (climax intensity).
    public Show_orgasmQuestion() {
        var orgasmQuestion = document.getElementById('orgasmQuestion');
        orgasmQuestion.style.display = 'inline';
    }

    //Function used to hide the question about sexual arousal during activities.
    public Hide_sexualArousalQuestion() {
        var sexualArousalQuestion = document.getElementById('sexualArousalQuestion');
        sexualArousalQuestion.style.display = 'none';  
    }

    //Function used to hide the question on orgasm intensity (climax intesity)
    public Hide_orgasmQuestion() {
        var orgasmQuestion = document.getElementById('orgasmQuestion');
        orgasmQuestion.style.display = 'none';
        
    }

    //Function used to hide the "other" field for sexual activity
    public Hide_otherQuestion() {
        var otherQuestion = document.getElementById('otherActivityQ');
        otherQuestion.style.display = 'none';
    }

    //Function used to show the "other" field for sexual activity
    public Show_otherQuestion() {
        var otherQuestion = document.getElementById('otherActivityQ');
        otherQuestion.style.display = 'inline';
    }

    public Show_selfieDescription() {
        var selfieDesc = document.getElementById('selfieDesc');
        selfieDesc.style.display = 'inline';
    }

    public Hide_selfieDescription(){
        var selfieDesc = document.getElementById('selfieDesc');
        selfieDesc.style.display = 'none';
    }
    
    //Function to recursively add the questions for each field
    public generateSelfieQ() {

        //Clear the array
        for (var r = this.items.length; r > 0; r--) {
            this.items.pop();
        }

        //You have to cast this because type script will throw an error otherwise
        //Converts the string to a base10 decimal
        var numSelfies = parseInt(this.numSelfies, 10);
        console.log(numSelfies);

        //Push the selfie onto an array and show the description on how to fill out questions
        if (numSelfies > 0) {
            this.Show_selfieDescription();
            for (var i = 0; i < numSelfies; i++){
                //This is the structure of a singular selfie.
                //Each selfie is added to the global array "items"
                this.items.push({ name: "Photo #" + (i + 1), description: [], otherSelfie: "", boredSelfie: "", documentSelfie: "", reactionSelfie: "",  communicateSelfie: ""});
            }
        }
        else {
            this.Hide_selfieDescription();
        }
    }

    
    //Function that allows the climax toggle button to be toggled on and off either showing or hiding the climax question.
    public ToggleClimax() {

        //For debugging purposes
        console.log("Climax questions toggling....");

        //Toggle button goes from false to true, making visible the correct portions of the html page based on this button being true
        if (this.toggleClimax == false) {
            this.toggleClimax = true;
            console.log(this.toggleClimax);
            this.Show_orgasmQuestion();            
        }

        //Toggle button goes from true to false, hiding the question about climax intensity
        else {
            this.toggleClimax = false;
            this.Hide_orgasmQuestion();
        }
    }

    //Function that toggles whether the expanded questions about sexual activity are shown.
    public ToggleSexualActivity() {

        console.log("Sexual activity toggling....");

        // If at least one sexual activity is selected, show the next set of questions.
        if ((this.kissing || this.caressing || this.fondling || this.masturbation || this.oral || this.anal || this.vaginal || (this.other != '' && this.other != undefined)) && !this.none) {
            this.Show_otherQuestion();
            this.toggleSexualActivity = true;
            console.log(this.toggleSexualActivity);
            this.Show_sexualArousalQuestion();
        }

        // If 'none' is toggled, hide ALL questions and also make all other values false.
        else if (this.none) {
            //if other has an answer and someone toggles none, make it disappear
            if (this.other != '' || this.other != undefined) {
                this.Hide_otherQuestion();
                this.other = '';
            }
            this.kissing = false;
            this.caressing = false;
            this.fondling = false;
            this.masturbation = false;
            this.oral = false;
            this.anal = false;
            this.vaginal = false;
            this.toggleSexualActivity = false;
            console.log(this.toggleSexualActivity);
            this.Hide_sexualArousalQuestion();
        }

        else if (this.none && (this.kissing || this.caressing || this.fondling || this.masturbation || this.oral || this.anal || this.vaginal)) {

        }

       // Otherwise, hide the next questions. The validation function will determine if NONE is accidentally selected
        else {
            this.Show_otherQuestion();
            this.toggleSexualActivity = false;
            console.log(this.toggleSexualActivity);
            this.Hide_sexualArousalQuestion();
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
            //var sexualInterest = this.sexualInterest;

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
            var sexualInterest = this.sexualInterest;
            var sexualAttitude = this.sexualAttitude;
            var sexualArousal = this.sexualArousal;
            var noActivity = this.none ? 1 : 0;
            var kissingActivity = this.kissing ? 1 : 0;
            var caressingActivity = this.caressing ? 1 : 0;
            var fondlingActivity = this.fondling ? 1 : 0;
            var masturbationActivity = this.masturbation ? 1 : 0;
            var oralActivity = this.oral ? 1 : 0;
            var analActivity = this.anal ? 1 : 0;
            var vaginalActivity = this.vaginal ? 1 : 0;
            var otherActivity = this.other;
            var intensity = this.intensity;


            // If the user did have sexual activity, put in the post. Otherwise, ignore.
            if (this.toggleSexualActivity == true) {
                sexualArousal = this.sexualArousal;
            }
            // Else if the user did not toggle, we know they ALSO can't have answers for the climax and intensity questions
            else {
                sexualArousal = "undefined";
                this.toggleClimax = false;
            }

            //Prints all of the selfie responses
            console.log("ITEMS: ")
            console.log(this.items)
            
            // If the user did orgasm, put it's intensity in the post. Otherwise, ignore.
            if (this.toggleClimax == true) {
                intensity = this.intensity;
            }
            else {
                intensity = "undefined";
            }

            // If the user inputs nothing for other, set "other" to "undefined"
            if (otherActivity == undefined || otherActivity == '')
                otherActivity = "undefined";

            //For debugging:
            //console.log(uid, date, onPeriod, sexualInterest, sexualAttitude, noActivity, kissingActivity, caressingActivity, fondlingActivity, masturbationActivity, oralActivity, analActivity, vaginalActivity, otherActivity, intensity, sexualArousal);
          
            //try to pull up the user's period start date and end date.
            this.storage.get('period_start_date').then((start_date) => {
                console.log(start_date);
                console.log(onPeriod);
                //if the period isn't set, and they report they are on their period...
                if (onPeriod == 'Yes' && (start_date == undefined || start_date == null || start_date == '0000-00-00')) {
                    //set the start date for the user's period to today.
                    this.storage.set('period_start_date', date);
                    var form_object = {  // this  is the form object sent to the server.
                        uid: uid,
                        lastPeriodStartDate: date
                    };
                    console.log(date);
                    //update the user's period start date on the server too.
                    this.change_period_start_date(form_object);
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
                sexualAttitude: sexualAttitude,
                sexualArousal: sexualArousal,
                kissing: kissingActivity,
                caressing: caressingActivity,
                fondling: fondlingActivity,
                masturbation: masturbationActivity,
                oral: oralActivity,
                anal: analActivity,
                vaginal: vaginalActivity,
                none: noActivity,
                other: otherActivity,
                intensity: intensity
            };

            // This is how the page is submitted.
            //Note that if the user leaves out specific fields that need to be filled out then the page will not submit and an error message will be sent to the user.
            if ((sexualInterest == '' || onPeriod == '' || sexualAttitude == '')
                || (sexualInterest == undefined || onPeriod == undefined || sexualAttitude == undefined)) {
                this.customalert("Please go back through the form and fill out the first three questions.", "Cannot Submit");
            }
            else {
                if (this.toggleSexualActivity == true) {
                    if (sexualArousal == '') {
                        this.customalert("Please go back through the form and fill out missing fields.", "Cannot Submit");
                        //The above error will never occur since variables are initialized to "1".
                    }
                    else {
                        console.log(form_object);
                        this.post_tracker(form_object);
                    }
                }
                else {
                    console.log(form_object);

                    this.post_tracker(form_object);
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
        this.presentLoadingCustom();
        // Server daily questions handler url (addDaily.php)
        var url = "http://myluna.org/api/v1/addDaily.php"
        console.log("in post tracker")

        this.http.get(url, {params:tracker_data}).map((response) => {
                this.dismissLoadingCustom();
                var Obj = response.json();
                console.log(Obj.error);
                console.log(Obj.message);
                if (Obj.error == false) {
                        // get request success
                        console.log("post tracker success");
                        this.customalert("Your daily questions have been successfully submitted", "Success");
                        //this.customalert("If birth control, relationship status, or any other settings have changed please navigate to the settings tab and update them.", "User Note");
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
          message: "Please verify that the start and end date for your period look correct. They are important to finding your average cycle length.",
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
        this.presentLoadingCustom();
        // Server daily questions handler url (addDaily.php)
        var url = "http://myluna.org/api/v1/addPeriod.php"
        console.log("in post period")
        

        this.http.get(url, {params:period_data}).map((response) => {
                this.dismissLoadingCustom();
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
                        //change period start date back to null, it's been recorded.
                        var form_object = {  // this  is the form object sent to the server.
                            uid: period_data.uid,
                            lastPeriodStartDate: null
                        };
                        this.change_period_start_date(form_object);
                        return true;
                } else {
                        // get request failed
                        console.log("post tracker failure: " + Obj.message);
                        this.customalert("Failure to submit your period. Please try again.", "Failure");
                        return false;
                }
        }).subscribe();

    }   // end post_period

      // post_period_start_date
    // send HTTP post request to the server to add 
    // the period start date for this uid
    // preconditions:
    //   user has entered in a daily question that they are on their period for the first time this cycle.
    // input:
    //   a form object with mens_start and uid.
    // output:
    //   success: obj.error field set false by server
    //     lastPeriodStartDate updated to mens_start for uid.
    //   failure: obj.error field set to true by server
    //     alert to user, ask to report questions.
    public change_period_start_date(period_data) {
        
        // Server daily questions handler url (changePeriodStartDate.php)
        var url = "http://myluna.org/api/v1/changePeriodStartDate.php"
        console.log("in change period start date")
        

        this.http.get(url, {params:period_data}).map((response) => {
                
                var Obj = response.json();
                console.log(Obj.error);
                console.log(Obj.message);
                if (Obj.error == false) {
                        // get request success
                        console.log("period start date submitted");
                        //remove the locally stored start and end dates; they'll be stored next time the user reports a period.
                        console.log(response);
                        return true;
                } else {
                        // get request failed
                        console.log("post period start date failure: " + Obj.message);
                        return false;
                }
        }).subscribe();

    }   // end post_period

   

      // presentLoadingCustom()
    // Display a custom spinner to indicate that the app is communicating with the server.
    // preconditions:
    //   none.
    // input:
    //   none.
    // output:
    //   none.
    // postconditions:
    //   the 'loading' datamember will be set to a new loading control, and will display on the screen with a 10 second timeout.
    presentLoadingCustom() {
      this.isLoading=true;
      this.loading = this.loadingCtrl.create({
        spinner: 'ios',
        content: `
          <div class="custom-spinner-container">
            <div class="custom-spinner-box">Loading...</div>
          </div>`
       });

       setTimeout(() => {
            if (this.isLoading == true) {
                this.isLoading=false;
                this.loading.dismiss();
                this.customalert('Please ensure you have an internet connection and try again.', 'Timeout: Could not connect to server');
            }
       }, 10000);

       this.loading.present();

    } //end presentLoadingCustom

      // dismissLoadingCustom()
    // Dismiss the custom spinner to indicate that the app is no longer communicating with the server.
    // preconditions:
    //   'loading' datamember should be set to a loading control.
    // input:
    //   none.
    // output:
    //   none.
    // postconditions:
    //   the 'loading' datamember will be dismissed.
    dismissLoadingCustom() {
        this.loading.dismiss();
        this.isLoading=false;
    }
}
