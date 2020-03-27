let db;

//using new browser api Index.db to create a new database which didnt exist before so now it is upgraded to  version 1

const request = indexedDB.open("Budget", 1);

//our request object will need an upgrade

request.onupgradeneeded = function(event) {
    db = event.target.result;
    db.createObject("pending", { autoIncrement: true});
};
