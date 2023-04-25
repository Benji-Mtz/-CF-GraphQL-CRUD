# CRUD with GraphlQL 

## Getting started with Express & GraphQL

Necessary packages

```sh
npm init -y
npm i express express-graphql graphql
npm i nodemon -D
```

Create the file server.js on root
```js

const express = require('express');
const { buildSchema } = require('graphql');

const app = express();
const port = process.env.PORT || 8080;

const courses = require('./courses');
const { graphqlHTTP } = require('express-graphql');

const schema = buildSchema(`
    type Course{
        id:  ID!
        title: String!
        views: Int
    }

    type Query{
        getCourses: [Course]
        getCourse(id: ID!): Course
    }
`);

const root = {
    getCourses(){
        return courses;
    },
    getCourse({ id }){
        console.log(id);
        const course = courses.find( (course) => course.id == id)
        return course;
    }
}

app.get('/', function (req, res) {
    res.json(courses);
});

// Middleware
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}));

app.listen(port, function(){
    console.log(`Servidor iniciado en http://localhost:${ port }`);
})
```

Create a mocking data for courses on the courses.js
```js
const courses = [
    { id: "1", title: "Curso de Golang", views: 1200 },
    { id: "2", title: "Curso de GraphQL", views: 1000 }
]

module.exports = courses;
```
Create a script for run server on package.json scripts
```json
 "scripts": {
    "start": "nodemon server.js"
  },
```
## Queries on GraphQL
Creating a simples Queries on GraphiQL
```json
{
  getCourse(id: 1) {
    title
  }
  getCourses{
    title
  }
}

```
Example of return
```json
{
  "data": {
    "getCourse": {
      "title": "Curso de Golang"
    },
    "getCourses": [
      {
        "title": "Curso de Golang"
      },
      {
        "title": "Curso de GraphQL"
      }
    ]
  }
}
```

Creating Queries with query variables
```json
// GraphiQL

query($id:ID!){
  getCourse(id:$id){
    id
    title
    views
  }
}

// Query variables
{
  "id": 2
}
```
Example of return
```json
{
    "data": {
        "getCourse": {
            "id": "2",
            "title": "Curso de GraphQL",
            "views": 1000
        }
    }
}
```
## Mutations on GraphQL
Creating a simples Mutations on GraphiQL, this needs specify the word `mutation` because by default is `query` and is optional.
```json
mutation {
  addCourse(title: "Curso de Express", views: 345) {
    title
  }
}
```
Response
```json
{
    "data": {
        "addCourse": {
            "title": "Curso de Express"
        }
    }
}
```