module.exports = {editNote, deleteNote, getNotes, newNote, createUser, getUser, loginUser, deleteUser}
const bcrypt = require('bcryptjs')
const {Level} = require('level') // For type inference

////////////////////////////////////////////////////////////////
////////// Account Management Utility Functions ////////////////
////////////////////////////////////////////////////////////////

/**
 * Fetches specified user if existing from the DB, otherwise returns null
 * @param {Level} db LevelDB Instance
 * @param {string} username
 */
async function getUser(db, username) {
    let toReturn
    await db.get(username)
        .then(user => {
            toReturn = user
        })
        .catch(() => {
            toReturn = null
        })
    return toReturn
}

/**
 * Deletes specified user from DB if existing and if auth details are valid
 * @param {Level} db LevelDB Instance
 * @param {string} username User's username
 * @param {string} password User's password
 */
async function deleteUser(db, username, password) {
    const isExistingUser = await getUser(db, username)
    if (!isExistingUser) {
        return "Cannot delete non-existing user"
    } else {
        // Validate user password before doing anything else
        const result = bcrypt.compareSync(password, isExistingUser.Password)
        if (isExistingUser.Username === username && result) {
            let toReturn
            // Remove existing user if password was correct
            await db.del(username)
                .then(() => {
                    toReturn = `Successfully Deleted ${username}`
                })
                .catch(() => {
                    toReturn = "Database error"
                })
            return toReturn
        } else {
            return "Incorrect Password"
        }
    }
}

/**
 * Fetches specified user if existing from the DB, otherwise returns null
 * @param {Level} db LevelDB Instance
 * @param {string} username User's username
 * @param {string} password User's password
 */
async function createUser(db, username, password) {
    const isExistingUser = await getUser(db, username)
    if (!isExistingUser) {
        // If username is not taken, proceed with creating account

        // Hash password for security
        bcrypt.hash(password, 5, async function (err, hashed) {
            // Save to DB and return success response
            await db.put(username, {"Username": username, "Password": hashed, "Notes": [], "ToDos": []})
        });
        return "User has been created successfully"
    } else {
        return "User Exists"
    }
}

/**
 * Logs in specified user if existing and if auth details are valid
 * @param {Level} db LevelDB Instance
 * @param {string} username User's username
 * @param {string} password User's password
 */
async function loginUser(db, username, password) {
    const isExistingUser = await getUser(db, username)
    if (isExistingUser) {
        // If user exists, validate credentials
        const result = bcrypt.compareSync(password, isExistingUser.Password)
        if (isExistingUser.Username === username && result) {
            return "Successfully Signed In"
        } else {
            return "Invalid login details"
        }
    } else {
        return "Invalid login details"
    }
}


////////////////////////////////////////////////////////////////
////////// Note Management Utility Functions ////////////////
////////////////////////////////////////////////////////////////


/**
 * Deletes specified note if existing and if auth details are valid
 * @param {Level} db LevelDB Instance
 * @param {Object} note Note object with Title and Content values
 * @param {string} username User's username
 * @param {string} password User's password
 */
async function deleteNote(db, note, username, password) {
    const isExistingUser = await getUser(db, username)
    if (isExistingUser) {
        // Validate credentials
        const result = bcrypt.compareSync(password, isExistingUser.Password)
        if (isExistingUser.Username === username && result) {
            let updatedUserInfo = isExistingUser
            // Check if note already exists
            let existingNotes = isExistingUser.Notes
            let alreadyExisting = false
            let newNotes = []
            for (let iteratedNote in existingNotes) {
                let noteObj = existingNotes[iteratedNote]
                if (noteObj.Title === note.Title) {
                    alreadyExisting = true
                } else {
                    // Add all notes that aren't the note to be deleted to a new array to replace the existing user notes
                    newNotes.push(noteObj)
                }
            }
            if (alreadyExisting) {
                updatedUserInfo.Notes = newNotes // Overwrite old notes
                await db.put(username, updatedUserInfo)
                return {"Success": "Successfully Deleted Note"}
            } else if (!alreadyExisting) { // If note isn't existing it can't be deleted, so return error
                return {"Error": "No note exists under that name."}
            }
        }
    }
}

/**
 * Edits specified note if existing and if auth details are valid
 * @param {Level} db LevelDB Instance
 * @param {Object} note Note object with Title and Content values
 * @param {string} username User's username
 * @param {string} password User's password
 */
async function editNote(db, note, username, password) {
    const isExistingUser = await getUser(db, username)
    if (isExistingUser) {
        // Validate credentials
        const result = bcrypt.compareSync(password, isExistingUser.Password)
        if (isExistingUser.Username === username && result) {
            let updatedUserInfo = isExistingUser
            // Check if note already exists
            let existingNotes = isExistingUser.Notes
            let alreadyExisting = false
            let newNotes = []
            newNotes.push(note) // Add updated note to new note list, then add old notes to it
            for (let iteratedNote in existingNotes) {
                let noteObj = existingNotes[iteratedNote]
                if (noteObj.Title !== note.Title) {
                    newNotes.push(noteObj)
                } else {
                    alreadyExisting = true
                }
            }
            if (alreadyExisting) {
                updatedUserInfo.Notes = newNotes // Overwrite old notes
                await db.put(username, updatedUserInfo)
                return {"Success": "Successfully Updated Note"}
            } else if (!alreadyExisting) { // If note isn't existing it can't be edited, so return error
                return {"Error": "No note exists under that name."}
            }
        }
    }
}

/**
 * Creates new note if not already existing and if auth details are valid
 * @param {Level} db LevelDB Instance
 * @param {Object} note Note object with Title and Content values
 * @param {string} username User's username
 * @param {string} password User's password
 */
async function newNote(db, note, username, password) {
    const isExistingUser = await getUser(db, username)
    if (isExistingUser) {
        // Validate credentials
        const result = bcrypt.compareSync(password, isExistingUser.Password)
        if (isExistingUser.Username === username && result) {
            let updatedUserInfo = isExistingUser
            // Check if note already exists
            let existingNotes = isExistingUser.Notes
            let alreadyExisting = false
            for (let iteratedNote in existingNotes) {
                let noteObj = existingNotes[iteratedNote]
                if (noteObj.Title === note.Title) {
                    alreadyExisting = true
                }
                console.log(noteObj)
            }
            if (!alreadyExisting) {
                updatedUserInfo.Notes.push(note)
                await db.put(username, updatedUserInfo)
                return {"Success": "Successfully Added Note"}
            } else if (alreadyExisting) {
                return {"Error": "A note already exists under that title"}
            }
        }
    }
}

/**
 * Gets user notes if auth details are valid
 * @param {Level} db LevelDB Instance
 * @param {string} username User's username
 * @param {string} password User's password
 */
async function getNotes(db, username, password) {
    const isExistingUser = await getUser(db, username)
    if (isExistingUser) {
        // Validate credentials
        const result = bcrypt.compareSync(password, isExistingUser.Password)
        if (isExistingUser.Username === username && result) {
            const notes = isExistingUser.Notes
            return {"Notes": notes}
        }
    }
}
