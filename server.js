const express = require('express');
const { buildSchema } = require('graphql');

const app = express();
const port = process.env.PORT || 8080;

const courses = require('./courses');
const { graphqlHTTP } = require('express-graphql');

const schema = buildSchema(`
    type Course {
        id:  ID!
        title: String!
        views: Int
    }

    type Query {
        getCourses: [Course]
        getCourse(id: ID!): Course
    }

    type Mutation {
        addCourse(title: String!, views: Int): Course
        updateCourse(id: ID!, title: String!, views: Int): Course
    }
`);

const root = {
    getCourses(){
        return courses;
    },
    getCourse({ id }){
        // console.log(id);
        const course = courses.find( (course) => course.id == id)
        return course;
    },
    addCourse({ title, views }){
        const id = String(courses.length + 1);
        const course = { id, title, views };
        courses.push(course);
        return course;
    },
    updateCourse({ id, title, views }){
        const courseIndex = courses.findIndex( (course) => course.id == id );
        const course = courses[courseIndex];

        // const newCourse = Object.assign(course, );
        const newCourse = {
            ...course,
            title, 
            views
        }

        courses[courseIndex] = newCourse;
        return newCourse;

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