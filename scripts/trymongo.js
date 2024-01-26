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
        const issues = await collection.find().toArray()
        console.log('Fetches Issues from DB: ',issues)
    
        const issuesDB = [
            {id:1, status:'new', owner:'Ravan', effort:5, created: new Date('2019-01-15'), due: undefined, title:'Error in console when clicking Add',},
            {id:2, status:'Assigned', owner:'Eddie', effort:14, created: new Date('2019-01-16'), due: undefined, title:'Freezing Application',}
        ]

        // const employee = {id: 1, name: {first:`Thomas_${users.length+1}`, last:'Beck'}, age:20}
        const res = await collection.insertMany(issuesDB)
        console.log('Result of insert is: '+ res.length)
    


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
