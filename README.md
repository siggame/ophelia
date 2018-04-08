# Ophelia - The SIG-Game Webserver

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This is the repository for SIG-Game's webserver application, the main entry point
for competitors of MegaMinerAI.

## Getting Started - Developers

To develop on the project, you'll need a newer version of [NodeJS](https://nodejs.org/en/) (LTS is preferred).

If you're on Windows, [Git Bash](https://git-scm.com/downloads) is reccomended as a replacement for Command Prompt.

### Environment Variables

The project relies on some global environment variables to get working. There should be a `.env_example` in the `client/`
and `server/` directories. Copy these files and rename the copy to `.env`. **DO NOT COMMIT THE .env FILES.** They're in the .gitignore, but just to be sure.

#### Server .env

This file contains any secrets that the backend needs to work properly. This includes things like database connection parameters, and things like that. **Again, do not commit this file.** This contains stuff you wouldn't want people to see. You should be getting the values for this from the team leads.

#### Client .env

This file sets some global stuff for the fronend, but **none of it is actually secret.** Since we're sending all of this code to the frontend, the client has access to all of it. This file is just more useful for setting "global variables". Note: every variable here should be prefixed with `REACT_APP_` for it to work properly.

Once you've installed the needed programs and set up the .env files, go ahead and run the following:
```
$ npm run setup
```

This will install all of the needed packages and put you back in the base directory of the repo. Once you're there, run the following to start the server in debug mode:
```
$ npm run debug
```
You can then navigate to [localhost:3000](localhost:3000) to use the site.

Once you make changes to the files on your local machine, refresh the page in your browser
to see your changes.

## Running the Webserver for Production

--

## Troubleshooting

--
