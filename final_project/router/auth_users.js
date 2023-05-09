const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  axios.get('https://ericfilishti-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books')
  .then(response => {
      const the_books = response.data;
      let isbn = req.params.isbn;
      let review = req.query.review;
      let username = req.session.authorization["username"];
      //let full_review = {"username":username,"review":review};
      the_books[isbn]["reviews"][username] = review;
      res.send("The review for the book with isbn " + isbn + " has been added/updated.");
  })
  .catch(error => {
      res.status(500).send('Failed to update books');
  })
  //res.send(books);
});
// Add a book review
regd_users.delete("/auth/review/:isbn", async function (req, res) {
    //Write your code here
    axios.get('https://ericfilishti-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books')
    .then(response => {
        const the_books = response.data;
        let isbn = req.params.isbn;
        let username = req.session.authorization["username"];
        //let full_review = {"username":username,"review":review};
        let review_num = Object.keys(the_books[isbn]["reviews"]).length;
        if(the_books[isbn]["reviews"]){
            delete the_books[isbn]["reviews"][username];
        }
        res.send("Reviews for the isbn " + isbn + " posted by the user " + username + " deleted.");
    })
    .catch(error => {
        res.status(500).send('Failed to delete books');
    })
    
    //res.send(books); 
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
