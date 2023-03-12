import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ServerApiVersion }  from 'mongodb';
import { BWindow } from "../../components/BingoCard";
type TData = {
  response: any
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TData>
) {
  console.log(req.method);
  if (req.method === 'GET')
   getBingoData();
  else if (req.method === 'POST')
   saveBingoDataToMongo(req.body);
   else if (req.method === 'PUT')
    updateBingoData(req.body);


  async function saveBingoDataToMongo(data:any) {
    if (!process.env.MONGODB_URI) {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
    }
    
    const uri = process.env.MONGODB_URI
    const options = {}
    
    let client
    client = new MongoClient(uri, options)
    client.connect().then(conn => {
      conn.db('bingo').collection('data').insertOne({tableId:1, data}).then(doc => {
        // console.log(doc);
      })

    })
    res.send({response: 'ok'});
  }
  async function updateBingoData(data:any) {
    if (!process.env.MONGODB_URI) {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
    }
    
    const uri = process.env.MONGODB_URI
    const options = {}
    const arrayData = JSON.parse(data);
    
    let client
    client = new MongoClient(uri, options)
    client.connect().then(conn => {
      const tableId = 1;
      conn.db('bingo').collection('data').updateOne({tableId}, {$set: {data:arrayData}}, {upsert:true}).then(doc => {
        console.log(doc);
      })

    })
    res.send({response: 'ok'});
  }
}
async function getBingoData(): Promise<any> {
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }
  
  const uri = process.env.MONGODB_URI
  const options = {}
  
  let client
  client = await new MongoClient(uri, options)
  return await client.connect().then(conn => {
    return conn.db('bingo').collection('data').findOne({tableId:1}).then((doc) => {
      console.log(doc);
      return doc
    })
    .catch(err => {
      console.log(err);
      return {};
    })

  })
}
export { getBingoData }
