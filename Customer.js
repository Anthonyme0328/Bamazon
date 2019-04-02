// all of my dependencies used to run the program
// do not forget to run npm init then npm install for all of the dependencies below

// mysql to used and make a database for products
var mysql = require('mysql');

// cli-table to display the products in a table
var Table = require('cli-table');

// inquierer to display all the prompts to navigate through Bamazon
var inquirer = require('inquirer');

// makes a connection to mysql database ******* you need to provide your own password

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // username
    user: "root",

    // password ****** i removed mine please provide your own
    password: "",
    database: "bamazonAME"
});

// once connection is made calls the start function
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected" + connection.threadId);
    start();
});

// functio that appears at begining

function start() {

    inquirer.prompt([{

// asks customer if they want to shop with a y or n prompt and displays a welcome message

// if they select yes then it moves to inventory
        type: "confirm",
        name: "confirm",
// welcome message
        message: "Welcome to Bamazon! Try checking out our Stock",
        default: true


// if no is selected it displays a good bye message
    }]).then(function(user) {
        if (user.confirm === true) {
            inventory();
        } else {
// goodbye message
            console.log("Thanks! Come back again!");
        }
    });
}

// function that displays all of the Bamazon inventory

function inventory() {

    // creates a new table with the column titles and the widths of the columns
    var table = new Table({
        // column titles
        head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
        // column dimensions
        colWidths: [10, 30, 30, 30, 30]
    });

    listOfTheInventory();

// funciton that gets all the information for the table
    function listOfTheInventory() {



        connection.query("SELECT * FROM products", function(err, res) {
            for (var i = 0; i < res.length; i++) {

                var Id = res[i].id,

                    product = res[i].product,

                    department = res[i].department,

                    price = res[i].price,

                    stock = res[i].stock;

// pushes all the info into table
              table.push(
                  [Id, product, department, price, stock]
            );
          }
            console.log("");

            console.log("----- Our  Current  Inventory -----");

            console.log("");

            console.log(table.toString());

            console.log("");

            // calls the function for buying something
            continueQ();
        });
    }
}

//function that prompts the person if they want to buy anything

function continueQ() {

    inquirer.prompt([{

        type: "confirm",
        name: "continue",
        message: "Would you like to buy anything?",
        default: true

    }]).then(function(user) {
        if (user.continue === true) {
            selectionPrompt();
        } else {
            // if no is selected displays a good bye message
            console.log("Thanks! Come back again!");
        }
    });
}

//function that prompts person what they want to buy by the id of the item

// then asks them how many they would like to buy

function selectionPrompt() {

    inquirer.prompt([{

        // user selects items id here
            type: "input",
            name: "Id",
            message: "Please enter the ID number of the item you would like",
        },
        {
            // then asks how many they are buying
            type: "input",
            name: "inputNumber",
            message: "How many of this would you like to buy?",

        }
    ]).then(function(userPurchase) {


        // gets data from data base checks that quantity is no greater
        // if greater then cannot buy
        connection.query("SELECT * FROM products WHERE id=?", userPurchase.Id, function(err, res) {
            for (var i = 0; i < res.length; i++) {

                if (userPurchase.inputNumber > res[i].stock) {

                    console.log("--------------------------------------------------");
                    console.log("Sorry! we don't have enough.");
                    console.log("-------------------------------------------------------");
                    start();

                } else {
                    // gives the person all of the items info
                    console.log("------------------------------------");
                    console.log("Your stuff is on the way");
                    console.log("-------------------------------------");
                    console.log("You picked:");
                    console.log("----------------------------------------");
                    console.log("Item: " + res[i].product);
                    console.log("Department: " + res[i].department);
                    console.log("Price: " + res[i].price);
                    console.log("Quantity: " + userPurchase.inputNumber);
                    console.log("----------------------------------------------");
                    console.log("Total: " + res[i].price * userPurchase.inputNumber);
                    console.log("---------------------------------------------");

                    var newStock = (res[i].stock - userPurchase.inputNumber);
                    var purchaseId = (userPurchase.Id);
                    confirmation(newStock, purchaseId);
                }
            }
        });
    });
}

// confirming the purchase is correct

function confirmation(newStock, purchaseId) {

    inquirer.prompt([{

        type: "confirm",
        name: "confirmPurchase",
        message: "Are you sure you want to buy this?",
        default: true

    }]).then(function(userConfirm) {
        if (userConfirm.confirmPurchase === true) {

            // when purchase is confirmed then the data base is updated

            connection.query("UPDATE products SET ? WHERE ?", [{
                stock: newStock
            }, {
                id: purchaseId
            }], function(err, res) {});

            console.log("------------------------------------");
            console.log("Transaction Approved");
            console.log("-------------------------------------");
            start();
        } else {
            console.log("--------------------------------------");
            console.log("Try again another time");
            console.log("------------------------------------------");
            start();
        }
    });
}