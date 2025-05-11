const express = require('express');
const morgan = require('morgan');
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');
const offerRoutes = require('./routes/offerRoutes');
const Item = require('./models/item')
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
require('dotenv').config();

const app = express();
let port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

app.set('view engine', 'ejs');

mongoose.connect(mongoUri)
.then(() =>{
    app.listen(port, () =>{
        console.log('Server is running on', port);
    })
})
.catch(err => console.log(err.message));

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'nfeiwofnieownfiow',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl: mongoUri})
}))

app.use(flash())

app.use((req, res, next) =>{
    console.log(req.session)
    res.locals.user = req.session.user || null
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
})

app.get('/', (req, res) =>{
    mongoose.connection.db.collection('items').find().toArray()
        .then(items => {
            console.log(items)
            res.render('index', { items });
        })
        .catch(err => {
            console.error('Error fetching items:', err);
            res.status(500).send('Server Error');
        });
})

app.use('/items', itemRoutes);
app.use('/users', userRoutes);
app.use('/offers', offerRoutes);

app.use((req, res, next) =>{
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) =>{
    console.log(err.stack)
    if(!err.status){
        err.status = 500;
        err.message = ("Internal Sever Error");
    }
    res.status(err.status);
    res.render('error', {error: err});
})

