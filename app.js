const express = require("express");
const bodyParser = require("body-parser");

const app = express();

newItems = ["Take medicines", "Do laundry"];
workItems = [];

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", function(req, res) {

    today = new Date();
    options = {
        dateStyle: "full"
    };
    day = today.toLocaleDateString("en-IN", options);

    res.render("list", {
        listTitle: day,
        newListItems: newItems
    });
});

app.get("/work", function(req, res) {
    title = "Work List";
    res.render("list", {
        listTitle: title,
        newListItems: workItems
    });
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.post("/", function(req, res) {
    item = req.body.newItem;
    if (req.body.listType == "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        newItems.push(item);
        res.redirect("/");
    }
});

app.post("/remove", function(req, res) {
    item = req.body.removeItem;
    if (req.body.listType == "Work") {
        index = workItems.indexOf(item);
        workItems.splice(index, 1);
        res.redirect("/work");
    } else {
        index = newItems.indexOf(item);
        newItems.splice(index, 1);
        res.redirect("/");
    }
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});