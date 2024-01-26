import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql';
import fs from 'fs'
import { MongoClient, ServerApiVersion } from 'mongodb';

const url = 'mongodb+srv://nodeUser:p8Agx5SeQbNPvea2@ibaw.vruule7.mongodb.net/issuetracker?retryWrites=true&w=majority'
// const url = 'mongodb://localhost/issuetracker'
let db;

async function getNextSequence(name){
    const result = await db.collection('counters').findOneAndUpdate(
        { _id: name },
        { $inc: { current: 1 }  },
        { returnOriginal : false }
    );
    console.log(result)
    return result.current
}

async function connectToDb(){
    const client = new MongoClient(url)
    console.log('Going to create connection to: ', url)
    await client.connect();
    console.log('Connected to MongoDB...');
    db = client.db()
}

let aboutMessage = 'Issue Tracker API v1.0';

const GraphQLDate = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: 'A Date() type in GraphQL as a scalar',
    serialize(value) {
        return value.toISOString();
    },
    parseValue(value){
        console.log(`Parsed Valually : ${value}`)
        return new Date(value);
    },
    parseLiteral(ast){
        console.log(`Parsed Literally : ${ast}`)
        return (ast.kind == Kind.STRING) ? new Date(ast.value) : undefined
    }
});

const resolvers = {
    Query: {
        about: () => aboutMessage,
        issueList,
    },
    Mutation: {
        setAboutMessage,
        issueAdd
    },
};

async function issueAdd(_, {issue}) {
    const issuesDB = await db.collection('issues').find({}).toArray();
    issue.created = new Date();
    issue.id = await getNextSequence('issues')
    if (issue.status == undefined) issue.status = "New"

    const result = await db.collection('issues').insertOne(issue);
    console.log('Inserted result : ', result.insertedId)
    const res = await db.collection('issues').find({id: issue.id }).toArray()
    console.log('Res: ', res)
    return res
}

async function issueList() {   
    const issuesDB = await db.collection('issues').find({}).toArray();
    return issuesDB;
}

function setAboutMessage(_, {message}) {
    return aboutMessage = message
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
    resolvers,
})

const app = express();

app.use(express.static('public'));
server.applyMiddleware({app, path: '/graphql'});


(async function (){
    try {
        (async function () {
            await connectToDb();
            app.listen(3000, ()=> {
                console.log('App started on port 3000')
            })
        })();
    } 
    catch (err) {
        console.log('Error: ', err)
    }
})()



