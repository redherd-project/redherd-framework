const fs = require('fs')
const sqlite = require('sqlite-sync');

let db = "redherd.sqlite3";

//  Delete database (if it exists)
// ******************************
try {
    if (fs.existsSync(db)) {
        fs.unlinkSync(db);
    }
} catch(err) {
    console.error(err)
}

//  Create database
// ******************************
sqlite.connect(db); 

//  Create tables
// ******************************
// assets
sqlite.run("CREATE TABLE assets (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, name TEXT, ip TEXT, description TEXT, user TEXT, fingerprint TEXT UNIQUE, wport INTEGER, joined INTEGER DEFAULT 1, id_type INTEGER)", null);
// assets_topics
sqlite.run("CREATE TABLE assets_topics (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, id_asset INTEGER NOT NULL, id_topic INTEGER NOT NULL);", null);
// processes
sqlite.run("CREATE TABLE processes (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, module TEXT NOT NULL, id_asset INTEGER NOT NULL, session TEXT NOT NULL);", null);
// roles
sqlite.run("CREATE TABLE roles (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, name TEXT NOT NULL, description TEXT);", null);
// topics
sqlite.run("CREATE TABLE topics (id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, name	TEXT NOT NULL, description TEXT, repo TEXT);", null);
// types
sqlite.run("CREATE TABLE types (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, name	TEXT NOT NULL, description TEXT);", null);
// users
sqlite.run("CREATE TABLE users (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, uname TEXT NOT NULL UNIQUE, secret TEXT, enabled INTEGER DEFAULT 0);", null);
// users_roles
sqlite.run("CREATE TABLE users_roles (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, id_user	INTEGER NOT NULL, id_role INTEGER NOT NULL);", null);
// system
//sqlite.run("CREATE TABLE system (seed TEXT NOT NULL PRIMARY KEY UNIQUE, dob	TEXT, current INTEGER NOT NULL DEFAULT 0);", null);
sqlite.run("CREATE TABLE system (seed TEXT NOT NULL PRIMARY KEY UNIQUE, dob	TEXT NOT NULL DEFAULT current_timestamp);", null);

//  Insert data
// ******************************
// assets
// sqlite.run("INSERT INTO main.assets (name, ip, description, user, fingerprint, wport, id_type) VALUES ('demo', '127.0.0.1', 'This is a local demo asset', 'pi', 'f1b487e553520284bda1cafcce23c871', 22, 1);", null);
// topics (debian)
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('debian_service', 'Debian service modules', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('debian_misc', 'Debian generic modules', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('debian_reconnaissance', 'Debian modules to gather target information', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('debian_weaponization', 'Debian modules to develop a payload', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('debian_delivery', 'Debian modules to deliver a payload to a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('debian_exploitation', 'Debian modules to exploit a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('debian_installation', 'Debian modules to a malicious software on a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('debian_command_and_control', 'Debian modules to establish a command and control channel on a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('debian_actions', 'Debian modules to produce an effect on a target', NULL);", null);
// topics (android)
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('android_service', 'Android service modules', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('android_misc', 'Android generic modules', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('android_reconnaissance', 'Android modules to gather target information', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('android_weaponization', 'Android modules to develop a payload', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('android_delivery', 'Android modules to deliver a payload to a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('android_exploitation', 'Android modules to exploit a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('android_installation', 'Android modules to a malicious software on a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('android_command_and_control', 'Android modules to establish a command and control channel on a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('android_actions', 'Android modules to produce an effect on a target', NULL);", null);
// topics (windows)
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('windows_service', 'Windows service modules', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('windows_misc', 'Windows generic modules', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('windows_reconnaissance', 'Windows modules to gather target information', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('windows_weaponization', 'Windows modules to develop a payload', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('windows_delivery', 'Windows modules to deliver a payload to a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('windows_exploitation', 'Windows modules to exploit a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('windows_installation', 'Windows modules to a malicious software on a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('windows_command_and_control', 'Windows modules to establish a command and control channel on a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('windows_actions', 'Windows modules to produce an effect on a target', NULL);", null);
// topics (macos)
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('macos_service', 'MacOS service modules', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('macos_misc', 'MacOS generic modules', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('macos_reconnaissance', 'MacOS modules to gather target information', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('macos_weaponization', 'MacOS modules to develop a payload', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('macos_delivery', 'MacOS modules to deliver a payload to a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('macos_exploitation', 'MacOS modules to exploit a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('macos_installation', 'MacOS modules to a malicious software on a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('macos_command_and_control', 'MacOS modules to establish a command and control channel on a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('macos_actions', 'MacOS modules to produce an effect on a target', NULL);", null);
// topics (centos)
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('centos_service', 'CentOS service modules', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('centos_misc', 'CentOS generic modules', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('centos_reconnaissance', 'CentOS modules to gather target information', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('centos_weaponization', 'CentOS modules to develop a payload', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('centos_delivery', 'CentOS modules to deliver a payload to a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('centos_exploitation', 'CentOS modules to exploit a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('centos_installation', 'CentOS modules to a malicious software on a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('centos_command_and_control', 'CentOS modules to establish a command and control channel on a target', NULL);", null);
sqlite.run("INSERT INTO main.topics (name, description, repo) VALUES ('centos_actions', 'CentOS modules to produce an effect on a target', NULL);", null);
// types
sqlite.run("INSERT INTO main.types (name, description) VALUES ('debian', 'Debian based asset type');", null);
sqlite.run("INSERT INTO main.types (name, description) VALUES ('centos', 'CentOS based asset type');", null);
sqlite.run("INSERT INTO main.types (name, description) VALUES ('android', 'Android based asset type');", null);
sqlite.run("INSERT INTO main.types (name, description) VALUES ('windows', 'Windows based asset type');", null);
sqlite.run("INSERT INTO main.types (name, description) VALUES ('macos', 'macOS based asset type');", null);

//  Close database
// ******************************
sqlite.close();
