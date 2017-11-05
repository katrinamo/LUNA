<?php
// Title: DeleteUser
// Author: Joshua Cockerill
//
// This file contains a script to authenticate a username/password
// combination, set the user to inactive, and echo a JSON encoded response string
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
            // Authenticate user identity
            if($db->authenticateUser($username, $password))
            {
                // Set user activity status to inactive
                if ($db->deleteUser($username))
                {
                    $response['error'] = false;
                    $response['message'] = 'User successfully deleted';
                }
                else
                {
                    $response['error'] = true;
                    $response['message'] = 'Error deleting user';
                }
            }
            else
            {
                $response['error'] = true;
                $response['message'] = 'Incorrect username or password';
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
        $response['message'] = 'Username and password are required';
    }
}
else
{
    $response['error'] = true;
    $response['message'] = 'Invalid request';
}
// Echo json response
echo json_encode($response);
