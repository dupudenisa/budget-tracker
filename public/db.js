let db;

const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
//using new browser api Index.db to create a new database which didnt exist before so now it is upgraded to  version 1
const request = indexedDB.open("Budget", 1);


//our request object will need an upgrade

request.onupgradeneeded = function (event) {
    db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
    
};

//running our check db

request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
}

// logging error 

request.onerror = function (event) {
    console.log(request.error);
}

//saving a record 

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);
}



function checkdatabase() {
    //db = target.result;
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll()


    // if we have a successful retrieval we are going to dispatch a fetch & posting all records found:

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(() => {
                    const transactions = db.transactions(
                        ["pending"], "readwrite");
                    const store = transactions.objectStore
                        ("pending");
                    store.clear();


                });
        }
    };
}
// listen for app coming back online
window.addEventListener("online", checkdatabase);
