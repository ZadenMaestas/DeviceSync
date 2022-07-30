<?php
if (isset($_POST["username"]) and isset($_POST["password"])){
    session_start();
    $_SESSION["loginSession"] = [$_POST["username"], $_POST["password"]];
    echo "Successfully Logged In";
} else{
    echo "Error";
}