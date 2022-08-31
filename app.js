const express = require("express");
const bodyParser = require("body-parser");
//const ejs= require("ejs")
const app = express();
const date = require(__dirname + "/date.js");
console.log(date.getDate());
var items = ["go shop"];
var shoppitems = [""];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  let day = date.getDate();
  res.render("list", { kindOfDay: day, newListItems: items });
});
app.post("/", function (req, res) {
  let item = req.body.newItem;
  if (req.body.list === "") {
    shoppitems.push(item);

    res.redirect("/shop");
  } else {
    items.push(item);
    console.log(item);
    res.redirect("/");
  }
  console.log(item);
});

app.get("/shop", function (req, res) {
  res.render("list", { kindOfDay: "Shopping Cart ", newListItems: shoppitems });
});

app.listen(4000, function () {
  console.log("server running on port 4000");
});
