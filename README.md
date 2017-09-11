# Ophelia - The SIG-Game Webserver

This is a test

This is the repository for SIG-Game's webserver application, the main entry point
for competitors of MegaMinerAI.

## Getting Started - Developers
For development, the project uses Vagrant in order to support multiple development
systems while still maintaining stability across them. Check out [this](http://siggame.io)
 post for more info on what Vagrant does.
 
 First, make sure you have [Vagrant](https://www.vagrantup.com/downloads.html)
 and [VirtualBox](https://www.virtualbox.org/wiki/Downloads) installed.
 
 Windows users, it is highly recommended that you use
 [Git Bash](https://git-scm.com/downloads) instead of Command Prompt.
 
 After installing those programs, go into your project's directory and run the following:
```
vagrant up
```
This will set up a VM with everything you need to start development. Once it finishes,
to access the box use:

```
vagrant ssh
```
Once you've SSH'd into the box, first change into the working directory:
```
cd /home/ubuntu/workspace
```
Note that you **should not edit these files on the VM.**

After you're in the working directory, run the following to start the server in debug mode: 
```
npm run-script debug
``` 
You can then navigate to [localhost:3000](localhost:3000) to use the site.

Once you make changes to the files on your local machine, refresh the page in your browser
to see your changes. 

## Running the Webserver for Production

--

## Troubleshooting

--
