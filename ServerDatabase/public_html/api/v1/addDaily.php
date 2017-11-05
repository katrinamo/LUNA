<?php
// Title: addDaily.php
// Author: Danyse
// Date: 05/20/2017 
// 
// Client will send uid, date, and all daily question answers. 
// Row added to entry table.
//
// Input:
//   uid: user random ID number
//   date
//   All 13 daily question data as name/value pairs 
//   (sexualInterest, sexualActivity, etc.)
// Output:
//   Success: Row added to entry table, success message to app:
//      {"error":false,"message":"Successfully added daily activity"} 
//   Failure: Failure message to app:
//      {"error":true,"message":"Error adding daily activity"}
// Notes:
//   Either POST or GET can be used. GET can be used for testing. 
//   Apps uses post 
// References:
//   modified from logIncident.php

// Importing required scripts
require_once '../../../includes/dboperation.php';
require_once '../../../includes/funcs.php';
 
$response = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'GET')
{

    header("Access-Control-Allow-Origin: *");

    // See if proper parameters were provided
    if (verifyRequiredParams(['uid', 'date', 'onPeriod','sexualInterest','sexualActivityNumber', 'emotionalCloseness', 'sexualRelationship', 'sexualLife', 'sexualArousal', 'sexualArousalConfidence', 'lubrication', 'lubricationMaintain', 'difficulty', 'satisfaction', 'discomfort']))
    {
        // Get parameter values
        $uid = $_REQUEST['uid'];
        $entry_date = $_REQUEST['date'];
        $onPeriod = $_REQUEST['onPeriod'];
        $sexualInterest = $_REQUEST['sexualInterest'];
        $sexualActivityNumber = $_REQUEST['sexualActivityNumber'];
        $emotionalCloseness = $_REQUEST['emotionalCloseness'];      
        $sexualRelationship = $_REQUEST['sexualRelationship'];
        $sexualLife = $_REQUEST['sexualLife'];
        $sexualArousal = $_REQUEST['sexualArousal'];
        $sexualArousalConfidence = $_REQUEST['sexualArousalConfidence'];
        $lubrication = $_REQUEST['lubrication'];
        $lubricationMaintain = $_REQUEST['lubricationMaintain'];
        $difficulty = $_REQUEST['difficulty'];
        $satisfaction = $_REQUEST['satisfaction'];
        $discomfort = $_REQUEST['discomfort'];
      
        // Create db operation object
        $db = new DbOperation();
        if (is_null($db->errMessage))
        {
            // Verify that UID exists
            if($db->authenticateUid($uid)) 
            {             
                // Create new daily questions event
                if($db->createEntry($uid, $entry_date, $onPeriod, $sexualInterest, $sexualActivityNumber, $emotionalCloseness, $sexualRelationship, $sexualLife, $sexualArousal, $sexualArousalConfidence, $lubrication, $lubricationMaintain, $difficulty, $satisfaction, $discomfort))
                {
                    $response['error'] = false;
                    $response['message'] = 'Successfully added daily activity';
                }
                else
                {
                    $response['error'] = true;
                    $response['message'] = 'Error adding daily activity';
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
