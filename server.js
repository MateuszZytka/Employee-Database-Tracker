const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const PORT = process.env.PORT || 3001;
const app = express();
const cTable = require('console.table');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'password',
      database: 'employee_db'
    },
    console.log(`Connected to the courses_db database.`)
  );

const start = async () => {
    let choice;
    while(true) {
        await inquirer.prompt
        ([
            {
                name: "command",
                type: "list",
                message: "What would you like to do?",
                choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role", "quit"]
            }
        ])
        .then((answer) => {
            console.log(answer.command);
            choice = answer.command;
        })
        switch (choice){
            case "view all departments":
                viewDeparments()
                break;
            case "view all roles":
                viewRoles()
                break;
            case "view all employees":
                viewEmployees()
                break;
            case "add a department":
                addDepartment()
                break;
            case "add a role":
                addRole()
                break;
            case "add an employee":
                addEmployee()
                break;
            case "update an employee role":
                updateEmployee()
                break;
            
        }
        if (choice === "quit"){
            break
        }
    }
}

function viewDeparments(){
    app.get("/api/departments", (req, res) => {
        db.query("SELECT * FROM department", function(err, results){
            res.json(results)
            console.table(results)
        })
    })
}

function viewRoles(){
    app.get("/api/roles", (req, res) => {
        db.query("SELECT * FROM role", function(err, results){
            res.json(results)
            console.table(results)
        })
    })
}

function viewEmployees(){
    app.get("/api/employees", (req, res) => {
        db.query("SELECT * FROM employee", function(err, results){
            res.json(results)
            console.table(results)
        })
    })
}

function addDepartment(){
    app.post("/api/add-department", ({body}, res) => {
        let params = body.name
        db.query("INSERT INTO department(name) VALUES (?)", params, function(err, results){
            if (err) {
                res.status(400).json({error: err.message})
                return
            } 
            res.json({body})
            console.log({body})
        })
    })
}

function addRole() {
    app.post("/api/add-role", ({body}, res) => {
        let title = body.title
        let salary = body.salary
        let department_id = body.department_id
        db.query("INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)", [title, salary, department_id], function(err, results){
            if (err) {
                res.status(400).json({error: err.message})
                return
            } 
            res.json({body})
            console.log({body})
        })
    })
}

function addEmployee(){
    app.post("/api/add-employee", ({body}, res) => {
        let first_name = body.first_name
        let last_name = body.last_name
        let role_id = body.role_id
        let manager_id = body.manager_id
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [first_name, last_name, role_id, manager_id], function(err, results){
            if (err) {
                res.status(400).json({error: err.message})
                return
            } 
            res.json({body})
            console.log({body})
        })
    })
}
// to do create update function
function updateEmployee(){
    
}

// app.post("/api/add-department", ({body}, res) => {
//     let params = body.name
//     db.query("INSERT INTO department(name) VALUES (?)", params, function(err, results){
//         if (err) {
//             res.status(400).json({error: err.message})
//             return
//         } 
//         res.json({body})
//         console.log({body})
//     })
// })

// app.post("/api/add-role", ({body}, res) => {
//     let title = body.title
//     let salary = body.salary
//     let department_id = body.department_id
//     db.query("INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)", [title, salary, department_id], function(err, results){
//         if (err) {
//             res.status(400).json({error: err.message})
//             return
//         } 
//         res.json({body})
//         console.log({body})
//     })
// })

// app.post("/api/add-employee", ({body}, res) => {
//     let first_name = body.first_name
//     let last_name = body.last_name
//     let role_id = body.role_id
//     let manager_id = body.manager_id
//     db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [first_name, last_name, role_id, manager_id], function(err, results){
//         if (err) {
//             res.status(400).json({error: err.message})
//             return
//         } 
//         res.json({body})
//         console.log({body})
//     })
// })


// app.get("/api/departments", (req, res) => {
//     db.query("SELECT * FROM department", function(err, results){
//         res.json(results)
//         console.table(results)
//     })
// })

// app.get("/api/roles", (req, res) => {
//     db.query("SELECT * FROM role", function(err, results){
//         res.json(results)
//         console.table(results)
//     })
// })

// app.get("/api/employees", (req, res) => {
//     db.query("SELECT * FROM employee", function(err, results){
//         res.json(results)
//         console.table(results)
//     })
// })






app.listen(PORT, () => console.log)