<?php
// Title: getUserStats.php
// Author: Tristan
// Date: 11/03/2017 
// 
// Client will send uid to retrieve stats for that user, primarily the cycle length.
//
// Input:
//   uid: user random ID number
// Output:
//   Success: Success message to app with stats for user in JSON:
//      {"error":false,"message":"Successfully retrieved user stats.","cycle_length":(cycle_length)} 
//   Failure: Failure message to app:
//      {"error":true,"message":"Error retrieving user stats."}
// Notes:
//   Either POST or GET can be used. GET can be used for testing. 
//   Apps uses post 
// References:
//   modified from addPeriod.php

// Importing required scripts
require_once '../../../includes/dboperation.php';
require_once '../../../includes/funcs.php';
 
$response = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'GET')
{
    // See if proper parameters were provided
    if (verifyRequiredParams(['uid']))
    {
        // Get parameter values
        $uid = $_REQUEST['uid'];
      
        // Create db operation object
        $db = new DbOperation();
        if (is_null($db->errMessage))
        {
            // Verify that UID exists
            if($db->authenticateUid($uid)) 
            {             
                // get average cycle length
                $average = $db->getUserStats($uid);
                if($average != -1.0)
                {
                    $response['error'] = false;
                    $response['message'] = 'Successfully retrieved user stats.';
                    $response['average_cycle_length'] = $average;
                }
                else
                {
                    $response['error'] = true;
                    $response['message'] = 'Error retrieving user stats - user has no Period entries.';
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