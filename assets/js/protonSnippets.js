const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
  tx[i].addEventListener("input", OnInput, false);
}

function OnInput() {
  this.style.height = "auto";
  this.style.height = (this.scrollHeight) + "px";
}

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

// Function I made to check if the user logged in
function isLoggedIn() {
    var path = window.location.pathname;
    var page = path.split("/").pop();
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
        else if(page === "upload.html" || page === "history.html" || page === "accountinfo.html" || page === "home.html"){
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
