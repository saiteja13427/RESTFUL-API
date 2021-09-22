//Requirements
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

//Mongo connection
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//Setting public folder to serve css, js and images
app.use(express.static("public"));

const articleSchema = {
    title: String,
    content: String
}

const Article = new mongoose.model("Article", articleSchema);

//Routes to get and delete all articles and post an article

app.route("/articles")

    .get(function(req, res) {
        Article.find({}, function(err, articles) {
            if (err) {
                res.send(err);
            } else {
                res.send(articles);
            }
            
        });  
    })
    .post(function(req, res) {
        const title = req.body.title;
        const content = req.body.content;
        const newArticle = new Article({
            title: title,
            content: content
        })
        newArticle.save(function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully posted a new article");
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully deleted all the articles");
            }        
        })
    });


//Routes to get, put, patch and delete a specific article
app.route("/articles/:atitle")

    .get(function(req, res) {
        Article.find({title: req.params.atitle}, function(err, article) {
            if (article.length!=0) {
                res.send(article);
            } else {
                res.send("No matching articles");
            }
            
        });  
    })
    .put(function(req, res) {
        Article.findOneAndUpdate(
            {title: req.params.atitle}, 
            {title: req.body.title, content: req.body.content}, 
            {overwrite: true}, function(err) {
                if (!err) {
                    res.send("Successfully replaced the article");
                } else {
                    res.send(err);
                }
        });
    })
    .patch(function(req, res) {
        Article.updateOne(
            {title: req.params.atitle}, 
            {$set: req.body}, 
            function(err) {
                if (!err) {
                    res.send("Successfully updated the article");
                } else {
                    res.send(err);
                }
        });
    })
    .delete(function (req, res) {
        Article.deleteOne({title: req.params.atitle}, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully deleted the articles");
            }        
        })
    });    

app.listen(3000, function(err){
    if (err) {
        console.log(err);
    } else {
        console.log("Server running at 3000");
    }
})
