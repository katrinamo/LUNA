<?php
// Title: addPeriod.php
// Author: Tristan
// Date: 11/01/2017 
// 
// Client will send uid, start date, and end date of period. 
// Row added to entry table.
//
// Input:
//   uid: user random ID number
//   start date
//   end date
// Output:
//   Success: Row added to entry table, success message to app:
//      {"error":false,"message":"Successfully added period"} 
//   Failure: Failure message to app:
//      {"error":true,"message":"Error adding period"}
// Notes:
//   Either POST or GET can be used. GET can be used for testing. 
//   Apps uses post 
// References:
//   modified from addDaily.php

// Importing required scripts
require_once '../../../includes/dboperation.php';
require_once '../../../includes/funcs.php';
 
$response = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'GET')
{

    header("Access-Control-Allow-Origin: *");

    // See if proper parameters were provided
    if (verifyRequiredParams(['uid', 'mens_start', 'mens_end']))
    {
        // Get parameter values
        $uid = $_REQUEST['uid'];
        $start_date = $_REQUEST['mens_start'];
        $end_date = $_REQUEST['mens_end'];
      
        // Create db operation object
        $db = new DbOperation();
        if (is_null($db->errMessage))
        {
            // Verify that UID exists
            if($db->authenticateUid($uid)) 
            {             
                //verify that there are no conflicting period entries.
                if ($db->isPeriodDateConflict($uid, $start_date, $end_date)) {
                    $response['error'] = true;
                    $response['message'] = 'This period entry conflicts with a previous period entry.';
                }
                // Create new daily questions event if the period is validated.
                else if($db->createPeriod($uid, $start_date, $end_date))
                {
                    $response['error'] = false;
                    $response['message'] = 'Successfully added period';
                }
                else
                {
                    $response['error'] = true;
                    $response['message'] = 'Error adding period';
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
        $response['message'] = 'Missing data from app';
    }
}
else
{
    $response['error'] = true;
    $response['message'] = 'Invalid request';
}
// Echo json response
echo json_encode($response);
