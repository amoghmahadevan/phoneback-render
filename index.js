const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('build'))
var morgan = require('morgan')
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    let currentDate = new Date();
    response.send(`
    <p> Phonebook has info for ${persons.length} people </p>
    <p> ${String(currentDate)} </p>
    `)
})

app.delete('/api/persons/:id', (request, response) => {
     const id = Number(request.params.id)
     persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const generateId = () => {
    let id = Math.floor(Math.random() * (1000) + 1)
    return id
}
app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name){
        return response.status(400).json({
            error: 'Name Missing!'
        })
    }

    if(!body.number){
        return response.status(400).json({
            error: 'Number Missing!'
        })
    }
    if(persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())){
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }

    morgan.token('body', (request, response) => JSON.stringify(request.body));
    app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const cors = require('cors')

app.use(cors())

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})