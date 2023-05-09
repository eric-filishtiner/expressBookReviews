const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();



const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try{
   await axios.get('https://ericfilishti-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books')
   .then((response) => {
       const string_books = JSON.stringify(response.data, null, 4);
       res.send(string_books);
       //res.send(response[data][1]);
   })  
} catch {
    res.status(500).json({message: "Failed to stringify the books"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
//I used async-await with axios for Task 10 above, 
//so it makes sense to use Promise callbacks here
//for practice
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  axios.get('https://ericfilishti-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books')
  .then(response => {
      res.send(response.data[req.params.isbn])
  })
  .catch(error => {
      res.status(500).send('Failed to get books');
  })
  //let isbn = req.params.isbn;
  //res.send(JSON.stringify(books[isbn]));
  //res.send(books);
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let the_books = '';
  axios.get('https://ericfilishti-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books')
  .then(response => {
        the_books = response.data;
        //res.send(response.data[req.params.isbn])
        let keys = Object.keys(the_books);
        let book_array = [];
        for(let ii = 0; ii < keys.length; ii++){
        if(the_books[keys[ii]]["author"] === req.params.author)
        {
            book_array.push(the_books[keys[ii]])
        }
    }
  res.send(book_array);
  })
  .catch(error => {
      res.status(500).send('Failed to get books');
  })
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  let title = req.params.title;
  let the_books = '';
  try{
    await axios.get('https://ericfilishti-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books')
    .then((response) => {
        the_books = response.data; //JSON.stringify(response.data, null, 4);
        //res.send(response[data][1]);
    })  
 } catch {
     res.status(500).json({message: "Failed to stringify the books"});
   }
  let keys = Object.keys(the_books);
  let book_array = [];
  for(let ii = 0; ii < keys.length; ii++){
    if(the_books[keys[ii]]["title"] === title)
    {
        book_array.push(the_books[keys[ii]])
    }
  }
  res.send(book_array);
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let the_books = '';
  axios.get('https://ericfilishti-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books')
  .then(response => {
        the_books = response.data;
        res.send(response.data[req.params.isbn]["reviews"])
  })
  .catch(error => {
      res.status(500).send('Failed to get book reviews');
  })
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
