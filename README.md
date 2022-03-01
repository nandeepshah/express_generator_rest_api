## Express Generator Server

[Setup](#initial-setup)  
[REST API](#rest-api)

## Initial Setup

Scaffold out an express server using the express generator npm pacakge

```bash
npm install -g express-generator@4.16.1
```

Then run the command in the parent directory. This command will create a new directory

```bash
express nucampsiteServer
```

Alternatively if this does not work use the following:

```bash
npx express-generator@4.16.1 nucampsiteServer
```

Now you can open this `nucampsiteSever` folder in VSCode.  
Then in the terminal run

```bash
npm install
```

You can now start the express server on `localhost:3000`

```bash
npm start
```

Add a `.gitignore` file to the directory and add `node_modules` to the file.  
Start a git repo here and add all the files and commit with a message "express generator server"

```bash
git init
git add .
git commit -m "express generator server"
```

[Back to Top](#express-generator-server)

## Rest API

To implement the REST API using this express server we will copy some of the files that were previously written for the pure express server.

Copy **`campsiteRouter.js`** , **`promotionsRouter.js`**, **`partnerRouter.js`** to **`\routes`** folder

Copy **`index.html`** , **`aboutus.html`** to **`\public`** folder

Then open `app.js` then enter the following code

```javascript
. . .
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
. . .
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);
. . .
```

After this do a git commit as below

```bash
git add .
git commit -m "express generator rest api"
git push
```

[Back to Top](#express-generator-server)
