<?php
if (isset($_COOKIE['loginSession'])) {
    include "components/logicallyRenderedPages/account.php";
} else {
    if (isset($_GET["mode"])) {
        if ($_GET["mode"] == "signin") {
            include "components/logicallyRenderedPages/signin.php";
        } else if ($_GET["mode"] == "signup") {
            include "components/logicallyRenderedPages/signup.php";
        }
    } else{
        include "components/logicallyRenderedPages/signin.php";
    }
}