//built from scratch by fredy 
const API_URL = 'https://twitterclone.fredy.dev/'; //tweet
const form = document.querySelector("form");
const tweetElement = document.querySelector('.all-tweets');

let imageuser;
let user;
getRandom();

listAllTweets();
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const content = document.querySelector('textarea').value;
    if (content == "") { alert('content is required'); return }
    const tweet = {
        user: user,
        image: imageuser,
        body: content,
        likes: [],
        comments: [],
    }
    console.log(tweet);

    fetch(API_URL + 'tweet', {
        method: 'POST',
        body: JSON.stringify(tweet),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
        .then(data => {
            console.log('Success:', data.updatedAt);
            listAllTweets();
            getRandom();
            //addNewPost(data.user,data.image,data.body,data.likes,data.comments)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    form.reset();

    // addNewPost(tweet.user,tweet.image,tweet.body,tweet.likes,tweet.comments)
});


function addNewPost(usuario, imagen, contenido, likes, comentarios) {
    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }
    const us = usuario;
    const ima = imagen
    const con = contenido;
    const li = likes.length;
    const come = comentarios === undefined || comentarios.length == 0 ? '' : createComment(comentarios)
    function createComment(temp) {
        let pri = '<div class="comment-container"><div class="un-comment">'
        let sec = '</div></div>'
        let answer = '';
        temp.forEach((com) => {
            answer += pri + com + sec;
        })
        return answer;
    }
    const tweetTemplate = `<div class="tweet-container">
    <div class="un-tweet">
        <div class="un-tweet-profile">
            <img src="${ima}" class="profiles" width="50" height="50"
                style="margin: 6px;">
        </div>
        <div class="un-tweet-content">
            <div class="un-tweet-content-user"><b>${us}</b></div>
            <div class="un-tweet-content-body">
                <p>${con}</p>
            </div>
        </div>
    </div>${come}<div class="un-tweet-reply">
        <div class="like" onclick="addNewLike(this)">
            <div>🖤</div>
            <div>${li}</div>
        </div>
        <textarea rows=" 1" class="text-reply" placeholder="Add a comment..."></textarea>
                <button class="button reply" onclick="addNewComment(this)"><strong>Reply</strong></button>
        </div>
    </div>`;
    let d = createElementFromHTML(tweetTemplate);
    tweetElement.appendChild(d);
}

function addNewComment(comment) {
    let com = comment.parentElement.childNodes[3].value;
    let comuser = comment.parentElement.parentElement.childNodes[1].lastElementChild.firstElementChild.innerText;
    console.log(com + comuser)
    let comments = {
        user: comuser,
        comment: com
    }
    fetch(API_URL + 'comments', {
        method: "POST",
        body: JSON.stringify(comments),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then(response => response.json())
        .then((json) => {
            console.log(json);
            listAllTweets();
        })
        .catch(err => console.log(err));
}

function addNewLike(likes) {
    // let like = likes.lastElementChild.innerText;
    let likeuser = likes.parentElement.parentElement.childNodes[1].lastElementChild.firstElementChild.innerText;
    // console.log(like)
    fetch(API_URL + 'likes', {
        method: "POST",
        body: JSON.stringify({u:likeuser,li: 1}),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then(response => response.json())
        .then((json )=> {
            // console.log(json);
            listAllTweets();
        })
        .catch(err => console.log(err));
}

function listAllTweets() {
    tweetElement.innerHTML = '';
    fetch(API_URL + 'alltweets')
        .then(response => response.json())
        .then(data => {

            data.forEach(arr => {
                // addNewPost(tweet.user,tweet.image,tweet.body,tweet.likes,tweet.comments)
                addNewPost(arr.user, arr.image, arr.body, arr.likes, arr.comments)

            });
        });
}


function getRandom() {
    const n = Math.floor(Math.random() * 8);
    imageuser = `/profilepicture/profile${n}.png`;
    document.querySelector('.profiles').src = imageuser;
    let nn;
    do {
        nn = Math.floor(Math.random() * 999);
    } while (nn < 100);
    user = '@randomUser' + nn;
}
