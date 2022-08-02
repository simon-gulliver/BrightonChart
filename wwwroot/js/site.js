if (navigator.serviceWorker) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('js/serviceworker.js')
            .then(console.log('[ServiceWorker] Registered Successfully'))
            .catch(err => console.log(`[ServiceWorker] Error: ${err}`));
    });
} else {
    console.log('Service Worker not supported.');
}

function renderPointsCallback(me, ctx, x, y, i) {
    switch (me.shpName) {
        case "landCoverPoint":
        case "symbols":
            ctx.drawImage(images[me.shpFile.byteKeys[i]], x, y);
            return true;
        case "geology":
            ctx.fillStyle = 'gray';
            //context.font = 'italic 30px sans-serif';
            ctx.textBaseline = 'top';
            var label = geologyLabels[me.shpFile.byteKeys[i]];       // this returns a label
            ctx.fillText(label, x, y);
            return true;
   }
    return true;
}


    function createImages()
    {
        // Image factory
        var createImage = function (src) {
            var img = new Image();
            img.src = src;
            return img;
        };


        var images = [];
        images.push(createImage("foo.jpg"));

    }
    var geologyLabels = [
        "clay",
        "gravel",
        "gravel,rock",
        "gravel,shells",
        "gravel,shells,pebbles",
        "mud",
        "mud,sand",
        "mud,sand,clay",
        "mud,shells,gravel,sand",
        "mud,shells,pebbles,gravel,sand",
        "mud,shells,sand",
        "pebbles,shells",
        "rock",
        "rock,shells",
        "sand",
        "sand,gravel",
        "sand,pebbles",
        "sand,pebbles,gravel",
        "sand,rock",
        "sand,shells",
        "sand,shells,gravel",
        "sand,shells,pebbles",
        "sand,shells,pebbles,gravel",
        "sand,shells,stone"
    ];

    function renderPolygonCallback(me, ctx, i)
    {
        switch (me.shpName) {
            case "bathy": 
                switch (me.shpFile.byteKeys[i-1]) {
                    case 0: ctx.fillStyle = "#8CF7A5";  break;       // green
                    case 1: ctx.fillStyle = "#63D7FF";break;
                    default: ctx.fillStyle = "#C6FFFF";
                }
                break;
            case "landCoverLine":
                ctx.fillStyle = (me.shpFile.byteKeys[i-1] == 0) ? "black" : "magenta";
                break;
            case "bathycontours":
                return me.shpFile.byteKeys[i-1];                      // this returns a label
            case "landCoverRegion":
                return me.shpFile.byteKeys[i-1];                      // this returns a label
            }
        return null;

    }
  
    var images = [];
    function setUpSymbolImages()
    {
        var j = 0;
        for (var i= 0; i < 115;i++)
        {
            var img = document.getElementById("i" + i.toString());
            if (img === null)
                j++;
            images.push(img);
        }
    }

    function paintSymbol(ctx, values, x, y) {
        var img = 0;
        switch (values["SZFEATDESC"].trim()) {
            case "Buoy, lateral, port-hand lateral mark": image = 41; y -= 4; break;
            case "Buoy, lateral, starboard-hand lateral mark": image = 42; y -= 4; break;
            case "Beacon, lateral, port-hand lateral mark": image = 74; break;
            case "Beacon, lateral, starboard-hand lateral mark": image = 75; break;
            case "Beacon, cardinal, east cardinal mark": image = 62; break;
            case "Beacon, cardinal, west cardinal mark": image = 64; break;
            case "Beacon, cardinal, south cardinal mark": image = 63; break;
            case "Beacon, cardinal, north cardinal mark": image = 61; break;
            case "Beacon, special purpose/general": image = 90; break;
            case "Beacon, isolated danger": image = 72; break;
            case "Beacon, safe water": image = 80; break;
            case "Beacon, cardinal": image = 60; break;
            case "Buoy, special purpose/general": image = 44; y -= 2; break;
            case "Buoy, cardinal, north cardinal mark": image = 11; y -= 3; break;
            case "Buoy, cardinal, west cardinal mark": image = 14; y -= 3; break;
            case "Buoy, cardinal, east cardinal mark": image = 12; y -= 3; break;
            case "Buoy, cardinal, south cardinal mark": image = 13; y -= 3; break;
            case "Buoy, safe water": image = 43; y -= 2; break;
            case "Buoy, isolated danger": image = 40; y -= 4; break;
            case "Topmark, cylinder (can)": image = 19; break;
            case "Topmark, 2 cones (points upward)": image = 25; break;
            case "Topmark, 2 cones (points downward)": image = 26; break;
            case "Topmark, 2 cones, point to point": image = 22; break;
            case "Topmark, 2 cones, base to base": image = 23; break;
            case "Topmark, x-shape (St. Andrew's cross)": image = 21; break;
            case "Topmark, cone, point up": image = 15; break;
            case "Topmark, cone, point down": image = 16; break;
            case "Topmark, square": image = 28; break;
            case "Topmark, sphere": image = 17; break;
            case "Topmark, 2 spheres": image = 18; break;
            case "Topmark, rhombus (diamond)": image = 24; break;
            case "Topmark, triangle, point up": image = 31; break;
            case "Topmark, other shape (see INFORM)": image = 32; break;
            case "Fog signal, reed": image = 67; break;
            case "Fog signal, bell": image = 68; break;
            case "Fog signal, horn": image = 71; break;
            case "Fog signal, siren": image = 66; break;
            case "Fog signal, whistle": image = 69; break;
            case "Fog signal, diaphone": image = 65; break;
            case "Radio station": image = 5; x += 8; break;
            case "Radar station, radar surveillance station": image = 1; x -= 1; break;
            case "Radar transponder beacon, racon, radar transponder beacon": image = 2; x += 12; break;
            case "Signal station, warning": image = 9; break;
            case "Signal station, traffic": image = 8; break;
            case "Distance mark, distance mark not physically installed": image = 59; break;
            case "Light vessel": image = 79; x -= 1; y -= 3; break;
            case "Light": image = 77; y += 3; break;
            case "Wreck": image = 34; break;
            case "Wreck, dangerous wreck": image = 36; break;
            case "Wreck, non-dangerous wreck": image = 35; break;
            case "Wreck, distributed remains of wreck": image = 37; break;
            case "Wreck, wreck showing mast/masts": image = 38; break;
            case "Wreck, wreck showing any portion of hull or superstructure": image = 39; break;
            case "Small craft facility": image = 10; break;

            case "Daymark": image = 57; break;
            case "Light float": image = 78; break;
            case "Topmark, sphere over rhombus": image = 27; break;
            case "Topmark, rectangle, vertical": image = 29; break;
            case "Topmark, trapezium, up": image = 30; break;
            case "Topmark, board": image = 20; break;
            case "Buoy, installation, single buoy mooring (SBM or SPM)": image = 33; break;
            case "Offshore platform": image = 89; break;
            case "Offshore Installation": image = 46; break;
            case "Offshore Installation, Fixed platform/structure": image = 47; break;
            case "Offshore Installation, wellhead": image = 48; break;
            case "Offshore Installation, diffuser": image = 49; break;
            case "Offshore Installation, Wind Turbine": image = 50; break;
            case "Offshore Installation, Turbine Substation": image = 51; break;
            case "Offshore Installation, protection structure": image = 52; break;
            case "Offshore Installation, pipeline structure": image = 53; break;
            case "Offshore Installation, manifold": image = 54; break;
            case "Offshore Installation, storage tank": image = 55; break;
            case "Offshore Installation, template": image = 56; break;
            case "Mooring/Warping facility, bollard": image = 82; break;
            case "Mooring/Warping facility, dolphin": image = 81; break;
            case "Mooring/Warping facility, post or pile": image = 83; break;
            case "Obstruction": image = 84; break;
            case "Obstruction, foul ground": image = 87; break;
            case "Obstruction, ground tackle": image = 88; break;
            case "Obstruction, foul area": image = 86; break;
            case "Fog signal, gong": image = 70; break;
            case "Berth": image = 0; break;
            case "Rescue station": image = 7; break;
            case "Coastguard station": image = 45; break;
            case "Pile": image = 91; break;
            case "Pile, post": image = 56; break;
            case "Offshore Installation, Removed": image = 56; break;
            case "Anchorage area": image = 58; break;
            case "Pilot boarding place": image = 93; break;
            case "Pilot boarding place, boarding by pilot-cruising vessel": image = 93; break;
            case "Harbour facility": image = 72; break;
            case "Recommended traffic lane part": image = 6; break;
            case "Radio calling-in point, inbound": image = 3; break;
            case "Radio calling-in point, two-way": image = 4; break;
            default: image = 56; break; // unknown, need to check out
        }
        //if (db == null) return false;
        //var transaction = db.transaction(["shapefile"], "readwrite");
        //transaction.objectStore("shapefile").get("image").onsuccess = function (event) {
        //    var imgFile = event.target.result;
        //    console.log("Got bathy!" + imgFile);

        //    // Get window.URL object
        //    var URL = window.URL || window.webkitURL;

        //    // Create and revoke ObjectURL
        //    var imgURL = URL.createObjectURL(imgFile);
        //    // Set img src to ObjectURL
        //    var imgElephant = document.getElementById("elephant");
        //    imgElephant.setAttribute("src", imgURL);
        //    var img = document.getElementById("elephant");
        //    ctx.drawImage(img, x, y);

        //    // Revoking ObjectURL
        //    URL.revokeObjectURL(imgURL);
        //    return true;
        //};

        //var img = document.getElementById("i"+image.toString());
        //if (img == null)
        //    return false;
        //var imgData = ctx.getImageData(10, 10, 50, 50);
        ctx.drawImage(images[image], x, y);
        return true;
    }

    // Fired when the manifest resources have been newly redownloaded.
    window.applicationCache.addEventListener('updateready',
        function () {                  // automatically reload page when applicationCache changes
            log('AppCache Update');
            window.applicationCache.swapCache();
            window.location.reload();
        }, false);






