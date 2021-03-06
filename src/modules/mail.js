const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

const path = require('path')

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASS
  }
})

transport.use(
  'compile',
  hbs({
    viewEngine: {
      extName: '.html',
      partialsDir: path.resolve('./src/modules/templates/mail'),
      defaultLayout: false
    },
    viewPath: path.resolve('./src/modules/templates/mail'),
    extName: '.html'
  })
)

module.exports = transport
