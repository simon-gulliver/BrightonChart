var RenderFlag = {
    UnZoomed: 1,
    Zoomed: 2,
    MarineSymbols: 4,
    LandFeatures: 8,
    Title: 16
};

function Layer(name, renderflags, style) {

   this.shpName = name;
   this.style = style;
   this.renderflags = renderflags;

  var theLayer = this;
    
  this.render = function () {
      //debugger;

      // it's a little bit "this"-ish... how to put all these member vars into scope?
      if (this.shpFile && (currentRenderFlags & this.renderflags) === this.renderflags) {
          var degreesPerPixel = Math.min(map.canvas.width / mainbox.width, map.canvas.height / mainbox.height);
          var ctx = map.canvas.getContext('2d');

          if (this.shpFile.header.shapeType === ShpType.SHAPE_POLYGON || this.shpFile.header.shapeType === ShpType.SHAPE_POLYLINE) {
              renderPolygons(this, ctx, degreesPerPixel);
          }
          else if (this.shpFile.header.shapeType === ShpType.SHAPE_POINT) {
              renderPoints(this, ctx, degreesPerPixel);
          }
      }
  };

 var onShpFail = function() { 
    alert('failed to load ' + theLayer.shpName);
  };
 
 var onShpComplete = function (oHTTP) {
     var binFile = oHTTP.binaryResponse;
     log('got data for ' + theLayer.shpName + ', parsing shapefile');
     theLayer.shpFile = new ShpFile(binFile, theLayer.shpName);
     addShapefileToStorage(theLayer.shpName,theLayer.shpFile);
     if (++renderedLayers === map.layers.length) {
         console.log("READ LAYERS INTO DATABASE");
         map.render();
     }
     //theLayer.render();
 };

 
  this.load = function() {
    this.shpLoader = new BinaryAjax("data/" + this.shpName + '.bmp', onShpComplete, onShpFail);
  }
};
//////////////////////////////////////////////////////////////////////////////////////////////////
function renderPoints(me, ctx, sc) {

  //log('rendering points');

  //var t1 = new Date().getTime();
  //log('starting rendering...');


  if (me.style.fillStyle) ctx.fillStyle = me.style.fillStyle;
  if (me.style.strokeStyle) ctx.strokeStyle = me.style.strokeStyle;
  if (me.style.lineWidth) ctx.lineWidth = me.style.lineWidth;

  // TODO: style attributes for point type (circle, square) and size/radius
  for (var i = 0; i < me.shpFile.records.length; i++) {
      var record = me.shpFile.records[i];
      //var x = -1.5 + (((record.x * me.shpFile.header.widthAdj)) * sc);
      //var y = -1.5 + map.canvas.height - ((record.y * me.shpFile.header.heightAdj)) * sc;
      var x = -1.5 + ((unscaleX(me, record) - mainbox.x) * sc);
      var y = -1.5 + map.canvas.height - (unscaleY(me, record) - mainbox.y) * sc;
      //if (x >= 0 && y >= 0 && x < map.canvas.width && y < map.canvas.height) {
          renderPointsCallback(me, ctx, x, y, i);
      //   }
    }

    /*
  if ((me.style.textFill || me.style.textStroke) && me.style.textProp) {
  
      if (!me.style.helper) {
          me.style.helper = document.createElement('canvas');
          me.style.helper.width = map.canvas.width;
          me.style.helper.height = map.canvas.height;
      // TODO: fix for IE?
    }

      var helper = me.style.helper.getContext('2d');
      me.helper.clearRect(0, 0, me.style.helper.width, me.style.helper.height);
      me.helper.fillStyle = 'black';
    
    //var helper = ctx;

      if (me.style.font) ctx.font = me.style.font;
      if (me.style.textFill) ctx.fillStyle = me.style.textFill;
      if (me.style.textStroke) {
          ctx.strokeStyle = me.style.textStroke;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = me.style.textHalo || 1;
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    for (var i = 0; i < me.shpFile.records.length; i++) {
        if (data[i] && me.dbfFiles.records[i].values && me.dbfFiles.records[i].values[style.textProp]) {
            var record = me.shpFile.records[i];
        if (record.shapeType === ShpType.SHAPE_POINT) {
          var shp = record.shape;
          var text = trim(data[i].values[style.textProp]);
          var tx = Math.round(3 + (shp.x - mainbox.x) * sc);
          var ty = Math.round(map.canvas.height - (shp.y - mainbox.y) * sc);
          var tw = Math.round(ctx.measureText(text).width);
          var th = 12;

          if (tx < 0 || tx + tw >= map.canvas.width || ty - th / 2 < 0 || ty + th / 2 >= map.canvas.height) continue;
          
          var img = helper.getImageData(tx+tw/2,ty,1,1);
          if (img.data[3]) continue;
          var img = helper.getImageData(tx,ty-th/2,1,1);
          if (img.data[3]) continue;
          img = helper.getImageData(tx+tw,ty-th/2,1,1);
          if (img.data[3]) continue;
          img = helper.getImageData(tx+tw,ty+th/2,1,1);
          if (img.data[3]) continue;
          img = helper.getImageData(tx,ty+th/2,1,1);
          if (img.data[3]) continue;
          
          helper.fillRect(tx, ty-th/2, tw, th);
          
          if (style.textStroke) ctx.strokeText(text, tx, ty);
          if (style.textFill) ctx.fillText(text, tx, ty);
        }
      }
      else {
            log(me.dbfFile.records[i].values);
      }
    }
  }
  */
  t2 = new Date().getTime();
  //log('done rendering in ' + (t2 - t1) + ' ms');
}

// from http://blog.stevenlevithan.com/archives/faster-trim-javascript
function trim(str) {
  var str = str.replace(/^\s\s*/, ''),
    ws = /\s/,
    i = str.length;
  while (ws.test(str.charAt(--i)));
  return str.slice(0, i + 1);
}
////////////////////////////////////////////////////////////////////////////////////
function renderPolygons(me, ctx, sc) {

  //log('rendering polygons');

  if (me.style) {
    for (var p in me.style) {
      ctx[p] = me.style[p];
    }
  }

  var totalledPartsCount = 0;
  var totalledPointsCount = 0;

  for (var i = 0; i < me.shpFile.header.recordCount; ) {
      var partsCount = me.shpFile.records[i++];
      var label = renderPolygonCallback(me, ctx, i);

      ctx.beginPath();
      for (var j = 0; j < partsCount; j++) {
          if (totalledPartsCount > me.shpFile.parts.length)
          { alert('format');i = me.shpFile.header.recordCount; break; }
          var pointsCount = me.shpFile.parts[totalledPartsCount++];

          if (totalledPointsCount > me.shpFile.points.length)
          { alert('format');i = me.shpFile.header.recordCount; break; }

          var point = me.shpFile.points[totalledPointsCount++];
          if (point === null)
              break;

          var startX = unscaleX(me, point);
          var startY = unscaleY(me, point);
          if (label !== null) {
              if (label === undefined)
                  label = 0;
              if (ctx.textStyle)
                  ctx.fillStyle = ctx.textStyle;
            //context.font = 'italic 30px sans-serif';
            ctx.textBaseline = 'top';
            ctx.fillText(label, (startX - mainbox.x) * sc, map.canvas.height - ((startY - mainbox.y) * sc));
          }

          if (ctx.strokeStyle) {
              ctx.moveTo((startX - mainbox.x) * sc, map.canvas.height - ((startY - mainbox.y) * sc));
              for (var k = 1; k < pointsCount; k++) {
                  if (totalledPointsCount > me.shpFile.points.length)
                      break;
                  var point = me.shpFile.points[totalledPointsCount++];
                  if (point === null)
                      break;

                  var x = unscaleX(me, point);
                  var y = unscaleY(me, point);

                  ctx.lineTo((x - mainbox.x) * sc, map.canvas.height - (y - mainbox.y) * sc);
              }
          }
      }

      if (me.style.fillStyle) { // strictly speaking only POLYGON(5)
            ctx.fill();
      }
      if (me.style.strokeStyle) {
            ctx.stroke();
      }
  }
}

var mindiff = 0, maxdiff = 0;


// shapefile unscale
function unscaleX(me, point) {
    var x = (point.x / me.shpFile.header.widthAdj) + me.shpFile.header.boundsXY.x;
    return x;
}

function unscaleY(me, point) {
    var y = (point.y / me.shpFile.header.heightAdj) + me.shpFile.header.boundsXY.y;
    return y;
}

function scale(a, b)
{
    return a - b;
}

