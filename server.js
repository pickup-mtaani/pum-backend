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
const Routes = require('routes/routes.routes')
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
const adminRoutes = require('routes/admin.routes')
const DoorstepRoutes = require('routes/door_step_package.routes')
const AgentToAgentRoutes = require('routes/agent_package.routes')
const zoneRoutes = require('routes/zones.routes')
const convRoutes = require('routes/conversation.routes')
var Riders = require('./IoControllers/riders.io')
var http = require('http').createServer(app)
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
app.use('/api/', convRoutes)
app.use('/api/', Routes)
app.use('/api/admin', adminRoutes)
app.use('/api/', zoneRoutes)
app.use('/api/', DoorstepRoutes)
app.use('/api/', AgentToAgentRoutes)


// global error handler
// app.use(errorHandler);

const root = require('path').join(__dirname, 'frontend', 'build')
app.use(express.static(root));
// app.get("*", (req, res) => {
//   res.sendFile('index.html', { root });
// })
app.get('*', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, 'frontend/build') });
});
// app.post('/mpesa-callback', async (req, res, next) => {
//     console.log(res)
//     // https://0dbf-217-21-116-210.in.ngrok.io
//     // try {
//     //   const Update = await MpesaLogs.findOneAndUpdate({ MerchantRequestID: req.body.Body?.stkCallback?.MerchantRequestID }, { log: JSON.stringify(req.body), ResultDesc: req.body.Body?.stkCallback?.ResultDesc, ResponseCode: req.body.Body?.stkCallback?.ResultCode, MpesaReceiptNumber: req.body.Body?.stkCallback?.CallbackMetadata?.Item[1]?.Value }, { new: true, useFindAndModify: false })
//     //   return res.status(200).json({ success: true, message: `payments fetched successfully`, body: req.body });
//     // } catch (error) {
//     //   console.log(error)
//     // }
// })

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 4000) : 4000;
http.listen(port, () => console.log('Server listening on port ' + port));
// const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80):80;
// http.listen(port, () => console.log('Server listening on port ' + port));

Riders(http)
