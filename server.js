require(`dotenv`).config();
const express = require(`express`);
const exphbs = require(`express-handlebars`);
const passport = require(`passport`);
const flash = require(`connect-flash`);
const cron = require(`./cron`);
const expressip = require(`express-ip`);

var db = require(`./models`);

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(`public`));
app.use(require(`express-session`)({ secret: `keyboard cat`, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(expressip().getIpInfoMiddleware);

//Cron
cron.start();

// Handlebars
app.engine(
    `handlebars`,
    exphbs({
        defaultLayout: `main`
    })
);
app.set(`view engine`, `handlebars`);

// Routes
require(`./routes/apiRoutes`)(app);
require(`./routes/htmlRoutes`)(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === `test`) {
    syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
    app.listen(PORT, function () {
        console.log(
            `==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.`,
            PORT,
            PORT
        );
    });
});

module.exports = app;
