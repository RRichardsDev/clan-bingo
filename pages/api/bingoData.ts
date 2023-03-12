import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ServerApiVersion }  from 'mongodb';
import { BWindow } from "../../components/BingoCard";
type TData = {
  response: any
}
const MONGODB_URI= "mongodb+srv://bingo-admin:hSCwcGCCNJ8tL724@myatlasclusteredu.lotklce.mongodb.net/?retryWrites=true&w=majority"
async function getBingoData(id:number): Promise<any> {
  if (!MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }
  
  const uri = process.env.MONGODB_URI
  const options = {}
  if (!uri) return;
  let client
  client = new MongoClient(uri, options)
  return await client.connect().then(async conn => {
    return conn.db('bingo').collection('data').findOne({tableId:id}).then((doc) => {
      // console.log(doc);
      return doc
    })
    .catch(err => {
      console.log(err);
      return {};
    })

  })
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TData>
) {


  async function saveBingoDataToMongo(id:number, data:any) {
    console.log({id});
    if (!MONGODB_URI) {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
    }
    
    const uri = MONGODB_URI
    const options = {}
    let client
    client = new MongoClient(uri, options)
    client.connect().then(conn => {
      conn.db('bingo').collection('data').insertOne({tableId:id, data}).then(doc => {
        // console.log(doc);
      })

    })
    res.send({response: 'ok'});
  }
  async function updateBingoData(id:number, data:any) {
    if (!MONGODB_URI) {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
    }
    console.log({id});
    
    const uri = MONGODB_URI
    const options = {}
    const arrayData = JSON.parse(data);
    
    let client
    client = new MongoClient(uri, options)
    client.connect().then(conn => {
      conn.db('bingo').collection('data').updateOne({tableId:id}, {$set: {data:arrayData}}, {upsert:true}).then(doc => {
        // console.log(doc);
      })

    })
    res.send({response: 'ok'});
  }
  const getBingoDataReq = async (req:NextApiRequest, res:NextApiResponse): Promise<any> => {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Invalid id' })
    const bingoData = await getBingoData(Number(id));
    res.status(200).json(bingoData);
  }
  console.log(req.method);
  if (req.method === 'GET')
   getBingoDataReq(req, res);
  else if (req.method === 'POST'){
    if (!req.query.id) return res.status(400).json({ response: 'Invalid id' })
    saveBingoDataToMongo(Number(req.query.id), req.body);
  }
   else if (req.method === 'PUT') {
    if (!req.query.id) return res.status(400).json({ response: 'Invalid id' })
     updateBingoData(Number(req.query.id), req.body);
   }

}

export { getBingoData }
