const Express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const { ObjectId } = require('mongodb')
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

app.put('/userDetails/:id', (request, response) => {
  const update = collection.findOneAndUpdate(
    { _id: ObjectId(request.params.id) },
    { $set: request.body }
  )
  response.send(update)
})

app.delete('/userDetails/:id', (request, response) => {
  const delete1 = collection.deleteOne({ _id: ObjectId(request.params.id) })

  response.send(delete1)
})
