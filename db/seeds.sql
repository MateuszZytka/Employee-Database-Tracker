INSERT INTO department (name)
VALUES  ("Development"),
        ("Design"),
        ("Database");

INSERT INTO role (title, salary, department_id)
VALUES  ("Full-stack Developer", 90000.00, 1),
        ("Frontend Developer", 80000.00, 1),
        ("Backend Developer", 80000.00, 1),
        ("Graphic Designer", 80000.00, 2),
        ("Data Analyst", 85000.00, 3),
        ("Data Scientist", 95000.00, 3);
        

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Mateusz", "Zytka", 1, null),
        ("John", "Doe", 2, 1),
        ("Byron", "Brown", 2, 3),
        ("Joe", "Thomas", 3, 3),
        ("Pascal", "Siakam", 2, 1);