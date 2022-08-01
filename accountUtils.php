<?php
session_start();

// Generate alphanumerically random and cryptographically secure string
function generate_session($input)
{
    $random_string = (random_bytes($input));
    return $random_string;
}

// SQL Query Functions
function createUserTableIfNotExists($db): void
{
    $res = $db->exec(
        "CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      username TEXT, 
      password TEXT,
      sessions LONGTEXT
    )");
}

function getUser($db, $username)
{
    $res = $db->query(
        "SELECT username, password from users where username = '${username}'");
    foreach ($res as $row) {
        $user = ['username' => $row["username"], 'password' => $row["password"]];
        break;
    }
    if (!isset($user)) {
        $user = null;
    }
    return $user;
}

function login($db, $username, $password)
{
    $user = getUser($db, $username);
    if ($user) {
        if ($user["username"] == $username and $user["password"] == $password) {
            $_SESSION["loginSession"] = [$_POST["username"], $_POST["password"]];
            setcookie('loginSession', $_POST["username"], time() + 31557600);
            echo "<script>alert('Successfully logged in.'); window.location.href = 'index.php';</script>";
        } else {
            echo "<script>alert('Incorrect password.');</script>";
        }
    }
    if ($user == null) {
        echo "<script>alert('Invalid username.');</script>";
    }
}

function createUser($db, $username, $password)
{
    $userExists = getUser($db, $username);
    if ($userExists) {
        echo "<script>alert('Username is taken.');</script>";
    } else {
        $res = $db->query(
            "INSERT INTO users (username, password)
            VALUES ('${username}', '${password}')"
        );
        if ($res) {
            // Set loginSession cookie and session information
            $_SESSION["loginSession"] = [$_POST["username"], $_POST["password"]];
            setcookie('loginSession', $_POST["username"], time() + 31557600);

            // Return response to user
            echo "<script>alert('User has been created, and you have been signed in'); window.location.href = 'index.php';</script>";
        } else {
            echo "Error";
        }
    }
}