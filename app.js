const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// newItems = ["Take medicines", "Do laundry"];
// workItems = [];

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your To-Do list!"
});
const item2 = new Item({
    name: "Hit the + button to add a new item."
});
const item3 = new Item({
    name: "<-- Hit this to cross an item."
});
const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

    today = new Date();
    options = {
        dateStyle: "full"
    };
    day = today.toLocaleDateString("en-IN", options);

    Item.find({}, function(err, foundItems) {
        //console.log(foundItems);
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log("Error:" + err);
                } else {
                    console.log("Document updated succesfully");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {
                listTitle: day,
                newListItems: foundItems
            });
        }
    });

});

// app.get("/work", function(req, res) {
//     title = "Work List";
//     res.render("list", {
//         listTitle: title,
//         newListItems: workItems
//     });
// });

app.get("/about", function(req, res) {
    res.render("about");
});

app.post("/", function(req, res) {
    itemName = req.body.newItem;
    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");
    // if (req.body.listType == "Work") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // } else {
    // newItems.push(item);
    // }
});

app.post("/remove", function(req, res) {
    itemID = req.body.checkbox;
    // if (req.body.listType == "Work") {
    //     index = workItems.indexOf(item);
    //     workItems.splice(index, 1);
    //     res.redirect("/work");
    // } else {
    //     index = newItems.indexOf(item);
    //     newItems.splice(index, 1);
    Item.findByIdAndRemove(itemID, function(err) {
        console.log("Error:" + err);
    })
    res.redirect("/");
    // }
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});