Intro guide to setting up this site:

Step 1: go to the repo, click "clone repo", and pick a destination on your computer to store the code file.

step 2: create a file called ".env.local" at the project root. then, go to Vercel and grab the values in the "environment variables" section, and add them line by line. it should look something like this:

ENV_VAR=123asgdf1&
ENV_VAR_TWO=word

These are where you store "keys", which are used to access services like the resend api (for the contact form) and the sanity api (for the cms/database). It's important to never push these to github for security reasons, which is why you have to add them manually.

Step 3: install Node (ask Cursor to help you with this, just install the most recent version). make sure the terminal shows the project root (semajmurphy most likely) before the text input to make sure you're editing the project folder.

step 4: open the terminal (control + `), then run the command "npm install". this will install the packages requried to work on the site.

To run the project on your computer:

just run the command in the terminal (control + `): "npm run dev". Then, visit localhost:3000 in your browser once the project has booted up.

To publish changes to the code:

Vercel is set to automatically rebuild the site once you push changes to github. To push changes to github, run these 3 commands in the terminal sequentially:

git add .
git commit -m "describe your changes here"
git push origin main

These 3 commands in a row are your method of publishing code to github, and pushing them to the live site.