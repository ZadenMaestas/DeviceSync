<?php
header('Content-Type: application/json');

session_start();

$jsonResponse = new stdClass();

if (isset($_SESSION["loginSession"])) {
    $jsonResponse->Response = "Successfully Logged Out";
    session_destroy();
} else {
    $jsonResponse->Response = "Error Logging Out, No User Logged In";
}
echo json_encode($jsonResponse);