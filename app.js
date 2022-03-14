// npm modules
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
// const getDate = require("./date");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb+srv://ericSpencer:strugbits@cluster0.yaouk.mongodb.net/todoListDB", { useNewUrlParser: true })

function getDate() {
    //   fetching date
    let dateTodayinWord = new Date();
    //   date formatting
    let optionDate = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };

    let day = dateTodayinWord.toLocaleDateString("en-IN", optionDate);
    return day;
}



const itemsSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome"
});
const item2 = new Item({
    name: "Add"
});
const item3 = new Item({
    name: "Remove"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
}
const List = mongoose.model("List", listSchema);

// using ejs for template
app.set("view engine", "ejs");


// access static files
app.use(express.static(__dirname + "/public"));

app.get("/:customListName", function(req, res) {
    console.log(req.params.customListName);
    const newCustomList = req.params.customListName;
    const list = new List({
        name: newCustomList,
        items: defaultItems
    });
    List.findOne({ name: newCustomList }, function(err, customListData) {
        if (!err) {
            if (!customListData) {
                const list = new List({
                    name: newCustomList,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + newCustomList);
            } else {
                const day = getDate();
                res.render("list", { day: newCustomList, newTask: customListData })
            }

        }
    })
});

// Default get request made by browser
app.get("/", function(req, res) {
    Item.find({}, function(err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Success")
                }
            });
            res.redirect("/");
        } else {



            if (err) {
                console.log(err)
            } else {
                let day = getDate();
                res.render("list", { day: day, newTask: foundItems });
            }
        }
    });


});


app.listen(process.env.PORT || 3000, function() {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


// getting post data from ejs file
app.post("/", function(req, res) {
    task = req.body.task;
    const item = new Item({
        name: task
    });
    item.save();
    res.redirect("/");
});

app.get("/work", function(req, res) {
    res.render("list", { day: "Work Time", newTask: work });
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.post("/work", function(req, res) {
    let work = req.body.task;
    tasks.push(work);
    res.redirect("/work");
});

app.post("/delete", function(req, res) {
    if (req.body.delete) {
        Item.deleteOne({ _id: req.body.delete }, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log("Deleted");
            }
        })
    }
    res.redirect("/");
});

app.get("/")