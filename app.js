var koa = require('koa'),
  hbs = require('koa-hbs'),
  route = require('koa-route')

var app = koa()

app.use(hbs.middleware({ viewPath: __dirname + '/views' }))

app.use(route.get('/', render))

function* render() {
  yield this.render('main', {title: 'koa-hbs', content: 'some'})
}

app.listen(3000)
