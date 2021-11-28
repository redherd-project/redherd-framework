# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.0.5] - Unreleased
### Added

### Changed

### Removed
- The users API endpoint

### Fixed

### Security


## [v0.0.4] - 2021-09-29
### Added
- The backend implementation of multi-asset module execution
- The frontend implementation of multi-asset module execution
- The new modules/run API endpoint which allows to launch a module on multiple assets at the same time
- The support for assets with RHEL-like operating system (tested on CentOS Linux 8.4 and AlmaLinux 8.4)
- The tabs workspace partial persistence using indexedDB client-side
- The "herd-modules" alias to modules collection folder
- The Herd-CLI function to disable assets
- The Herd-CLI function to revoke OpenVPN certificates
- The Asset transfer modules
- The Docker asset
- The Docker client

### Changed
- The Herd-View theme from light to dark
- The FileManager theme from light to dark
- The overall Herd-View user experience implementing multi tabs workspace and reworking all the interaction mechanics
- The processKiller job for Windows OS implementing a WMIC-based command
- The processKiller job for Unix OS implementing a PsKill-based command
- The module binaries for new process killer logic
- The Docker OpenVPN certificate revocation script to work in batch mode

### Removed
- cifs-utils package installation during debian asset setup

### Fixed
- A Herd-CLI bug allowing the generation of users with empty username
- Herd-View code with first cleanup and rationalization pass
- The windows_ipconfig module metadata
- A bug preventing the Herd-CLI to show the help in absence of arguments
- Some minor Herd-View bugs
- Some minor Herd-Server bugs

### Security
- Fixed Herd-Server libraries vulnerabilities
- Fixed Herd-View libraries vulnerabilities
- Modified the Distribution-Server username generation criteria from pattern-based to random


## [v0.0.3] - 2021-08-19
### Added
- The new System entity into the database. It represents the context of the current framework iteration (seed, dob)
- The new system API endpoint which allows to obtain the system context
- The herd-server code to manage the new System entity
- The herd-view code to manage and retrieve the system context
- The new system Herd-CLI realm, which is responsible for initialize the framework context creating a new seed and inserting dob value
- Debian theHarvester module
- Debian SET module

### Changed
- The herd-server code responsible for the user authentication in order to integrate the validation of the framework seed
- The deploy script in order to initialize the framework context
- Cyber Kill Chain topic list
- SSH keep-alive timeout to 5 seconds

### Fixed
- A bug causing the spawn of services for unexisting assets
- A bug affecting the herd-view causing a race condition while retrieving the system context and impacting on the user login
- Docker time synchronization with host machine
- Docker deamon start in Docker-based modules


## [v0.0.2b] - 2021-07-31
### Changed
- The implementation of the isAlive function for Android and MacOs assets
- Reduced jwt expiration timer to 3 hours

### Fixed
- A **critical** bug affecting the isAlive function for Unix-based assets
- 403 error on Herd-View page refresh

### Security
- Automatic logout in case of jwt expiration


## [v0.0.2a] - Unreleased
### Added
- Windows traceroute module
- Windows Ping Sweep, TCP and UDP nmap modules
- Windows Defender module
- Windows and Debian Metasploit modules
- Windows Gophish module
- Windows PowerView modules
- Debian dirb module 
- Debian Covenant module
- Debian Gophish module
- Debian wpscan module
- Debian hydra module (SSH, FTP, RDP)
- Debian netcat listener module
- The processKiller job for Windows OS 
- URL validation function

### Changed
- Module output format
- The asset isAlive function
- Asset modules table

### Removed
- Local demo asset

### Fixed
- Debian shared folder permissions
- Windows file transfer modules
- Interactive modules UI


## [v0.0.1] - 2021-07-16
### Added
- New module execution verb "pivot" used to execute modules that require a redirection to an external application
- Windows shared files management modules

### Changed
- The module-detail component of Herd-View, implementing a first iteration of the business logic required to manage the new "pivot" verb
- The debian_motion_cam module implementing the pivot function
- The debian_rtsp_cam module implementing the pivot function
- Documentation updated

### Fixed
- Wrong output while generating debian client one-liner with Herd-CLI
- Herd-CLI asset one-liner generation
- Android asset setup repository management
- Windows asset setup SSH configuration
- Herd-View "Not Found" issue

### Security 
- Distribution-Server default credentials removed
- Distribution-Server credentials generated at first deploy
- Herd-View default user removed
- npm dependencies updated in different package-lock.json files


## [v0.0.1c] - Unreleased
### Added
- Topics based on Cyber Kill Chain

### Changed
- Optional database initialization during framework deploy
- Existing modules topic
- Documentation updated


## [v0.0.1b] - Unreleased
### Added
- Hot module update
- Draft documentation

### Changed
- Herd-CLI code refactored in order to allow its direct interaction with the herd-server db
- Modified the users entity of the herd-server db adding the UNIQUE constraint to the uname field
- Modified Herd-CLI one-liner management realm name from "asset" to "endpoint" in order to provide a more accurate association

### Removed
- Runtime modification of the REDHERD_PATH variable in the Herd-CLI script

### Fixed
- Modified the initialization of the REDHERD_PATH variable using an environment based function
- Fixed some wrong descriptions in the Herd-CLI help


## [v0.0.1a] - Unreleased
- First commit
