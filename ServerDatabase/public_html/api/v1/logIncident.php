<?php
// Title: LogIncident
// Author: Joshua Cockerill
// 05/20/2017 PEP1 chenge doesHashedUserExist to doesUserExist
// User IDs will be hashed in table. Client will sned hshed login Uers ID 
// This file contains a script to verify a hashed username exists, log
// an incident location/date, and echo a JSON encoded response string
//
// References:
//   modified from auth.php

// Importing required scripts
require_once '../../../includes/dboperation.php';
require_once '../../../includes/funcs.php';
 
$response = [];

// GET used for testing
if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'GET')
{
    // See if proper parameters were provided
    if (verifyRequiredParams(['userHash', 'location', 'date']))
    {
        // Get parameter values
        $user_hash = $_REQUEST['userHash'];
        $loc = $_REQUEST['location'];
        $date = $_REQUEST['date'];
        // Create db operation object
        $db = new DbOperation();
        if (is_null($db->errMessage))
        {
            // See if hashed user exists DECIDE IN FUTURE HOW STORED
            if($db->doesUserExist($user_hash)) // PEP1 change 
            {
                // Create incident
                if($db->createIncident($user_hash, $loc, $date))
                {
                    $response['error'] = false;
                    $response['message'] = 'Successfully logged incident';
                }
                else
                {
                    $response['error'] = true;
                    $response['message'] = 'Error logging new incident';
                }
            }
            else
            {
                $response['error'] = true;
                $response['message'] = 'Invalid hash name';
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
        $response['message'] = 'Hash name, location, and date are required';
    }
}
else
{
    $response['error'] = true;
    $response['message'] = 'Invalid request';
}
// Echo json response
echo json_encode($response);