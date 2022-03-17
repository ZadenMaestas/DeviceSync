
/////////////////////////////////////////////////////////////////
// Cookie Functions:
////////////////////////////////////////////////////////////////

// Credits To: https://stackoverflow.com/a/15724300
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    else return null;
}

// Can't even remember where I got this one from, but not made by me, credits to whoever came up with this
function removeCookies() {
    var res = document.cookie;
    var multiple = res.split(";");
    for (var i = 0; i < multiple.length; i++) {
        var key = multiple[i].split("=");
        document.cookie = key[0] + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
    }
}

////////////////////////////////////////////////////////////////
// Theme Functions:
////////////////////////////////////////////////////////////////
function parseTheme(json){
  // Define theme config values
  let name = json.theme_name
  let accent = json.accent
  let secondary = json.secondary
  let bgColor = json.background_color
  let btn_grad1 = json.btn_grad1
  let btn_grad2 = json.btn_grad2

  if(name && accent && secondary && bgColor && btn_grad1 && btn_grad2) {
    console.log("Loaded Theme: "+name)
    // Get the css root element to modify vars
    var root = document.querySelector(':root');
    // Set all variables to their according values in the theme file
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--secondary', secondary);
    root.style.setProperty('--bg-color', bgColor);
    root.style.setProperty('--btn-grad1', btn_grad1);
    root.style.setProperty('--btn-grad2', btn_grad2);
    return true;
  }
  return false;
}

function setSavedTheme(){
  // This function grabs the set theme from cookies and parses all it's values
  let setTheme = parseTheme(JSON.parse(getCookie("theme")));
  return setTheme;
}

async function checkForTheme(){
  // Check if on home page, if so, check for theme
  var page = window.location.pathname.split("/").pop();
  if(page == 'home.html'){
    let url = 'https://devicesync-api.theprotondev.repl.co/gettheme?username='+getCookie("username")+"&auth_token="+getCookie("auth_token")
    // Make request to get latest set theme
    let response = await fetch(url);
    const resultJson = await response.json();
    // If error has occured return false
    if(resultJson.Error){
      setSavedTheme();
      return false
    }
    // check if a theme is set
    let theme = getCookie("theme");
    const isThemeSet = theme != null
    if(isThemeSet){
      // If a theme is already set check if it has the same name as the other theme
      if(theme.theme_name != resultJson.theme_name){
        setTheme(resultJson);
        setSavedTheme();
      }
      else{
        setSavedTheme();
      }
    }
    else{
      setTheme(resultJson);
      setSavedTheme();
    }
  }
  else{
    if(getCookie("theme") == null){
      return false;
    }
    else{
      parseTheme(JSON.parse(getCookie("theme")));
    }
  }
}

function setTheme(json){
  document.cookie = "theme="+JSON.stringify(json)+'; secure';
}

////////////////////////////////////////////////////////////////
// Text Area Autosize:
////////////////////////////////////////////////////////////////

const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
  tx[i].addEventListener("input", OnInput, false);
}

function OnInput() {
  this.style.height = "auto";
  this.style.height = (this.scrollHeight) + "px";
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
        }
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

// Function I made to check if the user logged in
function isLoggedIn() {
    var page = window.location.pathname.split("/").pop();
    var auth = getCookie("auth_token");
    const isSignedIn = auth != null;
    if(page){
        // Check if user is signed in on any of these pages, if so redirect to the home screen
        if (page == "index.html" || page == "signin.html" || page == "signup.html") {
            if (isSignedIn) {
                window.location = 'home.html';
            }
        }
        // If the user is not signed in on user pages then redirect them to index
        else if(page === "upload.html" || page === "history.html" || page === "accountinfo.html" || page === "home.html" || page === "uploadocr.html" || page === "themes.html"){
            if (isSignedIn) {
                var div = document.getElementById("ifLoggedin");
                div.style = 'display:block;visibility:visible;';
            } else {
                var div = document.getElementById("ifNotloggedin");
                div.style = 'display:block;visibility:visible;';
                setTimeout(function () {
                    window.location = 'index.html';
                }, 3000);
            }
        }
    }
    else{
        window.location = 'index.html';
    }

}

async function isAPIUp(){
  var path = window.location.pathname;
  var page = path.split("/").pop();
  // If the API is up but the user is on the api down page, redirect them home
  let response = await fetch('https://devicesync-api.theprotondev.repl.co/status');
  const data = await response.text();
  if(page == "apierror.html"){
    if (data == "API Status: Up"){
        window.location = 'index.html';
      }
  }
  // If the API is down, and the user is not on the error page, redirect them to it
  else{
    if (data != "API Status: Up"){
        window.location = 'apierror.html';
      }
  }
}
