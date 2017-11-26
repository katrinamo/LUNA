<?php
// Title: Register
// Author: Paul Piwowarski
// Date: 7/2017
//
// Executed from index.html to get the new user email address. 
// It executes createUser to create a new user in the user table 
// with a random emailID field, and random uid. 
// The emailID is sent to the new user's email address. 
// The new user then downloads the app and uses it to
// complete registration.
//
// References:
//   modified from Spring 2017 Luna register.php

// Importing required scripts
require_once '../../../includes/dboperation.php';
require_once '../../../includes/funcs.php';

$response = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST')
{

    header("Access-Control-Allow-Origin: *");

    // See if proper parameter was provided
    if (verifyRequiredParams(['emailaddress']))
    {
        // Get parameter value
        $emailAddress = $_REQUEST['emailaddress'];
        // verify that email address is a UK campus address:
        // ends in "@uky.edu" or
        // ends in @g.uky.edu
        $ending1 = preg_match("/.+@uky\.edu$/",$emailAddress);
        $ending2 = preg_match("/.+@g\.uky\.edu$/",$emailAddress);
        if  ($ending1 || $ending2) 
        {
            // Create db operation object
            $db = new DbOperation();
            if (is_null($db->errMessage))
            {
                // Create new user with random emailID
                $emailID = $db->createUser();
                if (!is_null($emailID))
                {
                    // Send message to new user email address
                    // containing random emailID
                    $l1="Thank you for your interest in this research application. ";
                    $l2="\nDownload the research study app from the Apple app store:";
                    $l3="\nhttps://www.apple.com/ios/app-store/";
                    $l4 = "\nEnter this random user name in the downloaded app to participate in the study:";
                    $l5 = "\n".$emailID;
                    $l6="\nKaylynne M. Glover";
                    $l7="\nUniversity of Kentucky";
                    $l8="\nPhD Student, Biology Department";
                    $msg = $l1.$l2.$l3.$l4.$l5.$l6.$l7.$l8;
                    // use wordwrap() if lines are longer than 70 characters
                    $msg = wordwrap($msg,70);
                    $subject = "Behavior and the Menstrual Cycle Research Study Participant Identifier";

		    $emailfrom = 'kaylynnemglover@gmail.com';
                    $fromname = 'Luna';
                    
                    $headers = 
	                    'Return-Path: ' . $emailfrom . "\r\n" . 
	                    'From: ' . $fromname . ' <' . $emailfrom . '>' . "\r\n" . 
	                    'X-Priority: 3' . "\r\n" . 
	                    'X-Mailer: PHP ' . phpversion() .  "\r\n" . 
	                    'Reply-To: ' . $fromname . ' <' . $emailfrom . '>' . "\r\n" .
	                    'MIME-Version: 1.0' . "\r\n" . 
	                    'Content-Transfer-Encoding: 8bit' . "\r\n" . 
	                    'Content-Type: text/plain; charset=UTF-8' . "\r\n";
	            $params = '-f ' . $emailfrom;
                    
                    $rc = mail($emailAddress, $subject, $msg, $headers, $params);

                    if ($rc)
                    {
                        // respond success message to be displayed 
                        $response['error'] = false;
                        $response['message'] = 'Your random user name has been sent to your campus email address.';
                    }
                    else
                    {
                        $response['error'] = true;
                        $response['message'] = 'Error sending message to your email address. Please check it'; 
                    }
                }
                else
                {
                    $response['error'] = true;
                    //$response['message'] = 'Error creating new user';
                    $response['message'] = $emailID;
                }
    
            }
            else
            {
                $response['error'] = true;
                $response['message'] = $db->errMessage;
            }
        }
        else
        {
            $response['error'] = true;
            $response['message'] = 'You must provide a University of Kentucky email address (xxx@uky.edu, xxx@g.uky.edu)';   
        }
    }
    else
    {
        $response['error'] = true;
        $response['message'] = 'You must provide your UK email address';
    }
}
?>
<html>
<body>
    <div style="width: 75%;margin: 0 auto;text-align: center;">
        <p style="text-align: center">
            Register to Participate in a Research Study<br><br>
            <span style="font-weight: bold">Behavior and the Menstrual Cycle</span><br><br>
        </p>
        <?php
            // Check if an error was given as part of the response
            //   - does not count null response
            if($response['error'] === false)
            {
                echo $response['message'] . "<p>Download the research study app from the Apple app store:<br>
                    https://www.apple.com/ios/app-store/
                    <br>and fill in the random user name sent to your email address";
            }
            else
            {
                // If error occurred, display red label
                if($response['error'] === true)
                {
                    echo "<label style='color: red;font-weight: bold;'>*" . $response['message'] . "</label><br><br>";
                }
        ?>
            <p>A randomly generated user name will be sent to your University of Kentucky email address to you.</p>
            <p>Note: You must provide your UK email address that ends in @uky.edu, or @g.uky.edu.</p>
            <form method='post' style="text-align: center;">
                <table style='margin: auto;'>
                    <tr>
                        <td>
                            Your UK email address:&nbsp;
                        </td>
                        <td>
                            <input type="text" name="emailaddress" placeholder="email address" minlength="8" required/>
                        </td>
                    </tr>
                </table>
                <br>
                <input type="submit" value="Register">
                <br>
            </form>
        <?php } ?>
    </div>
</body>
</html>
