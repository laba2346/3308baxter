import Express from 'express';
import { Provider, store } from 'redux';
import { Sequelize } from 'sequelize';
var models = require('./models');

const app = Express();
const port = 3000;

// Wait on api calls here

models.sequelize.sync().then(function() {
  app.listen(port, function() {
    console.log('Planr is running on localhost:' + port + '!');
  });
});

models.sequelize.sync().then(function() {
  models.users.create({
    username: 'mrrobot',
    email: 'mr@robot.com',
    password: 'monkey',
    join_date: '1994-05-31'
  })
})

app.get('/assignments/', (req, res) => {
  res.send('assignments not implemented')
});

app.get('/classes/', (req, res) => {
  res.send('classes not implemented')
});

app.get('/users/', (req, res) => {
  res.send('users not implemented')
});

// Create new store and send initial state to client
app.get('/*', (req,res) => {
    res.send('hello world!');
});
