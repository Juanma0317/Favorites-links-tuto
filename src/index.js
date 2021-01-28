const express = require(`express`);
const morgan = require(`morgan`);
const exphbs = require(`express-handlebars`);
const path = require(`path`);
const { urlencoded } = require("express");
const flash = require(`connect-flash`);
const session = require(`express-session`);
const MySQLStore = require(`express-mysql-session`);
const {database} = require(`./keys`); 
const passport = require(`passport`);
/* Incialization */
const app = express();
require(`./lib/passport`);



/* Settings */
app.set(`port`, process.env.PORT || 4000);
app.set(`views`, path.join(__dirname,`views`));
app.engine(`.hbs`, exphbs({
   defaultLayout: `main`,
   layoutsDir: path.join(app.get(`views`), `Layouts`),
   partialsDir: path.join(app.get(`views`), `partials`),
   extname: `.hbs`,
   helpers: require(`./lib/handlebars`)


}));

app.set(`view engine`, `.hbs`);

/* Middleware */
app.use(session({
    secret: `faztmysqlnodesession`,
    resave: false,
    saveUninitialized: false,
    store:  new MySQLStore(database)    

}));
app.use(flash());
app.use(morgan(`dev`));
app.use(urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

/* Global variables */
app.use((req,res,next)=>{
    app.locals.success = req.flash(`success`);
    app.locals.message = req.flash(`message`);
     app.locals.user = req.user;
    next();
});



/* Routes */
app.use(require(`./routes/index.js`));
app.use(require(`./routes/authentication.js`));
app.use(`/links`,require(`./routes/links.js`));



/* Files Pubblic */
app.use(express.static(path.join(__dirname,`public`)));

/* Starting on Server */
app.listen(app.get(`port`), ()=>{
    console.log(`Server on Port`,app.get(`port`));
});
