// ported from http://code.google.com/p/vanrijkom-flashlibs/ under LGPL v2.1

function ShpFile(binFile,shpName) {
    var src = new BinaryFileWrapper(binFile);

    this.header = new ShpHeader(src,shpName);

    log('got header, parsing records');

    this.records = new Array(this.header.recordCount);
    if (this.header.shapeType === 1)
        processImages(src, this);
    else
        processPoly(src, this);
}

function processImages(src, me)
{
    for (var i= 0; i < me.header.recordCount;i++) 
        me.records[i] = {
            //x: src.getDouble(),
            //y: src.getDouble()
            x: src.getShort(),
            y: src.getShort()
        };
    switch (me.header.shpName) {
        case "symbols": processByteArray(src, me); break;
        case "landCoverPoint": processByteArray(src, me); break;
        case "geology": processByteArray(src, me); break;
    }
}

function processByteArray(src, me) {
    me.byteKeys = new Array(me.header.recordCount);
    for (var i = 0; i < me.header.recordCount; i++)
        me.byteKeys[i] = src.getByte();
}

function processStringArray(src, me) {
    me.byteKeys = new Array(me.header.recordCount);
    for (var i = 0; i < me.header.recordCount; i++)
        me.byteKeys[i] = src.getString();
}

function processPoly(src, me) {
    me.partsCount = src.getShort();
    me.pointsCount = src.getLong();

     for (var i = 0; i < me.header.recordCount; i++)
        me.records [i] = src.getShort();
    me.parts = new Array(me.partsCount);
    me.points = new Array(me.pointsCount);
    for (var j = 0; j < me.partsCount; j++)
        me.parts [j] = src.getShort();
    for (var k = 0; k < me.pointsCount; k++)
        //me.points[k] = { x: src.getDouble(), y: src.getDouble() };
        me.points[k] = { x: src.getShort(), y: src.getShort() };

    switch (me.header.shpName) {
        case "bathy": processByteArray(src, me); break;
        case "bathycontours": processByteArray(src, me); break;
        case "landCoverLine": processByteArray(src, me); break;
        case "landCoverRegion": processStringArray(src, me); break;
        case "majorRoads": processStringArray(src, me); break;
    }
};



function ShpHeader(src,shpName)
{
    //debugger;
    this.shpName = shpName;

    // read shape-type:
    this.shapeType = src.getByte();
   
    // read bounds:
    this.boundsXY = { x: src.getDouble(), 
                      y: src.getDouble(),
                      width: src.getDouble(),
                      height: src.getDouble()
    };

    this.widthAdj = src.getDouble();
    this.heightAdj = src.getDouble();

    this.recordCount = src.getShort();
}

var ShpType = {

    /**
     * Unknow Shape Type (for internal use) 
     */
    SHAPE_UNKNOWN: -1,
    /**
     * ESRI Shapefile Null Shape shape type.
     */
    SHAPE_NULL: 0,
    /**
     * ESRI Shapefile Point Shape shape type.
     */
    SHAPE_POINT: 1,
    /**
     * ESRI Shapefile PolyLine Shape shape type.
     */
    SHAPE_POLYLINE: 3,
    /**
     * ESRI Shapefile Polygon Shape shape type.
     */
    SHAPE_POLYGON: 5,
    /**
     * ESRI Shapefile Multipoint Shape shape type
     * (currently unsupported).
     */
    SHAPE_MULTIPOINT: 8,
    /**
     * ESRI Shapefile PointZ Shape shape type.
     */
    SHAPE_POINTZ: 11,
    /**
     * ESRI Shapefile PolylineZ Shape shape type
     * (currently unsupported).
     */
    SHAPE_POLYLINEZ: 13,
    /**
     * ESRI Shapefile PolygonZ Shape shape type
     * (currently unsupported).
     */
    SHAPE_POLYGONZ: 15,
    /**
     * ESRI Shapefile MultipointZ Shape shape type
     * (currently unsupported).
     */
    SHAPE_MULTIPOINTZ: 18,
    /**
     * ESRI Shapefile PointM Shape shape type
     */
    SHAPE_POINTM: 21,
    /**
     * ESRI Shapefile PolyLineM Shape shape type
     * (currently unsupported).
     */
    SHAPE_POLYLINEM: 23,
    /**
     * ESRI Shapefile PolygonM Shape shape type
     * (currently unsupported).
     */
    SHAPE_POLYGONM: 25,
    /**
     * ESRI Shapefile MultiPointM Shape shape type
     * (currently unsupported).
     */
    SHAPE_MULTIPOINTM: 28,
    /**
     * ESRI Shapefile MultiPatch Shape shape type
     * (currently unsupported).
     */
    SHAPE_MULTIPATCH: 31

};

