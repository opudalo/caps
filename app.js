var koa = require('koa'),
  views = require('koa-views'),
  route = require('koa-route'),
  serve = require('koa-static')


var app = koa()


app.use(serve('public'))

app.use(views(__dirname + '/pages','html', {
  'html': 'underscore'
}))

app.use(route.get('/', index))

function *index() {
  yield this.render('index', {})
}

app.listen(3000)
