<?php
session_start();
if (!isset($_SESSION["loginSession"])){
    include 'components/logicallyRenderedPages/signedoutHomePage.php';
} else{
    include 'components/logicallyRenderedPages/signedinHomePage.php';
}
?>
