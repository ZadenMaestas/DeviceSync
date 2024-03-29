# API Documentation (For my own reference at the moment, though if you can develop something using this, you have my respect)

### I'd recommend using [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to test these

---

## POST Endpoints (Parameters taken as Encoded URL Form)

### /account/signup

##### Parameters:

- username | The username of the account to create
- password | The password of the account to create

##### Returns: JSON response, and saves session cookie for connected client

<br>

### /account/signin

##### Parameters:

- username | The username of the account to sign in
- password | The password of the account to sign in

##### Returns: JSON response, and saves session cookie for connected client

<br>

### /account/newNote

##### Parameters (Best to make sure these parameters are URL encoded:

##### title | Title of note

##### content | Content of note

##### Returns: If client requesting this endpoint is logged in then create the note if parameters are included, otherwise redirect to /account/signin

##### Example usage: /account/newNote/MyFirstNote/This%20is%20my%20first%20note

<br>

### /account/editNote

##### Parameters

##### title | Title of note to edit

##### content | Content of note to replace old content with

##### Returns: If client requesting this endpoint is logged in then edit the specified note if parameters are included, otherwise redirect to /account/signin


<br>

### /account/deleteNote

##### Parameters

##### title | Title of note to delete

##### Returns: If client requesting this endpoint is logged in then delete the specified note if title is included, otherwise redirect to /account/signin

----

## GET Endpoints

### /logout

##### Parameters: NONE

##### Returns: Invalidates client session (if any) then redirects home

<br>

### /account/delete

##### Parameters: NONE

##### Returns: If client requesting this endpoint is logged in then delete the account, otherwise redirect to /account/signin


<br>

### /account/getNotes

##### Parameters: NONE
##### Returns: If client requesting this endpoint is logged in then returns a list of note dictionary objects, otherwise redirect to /account/signin

##### Example usage: /account/newNote/MyFirstNote/This%20is%20my%20first%20note
