var koa = require('koa'),
  hbs = require('koa-hbs'),
  route = require('koa-route'),
  serve = require('koa-static')


var app = koa()


app.use(serve('public'))
  .use(hbs.middleware({ viewPath: __dirname + '/pages' }))
  .use(route.get('/', render))

function* render() {
  yield this.render('main', {title: 'koa-hbs', content: 'some'})
}

app.listen(3000)
