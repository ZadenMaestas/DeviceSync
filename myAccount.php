<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DeviceSync</title>
    <link rel="stylesheet" href="https://unpkg.com/chota@latest">
    <!--
    darkmode.js checks the theme settings for the browser and sets dark mode accordingly-->
    <script defer src="../../assets/js/darkmode.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js"
            integrity="sha256-0H3Nuz3aug3afVbUlsu12Puxva3CP4EhJtPExqs54Vg=" crossorigin="anonymous"></script>
    <script src="../../assets/js/utils.js"></script>
    <link rel="stylesheet" href="../../assets/css/style.css">
</head>
<body>
<div class="container">
    <nav class="nav">
        <div class="nav-left">
            <a class="brand active" href="index.php">DeviceSync</a>
            <div class="tabs">
                <a href="index.php">Home</a>
                <a class="active" href="myAccount.php">Account</a>
            </div>
        </div>
        <div id="logoutDiv" class="nav-right">
            <script>isSignedIn()</script>
        </div>
    </nav>
    <div class="spacer"></div>
    <div class="spacer"></div>
    <?php
    /* Conditional Content Rendering
    If user is signed in, display account portal
    If user is not signed in and no mode has been specified display sign in page
    If user is not signed in and mode has been specified, display corresponding form page [GET ?mode=signin or GET ?mode=signup]
    */
    if (isset($_COOKIE['loginSession'])) {
        include "components/logicallyRenderedPages/account.php";
    } else {
        if (isset($_GET["mode"])) {
            if ($_GET["mode"] == "signin") {
                include "components/logicallyRenderedPages/signin.php";
            } else if ($_GET["mode"] == "signup") {
                include "components/logicallyRenderedPages/signup.php";
            }
        } else {
            include "components/logicallyRenderedPages/signin.php";
        }
    }
    ?>
</div>
<?php
// Display footer
include 'components/footer.php';
?>
</body>
</html>