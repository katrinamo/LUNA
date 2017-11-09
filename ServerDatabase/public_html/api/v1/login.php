<?php
// Title: login.php
// Author: Sydney Norman
// Date 11/7/2017
//
// Search the user table for the username and password received from the app
// If found, return a token.
//
// input from app:
//   username, password
// output (username and password found):
//   success message sent to app
//
// output (username not found):
//   failure message sent to app
//   
// output (username and password not found):
//   failure message sent to app
//
// References:
//   modified from https://www.simplifiedios.net/swift-php-mysql-tutorial/
//   by Belal Khan

// Importing required scripts
require_once '../../../includes/dboperation.php';  
require_once '../../../includes/funcs.php';
 
$response = array(); //[];

if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'GET')
{   

    header("Access-Control-Allow-Origin: *");

    // See if proper parameters were provided
    if (verifyRequiredParams(['username', 'pass']))
    {
        // Get parameter values
        $username = $_REQUEST['username'];
        $password = $_REQUEST['pass'];

        // Create db operation object
        $db = new DbOperation();
        if (is_null($db->errMessage))
        {
            // Find emailID in user table
            $doesUserExist = $db->doesUserExist($username);
            if ($doesUserExist)
            {
		$isAuthenticated = $db->authenticateUser($username, $password);
		if ($isAuthenticated) {
			// Login Successful: Username and Password Found
			$response['error'] = false;
			$response['message'] = 'Login Successful';
			$response['uid'] = $db->getUid($username, $password);
			
			$response['birthday'] = $db->getBirthday($username, $password);
			$response['cycleLength'] = $db->getCycleLength($username, $password);
			$response['periodLength'] = $db->getPeriodLength($username, $password);
			$response['birthControlType'] = $db->getBirthControlType($username, $password);
			$response['lastPeriod'] = $db->getLastPeriod($username, $password);
			$response['status'] = $db->getStatus($username, $password);
			$response['time'] = $db->getTime($username, $password);
			$response['pregnant'] = $db->getPregnant($username, $password);
			$response['reproductiveDisorder'] = $db->getReproductiveDisorder($username, $password);

		}
		else {
			// Login Failed: Incorrect Password
			$response['error'] = true;
			$response['message'] =  'Incorrect Password';
		}	
	    }
	    else {
		// Login Failed: Username Not Found
		$response['error'] = true;
		$response['message'] = 'Username Not Found';
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
        $response['message'] = 'Username and Password are required';
    }    
}
else
{
    $response['error'] = true;
    $response['message'] = 'Invalid request';
}
$response['help'] = 'help';
// Echo json response
echo json_encode($response);
