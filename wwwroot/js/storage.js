window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
var dbVersion = 1.0;
var db;
var map=null;


// Create/open database
function storageReadAll() {
//    function storageReadAll(mapNew) {
//        map = mapNew;
    if (!window.indexedDB) {
        window.alert("Your browser will only support online access.")
    }

    var request = indexedDB.open("shapefiles", dbVersion);
    var db;
        //createObjectStore = function (db) {
        //    console.log("Creating objectStore")
        //    db.createObjectStore("shapefile");
        //};

   request.onsuccess = function (event) {
       db = request.result;
       readAll(db);
   };
   request.onerror = function (event) {
       alert("Unable to initialise db");
   };
   request.onupgradeneeded = function (event) {
       db = event.target.result;
       console.log("onupgradeneeded")
       var objectStore = db.createObjectStore("shapefile");
   } 

}

function addShapefileToStorage(shpName, shpData) {
    var request = indexedDB.open("shapefiles", dbVersion);
    var db;
        //createObjectStore = function (dataBase) {
        //    console.log("Creating objectStore")
        //    dataBase.createObjectStore("shapefile");
        //};

    request.onsuccess = function (event) {
        db = request.result;
        var request1 = db.transaction("shapefile", "readwrite")
            .objectStore("shapefile")
            .put(shpData, shpName);

        request1.onsuccess = function (event) {
            db.close();
        };
    };
    request.onerror = function (event) {
        db.close();
        alert("Unable to initialise db");
    };
    request.onupgradeneeded = function (event) {
        db = event.target.result;
        console.log("onupgradeneeded")
        var objectStore = db.createObjectStore("shapefile");
   } 


    request.onerror = function (event) {
        alert("Unable to add layer");
    }
}


 
function readAll(db) {

    try {
        //throw "newdb";
        var objectStore = db.transaction("shapefile", "readwrite").objectStore("shapefile");
    }
    catch (err) {
        loadRemaindingLayersFromServer();
        db.close();
        indexedDB.deleteDatabase("shapefile1");
        //db = null;
        return;
    }
    //var objectStoreRequest = objectStore.clear();
    //objectStoreRequest.onsuccess = function (event) {
    //    alert('deleted');
    //};

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            for (var i = 0; i < map.layers.length; i++) {
                if (map.layers[i].shpName == cursor.key) {
                    map.layers[i].shpFile = cursor.value;
                    if (++renderedLayers == map.layers.length) {
                        console.log("ALL LAYERS IN DATABASE");
                        map.render();
                    }
                }
            }
            cursor.continue();
        }

        else {
            loadRemaindingLayersFromServer()
        }
        db.close();
    };

    function loadRemaindingLayersFromServer ()
    {
        var canvas = document.getElementById('canvas1');
        for (var i = 0; i < map.layers.length; i++) {
            if (!map.layers[i].shpFile) {
                //var layer = map.layers[i];
                //layer.canvas = canvas;
                map.layers[i].load();
            }
        }
        map.render();
    }
}



//(function () {
//    // IndexedDB
//    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
//        IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
//        dbVersion = 1.0;

//    // Create/open database
//    var request = indexedDB.open("shapefiles", dbVersion),
//        db,
//        createObjectStore = function (dataBase) {
//            // Create an objectStore
//            console.log("Creating objectStore")
//            dataBase.createObjectStore("shapefile");
//        },

//        getImageFile = function () {
//            // Create XHR
//            var xhr = new XMLHttpRequest(),
//                blob;

//            xhr.open("GET", "images/400.png", true);
//            // Set the responseType to blob
//            xhr.responseType = "blob";

//            xhr.addEventListener("load", function () {
//                if (xhr.status === 200) {
//                    console.log("Image retrieved");

//                    // Blob as response
//                    blob = xhr.response;
//                    console.log("Blob:" + blob);

//                    // Put the received blob into IndexedDB
//                    putShapefileInDb(blob);
//                }
//            }, false);
//            // Send XHR
//            xhr.send();
//        },

//        putShapefileInDb = function (blob) {
//            console.log("Putting bathy in IndexedDB");

//            // Open a transaction to the database
//            //var transaction = db.transaction(["shapefile"], IDBTransaction.READ_WRITE);
//            var transaction = db.transaction(["shapefile"], "readwrite");

//            // Put the blob into the dabase
//            var put = transaction.objectStore("shapefile").put(blob, "image");

//            // Retrieve the file that was just stored
//            transaction.objectStore("shapefile").get("image").onsuccess = function (event) {
//                var imgFile = event.target.result;
//                console.log("Got bathy!" + imgFile);

//                // Get window.URL object
//                var URL = window.URL || window.webkitURL;

//                // Create and revoke ObjectURL
//                var imgURL = URL.createObjectURL(imgFile);

//                // Set img src to ObjectURL
//                //var imgElephant = document.getElementById("elephant");
//                //imgElephant.setAttribute("src", imgURL);

//                // Revoking ObjectURL
//                URL.revokeObjectURL(imgURL);
//            };
//        };

//    request.onerror = function (event) {
//        console.log("Error creating/accessing IndexedDB database");
//    };

//    request.onsuccess = function (event) {
//        console.log("Success creating/accessing IndexedDB database");
//        db = request.result;

//        db.onerror = function (event) {
//            console.log("Error creating/accessing IndexedDB database");
//        };

//        // Interim solution for Google Chrome to create an objectStore. Will be deprecated
//        if (db.setVersion && (db.version != dbVersion)) {
//            var setVersion = db.setVersion(dbVersion);
//            setVersion.onsuccess = function () {
//                createObjectStore(db);
//                getImageFile();
//            };
//            return;
//        }
//        getImageFile();
//    }

//    // For future use. Currently only in latest Firefox versions
//    request.onupgradeneeded = function (event) {
//        createObjectStore(event.target.result);
//    };
//})();




