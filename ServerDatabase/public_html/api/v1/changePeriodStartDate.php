<?php
// Title: changePeriodStartDate.php
// Author: Tristan Basil
// Date: 12/3/17
//
// Change period start date in user's data in user table. 
//
// Input:
//   uid: user random ID number
//   lastPeriodStartDate: date of period start date for cycle. only set when user in period.
//
// Output:
//   Success: onboard columns changed in user table for user
//   success message to app:
//      {"error":false,"message":"Period start date successfully updated"} 
//   Failure: Failure message to app:
//      {"error":true,"message":"Error changing period start date"}
// Notes:
//   Either POST or GET can be used. GET can be used for testing. 
//   
// References:
//   modified from changeOnboard.php

// Importing required scripts
require_once '../../../includes/dboperation.php';
require_once '../../../includes/funcs.php';

$response = [];

// GET used for testing
if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'GET')
{

    header("Access-Control-Allow-Origin: *");

    // See if proper parameters were provided  
    if (verifyRequiredParams(['uid', 'lastPeriodStartDate']))  
    {      
        // Get parameter values
        $uid = $_REQUEST['uid'];
        $lastPeriodStartDate = $_REQUEST['lastPeriodStartDate'];      

        // Create db operation object
        $db = new DbOperation();
        if (is_null($db->errMessage))
        {         
            // Verify that uid is in user table  
            if ($db->authenticateUid($uid)) 
            {     
                // change the onboard fields in user table          
                if ($db->changePeriodStartDate($uid, $lastPeriodStartDate)) 
                {                  
                    $response['error'] = false;
                    $response['message'] = 'Period start date successfully updated';              
                }
                else
                {
                    $response['error'] = true;
                    $response['message'] = 'Error changing period start date';
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