const Express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

const DB_URL = 'mongodb://localhost:27017'
const DB_NAME = 'user'

var app = Express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
var database, collection

const PORT = 8000

app.listen(PORT, () => {
  MongoClient.connect(DB_URL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
      throw error
    }
    database = client.db(DB_NAME)
    collection = database.collection('userDetails')
    console.log('Connected to `' + DB_NAME + '`!')
  })
})

app.post('/userDetails', (request, response) => {
  database.collection('userDetails').insert(request.body, (error, result) => {
    if (error) {
      return response.status(500).send(error)
    }
    response.send(result.result)
  })
})

app.get('/userDetails', (request, response) => {
  collection.find({}).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error)
    }
    response.send(result)
  })
})

app.put('/userDetails', (request, response) => {
  let id = request.query.id
  collection.findOneAndUpdate(
    { _id: id },
    { $set: request.body },
    { new: true, upsert: true, returnOriginal: false }
  )
  response.status(200).send(true)
})
