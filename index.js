const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

morgan.token('content', function(req, res, param) {
    return JSON.stringify(req.body)
});
app.use(morgan(':method :status :res[content-length] - :response-time ms :content'));


let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('HOMEPAGE')
})

app.get('/info', (request, response) => {
  response.send(
    `
    <p>Phonebook has ${phonebook.length} people.</p>
    <p>${new Date()}
    `)
})

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const found = phonebook.find(person => person.id == id)
  if (found) {
    response.json(found)
  } else {
    // 404 = "Resource Not Found"
    response.status(404).json({ error: 'Person not found' })
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id 
  phonebook = phonebook.filter(person => person.id !== id)

  // 204 = "No Content"
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number ) {
    // 400 = "Bad Request"
    return response.status(400).json({ error: 'content missing' })
  }

  if (phonebook.find(person => person.name == body.name)) {
    // 409 = "Conflict"
    return response.status(409).json({ error: 'name already exists' })
  }

  const new_id = Math.floor(Math.random() * 1000)

  const new_person = {
    name: body.name,
    number: body.number,
    id: new_id,
  }
  phonebook = phonebook.concat(new_person)
  response.json(new_person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
