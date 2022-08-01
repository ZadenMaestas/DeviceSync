<?php
header('Content-Type: text/html');
session_start();
if (!isset($_SESSION["loginSession"])){
    if (isset($_POST["username"]) and isset($_POST["password"])){
        $_SESSION["loginSession"] = [$_POST["username"], $_POST["password"]];
        setcookie('loginSession', $_POST["username"], time() + 31557600);
        echo "Successfully Logged In";
    } else{
        echo "Error";
    }
} else{
    echo "User already logged in";
}
echo "<script>
setTimeout(function(){
    window.open('index.php','_self')
},2000);
</script>";