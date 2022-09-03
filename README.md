# DeviceSync V2

## About

**DeviceSync is an open source cross-platform note-taking application under the MIT License**

## Usage | [Application can be found here](https://devicesync.theprotondev.repl.co)

### Phone Installation:

**Tap on your browser menu and tap the Add To Homescreen button**

_You can then open DeviceSync from the home screen, and it will look like it's very own app!_

### Computer Usage:

**You're likely to use the site as usual on PC, but if you'd like browsers like Brave support a similar look to the PWA
on mobile. To achieve this open the browser menu, go to more tools, and click Create Shortcut. This will then open a
promp for the shortcut name and give a untoggled option "Open In Window" make sure to toggle that then press add**

_You can then open DeviceSync from the desktop, and it will have its own window separate from your regular browser tabs_

### If you're a power-user or just like having the power of a Command Line Interface, you're in luck DeviceSync has it's very own CLI written in Python3. To install it follow the instructions below

**Note: Only works on Linux**

#### Bash Shell

```bash
sudo bash <(curl -s https://raw.githubusercontent.com/ZadenMaestas/DeviceSync/main/bin/install-cli.sh)
```

#### Fish Shell:

```bash
sudo bash (curl -s https://raw.githubusercontent.com/ZadenMaestas/DeviceSync/main/bin/install-cli.sh | psub)
```

---

### Why the rewrite?

#### I've thought of a lot of things I could do better with DeviceSync, both in how I advertise the application, and the tech stach used with it, where the last version was written in a shoddy Python Flask backend and was not even on the same domain, this version is written in NodeJS using ExpressJS to manage both page endpoints and API endpoints, and I was just bored near the end of summer

## Features

- Note system with CRUD support (create, read, update, delete)
- Allows the copying of note content, editing of existing notes, and the deletion of existing notes
- Account system with BCrypt password hashing using LevelDB
- CLI Available For Linux | [Click Here To Learn More](https://github.com/ZadenMaestas/DeviceSync#if-youre-a-power-user-or-just-like-having-the-power-of-a-command-line-interface-youre-in-luck-devicesync-has-its-very-own-cli-written-in-python3-to-install-it-follow-the-instructions-below)
- [Ability to self-host the application ](https://github.com/ZadenMaestas/DeviceSync#self-hosting)
- Custom UI theming
- **More updates on the way!**
    - Planned features include
        - ToDos
        - User note groups
        - Account portal

## Current Tech Stack

- NodeJS
    - Modules:
        - Production:
            - [Express](https://expressjs.com) | Quite popular web server framework that I wanted to try
            - [LevelDB](https://github.com/Level/level) | Key Value Storage Solution
            - [BcryptJS](https://github.com/dcodeIO/bcrypt.js#readme) | Used for password hashing
        - Development:
            - [nodemon](https://nodemon.io) | Enables hot reloading for the server which is essential for me personally
            - livereload & connect-livereload | Another layer of adding hot reloading but reloads changes on browser
- HTML, CSS, and JavaScript
- CSS Microframework used: [Chota](https://jenil.github.io/chota/)

## Development and Contribution:

#### Pull requests and positive contributions are appreciated in any way!

### Running server

```bash
git clone https://github.com/ZadenMaestas/DeviceSync.git
cd DeviceSync/src
npm install
npm run dev
```

## Self-hosting

### You are more than welcome to host your own instance of DeviceSync on your own server, simply follow the development instructions above

## Documentation

### [Current state of API documentation can be found here](https://github.com/ZadenMaestas/DeviceSync/blob/main/docs/documentation.md)
