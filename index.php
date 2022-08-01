<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DeviceSync</title>
    <link rel="stylesheet" href="https://unpkg.com/chota@latest">
    <script defer src="assets/js/darkmode.js"></script> <!-- Dark-Mode Detection Setter -->
    <script src="https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js"
            integrity="sha256-0H3Nuz3aug3afVbUlsu12Puxva3CP4EhJtPExqs54Vg=" crossorigin="anonymous"></script>
    <script src="assets/js/utils.js"></script>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<div class="container">
    <!-- Navigation Bar -->
    <nav class="nav">
        <div class="nav-left">
            <a class="brand active" href="index.php">DeviceSync</a>
            <div class="tabs">
                <a href="index.php" class="active">Home</a>
                <a href="myAccount.php">Account</a>
            </div>
        </div>
        <div id="logoutDiv" class="nav-right">
            <script>isSignedIn()</script>
        </div>
    </nav>

    <!-- Body Content Conditional Rendering Logic -->
    <?php
    session_start();
    if (!isset($_SESSION["loginSession"])) {
        include 'components/logicallyRenderedPages/signedoutHomePage.php';
    } else {
        include 'components/logicallyRenderedPages/signedinHomePage.php';
    }
    ?>
</div>
<?php
// Display footer
include 'components/footer.php';
?>
</div>
</body>
</html>