const bcrypt = dcodeIO.bcrypt;

/////////////////////////////////////////////////////////////////
// Cookie Functions:
////////////////////////////////////////////////////////////////

// Credits To: https://stackoverflow.com/a/15724300
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  else return null;
}

// Credits To: https://stackoverflow.com/a/5886746
function eraseCookieFromAllPaths(name) {
  // This function will attempt to remove a cookie from all paths.
  var pathBits = location.pathname.split("/");
  var pathCurrent = " path=";

  // do a simple pathless delete first.
  document.cookie = name + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT;";

  for (var i = 0; i < pathBits.length; i++) {
    pathCurrent += (pathCurrent.substr(-1) != "/" ? "/" : "") + pathBits[i];
    document.cookie =
      name + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT;" + pathCurrent + ";";
  }
}

////////////////////////////////////////////////////////////////
// Theme Functions: Not Used Yet, Theming Disabled Till A Future Update
////////////////////////////////////////////////////////////////
function setVar(variable, colorPickerObj) {
  if (variable == "primary") {
    let value = colorPickerObj.toRGBString();
    document
      .querySelector(":root")
      .style.setProperty(
        "--" + variable,
        value.replace("rgb(", "").replace(")", "")
      );
    document
      .querySelector(":root")
      .style.setProperty("--formatted-primary", colorPickerObj.toHEXString());
  }
  if (variable == "secondary") {
    let value = colorPickerObj.toHEXString();
    document.querySelector(":root").style.setProperty("--" + variable, value);
  }
  if (variable == "text-color") {
    let value = colorPickerObj.toHEXString();
    document.querySelector(":root").style.setProperty("--" + variable, value);
  }
}

function parseTheme(json) {
  // Define theme config values
  let primary = json.primary;
  let secondary = json.secondary;
  let text_color = json.text_color;

  if (primary && secondary && text_color) {
    // Get the css root element to modify vars
    var root = document.querySelector(":root");
    // Set all variables to their according values in the theme file
    root.style.setProperty("--primary", primary);
    root.style.setProperty("--secondary", secondary);
    root.style.setProperty("--text-color", text_color);
    return true;
  }
  return false;
}

function applySavedTheme() {
  // This function grabs the set theme from cookies and parses all it's values
  let setTheme = parseTheme(JSON.parse(getCookie("theme")));
  return setTheme;
}

async function saveMadeChanges() {
  // Get all the cookies for the theme modifications, and save them to a json format
  const style = getComputedStyle(document.body);
  const primary = style.getPropertyValue("--primary");
  const formatted_primary = style.getPropertyValue("--formatted-primary");
  const secondary = style.getPropertyValue("--secondary");
  const text_color = style.getPropertyValue("--text-color");
  const madeTheme =
    `{"primary" : "${primary}", "formatted_primary" : "${formatted_primary}", "secondary": "${secondary}", "text_color": "${text_color}"}`.replace(
      /(\r\n|\n|\r)/gm,
      ""
    );
  const json = JSON.parse(madeTheme);
  document.cookie = "theme=" + JSON.stringify(json) + "; secure";
  let url =
    "https://devicesync-api.theprotondev.repl.co/settheme?username=" +
    getCookie("username") +
    "&auth_token=" +
    getCookie("auth_token");
  // Make request to set latest theme
  const rawResponse = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: madeTheme,
  });
  const content = await rawResponse.json();

  console.log(content);
  let response = await fetch(url);
  console.log("User has set a new custom theme");
  toast("success", "New Theme Has Been Set");
}

////////////////////////////////////////////////////////////////
// Text Area Autosize:
////////////////////////////////////////////////////////////////

const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  tx[i].style.scrollHeight + "px;overflow-y:hidden;";
  tx[i].addEventListener("input", OnInput, false);
}

function OnInput() {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
}

////////////////////////////////////////////////////////////////
// Toast Notifications:
////////////////////////////////////////////////////////////////

// Custom toast notification function to shorten boilerplate code
function toast(notiType, message) {
  // Toast error style
  const defaultTime = {
    settings: {
      duration: 500,
    },
  };

  const errorOptions = {
    settings: {
      duration: 3000,
    },
    style: {
      main: {
        background: "#FF0000",
        color: "#fff",
      },
    },
  };
  // Toast success style
  const successOptions = {
    settings: {
      duration: 3000,
    },
    style: {
      main: {
        background: "#00FF00",
        color: "#000000",
      },
    },
  };
  if (notiType == "error") {
    iqwerty.toast.toast(message, errorOptions);
  } else if (notiType == "success") {
    iqwerty.toast.toast(message, successOptions);
  } else if (notiType == "prompt") {
    iqwerty.toast.toast(message, defaultTime);
  }
}

////////////////////////////////////////////////////////////////
// Authorization And Other API Call Related Code:
////////////////////////////////////////////////////////////////

// Function that gets called to check if user logged in on every page load
async function isLoggedIn() {
  console.log("Checking if user is logged in...");
  // Get pagename
  var page = window.location.pathname.split("/").pop();
  // If the user is on a page and not just the index of domain
  if (page) {
    // Get cookies
    var auth_token = getCookie("auth_token");
    var username = getCookie("username");
    // Check if the user isn't signed in, if they aren't then make sure they aren't on a restricted page
    if (!username && !auth_token) {
      // Disable user only buttons if not signed in
      document.getElementById("logoutBtn").onclick = "";
      console.log(
        "User is not signed in, checking if on registered user only page..."
      );
      if (
        page == "home.html" ||
        page == "themeDesigner.html" ||
        page == "home.html"
      ) {
        window.location = "index.html";
      }
      else if(page == "myaccount.html"){
        window.location = "signup.html";
      }
    }
    // If both cookies aren't included, remove auth related cookies
    if (username != null && auth_token == null) {
      eraseCookieFromAllPaths("username");
      toast("error", "Authentication Session Invalid, Removed Cookies");
    }
    if (username == null && auth_token != null) {
      eraseCookieFromAllPaths("auth_token");
      toast("error", "Authentication Session Invalid, Removed Cookies");
    }
    // If the cookies exist, then validate the auth session using the api
    if (username != null && auth_token != null) {
      let url =
        "https://devicesync-api.theprotondev.repl.co/isAuthValid?username=" +
        username +
        "&auth_token=" +
        auth_token;
      let jsonResponse = await (await fetch(url)).json();
      if (jsonResponse.Error) {
        // This would mean the auth session is invalid
        // Delete cookies
        eraseCookieFromAllPaths("username");
        eraseCookieFromAllPaths("auth_token");
        toast("error", "Authentication Session Invalid, Logging You Out");
      }
      // If auth token is valid
      else {
        console.log("User is signed in")
        // Get the pfp url for this user
        let jsonResponse = await (
          await fetch(
            "https://devicesync-api.theprotondev.repl.co/getpfpfor?username=" +
              username
          )
        ).json();
        // Set pfp
        if(page == "index.html"){
          window.location="home.html";
        }
        hideElement("placeholder");
        showElement("userNavDiv");
        document.getElementById("userPfp").src = jsonResponse.pfp;
      }
    }
    // If the user is not on a specific html page, redirect to index
  } else {
    window.location = "index.html";
  }
}

async function isAPIUp() {
  var path = window.location.pathname;
  var page = path.split("/").pop();
  // If the API is up but the user is on the api down page, redirect them home
  let response = await fetch(
    "https://devicesync-api.theprotondev.repl.co/status"
  );
  const data = await response.text();
  if (page == "apierror.html") {
    if (data == "API Status: Up") {
      window.location = "index.html";
    }
  }
  // If the API is down, and the user is not on the error page, redirect them to it
  else {
    if (data != "API Status: Up") {
      window.location = "apierror.html";
    }
  }
}

// Function that gets called when the user clicks the top right logout button
async function logout() {
  // Get username and auth_token cookies, then construct API request url string
  const username = getCookie("username");
  const auth_token = getCookie("auth_token");
  const url = `https://devicesync-api.theprotondev.repl.co/logout?username=${username}&auth_token=${auth_token}`;
  // Make GET request to logout user using the just created url string
  let jsonResult = await (await fetch(url)).json();
  // Remove all cookies on site once logged out
  eraseCookieFromAllPaths("username");
  eraseCookieFromAllPaths("auth_token");
  eraseCookieFromAllPaths("theme");
  // Return a success message
  toast("success", "Invalidated Login Session, Redirecting To Home.");
  // Redirect to index page
  setTimeout(function () {
    window.location = "index.html";
  }, 3000);
}

// Function that gets called when a user attempts to signup
async function signUp() {
  // Check if both fields are filled in
  const usernameBox = document.getElementById("usernameBox");
  const passwordField = document.getElementById("passwordBox");
  // Check if nothing was input, if so return toast error
  if (usernameBox.value == "" || passwordBox.value == "") {
    toast("error", "Please enter both a username and a password");
  }
  // If both input fields are filled in proceed
  if (usernameBox.value != "" && passwordField.value != "") {
    // Process data
    const user = usernameBox.value;
    const password = passwordField.value;
    // Make sure pass is 8 or more chars
    if (passwordBox.value.length < 8) {
      toast("error", "Password must be at least 8 characters long");
      return false;
    }
    // Get password and hash it
    const hashPassword = async () => {
      const hash = await bcrypt.hash(password, 10);
      let url =
        "https://devicesync-api.theprotondev.repl.co/signup?username=" +
        user +
        "&password=" +
        hash;
      // Check result of json, return request result
      let jsonResult = await (await fetch(url)).json();
      if (jsonResult.Error) {
        toast("error", jsonResult.Error);
      } else {
        // On success
        const username = jsonResult.username;
        const auth_token = jsonResult.auth_token;

        toast("success", "Welcome, " + username);
        document.cookie = "username=" + username + "; secure";
        document.cookie = "auth_token=" + auth_token + "; secure";
        setTimeout(function () {
          window.location = "home.html";
        }, 3000);
      }
    };
    hashPassword();
  }
}

// Function that gets called when a user attempts to signin
async function signIn() {
  // Check if both fields are filled in
  const usernameBox = document.getElementById("usernameBox");
  const passwordBox = document.getElementById("passwordBox");
  // Return error toast notification if one of the fields or both fields are blank
  if (usernameBox.value == "" || passwordBox.value == "") {
    toast("error", "Please enter both a username and a password");
  } else if (passwordBox.value.length < 8) {
    toast(
      "error",
      "Your password should be exactly 8 characters | You Entered " +
        passwordBox.value.length
    );
  }
  // If both fields are filled in and hsave sufficient data, proceed with trying to login
  else {
    toast("prompt", "Processing Data");
    // Move on to processing data
    let url = `https://devicesync-api.theprotondev.repl.co/signin?username=${usernameBox.value}&password=${passwordBox.value}`;
    // Check result of json, return request result
    let jsonResult = await (await fetch(url)).json();

    // If JSON returned is an error, then return the error in a toast notification
    if (jsonResult.Error) {
      toast("error", jsonResult.Error);
    }
    // On successful request, return success notification
    else {
      // Get the username and generated auth_token, then store them as cookies
      const username = jsonResult.username;
      const auth_token = jsonResult.auth_token;
      // Return success toast notification
      toast("success", "Welcome Back, " + username);
      // Create a date object a year and a month from now, then set this as the expiration date of
      // the newly created cookies
      var expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      document.cookie =
        "username=" +
        username +
        "; SameSite=None; Secure; expires=" +
        expiryDate.toGMTString();
      document.cookie =
        "auth_token=" +
        auth_token +
        ";  SameSite=None; Secure; expires=" +
        expiryDate.toGMTString();
      // Redirect the user to the home page if all of this is successful
      window.location = "home.html";
    }
  }
}

// Function that gets called when the user searches through their pastes
async function searchPastes() {
  const user = getCookie("username");
  const auth = getCookie("auth_token");
  const query = document.getElementById("searchField").value;
  let url =
    "https://devicesync-api.theprotondev.repl.co/searchPastes?username=" +
    user +
    "&auth_token=" +
    auth +
    "&query=" +
    query;
  // Check result of json, return request result
  let jsonResult = await (await fetch(url)).json();
  document.getElementById("results").innerHTML = "";
  for (const [key, value] of Object.entries(jsonResult)) {
    // Check if error is resulted
    if (
      value == "Missing 1 out of 3 required arguments. You are missing query"
    ) {
      checkPastes();
    } else if (
      key == "Error" &&
      value !== "Missing 1 out of 3 required arguments. You are missing query"
    ) {
      // Clear previous contents of div
      document
        .getElementById("results")
        .insertAdjacentHTML(
          "beforeend",
          '<h4 class="text-center" style="margin-top: 50px; color: var(--text-color);font-family: ABeeZee, sans-serif;"><strong><em>' +
            value +
            "</em></strong></h4>"
        );
    } else {
      let paste_title = decodeURI(key);
      let paste = decodeURI(value);
      // Clear previous contents of div
      let shareUrl = "https://theprotondev.github.io/DeviceSyncApp/share.html?content=" + encodeURI(value);
      let rawUrl = "https://theprotondev.github.io/DeviceSyncApp/share.html?content=" + encodeURI(value);
      document
        .getElementById("results")
        .insertAdjacentHTML(
          "beforeend",
          "<div class='card' style='background: rgba(255,255,255,0);border-style: none;color: var(--text-color);padding-bottom: 25px;padding-top: 25px;'><div class='card-body'><h4 class='card-title'>" +
            paste_title +
            "</h4><p class='card-text'>" +
            paste.replace(/\n/g, "<br>") +
            "</p><div><button id='copyBtn' class='btn' type='button' style='color: var(--text-color);background: var(--secondary);border-radius: 25px;' onclick=\"ClipboardJS.copy(`" +
            paste +
            "`);toast('success', 'Copied Paste To Clipboard');\"><i class='fa fa-copy'></i>  Copy</button><span style='cursor: default;'>       </span><button id='rawBtn' class='btn' type='button' style='color: var(--text-color);background: var(--secondary);border-radius: 25px;' onclick=\"window.open('" +
            rawUrl +
            "', 'blank');\"><i class='fa fa-paperclip '></i>   Raw</button><span style='cursor: default;'>       </span><button id='shareBtn' class='btn' type='button' style='color: var(--text-color);background: var(--secondary);border-radius: 25px;' onclick=\"shareRaw('" +
            shareUrl +
            "');\"><i class='fa fa-share-alt'></i>  Share Raw</button><span style='cursor: default;'>       </span><button class='btn' type='button' style='color: var(--text-color);background: var(--secondary);border-radius: 25px;' onclick=\"deletePaste('" +
            encodeURI(paste_title) +
            "')\"><i class='fa fa-trash'></i>  Delete</button></div></div></div>"
        );
    }
  }
}

async function checkPastes() {
  document.getElementById("searchField").value = "";
  const user = getCookie("username");
  const auth = getCookie("auth_token");
  let url =
    "https://devicesync-api.theprotondev.repl.co/get?history=true&username=" +
    user +
    "&auth_token=" +
    auth;
  // Check result of json, return request result
  let jsonResult = await (await fetch(url)).json();
  document.getElementById("results").innerHTML = "";
  for (const [key, value] of Object.entries(jsonResult)) {
    // Check if error is resulted
    if (key == "Error") {
      // Clear previous contents of div
      document
        .getElementById("results")
        .insertAdjacentHTML(
          "beforeend",
          '<h4 class="text-center" style="margin-top: 50px; color: var(--text-color);font-family: ABeeZee, sans-serif;"><strong><em>' +
            value +
            "</em></strong></h4>"
        );
    } else {
      let paste_title = decodeURI(key);
      let paste = decodeURI(value);
      // Clear previous contents of div
      let shareUrl = "https://theprotondev.github.io/DeviceSyncApp/share.html?content=" + encodeURI(value);
      let rawUrl = "https://theprotondev.github.io/DeviceSyncApp/share.html?content=" + encodeURI(value);
      document
        .getElementById("results")
        .insertAdjacentHTML(
          "beforeend",
          "<div class='card' style='background: rgba(255,255,255,0);border-style: none;color: var(--text-color);padding-bottom: 25px;padding-top: 25px;'><div class='card-body'><h4 class='card-title'>" +
            paste_title +
            "</h4><p class='card-text'>" +
            paste.replace(/\n/g, "<br>") +
            "</p><div><button id='copyBtn' class='btn' type='button' style='color: var(--text-color);background: var(--secondary);border-radius: 25px;' onclick=\"ClipboardJS.copy(`" +
            paste +
            "`);toast('success', 'Copied Paste To Clipboard');\"><i class='fa fa-copy'></i>  Copy</button><span style='cursor: default;'>       </span><button id='rawBtn' class='btn' type='button' style='color: var(--text-color);background: var(--secondary);border-radius: 25px;' onclick=\"window.open('" +
            rawUrl +
            "', 'blank');\"><i class='fa fa-paperclip'></i>   Raw</button><span style='cursor: default;'>       </span><button id='shareBtn' class='btn' type='button' style='color: var(--text-color);background: var(--secondary);border-radius: 25px;' onclick=\"shareRaw('" +
            shareUrl +
            "');\"><i class='fa fa-share-alt'></i>  Share Raw</button><span style='cursor: default;'>       </span><button class='btn' type='button' style='color: var(--text-color);background: var(--secondary);border-radius: 25px;' onclick=\"deletePaste('" +
            encodeURI(paste_title) +
            "')\"><i class='fa fa-trash'></i>  Delete</button></br></div></div></div>"
        );
    }
  }
}

async function shareRaw(rawUrl) {
  if (navigator.share) {
    navigator
      .share({ text: rawUrl })
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing:", error));
  } else {
    console.log(
      "Not on mobile, copied " + rawUrl + " instead of opening share menu"
    );
    ClipboardJS.copy(rawUrl);
    toast("success", "Copied Raw Paste URL To Clipboard");
  }
}

async function deletePaste(paste_title) {
  const user = getCookie("username");
  const auth = getCookie("auth_token");
  const url =
    "https://devicesync-api.theprotondev.repl.co/delete?username=" +
    user +
    "&auth_token=" +
    auth +
    "&paste_title=" +
    paste_title;
  // Check result of json, return request result
  let jsonResult = await (await fetch(url)).json();
  document.getElementById("reloadBtn").click();
}

function hideElement(inputId) {
  document.getElementById(inputId).style.display = "none";
  document.getElementById(inputId).style.visibility = "hidden";
  return true;
}

function showElement(inputId) {
  document.getElementById(inputId).style.display = "block";
  document.getElementById(inputId).style.visibility = "visible";
  return true;
}
