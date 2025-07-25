const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    const user_exists = users.some(user => user.username === username)
    return !user_exists
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const user_exists = users.some(user => user.username === username && user.password === password)
    return user_exists
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        req.session.accessToken = accessToken;

        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const review = req.query.review
    const username = req.session?.authorization?.username

    // Validate input
    if (!username) return res.status(401).json({ message: "User not authenticated" });
    if (!review) return res.status(400).json({ message: "Review query parameter is required" });
    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
    
    // Add or update review
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added successfully",
        reviews: books[isbn].reviews
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const username = req.session?.authorization?.username

    // Check if user is authenticated
    if (!username) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if user has a review to delete
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review by user not found" });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully"
    });
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
