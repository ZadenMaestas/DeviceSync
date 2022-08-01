<?php
// Account Database System Management
try {
    // Open db.sqlite
    $db = new PDO('sqlite:db.sqlite');

    include 'accountUtils.php';
    /* Include Utility Functions:
     * createUserTableIfNotExists($db)
     * getUser($db, $username, $password)
     * createUser($db, $username, $password)
     */

    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    createUserTableIfNotExists($db);
    if (isset($_GET['mode'])) {
        if ($_GET['mode'] == "signup") {
            if (isset($_POST['username']) and isset($_POST['password'])) {
                $username = $_POST['username'];
                $password = $_POST['password'];
                createUser($db, $username, $password);
            }
        }
        if ($_GET['mode'] == "signin") {
            if (isset($_POST['username']) and isset($_POST['password'])) {
                $username = $_POST['username'];
                $password = $_POST['password'];
                login($db, $username, $password);
            }
        }
    }

    // Garbage csollect db
    $db = null;
} catch (PDOException $ex) {
    echo $ex->getMessage();
}

?>