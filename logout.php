<?php
/*
 /logout.php endpoint to remove login session if logged in, otherwise return error
  This page just sends a response on whether logging out was successful in
  an alert message and redirects to index.php
*/
session_start();

if (isset($_COOKIE["loginSession"]) or isset($_SESSION["loginSession"])) {
    // Invalidate cookie and destroy session data
    setcookie('loginSession', "", time() - 3600);
    session_destroy();
    // Set response
    $response = "Successfully Logged Out";
} else {
    $response = "Error Logging Out, No User Logged In";
}
echo "<script>alert('${response}'); window.location.href = 'index.php';</script>";
