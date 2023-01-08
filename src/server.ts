import { router } from '@router/routers'
import express from 'express'

const app = express()

app.use(router)
app.listen(3000, () => console.log('running at port 3000'))
