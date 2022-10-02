$(document).ready(function () {
    // Signup Form Logic On Submit
    $("#signUpForm").submit(function (event) {
        let formData = {
            username: $("#usernameInput").val(),
            password: $("#passwordInput").val(),
        };

        $.ajax({
            type: "POST",
            url: "/account/signup",
            data: formData,
            dataType: "json",
            encode: true,
        }).done(function (data) {
            alert(data.Success || data.Error)
            if (data.Success) {
                window.location.href = "/analytics/hit"
            }
        });

        event.preventDefault();
    });

    // Signin Form Logic On Submit
    $("#signInForm").submit(function (event) {
        let formData = {
            username: $("#usernameInput").val(),
            password: $("#passwordInput").val(),
        };

        $.ajax({
            type: "POST",
            url: "/account/signin",
            data: formData,
            dataType: "json",
            encode: true,
        }).done(function (data) {
            alert(data.Success || data.Error)
            if (data.Success) {
                window.location.href = "/"
            }
        });

        event.preventDefault();
    });
    // New Note Form Logic On Submit
    $("#newNoteForm").submit(function (event) {
        let formData = {
            title: $("#noteTitleInput").val(),
            content: $("#noteContentInput").val(),
        };

        $.ajax({
            type: "POST",
            url: "/account/newNote",
            data: formData,
            dataType: "json",
            encode: true,
        }).done(function (data) {
            alert(data.Success || data.Error)
            if (data.Success) {
                window.location.href = "/"
            }
        });

        event.preventDefault();
    });
    // New Note Form Logic On Submit
    $("#editNoteForm").submit(function (event) {
        let formData = {
            title: $("#noteEditTitleInput").val(),
            content: $("#noteEditContentInput").val(),
        };

        $.ajax({
            type: "POST",
            url: "/account/editNote",
            data: formData,
            dataType: "json",
            encode: true,
        }).done(function (data) {
            alert(data.Success || data.Error)
            if (data.Success) {
                window.location.href = "/"
            }
        });

        event.preventDefault();
    });
    // Prevent default on theme editor form submit
    $('#themeCreatorForm').submit(function(event) {
        let primaryColor = parseColor('primary')
        if (primaryColor) {
            document.getElementById("isDarkmode").checked ? document.body.classList.add("dark") : document.body.classList.remove("dark")
            let darkMode = document.getElementById("isDarkmode").checked
            const theme = {"primaryColor": primaryColor, "darkMode": darkMode}
            let formData = {
                theme: theme,
            };

            $.ajax({
                type: "POST",
                url: "/account/theme/set",
                data: formData,
                dataType: "json",
                encode: true,
            }).done(function (data) {
                alert(data.Success || data.Error)
                if (data.Success) {
                    window.location.href = "/"
                }
            });
        }

        event.preventDefault();
    });
});