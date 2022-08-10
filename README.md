# DeviceSync V2

----------

## About

**DeviceSync is an open source cross-platform note-taking application under the MIT License**

### Why the rewrite?

#### I've thought of a lot of things I could do better with DeviceSync, both in how I advertise the application, and the tech stach used with it, where the last version was written in a shoddy Python Flask backend and was not even on the same domain, this version is written in NodeJS using ExpressJS to manage both page endpoints and API endpoints, and I was just bored near the end of summer

## Features

- Note system with CRUD support (create, read, update, delete)
- Allows the copying of note content, editing of existing notes, and the deletion of existing notes
- Account system with BCrypt password hashing using LevelDB
- [Ability to self-host the application ](https://github.com/ZadenMaestas/DeviceSync#self-hosting)
- **More updates on the way!** Planned features include, ToDos, account portal, custom theming, CLI in Python
  using Requests module and DeviceSync API

## Current Tech Stack

- NodeJS
    - Modules:
        - Production:
            - [Express](https://expressjs.com) | Quite popular web server framework that I wanted to try
            - [LevelDB](https://github.com/Level/level) | Key Value Storage Solution
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

### [Current state of API documentation can be found here]()