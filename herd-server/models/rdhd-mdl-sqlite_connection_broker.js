'use strict';

const sqlite = require('sqlite-sync');

class SqliteConnectionBroker
{
    constructor(db)
    {
        this._db = db;
    }

    // Open database connection
    connect(verbose = false)
    {
        try
        {
            sqlite.close();
            if (verbose)
            {
                console.log("Database connection already established");
            }
        }
        catch
        {
            if (verbose)
            {
                console.log("Establish new database connection");
            }
        }
        finally
        {
            sqlite.connect(this._db);
        }
        return sqlite;
    }

    // Close database connection
    close(verbose = false)
    {
        try
        {
            sqlite.close();
            if (verbose)
            {
                console.log("Database connection closed");
            }
        }
        catch
        {
            if (verbose)
            {
                console.log("No existing database connection");
            }
        }
    }
}

module.exports = SqliteConnectionBroker;