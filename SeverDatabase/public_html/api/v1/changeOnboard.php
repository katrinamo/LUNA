<?php
// Title: changeOnboard.php
// Author: Danyse Hickman
// Date: 6/27/17
//
// Change onboard fields in user's data in user table. 
//
// Input:
//   uid: user random ID number
//   All 9 onboard question data as name/value pairs
//  (birthday, cycleLength, etc.)
//
// Output:
//   Success: onboard columns changed in user table for user
//   success message to app:
//      {"error":false,"message":"Onboard successfully changed"} 
//   Failure: Failure message to app:
//      {"error":true,"message":"Error changing onboard"}
// Notes:
//   Either POST or GET can be used. GET can be used for testing. 
//   
// References:
//   modified from changePassword.php

// Importing required scripts
require_once '../../../includes/dboperation.php';
require_once '../../../includes/funcs.php';

$response = [];

// GET used for testing
if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'GET')
{
    // See if proper parameters were provided  
    if (verifyRequiredParams(['uid', 'birthday', 'cycleLength', 'periodLength', 'birthControlType', 'lastPeriod', 'status', 'pregnant', 'reproductiveDisorder']))  
    {      
        // Get parameter values
        $uid = $_REQUEST['uid'];
        $birthday = $_REQUEST['birthday'];      
        $cycleLength = $_REQUEST['cycleLength'];
        $periodLength = $_REQUEST['periodLength'];
        $birthControlType = $_REQUEST['birthControlType'];
        $lastPeriod = $_REQUEST['lastPeriod'];
        $status = $_REQUEST['status'];
        $time = $_REQUEST['time'];
        $pregnant = $_REQUEST['pregnant'];
        $reproductiveDisorder = $_REQUEST['reproductiveDisorder'];

        // Create db operation object
        $db = new DbOperation();
        if (is_null($db->errMessage))
        {         
            // Verify that uid is in user table  
            if ($db->authenticateUid($uid)) 
            {     
                // change the onboard fields in user table          
                if ($db->changeOnboard($uid, $birthday,$cycleLength, $periodLength, $birthControlType, $lastPeriod, $status, $time, $pregnant, $reproductiveDisorder)) 
                {                  
                    $response['error'] = false;
                    $response['message'] = 'Onboard successfully changed';              
                }
                else
                {
                    $response['error'] = true;
                    $response['message'] = 'Error changing onboard';
                }
            
            }
            else
            {
                $response['error'] = true;
                $response['message'] = 'User ID not found';
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
        $response['message'] = '***User ID required';
    }
}
else
{
    $response['error'] = true;
    $response['message'] = 'Invalid request';
}
// Echo json response
echo json_encode($response);