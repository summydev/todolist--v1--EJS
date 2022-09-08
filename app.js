const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//const ejs= require("ejs")
const app = express();
const date = require(__dirname + "/date.js");
console.log(date.getDate());
//var items = ["go shop"];
var shoppitems = [""];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});
const itemsSchema = {
  name: String,
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "go shop",
});
const item2 = new Item({
  name: "do task 2",
});
const item3 = new Item({
  name: "do task 3",
});
const defaultItems = [item1, item2, item3];
const listSchema = {
  name: String,
  items: [itemsSchema],
};
const List = mongoose.model("list", listSchema);

app.get("/", function (req, res) {
  Item.find({}, function (err, founditems) {
    if (founditems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("inserted successfully");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { kindOfDay: "today", newListItems: founditems });
      console.log(founditems);
    }
  });
});
app.post("/", function (req, res) {
  let itemName = req.body.newItem;

  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect("/");
  // if (req.body.list === "") {
  //   shoppitems.push(item);

  //   res.redirect("/shop");
  // } else {
  //   items.push(item);
  //   console.log(item);
  //   res.redirect("/");
  // }
  console.log(itemName);
});
app.post("/delete", function (req, res) {
  // }
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (err) {
      console.log(err);
    } else console.log("duccessfully deleted");
  });
  res.redirect("/");
});

app.get("/shop", function (req, res) {
  res.render("list", { kindOfDay: "Shopping Cart ", newListItems: shoppitems });
});
app.get("/:postName", function (req, res) {
  const customListName = req.params.postName;
  List.findOne({ name: customListName }, function (err, results) {
    if (err) {
      console.log("doesnt exist...not found");
    } else {
      console.log("exists");
    }
  });
  const list = new List({
    name: customListName,
    items: defaultItems,
  });
  list.save();
});
app.listen(4000, function () {
  console.log("server running on port 4000");
});
