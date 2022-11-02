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
        db.query("select role.id as ID, role.title as title, role.salary as Salary, department.name as Department FROM role JOIN department on role.department_id = department.id", function(err, results){
            console.table(results)
            start()
        })
}

function viewEmployees(){
        db.query("SELECT employee.id as id, employee.first_name as 'First Name', employee.last_name as 'Last Name', title as 'Title', salary as Salary, name as Department, CONCAT(e.first_name, ' ', e.last_name) as Manager FROM employee JOIN role r on employee.role_id = r.id JOIN department d on d.id = r.department_id LEFT JOIN employee e on employee.manager_id = e.id", function(err, results){
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
    let department =[]
    db.query("select name from department", function (err, results){
        for(let i =0; i < results.length; i++){
        department.push(results[i].name)
    }
    })
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
                choices: department
            }
        ]
    ).then((answers) => {
        let title = answers.name
        let salary = answers.salary
        db.query("INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)", [title, salary, (department.indexOf(answers.department) + 1)], function(err, results){
            if (err) {
                console.log(err)
                return
            } 
            console.log("Role added to database")
            start()
        })
    })
}

// to do add employee
async function addEmployee(){
    let employee = []
    let role = []
    db.query("select title from role", function (err, results) {
        for(let i =0; i <results.length; i++){
            role.push(results[i].title)
          } 
          return role
      })
    db.query(`select concat(first_name, " ", last_name) AS Employee from employee`, function (err, results){
        for(let i =0; i <results.length; i++){
            employee.push(results[i].Employee)
        } return employee
    })
    await inquirer
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
                type: "list",
                message: "Enter the employee's role",
                choices: role
            },
            {
                name: "manager",
                type: "list",
                message: "Enter the employee's manager",
                choices: employee
            }
        ]
    ).then((answers) => {
        let fname = answers.first_name
        let lname = answers.last_name
        let roleID = (role.indexOf(answers.role) + 1)
        let managerID = (employee.indexOf(answers.manager) + 1)
        console.log(answers.employee)
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [fname, lname, roleID, managerID], function(err, results){
            if (err) {
                console.log(err)
            } else {
            console.log("Employee Added to Database")
            start()}
        })
    })
}

function updateEmployee(){
    let employee = []
    let role = []
    db.query(`select concat(first_name, " ", last_name) AS Employee from employee`, function (err, results){
    for(let i =0; i <results.length; i++){
        employee.push(results[i].Employee)
    }
    })
    db.query("select title from role", function (err, results) {
      for(let i =0; i <results.length; i++){
          role.push(results[i].title)
        }    
    })

    inquirer
    .prompt(
        [
            {
                name: "confirm",
                type: "confirm",
                message: "confirm to add employee"
            },
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
        let role_id = (role.indexOf(answers.role) + 1)
        let employee_id = (employee.indexOf(answers.employee) + 1)
    db.query("UPDATE EMPLOYEE SET role_id = (?) where id = (?)", [role_id, employee_id], (err, results) => {
        if (err){
            res.status(400).json({error: err.message})
                return
        }
        console.log("Employee updated.")
        start()
    })
    })
}
start()


app.listen(PORT, () => console.log)