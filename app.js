const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors({
    origin: '*'
}));

// App Routers
const appLoginRouter = require('./routes/app/login');
app.use(express.json());
app.use('/app/login', appLoginRouter)

const appCoinsRouter = require('./routes/app/coins');
app.use(express.json());
app.use('/app/coins', appCoinsRouter)

const appCategoriesRouter = require('./routes/app/categories');
app.use(express.json());
app.use('/app/categories', appCategoriesRouter)

const appChampionshipsRouter = require('./routes/app/championships');
app.use(express.json());
app.use('/app/championships', appChampionshipsRouter)

const appQuestionsRouter = require('./routes/app/questions');
app.use(express.json());
app.use('/app/questions', appQuestionsRouter)

// Admin Routers
const adminLoginRouter = require('./routes/admin/login');
app.use(express.json());
app.use('/admin/login', adminLoginRouter)

const adminLabelsRouter = require('./routes/admin/labels');
app.use(express.json());
app.use('/admin/labels', adminLabelsRouter)

app.get('/', (req,res) => {
    res.send('<h1>Node.js crud API</h1>')
})

app.get('/health', (req,res) => {
    res.send("API Health");
})

app.listen(port, () => {
    console.log('Listening port: ' + port);
})