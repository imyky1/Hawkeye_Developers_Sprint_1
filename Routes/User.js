const con = require('../Config/db_connection');
const express = require('express');
const Router = express.Router();

//connecting mysql database
var connection = con.getConnection();
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.message);
    } else {
        console.log('Connected to MySQL database');
    }
});

//API to get data
Router.get('/student', (req, res) => {
    connection.query('SELECT * FROM employee', (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error retrieving posts' });
        } else {
            res.status(200).json(results);
        }
    })
})
//API to post data
Router.post('/student', (req, res) => {
    const { e_id, e_name, e_sal } = req.body;
    const sql = 'INSERT INTO employee(e_id,e_name,e_sal) VALUES (?,?,?)';
    connection.query(sql, [e_id, e_name, e_sal], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error creating employee' });
        } else {
            res.status(200).json({ message: 'Post created', postId: results.insertId });
        }
    });
});
//API to update data
Router.put('/student/:id', (req, res) => {
    const { e_name, e_sal } = req.body;
    const e_id = req.params.id;
    const sql = 'UPDATE employee SET e_id = ?, e_name = ?, e_sal = ?';
    connection.query(sql, [e_id, e_name, e_sal], (error, results) => {
        if (error) {
            res.status(500).json({ error: error });
        } else {
            res.status(200).json({ message: 'student updated' });
        }
    });
});

// API to delete data
Router.delete('/student/:id', (req, res) => {
    const e_id = req.params.id;
    const sql = 'DELETE FROM employee WHERE e_id = ?';
    connection.query(sql, [e_id], (error, results) => {
        if (error) {
            res.status(500).json({ error: error });
        } else {
            res.status(200).json({ message: 'employee deleted' });
        }
    });
});

module.exports = Router;

