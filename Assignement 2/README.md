## Assignement 2 : Node.js + static html + client-side js.
Starting from the live multiuser whiteboard drawing app, add the save image on server feature :

Create a new endpoint on your node server able to receive http post file uploads. File upload will be stored in a dedicated folder. Watch out for directory permissions Whenever a file is uploaded, insert a document in a mongodb database with username, datetime, path to image.
use canvas.toDataURL() method

On client side, Add a button in the menubar to save the image on the server.

use Fetch to send the image stored in the DataURL to the new endpoint.

Display a sucess message on client when upload is done.

Create a new endpoint on your node server to send the list of uploaded images with username, datetime, URL to image

Add a "saved images" button in the menubar that will open a new page listing all saved images with links to open them.

you can use the "Formidable" Node Module to handle file uploads : https://www.w3schools.com/nodejs/nodejs_uploadfiles.asp https://www.npmjs.com/package/formidable

The assignement directory will contain your node.js file structure including server.js ( your main node code) package.json a public directory including your static files

## How to run...
<ul>
<li>Clone the repo and navigate to the folder containing "server.js" </li>
<li>Run "npm install package.json" to create node_modules folder </li>
<li>For DB, either install mongoDB on local machine or you can use Docker, depending upon that use the mongoDB client url </li>
<li>Run "node server.js", this will run app on localhost:3000</li>
</ul>

## MongoDB connection with Heroku
<ul>
<li>For deployment on Heroku, I have used a cloud-hosted MongoDB service "MongoDB Atlas".</li>
<li>On MongoDB Atlas , I created a cluster under a project, then created a database and added collection to it.</li>
<li>Then, obtained DB URI and added the environment variable <b>MONGODB_URI</b> under "Config Vars" on Heroku.</li>
</ul>

## Available on a public web url**

App is available on Heroku and can be accessed by below url:-
https://whiteboard-assignment-2.herokuapp.com