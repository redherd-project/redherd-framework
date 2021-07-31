# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.0.3] - Unreleased
### Added

### Changed

### Removed

### Fixed

### Security

## [v0.0.2b] - 2021-07-31
### Added

### Changed
- The implementation of the isAlive function for Android and MacOs assets
- Reduced jwt expiration timer to 3 hours

### Removed

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
