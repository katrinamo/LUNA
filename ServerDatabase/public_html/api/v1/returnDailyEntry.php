<?php
// Title: returnDailyEntry.php
// Author: Katie Long
// Date: 12/3/2017
// 
// Returns the data for the entry of a specific day.
// Used when user is clicking on days in the calendar.
//
// Input:
//   uid: user random ID number
//   date selected
// Output:
//   Success: Returns the data for the selected date
//      {"error":false,"message":"Successfully returned daily questions entry"} 
//   Failure: Failure message to app:
//      {"error":true,"message":"Error retrieving daily questions entry"}
// Notes:
//   Either POST or GET can be used. GET can be used for testing. 
//   App uses GET
// References:
//   modified from addPeriod.php

// Importing required scripts
require_once '../../../includes/dboperation.php';
require_once '../../../includes/funcs.php';
 
$response = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'GET')
{

    header("Access-Control-Allow-Origin: *");

    // See if proper parameters were provided
    if (verifyRequiredParams(['uid', 'selected_date']))
    {
        // Get parameter values
        $uid = $_REQUEST['uid'];
        $selected_date = $_REQUEST['selected_date'];
      
        // Create db operation object
        $db = new DbOperation();
        if (is_null($db->errMessage))
        {
            // Verify that UID exists
            if($db->authenticateUid($uid)) 
            {             
                // Create new daily questions event
		$entry = $db->returnDailyEntry($uid, $selected_date);
                if($entry != null)
                {
                    $response['error'] = false;
		    //Return the data
                    $response['message'] = 'Successfully returned daily questions entry';
		    $entry['sexualInterest'];
                }
                else
                {
                    $response['error'] = true;
                    $response['message'] = 'Error retreiving daily questions entry';
                }           
            }
            else
            {
                $response['error'] = true;
                $response['message'] = 'Invalid UID';
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
        $response['message'] = 'Malformed GET/POST statement. Check parameters.';
    }
}
else
{
    $response['error'] = true;
    $response['message'] = 'Invalid request';
}
// Echo json response
echo json_encode($response);

