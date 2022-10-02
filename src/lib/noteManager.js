/**
 * Class that allows management of notes via a UserSession
 * @param userSession {UserSession} The active user session to use
 */
class NoteManager {
    constructor(userSession) {
        this.userSession = userSession
    }

    /**
     * Creates new note if not already existing and if auth details are valid
     * @param {{Content: string, Title: string}} note Note object with title and content to save
     */
    async newNote(note) {
        const username = this.userSession.username
        const user = await this.userSession.getUser()
        let updatedUserInfo = user
        // Check if note already exists
        let existingNotes = user.Notes
        let alreadyExisting = false
        for (let iteratedNote in existingNotes) {
            let noteObj = existingNotes[iteratedNote]
            if (noteObj.Title === note.Title) {
                alreadyExisting = true
            }
        }
        if (!alreadyExisting) {
            updatedUserInfo.Notes.push(note)
            await this.userSession.db.put(username, updatedUserInfo)
            return {"Success": "Successfully Added Note"}
        } else if (alreadyExisting) {
            return {"Error": "A note already exists under that title"}
        }
    }

    /**
     * Gets user notes if auth details are valid
     */
    async getNotes() {
        const user = await this.userSession.getUser()
        const notes = user.Notes
        return {"Notes": notes}
    }

    /**
     * Edits specified note if existing and if auth details are valid
     * @param {{Content: string, Title: string}} note Note object with title and content to alter
     */
    async editNote(note) {
        const username = this.userSession.username
        const user = await this.userSession.getUser()
        let updatedUserInfo = user
        // Check if note already exists
        let existingNotes = user.Notes
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
            await this.userSession.db.put(username, updatedUserInfo)
            return {"Success": "Successfully Updated Note"}
        } else if (!alreadyExisting) { // If note isn't existing it can't be edited, so return error
            return {"Error": "No note exists under that name."}
        }
    }

    /**
     * Deletes specified note if existing and if auth details are valid
     */
    async deleteNote(noteTitle) {
        const username = this.userSession.username
        const user = await this.userSession.getUser()
        let updatedUserInfo = user
        // Check if note already exists
        let existingNotes = user.Notes
        let alreadyExisting = false
        let newNotes = []
        for (let iteratedNote in existingNotes) {
            let noteObj = existingNotes[iteratedNote]
            if (noteObj.Title === noteTitle) {
                alreadyExisting = true
            } else {
                // Add all notes that aren't the note to be deleted to a new array to replace the existing user notes
                newNotes.push(noteObj)
            }
        }
        if (alreadyExisting) {
            updatedUserInfo.Notes = newNotes // Overwrite old notes
            await this.userSession.db.put(username, updatedUserInfo)
            return {"Success": "Successfully Deleted Note"}
        } else if (!alreadyExisting) { // If note isn't existing it can't be deleted, so return error
            return {"Error": "No note exists under that name."}
        }

    }
}

module.exports = {NoteManager};