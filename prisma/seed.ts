import { client } from '../src/database/client'
import fs from 'fs'
import csv from 'csv-parser'
import { Writable, Transform } from 'stream'

async function main () {
  const readableStreamFile = fs.createReadStream('Unidades_Basicas_Saude-UBS.csv')
  const transformToObject = csv({ separator: ';' })
  const transformToString = new Transform({
    objectMode: true,
    transform (chunk, encoding, callback) {
      callback(null, JSON.stringify(chunk))
    }
  })
  const writableStreamFile = new Writable({
    async write (chunk, encoding, next) {
      const stringifyer = chunk.toString()
      const rowData = JSON.parse(stringifyer)
      console.log('PROCESSANDO', rowData)
      await client.ubs.create({
        data: {
          BAIRRO: rowData.BAIRRO,
          CNES: rowData.CNES,
          IBGE: rowData.IBGE,
          LATITUDE: rowData.LATITUDE,
          LOGRADOURO: rowData.LOGRADOURO,
          LONGITUDE: rowData.LONGITUDE,
          NOME: rowData.NOME,
          UF: rowData.UF

        }

      })
      next()
    }
  })

  console.log('Iniciou', Date())
  readableStreamFile
    .pipe(transformToObject)
    .pipe(transformToString)
    .pipe(writableStreamFile)
    .on('close', () => console.log('Finalizou', Date()))
}
main()
  .then(async () => {
    await client.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await client.$disconnect()
    process.exit(1)
  })
