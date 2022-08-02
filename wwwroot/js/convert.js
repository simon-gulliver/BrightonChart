function DecimalLatLong2UTM(LL) {
    var SouthernHemisphere = (LL.lat < 0);
    var k0 = 0.9996;
    var a = 6378137;
    var b = 6356752.3142;
    var f = (a - b) / a;
    var invf = 1 / f;
    var rm = Math.pow((a * b), 0.5);
    var e = Math.sqrt(1 - Math.pow((b / a), 2));
    var e1sq = Math.pow(e, 2) / (1 - Math.pow(e, 2));
    var n = (a - b) / (a + b);
    var latRad = LL.lat * Math.PI / 180;
    var rho = a * (1 - Math.pow(e, 2)) / (Math.pow(1 - (Math.pow(e * Math.sin(latRad)), 2)), (3 / 2));
    var nu = a / (Math.pow((1 - Math.pow((e * Math.sin(latRad)), 2)), 0.5));

    var a0 = a * (1 - n + (5 * n * n / 4) * (1 - n) + (81 * Math.pow(n, 4) / 64) * (1 - n));
    var b0 = (3 * a * n / 2) * (1 - n - (7 * n * n / 8) * (1 - n) + 55 * Math.pow(n, 4) / 64);
    var c0 = (15 * a * n * n / 16) * (1 - n + (3 * n * n / 4) * (1 - n));
    var d0 = (35 * a * Math.pow(n, 3) / 48) * (1 - n + 11 * n * n / 16);
    var e0 = (315 * a * Math.pow(n, 4) / 51) * (1 - n);
    var s = a0 * latRad - b0 * Math.sin(2 * latRad) + c0 * Math.sin(4 * latRad) - d0 * Math.sin(6 * latRad) + e0 * Math.sin(8 * latRad);

    var p = (LL.lng - GetZoneCM()) * 3600 / 10000;
    var sin1 = Math.PI / (180 * 3600);

    var ki = s * k0;
    var kii = nu * Math.sin(latRad) * Math.cos(latRad) * Math.pow(sin1, 2) * k0 * (100000000) / 2;
    var kiii = ((Math.pow(sin1, 4) * nu * Math.sin(latRad) * Math.pow(Math.cos(latRad), 3)) / 24) * (5 - Math.pow(Math.tan(latRad), 2) + 9 * e1sq * Math.pow(Math.cos(latRad), 2) + 4 * Math.pow(e1sq, 2) * Math.pow(Math.cos(latRad), 4)) * k0 * (10000000000000000);
    var kiv = nu * Math.cos(latRad) * sin1 * k0 * 10000;
    var kv = Math.pow((sin1 * Math.cos(latRad)), 3) * (nu / 6) * (1 - Math.pow(Math.tan(latRad), 2) + e1sq * Math.pow(Math.cos(latRad), 2)) * k0 * (1000000000000);
    var a6 = Math.pow(((p * sin1), 6) * nu * Math.sin(latRad) * Math.pow(Math.cos(latRad), 5) / 720) * (61 - 58 * Math.pow(Math.tan(latRad), 2) + Math.pow(Math.tan(latRad), 4) + 270 * e1sq * Math.pow(Math.cos(latRad), 2) - 330 * e1sq * Math.pow(Math.sin(latRad), 2)) * k0 * (1.0E+24);

    var utm = new Object();
    utm.x = 500000 + (kiv * p + kv * Math.pow(p, 3));
    utm.y = (ki + kii * p * p + kiii * Math.pow(p, 4));
    if (SouthernHemisphere) utm.y = 10000000 + utm.y;
    return utm;
}

// cannot calculate from UTM what UTM it is derived from
// the zone variable is created by map.aspx.cs, but no indication of N or S (as it should do)
// For now UTM 56 IS southern hemisphere
function UTM2DecimalLatLong(easting, northing) {
    if (zone == 56)
        northing = 10000000 - northing;  //    if not northernHemisphere:
    var a = 6378137;
    var e = 0.081819191;
    var e1sq = 0.006739497;
    var k0 = 0.9996;

    var arc = northing / k0;
    var mu = arc / (a * (1 - Math.pow(e, 2) / 4.0 - 3 * Math.pow(e, 4) / 64.0 - 5 * Math.pow(e, 6) / 256.0));

    var ei = (1 - Math.pow((1 - e * e), (1 / 2.0))) / (1 + Math.pow((1 - e * e), (1 / 2.0)));
    var ca = 3 * ei / 2 - 27 * Math.pow(ei, 3) / 32.0;
    var cb = 21 * Math.pow(ei, 2) / 16 - 55 * Math.pow(ei, 4) / 32;
    var cc = 151 * Math.pow(ei, 3) / 96;
    var cd = 1097 * Math.pow(ei, 4) / 512;
    var phi1 = mu + ca * Math.sin(2 * mu) + cb * Math.sin(4 * mu) + cc * Math.sin(6 * mu) + cd * Math.sin(8 * mu);

    var n0 = a / Math.pow((1 - Math.pow((e * Math.sin(phi1)), 2)), (1 / 2.0));
    var r0 = a * (1 - e * e) / Math.pow((1 - Math.pow((e * Math.sin(phi1)), 2)), (3 / 2.0));
    var fact1 = n0 * Math.tan(phi1) / r0;

    var _a1 = 500000 - easting;
    var dd0 = _a1 / (n0 * k0);
    var fact2 = dd0 * dd0 / 2;
    var t0 = Math.pow(Math.tan(phi1), 2);
    var Q0 = e1sq * Math.pow(Math.cos(phi1), 2);
    var fact3 = (5 + 3 * t0 + 10 * Q0 - 4 * Q0 * Q0 - 9 * e1sq) * Math.pow(dd0, 4) / 24;
    var fact4 = (61 + 90 * t0 + 298 * Q0 + 45 * t0 * t0 - 252 * e1sq - 3 * Q0 * Q0) * Math.pow(dd0, 6) / 720;

    var lof1 = _a1 / (n0 * k0);
    var lof2 = (1 + 2 * t0 + Q0) * Math.pow(dd0, 3) / 6.0;
    var lof3 = (5 - 2 * Q0 + 28 * t0 - 3 * Math.pow(Q0, 2) + 8 * e1sq + 24 * Math.pow(t0, 2)) * Math.pow(dd0, 5) / 120;
    var _a2 = (lof1 - lof2 + lof3) / Math.cos(phi1);
    var _a3 = _a2 * 180 / Math.PI;

    var LL = new Object();
    LL.lat = 180 * (phi1 - fact1 * (fact2 + fact3 + fact4)) / Math.PI;

    //if not northernHemisphere:
    if (zone == 56)
        LL.lat = -LL.lat

    LL.lon = GetZoneCM() - _a3;
    return LL;
}

function GetZoneCM() {
    return 6 * zone - 183;
}

/////////////////////////////////////////////////////////////
// useful functions
/////////////////////////////////////////////////////////////
// rounds to selected decimal value (length=0 = integer)
function roundNumber(num, length) {
    return Math.round(num * Math.pow(10, length)) / Math.pow(10, length);
}
// rounds down to integer
function roundDownNumber(num) {
    return Math.floor(num); //.toFixed(0);
}

function utm2pixel(utm, world) {
    var pixel = new Object();
    pixel.x = Math.floor(((utm.x - world.minX) * world.container.offsetWidth) / world.zoom);
    pixel.y = Math.floor(((world.maxY - utm.y) * world.container.offsetWidth) / world.zoom);
    return pixel;
}
function utm2pixelX(x, world) {
    return Math.floor(((x - world.minX) * world.container.offsetWidth) / world.zoom);
}
function utm2pixelY(y, world) {
    return Math.floor(((world.maxY - y) * world.container.offsetWidth) / world.zoom);
}
function pixel2utm(world, pixel) {
    var utm = new Object();
    utm.x = world.minX + ((pixel.x * world.zoom) / world.container.offsetWidth);
    utm.y = world.maxY - ((pixel.y * obj.zoom) / obj.container.offsetWidth);
    return utm;
}

function maxX(world) {
    return world.maxX + ((world.zoom * world.container.offsetHeight) / world.container.offsetWidth);
}
function minY(world) {
    return world.maxY - ((world.zoom * world.container.offsetHeight) / world.container.offsetWidth);
}
