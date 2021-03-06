import Express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import path from 'path';

// Webpack Requirements
import webpack from 'webpack';
import config from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

// DB
import { Sequelize } from 'sequelize';
var models = require('./models');

// Import routers
import signUpRouter from './routes/SignUp.routes.js';
import loginRouter from './routes/Login.routes.js';
import logoutRouter from './routes/Logout.routes.js'
import settingsRouter from './routes/Settings.routes.js';
import assignmentsRouter from './routes/Assignments.routes.js';
import viewClassesRouter from './routes/ViewClasses.routes.js';


//models.classes.belongsTo(models.users)
//models.assignments.belongsTo(models.classes)

// Initialize the Express App
const app = new Express();


// Run Webpack dev server in development mode
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// React And Redux Setup
import { configureStore } from '../client/store';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Helmet from 'react-helmet';

// Import required modules
import routes from '../client/routes';
import { fetchComponentData } from './util/fetchData';
import serverConfig from './config/config.js';

//Passport/session stuff
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var expressSession = require('express-session');
import passport from './passport/passport';

// Apply body Parser and server public assets and routes
app.use(compression());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(Express.static(path.resolve(__dirname, '../dist')));
app.use(bodyParser());
app.use(cookieParser("keyboard cat"));

//Initialize some stuff
app.use(flash());
app.use(expressSession({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 3600000}
}));
app.use(passport.initialize());
app.use(passport.session());

/**
    Routes requests to root based on authentication status
*/

app.get('/docs', function(req, res){
    app.use(Express.static('doc'))
    res.sendFile(path.resolve('./doc/index.html'));
});
app.get('/', function(req, res, next){
    if (req.isAuthenticated()) {
        next();
    }
    else{
        res.redirect('/landing');
    }
});

app.get('/landing', function(req, res, next){
    if (req.isAuthenticated()){
        res.redirect('/');
    }
    else{
        next();
    }
});


// Place routers below here
app.use('/api', signUpRouter);
app.use('/api', loginRouter);
app.use('/api', logoutRouter);
app.use('/api', settingsRouter);
app.use('/api', assignmentsRouter);
app.use('/api', viewClassesRouter);

// Render Initial HTML
const renderFullPage = (html, initialState) => {
  const head = Helmet.rewind();

  // Import Manifests
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets);

  return `
    <!doctype html>
    <html>
      <head>
        ${head.base.toString()}
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
        ${head.script.toString()}
        ${process.env.NODE_ENV === 'production' ? `<link rel='stylesheet' href='${assetsManifest['/app.css']}' />` : ''}
        <link rel="shortcut icon" href="http://res.cloudinary.com/hashnode/image/upload/v1455629445/static_imgs/mern/mern-favicon-circle-fill.png" type="image/png" />
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          ${process.env.NODE_ENV === 'production' ?
          `//<![CDATA[
          window.webpackManifest = ${JSON.stringify(chunkManifest)};
          //]]>` : ''}
        </script>
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,500,700,700i" rel="stylesheet">
        <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/vendor.js'] : '/vendor.js'}'></script>
        <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/app.js'] : '/app.js'}'></script>
      </body>
    </html>
  `;
};

const renderError = err => {
  const softTab = '&#32;&#32;&#32;&#32;';
  const errTrace = process.env.NODE_ENV !== 'production' ?
    `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>` : '';
  return renderFullPage(`Server Error${errTrace}`, {});
};

// Server Side Rendering based on routes matched by React-router.
app.use((req, res, next) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end(renderError(err));
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (!renderProps) {
      return next();
    }

    const store = configureStore();

    return fetchComponentData(store, renderProps.components, renderProps.params)
      .then(() => {
        const initialView = renderToString(
          <Provider store={store}>
                <RouterContext {...renderProps} />
          </Provider>
        );
        const finalState = store.getState();

        res
          .set('Content-Type', 'text/html')
          .status(200)
          .end(renderFullPage(initialView, finalState));
      })
      .catch((error) => next(error));
  });
});

models.sequelize.sync().then(function() {
  app.listen(serverConfig.port, function() {
    console.log('Planr is running on localhost:' + serverConfig.port + '!');
  });
});

export default app;
