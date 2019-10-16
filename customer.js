const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,
  user: "root",

  password: "lamora22",
  database: "shopkeep_DB"
});

const inventory = {
  medicine: [],
  weapon: [],
  clothing: [],
  material: []
};

connection.connect(function(error) {
  if (error) {
    return console.log(error);
  }
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM items", function(error, data) {
    if (error) {
      return console.log(error);
    }
    data.forEach(item => {
      inventory[item.type].push(item);
    });
    inquirer
      .prompt([
        {
          message: "welcome!",
          type: "list",
          choices: ["buy", "exit"],
          name: "action"
        }
      ])
      .then(function(enter) {
        first(enter);
      });
  });
}
function first(enter) {
  if (enter.action === "buy") {
    inquirer
      .prompt([
        {
          message: "what are you looking for?",
          type: "list",
          choices: ["medicine", "weapon", "clothing", "material"],
          name: "buyType"
        }
      ])
      .then(function(category) {
        inquirer.prompt([
          {
            type: "list",
            choices: inventory[category.buyType],
            name: "itemDisplay"
          }
        ]);
      });
  } else {
    return console.log("come again soon!");
  }
}
