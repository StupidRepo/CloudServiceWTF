const express = require('express')
const upload = require('express-fileupload')
const crypto = require('crypto')

// Yes downloading worked! 2

uploadDisabledM = {
  'message': 'Uploading has been disabled for new users.',
  'code': 'UPL_DISABLED'
}
noFilesProvidedM = {
  'message': 'No files were provided.',
  'code': 'NO_FILE_PROV'
}

const app = express()
const http = require('http').Server(app).listen(8080)
app.use(express.static('public'))
app.use(upload())
app.set('view engine', 'ejs')

app.get('/', (res, req) => {
  return req.render('index')
})

app.get('/upload', (res, req) => {
  req.redirect('/')
})

app.post('/upload', (res, req) => {
  let file
  let ID
  let uploadPath

  if (!res.files || Object.keys(res.files).length === 0) {
    return req.status(400).render('error', {
      error: noFilesProvidedM.message,
      code: noFilesProvidedM.code
    })
  }

  file = res.files.sampleFile
  ID = crypto.randomBytes(4).toString('hex')
  uploadPath = `${__dirname}/uploads/${ID}-${file.name}`
  endingFileName = `${ID}-${file.name}`

  file.mv(uploadPath, (err) => {
    if (err) {
      res.status(500).render('error', {
        error: err.message,
        code: 500
      })
    } else {
      return req.render('success', { filename: endingFileName })
    }
  })
})

app.post('/download', (res, req) => {
    req.download(`${__dirname}/uploads/${res.body.fileNamee}`), (err) => {
      if (err) {
          req.status(500)
          req.redirect('/')
      } else {
          req.redirect('/')
      }
    }
})