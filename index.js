const express = require('express');
const bodyParser = require('body-parser')
const db = require('./config/database');
const path = require("path")
const cors = require('cors');

const port = process.env.PORT || 8001


const app = express();
app.use(bodyParser.urlencoded({ limit: '15gb', extended: false }));
app.use(bodyParser.json({limit: '15gb'}));
app.use(cors());


app.use(express.static(path.join(__dirname, 'public')));

db.connection().then((database) => {

    module.exports = database
    app.use('/api/auth', require('./routes/auth.route'));
    app.use('/api', require('./routes/user.route'));

   
    app.listen(port, () => {
        console.log(`The app is up on port ${port}`);
    })
});
