<?php
// Title: addDaily.php
// Author: Danyse
// Date: 05/20/2017
// EDITOR: KATIE
// EDIT DATE: 11/9/2017
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
    if (verifyRequiredParams(['uid', 'date', 'onPeriod','sexualInterest', 'sexualAttitude', 'sexualArousal', 'kissing', 'caressing', 'fondling', 'masturbation', 'oral', 'anal', 'vaginal', 'none', 'other', 'intensity']))
    {
        // Get parameter values
        $uid = $_REQUEST['uid'];
        $entry_date = $_REQUEST['date'];
        $onPeriod = $_REQUEST['onPeriod'];
        $sexualInterest = $_REQUEST['sexualInterest'];
        $sexualAttitude = $_REQUEST['sexualAttitude'];
        $sexualArousal = $_REQUEST['sexualArousal'];
        $kissing = $_REQUEST['kissing'];
        $caressing = $_REQUEST['caressing'];
        $fondling = $_REQUEST['fondling'];
        $masturbation = $_REQUEST['masturbation'];
        $oral = $_REQUEST['oral'];
        $anal = $_REQUEST['anal'];
        $vaginal = $_REQUEST['vaginal'];
        $none = $_REQUEST['none'];
        $other = $_REQUEST['other'];
        $intensity = $_REQUEST['intensity'];

        // Create db operation object
        $db = new DbOperation();
        if (is_null($db->errMessage))
        {
            // Verify that UID exists
            if($db->authenticateUid($uid))
            {
		if (!($db->areDailyQuestionsSubmitted($uid, $entry_date))) { 
                	// Create new daily questions event
                	if($db->createEntry($uid, $entry_date, $onPeriod, $sexualInterest, $sexualAttitude, $sexualArousal,  $kissing, $caressing, $fondling, $masturbation, $oral, $anal, $vaginal, $none, $other, $intensity))
                	{
                    		$response['error'] = false;
                    		$response['message'] = 'Successfully added daily activity';
                	}
                	else
                	{
                    		$response['error'] = true;
                    		$response['message'] = 'Error adding daily activity';
                	}
		{
		else {
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


