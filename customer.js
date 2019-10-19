const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,
  user: "root",

  password: "lamora22",
  database: "shopkeep_DB"
});

let inventory = {
  medicine: [],
  weapon: [],
  clothing: [],
  material: []
};

function refreshInv() {
  inventory = {
    medicine: [],
    weapon: [],
    clothing: [],
    material: []
  };

  connection.query("SELECT * FROM items", function(error, data) {
    if (error) {
      return console.log(error);
    }
    data.forEach(item => {
      inventory[item.type].push(item);
    });
  });
}

connection.connect(function(error) {
  if (error) {
    return console.log(error);
  }
  afterInitial();
});

function afterInitial() {
  refreshInv();
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
      return first(enter);
    })
    .catch(function(error) {
      console.log(error);
      connection.end();
    });
}

function reEnter() {
  first({ action: "enter" });
}
function goodbye() {
  connection.end();
  return console.log("come again soon!");
}
function first(enter) {
  if (enter.action != "exit") {
    inquirer
      .prompt([
        {
          message: "what are you looking for?",
          type: "list",
          choices: ["medicine", "weapon", "clothing", "material", "exit"],
          name: "buyType"
        }
      ])
      .then(function(category) {
        if (category.buyType === "exit") {
          return goodbye();
        }
        return second(category);
      })
      .catch(function(error) {
        console.log(error);
        connection.end();
      });
  } else {
    return goodbye();
  }
}
function second(category) {
  inquirer
    .prompt([
      {
        type: "list",
        choices: inventory[category.buyType],
        message: "here's what I have!",
        name: "itemDisplay"
      }
    ])
    .then(function(pickItem) {
      inventory[category.buyType].forEach(heldItem => {
        if (pickItem.itemDisplay == heldItem.name) {
          third(heldItem);
        }
      });
    })
    .catch(function(error) {
      console.log(error);
      connection.end();
    });
}
function third(heldItem) {
  if (heldItem.quantity === 0) {
    console.log("sorry, those are sold out!");
    return reEnter();
  }

  inquirer
    .prompt([
      {
        type: "number",
        message: `${heldItem.name}? those are ${heldItem.price}G, and I have ${heldItem.quantity}. how many do you want?`,
        name: "buyCount"
      }
    ])
    .then(function(orderAmount) {
      if (orderAmount.buyCount > heldItem.quantity || orderAmount < 0) {
        console.log("please ask for an amount I can actually sell you...");
        third(heldItem);
      } else if (orderAmount.buyCount === 0) {
        console.log("that's fine, take your time!");
        return reEnter();
      } else if (
        orderAmount.buyCount > 0 &&
        orderAmount.buyCount <= heldItem.quantity
      ) {
        const total = orderAmount.buyCount * heldItem.price;
        const newQuantity = heldItem.quantity - orderAmount.buyCount;
        fourth(total, heldItem.name, newQuantity);
      } else {
        console.log("err... what?");
        third(heldItem);
      }
    })
    .catch(function(error) {
      console.log(error);
      connection.end();
    });
}

function fourth(confirmAmount, itemName, newQuantity) {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: `your total will be ${confirmAmount}G. is this okay?`,
        name: "isConfirm"
      }
    ])
    .then(function(toUpdate) {
      if (toUpdate.isConfirm) {
        update(itemName, newQuantity);
      } else {
        return reEnter();
      }
    })
    .catch(function(error) {
      console.log(error);
      connection.end();
    });
}

function update(itemName, newQuantity) {
  console.log("thanks for your business!");
  connection.query("UPDATE items SET ? WHERE ?", [
    {
      quantity: newQuantity
    },
    {
      name: itemName
    }
  ]);
  refreshInv();
  return reEnter();
}
