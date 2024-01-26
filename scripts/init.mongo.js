const issuesDB = [
    {id:1, status:'new', owner:'Ravan', effort:5, created: new Date('2019-01-15'), due: undefined, title:'Error in console when clicking Add',},
    {id:2, status:'Assigned', owner:'Eddie', effort:14, created: new Date('2019-01-16'), due: undefined, title:'Freezing Application',}
]

// Db.issues.inserMany(issuesDB)
// const count = db.issues.countDocuments()
// console.log('Inserted: ', count, issues)

import { MongoClient, ServerApiVersion } from "mongodb";

const url = 'mongodb+srv://nodeUser:p8Agx5SeQbNPvea2@ibaw.vruule7.mongodb.net/issuetracker?retryWrites=true&w=majority'
// const url = 'mongodb://localhost/issuetracker'

const client = new MongoClient(url, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }})

console.log('Going to create connection to: ', url)


async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db().command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const db = client.db()
        const collection = db.collection('issues')
        const counters = db.collection('counters')

        
        console.log('Cleaning DB...')
        await collection.drop()
        
        console.log('Start inserting Data...')
        const res = await collection.insertMany(issuesDB)
        console.log('Result of insert is: '+ JSON.stringify(res.insertedIds))
        
        const count = await collection.countDocuments()
        console.log('Entered Data: ', count)
        
        console.log('Creating Indexes ....')
        await collection.createIndex({id:1}, {unique:true})
        await collection.createIndex({status:1})
        await collection.createIndex({owner:1})
        await collection.createIndex({created:1})
        
        const indexes = await collection.indexes()
        console.log(indexes)

        await counters.insertOne({_id: 'issues', current: count})
        
    }
    catch{ (err) => {console.log('New Error Received', err)}
       
    } 
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch((err) => {console.log('New Error Received', err)});

// client.connect( function(err, client) {
    //     if (err) console.log("error", err)
    //     console.log('connected...')


// })
