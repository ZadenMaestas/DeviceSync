module.exports = {readDB}

/**
 * Function exclusively for debugging in a development environment. Logs the database details.
 * @param db : The LevelDB Instance In Use
 * @returns void
 */
async function readDB(db) {
    for await (const [key, value] of db.iterator()) {
        console.log(key, value)
    }
}
