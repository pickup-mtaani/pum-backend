require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
var path = require('path');
// const errorHandler = require('_middleware/error-handler');
var dotenv = require('dotenv');
var mongoose = require('mongoose')
const UserRoutes = require('routes/user.routes')
const RolesRoutes = require('routes/role.routes')
const ThrifterLocationRoutes = require('routes/thrifter_location.routes')
const ThrifterRoutes = require('routes/thrifter.routes')
const PackageRoutes = require('routes/package.routes')
const BizCategorygeRoutes = require('routes/business_category.routes')
const BizgeRoutes = require('routes/business.routes')
const AgentRoutes = require('routes/agent.routes')
const RiderRoutes = require('routes/riders.routes')
const productsRoutes = require('routes/products.routes')
const stocksRoutes = require('routes/stocks.routes')
const salesRoutes = require('routes/sales.routes')


app.use(express.static(path.join(__dirname, 'public')));
dotenv.config();

var db;
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err, database) {
    if (err) {
        return console.log(err)
    };
    db = database

    console.log('db connected')
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes


// app.get("/", (req, res) => {
//     res.send().json('index.html');
// })
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/', UserRoutes)
app.use('/api/', RolesRoutes)
app.use('/api/', ThrifterLocationRoutes)
app.use('/api/', ThrifterRoutes)
app.use('/api/', PackageRoutes)
app.use('/api/', BizCategorygeRoutes)
app.use('/api/', BizgeRoutes)
app.use('/api/', AgentRoutes)
app.use('/api/', RiderRoutes)
app.use('/api/', productsRoutes)
app.use('/api/', stocksRoutes)
app.use('/api/', salesRoutes)


// global error handler
// app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
