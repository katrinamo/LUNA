<?php
// Title: auth.php
// Author: Paul Piwowarski
// Date 7/2017
//
// Search the user table for the emailID received from the app
// If found, put the received username and password in it.
// Send the uid in the user entry to the app
//
// input from app:
//   username, password, emailID
// output (emailID found):
//   user table entry updated with username, password, 
//   active flag set true. uid sent to app with success message
// output (emailID not found):
//   failure message sent app
//
// References:
//   modified from https://www.simplifiedios.net/swift-php-mysql-tutorial/
//   by Belal Khan

// Importing required scripts
require_once '../../../includes/dboperation.php';  
require_once '../../../includes/funcs.php';
 
$response = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'GET')
{   
    header("Access-Control-Allow-Origin: *");
    // See if proper parameters were provided
    if (verifyRequiredParams(['username', 'pass','emailID']))
    {
        // Get parameter values
        $username = $_REQUEST['username'];
        $password = $_REQUEST['pass'];
        $emailID = $_REQUEST['emailID'];
        // Create db operation object
        $db = new DbOperation();
        if (is_null($db->errMessage))
        {
            // Check to see if EmailID is already in use
            $isEmailIDActive = $db->isEmailIDActive($emailID);
            if (!$isEmailIDActive) {
                // Check to see if username is unique
                $doesUserExist = $db->doesUserExist($username);
                if (!$doesUserExist) {
                    // Find emailID in user table
                    $result = $db->findEmailID($emailID,$username,$password);
                    if ($result> 0)
                    {
                        // EmailID found in user table,
                        // Username is unique
                        // put username and password in the user row columns
                        // uid in user entry returned in message field
                        $response['error'] = false;
                        $response['message'] = $result; // uid from user table
                   }
                    else
                    {
                        if ($result == 0)  // 0 = emailID not found
                        {
                            $response['error'] = true;
                            $response['message'] = 'random emailID not found';
                        }            
                        else {  
                            // error searching for email ID   (negative number)
                            // when error log available, log to it
                            // user cannot do anything
                            $response['error'] = $result;
                            $response['message']='DB error searching for emailID';
                        }
                    }
                }
                else {
                    $response['error'] = true;
                    $response['message'] = "Username already exists";
                }
            }
            else {
                $response['error'] = true;
                $response['message'] = "EmailID is already in use. Try logging in instead.";
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
        $response['message'] = 'emailID, Username and password are required';
    }    
}
else
{
    $response['error'] = true;
    $response['message'] = 'Invalid request';
}
// Echo json response
echo json_encode($response);
