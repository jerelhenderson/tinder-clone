# Simple Tinder Clone
This NodeJS project was created following the [How to Create a Dating Web App in NodeJS](https://www.cometchat.com/tutorials/tinder-clone-dating-website-node-js) tutorial and may be the basis of a (non-dating) swipe application idea.

The primary technologies used are:
* CometChat JavaScript
* ExpressJS
* MySQL

## Up and Running
### Accounts, APIs - Oh my!
1. Clone this repository using `git clone https://github.com/jerelhenderson/tinder-clone.git`
2. Now, create a [CometChat](https://app.cometchat.com/signup) account.
3. Navigate to the Users tab and delete all the default users.
4. Next, go to the [Apps Dashboard](https://app.cometchat.com/apps) and add a new application. You can name it as you wish.
5. After you've added the app, you'll be copying four items from the [API & Auth Keys](https://app.cometchat.com/app/202197cc0c1d1ccf/api-keys) page to a `config.js` file in the cloned repository's `public/js` directory.
6. Copy your APP ID, Region, Auth Key and Rest API Key to the provided `example_config.js` file, uncomment, then rename this file as `config.js`. If you plan to upload this directory to a public repository, be sure to add this file to your `.gitignore`
### MySQL - No, your SQL!
7. Next, you will need to have a [MySQL server](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/) installed.
8. In the project root directory, add your database connection information to the `.env_example` file, rename it to `.env` and don't forget to `.gitignore if you will be uploading this repository to the Internet.
### Ready, set... install!
9. Working off the assumption you NodeJS is installed on your computer, it's time to `npm install`!
10. Run the server with either `npx nodemon index.js` or `node index.js`