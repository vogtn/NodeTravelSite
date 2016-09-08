var express = require('express');
var app = express();
var fortune = require('./lib/fortune.js');

app.set('port', process.env.PORT || 3000);

//set up handlebars view engine
var handlebars = require('express3-handlebars').create({
  defaultLayout:'main',
  helpers: {
    section: function(name, options){
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));


//Newsletter

app.use(require('body-parser')());

app.get('/newsletter', function(req,res){
  //provide dummy value
  res.render('newsletter', {csrf: 'CSRF token goes here'})
});

app.post('/process', function(req,res){
  console.log('Form (from querystring): ' + req.query.form);
  console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  console.log('Name (from visible form field): ' + req.body.name);
  console.log('Email (from visible form field): ' + req.body.email);
  res.redirect(303, '/thank-you');
});

//Test (middleware)
app.use(function(req, res, next){
  res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
      next();
});

//Middleware weather handler
app.use(function(req,res,next){
  if(!res.locals.partials) res.locals.partials = {};
  res.locals.partials.weather = getWeatherData();
  next();
});

//Routes
app.get('/', function(req,res){
  res.render('home');
});

app.get('/about', function(req,res){
  res.render('about', {
    fortune: fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js'
  });
});

app.get('/tours/hood-river', function(req, res){
  res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', function(req, res){
  res.render('tours/request-group-rate');
});

// 404 catch-all handler (middleware)
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});


//Dummy Weather Data
function getWeatherData(){
  return{
    locations: [
      {
        name: 'Seattle',
        forcastUrl: 'http://www.wunderground.com/US/WA/Seattle.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
        weather: 'Overcast',
        temp: '54.1 F (12.3 C)',
      },
      {
        name: 'Portland',
        forcastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
        weather: 'Partly Cloudy',
        temp: '55.0 F (12.8 C)',
      },
    ],
  };
}


app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
