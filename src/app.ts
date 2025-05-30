import express from 'express'
const app = express()
import cors from 'cors'
import globalErrorHandler from './app/middlewares/globalErrorhandler'
import notFound from './app/middlewares/notFound'
import router from './app/routes'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1',router)
app.get('/', (req, res) => {
  res.send('Hurry brother-shop is running yeaha')
})

app.use(globalErrorHandler)
app.use(notFound)


export default app;