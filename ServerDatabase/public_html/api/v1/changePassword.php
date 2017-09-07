<?php
// Title: ChangePassword
// Author: Joshua Cockerill
//
// This file contains a script to authenticate a username/password
// combination, change the password provided a new password, and
// echo a JSON encoded response string
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
    if (verifyRequiredParams(['username', 'pass', 'newPass']))
    {
        // Get parameter values
        $username = $_REQUEST['username'];
        $password = $_REQUEST['pass'];
        $newPassword = $_REQUEST['newPass'];
        // Create db operation object
        $db = new DbOperation();
        if (is_null($db->errMessage))
        {
            // Authenticate user identity
            if ($db->authenticateUser($username, $password))
            {
                // Change user password
                if ($db->changePassword($username, $newPassword))
                {
                    $response['error'] = false;
                    $response['message'] = 'Password successfully changed';
                }
                else
                {
                    $response['error'] = true;
                    $response['message'] = 'Error changing password';
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
        $response['message'] = 'Username and passwords are required';
    }
}
else
{
    $response['error'] = true;
    $response['message'] = 'Invalid request';
}
// Echo json response
echo json_encode($response);