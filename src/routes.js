import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from '../utils/build-route-path.js'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search }  = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)
            return res
                .end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            try {
                const {title, description} = req.body
    
                const task = {
                    id: randomUUID(),
                    title,
                    description,
                    completed_at: null,
                    created_at: new Date().toJSON(),
                    updated_at: new Date().toJSON(),
                }
    
                const newTask = database.insert('tasks', task)
    
                return res
                    .writeHead(201)
                    .end(JSON.stringify(newTask))

            } catch (e) {
                console.log(e)
                return res
                    .writeHead(400)
                    .end('Erro genérico')
            }
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params
            const {title, description} = req.body

            const task = database.find('tasks', id)

            database.update('tasks', id, {
                ...task,
                title, 
                description,
                updated_at: new Date().toJSON(),
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const {id} = req.params

            const task = database.find('tasks', id)

            database.update('tasks', id, {
                ...task,
                completed_at: new Date().toJSON(),
            })

            return res.writeHead(204).end()
        }
    },
]