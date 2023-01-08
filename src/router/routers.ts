import { client } from '@database/client'
import { Router, Request, Response } from 'express'

const router = Router()  

router.get("/find", async (req: Request, res: Response) => {
    console.log(req)
    const { skip, take } = req.query
    try {
        const readableStream = await client.ubs.findMany({
            skip: Number(skip) || 1,
            take: Number(take) || 10,
            
        })
        res.json(readableStream)
    } catch (error) {
        res.status(400).json('err')
    }
})

router.get("/find/:uf", async (req: Request, res: Response) => {
    const { uf } = req.params
    const { skip, take } = req.query
   
    try {
        const readableStream = await client.ubs.findMany({
            skip: Number(skip) || 1,
            take: Number(take) || 10,
            where: {
                UF: uf
            }
        })
        res.json(readableStream)
    } catch (error) {
        res.status(400).json('err')
    }
    
})
export { router }

/**
 * previewFeaturesdeve ser definido mongoDbno clientgerador para habilitar o suporte ao MongoDB.
 */