const express = require('express');
const Datastore = require('nedb');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');
const { request, response } = require('express');
const db = new Datastore({ filename: 'database.db', autoload: true, timestampData: true });
const app = express();
const port = 8080;
const filter = new Filter();

app.listen(port, () => console.log(`Express app listening on port ${port}`));
//app.use('/', express.static('public'));
app.use(express.json());

app.get('/alltweets', (request, response) => {
    db.find({}).sort({ createdAt: -1 }).exec((err, docs) => {
        response.json(docs);
    })
});

app.post('/comments', (request, response) => {
    // console.log(request.body);
    db.update({ user: request.body.user }, { $push: { comments: request.body.comment } }, {}, (err, num) => {
        // ...
    });
    response.json({ test: 'hey' })
})
app.post('/likes',(request,response)=>{
    // console.log(request.body);
    db.update({ user: request.body.u }, { $push: { likes: request.body.li } }, {}, (err, num) => {
        // ...
    });
    response.json({ test: 'hey' })
})

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});


app.post('/tweet', (request, response) => {
    if (isValide(request.body)) {
        //insert into db

        const tweet = {
            user: filter.clean(request.body.user.toString()),
            image: request.body.image.toString(),
            body: filter.clean(request.body.body.toString()),
            likes: request.body.likes,
            comments: request.body.comments,
        }
        // console.log(tweet);
        db.insert(tweet, (err, newDoc) => {
            console.log('added new');
            response.json(newDoc)
        })
    } else {
        response.status(422);
        response.json({
            message: "Hey! Name and body is required!"
        })
    }
})

function isValide(temp) {
    return temp.body && temp.body.toString().trim() !== '';
}

