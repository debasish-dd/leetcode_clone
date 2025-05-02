import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes.js'
import problemsRoutes from './routes/problems.routes.js';

const app = express();


app.use(express.json());
app.use(cookieParser());

dotenv.config({ path: './.env' })

const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Welcome to LeetLab 🔥')
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/problems', problemsRoutes)



app.listen(port, () => {
  console.log(`the server is running on port: ${port}`)
})
