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
    let choice
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
            case "quit":
                console.log("Succesfully ended application.")
                break
            
        }
    }

function viewDeparments(){
        db.query("SELECT * FROM department", function(err, results){
            console.table(results)
            start()
        })
}

function viewRoles(){
        db.query("SELECT * FROM role", function(err, results){
            console.table(results)
            start()
        })
}

function viewEmployees(){
        db.query("SELECT * FROM employee", function(err, results){
            console.table(results)
            start()
        })
}

function addDepartment () {
    inquirer
    .prompt(
        {
            name: "department",
            type: "input",
            message: "Enter the name of the department you would like to add:"
        }
    ).then((answer) => {
        let params = answer.department
        db.query("INSERT INTO department (name) VALUES (?)", params, function(err, results){
            if (err) {
                console.log(err)
                return
            } 
            console.log("Department added to database")
            start()
        })
    })
}

function addRole() {
    inquirer
    .prompt(
        [
            {
                name: "name",
                type: "input",
                message: "Enter the name for the new role:"
            },
            {
                name: "salary",
                type: "input",
                message: "Enter the salary for the new role:"
            },
            {
                name: "department",
                type: "list",
                message: "Enter the department the role belongs to:",
                choices: departments
            }
        ]
    ).then((answers) => {
        let title = answers.name
        let salary = answers.salary
        let department_id = answers.department
        db.query("INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)", [title, salary, department_id], function(err, results){
            if (err) {
                res.status(400).json({error: err.message})
                return
            } 
            console.log("Role added to database")
        })
    })
}

function addEmployee(){
    inquirer
    .prompt(
        [
            {
                name: "first_name",
                type: "input",
                message: "Enter the employee's first name"
            },
            {
                name: "last_name",
                type: "input",
                message: "Enter the employee's last name"
            },
            {
                name: "role",
                type: "input",
                message: "Enter the employee's role"
            },
            {
                name: "manager",
                type: "input",
                message: "Enter the employee's manager"
            }
        ]
    ).then((answers) => {
        let fname = answers.first_name
        let lname = answers.last_name
        let roleID = answers.role
        let managerID = answers.manager
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [fname, lname, roleID, managerID], function(err, results){
            if (err) {
                res.status(400).json({error: err.message})
                return
            } 
            console.log("Employee Added to Database")
        })
    })
}

function updateEmployee(){
    inquirer
    .prompt(
        [
            {
                name: "employee",
                type: "list",
                message: "Which employee's role would you like to update?",
                choices: employee
            },
            {
                name: "role",
                type: "list",
                message: "Which role would you like to assign to the selected employee",
                choices: role
            }
        ]
    ).then((answers) => {
    let roleID = answers.role
    db.query("UPDATE EMPLOYEE SET role_id = (?)", roleID, (err, results) => {
        if (err){
            res.status(400).json({error: err.message})
                return
        }
        console.log("Employee updated.")
    })
    })
}
start()
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