// Projections using Open Layers
// http://www.openlayers.org/dev/examples/dynamic-text-layer.html

var RenderFlag = {
    UnZoomed: 1,
    Zoomed: 2,
    MarineSymbols: 4,
    LandFeatures: 8,
    Title: 16
};

var renderedLayers = 0;
var canvas = null;
var map;

function log(s) {
  if (window.console && window.console.log) console.log(s);
}

function Map(layers) {
    if (layers === undefined) // browserlink calls this with undefined param, why????
        return;
  map = this;
  this.layers = layers;
  var parent = document.getElementById('map');
  if (!parent.style.position) parent.style.position = 'relative';

  var canvas = document.getElementById('canvas1');
  this.canvas = canvas;
  canvas.style.position = 'absolute';
  canvas.style.left = '0px';
  canvas.style.top = '0px';

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  this.canvas.style.width = window.innerWidth + 'px';
  this.canvas.style.height = window.innerHeight + 'px';

  setUpSymbolImages();

  document.getElementById('msym').onclick = function () { currentRenderFlags ^= RenderFlag.MarineSymbols; map.render(); }
  document.getElementById('lsym').onclick = function () { currentRenderFlags ^= RenderFlag.LandFeatures; map.render(); }
  document.getElementById('title').onclick = function () { currentRenderFlags ^= RenderFlag.Title; map.render(); }


  var rendering = 0;

  var render = function () {
      if (rendering++ !== 0)
          log("Rendering busy");
      else {
          var canvas = document.getElementById('canvas1');
          var ctx = canvas.getContext('2d');
          ctx.fillStyle = "#fadfa8";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          for (var i = 0; i < layers.length; i++) {
              layers[i].render();
          }
      }
      rendering--;
  }

  var resize = function (e) {
      var widthAdj = window.innerWidth/map.canvas.width;
      var heightAdj = window.innerHeight / map.canvas.height;
      //var adj = (widthAdj > heightAdj) ? widthAdj : heightAdj;
      var adj = widthAdj;

      map.canvas.style.width = window.innerWidth + 'px';
      map.canvas.style.height = window.innerHeight + 'px';
      map.canvas.width = window.innerWidth;
      map.canvas.height = window.innerHeight;
      //mainbox.width *= adj;
      //mainbox.height *= adj;
      mainbox.width /= heightAdj;
      mainbox.height /= widthAdj;
      log('widthAdj=' + widthAdj + ', heightAdj=' + heightAdj);
      map.render();
  }

  
  var panBy = function (x, y) {
      if (x != 0 || y != 0) {
          var degreesPerPixel = mainbox.width / window.innerWidth;
          mainbox.x -= x * degreesPerPixel;
          mainbox.y += y * degreesPerPixel;
          checkZoom();
          render();
      }
  }
  
  var zoomBy = function(s,x,y) {
    var degreesPerPixel = mainbox.width / window.innerWidth;
    var boxX = mainbox.x + (x * degreesPerPixel)
    var boxY = mainbox.y + ((window.innerHeight-y) * degreesPerPixel)
    mainbox.x -= boxX;
    mainbox.y -= boxY;
    mainbox.x *= s;
    mainbox.y *= s;
    mainbox.width *= s;
    mainbox.height *= s;
    mainbox.x += boxX;
    mainbox.y += boxY;
    checkZoom();
    render();
  }

  this.render = render;
  this.panBy = panBy;
  this.zoomBy = zoomBy;


  var checkZoom = function () {
      var x = mainbox.x + mainbox.width;
      var y = mainbox.y + mainbox.height;
      if (mainbox.x < zoombox.loX || mainbox.y < zoombox.loY || mainbox.x + mainbox.width > zoombox.hiX || mainbox.y + mainbox.height > zoombox.hiY) {
          currentRenderFlags |= RenderFlag.UnZoomed; currentRenderFlags &= ~RenderFlag.Zoomed;
      } else {
          currentRenderFlags |= RenderFlag.Zoomed; currentRenderFlags &= ~RenderFlag.UnZoomed;
      }
  }
  var mouseDown = function(e) {
    var prevMouse = { x: e.clientX, y: e.clientY };
    var mouseMove = function(e) {
      //panBy(e.clientX - prevMouse.x, e.clientY - prevMouse.y); // done by hammer
      prevMouse.x = e.clientX;
      prevMouse.y = e.clientY;
      e.preventDefault(); // hopefully no selecting
    }
    var mouseUp = function(e) {
      //panBy(e.clientX - prevMouse.x, e.clientY - prevMouse.y); // done by hammer
      document.body.style.cursor = null;
      document.removeEventListener('mousemove', mouseMove, false);
      document.removeEventListener('mouseup', mouseUp, false);
    }
    document.body.style.cursor = 'hand';
    document.addEventListener('mousemove', mouseMove, false);
    document.addEventListener('mouseup', mouseUp, false);
    e.preventDefault(); // hopefully no selecting
 };

  
  //parent.addEventListener('mousedown', mouseDown, false);
  window.addEventListener('resize', resize, false);

  var mouseWheel = function(e) {

    var localX = e.clientX;
    var localY = e.clientY;
  
    // correct for scrolled document
    localX += document.body.scrollLeft + document.documentElement.scrollLeft;
    localY += document.body.scrollTop + document.documentElement.scrollTop;

    // correct for nested offsets in DOM
    for(var node = parent; node; node = node.offsetParent) {
      localX -= node.offsetLeft;
      localY -= node.offsetTop;
    }  
    
    var delta = 0;
    if (e.wheelDelta) {
        delta = e.wheelDelta;
    }
    else if (e.detail) {
        delta = -e.detail;
    }
  
    if (delta > 0) {
      zoomBy(0.9, localX, localY);
    }
    else if (delta < 0) {
      zoomBy(1.1, localX, localY);
    }
    
    // cancel page scroll
    e.preventDefault();
  }

  // Safari
  parent.addEventListener('mousewheel', mouseWheel, false);
  // Firefox
  parent.addEventListener('DOMMouseScroll', mouseWheel, false);

}



hammerIt(document.getElementById('canvas1'));

function hammerIt(elm) {
    hammertime = new Hammer(elm, {});
    hammertime.get('pinch').set({
        enable: true
    });
    hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    var posX = 0,
        posY = 0,
        scale = 3,
        last_scale = 3,
        last_posX = 0,
        last_posY = 0,
        max_pos_x = 0,
        max_pos_y = 0,
        transform = "",
        el = elm;

    var panning = 0;

    hammertime.on('panleft panright panup pandown pinch pinchin pinchout panend pinchend', function (ev) {
        //if (ev.type == "doubletap") {
        //    transform =
        //        "translate3d(0, 0, 0) " +
        //        "scale3d(2, 2, 1) ";
        //    scale = 2;
        //    last_scale = 2;
        //    try {
        //        if (window.getComputedStyle(el, null).getPropertyValue('-webkit-transform').toString() != "matrix(1, 0, 0, 1, 0, 0)") {
        //            transform =
        //                "translate3d(0, 0, 0) " +
        //                "scale3d(1, 1, 1) ";
        //            scale = 1;
        //            last_scale = 1;
        //        }
        //    } catch (err) { }
        //    el.style.webkitTransform = transform;
        //    transform = "";
        //}

        //pan    
       // if (scale != 1) {
       //     posX = last_posX + ev.deltaX;
       //     posY = last_posY + ev.deltaY;
       //     max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2);
       //     max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2);
       //     if (posX > max_pos_x) {
       //         posX = max_pos_x;
       //     }
       //     if (posX < -max_pos_x) {
       //         posX = -max_pos_x;
       //     }
       //     if (posY > max_pos_y) {
       //         posY = max_pos_y;
       //     }
       //     if (posY < -max_pos_y) {
       //         posY = -max_pos_y;
       //     }
       //     last_posX = posX < max_pos_x ? posX : max_pos_x;
       //     last_posY = posY < max_pos_y ? posY : max_pos_y;
       //}

        //if (ev.type == "pinchend") {
            //last_scale = scale;
            //var localX = el.clientX;
            //var localY = el.clientY;

            //// correct for scrolled document
            //localX += document.body.scrollLeft + document.documentElement.scrollLeft;
            //localY += document.body.scrollTop + document.documentElement.scrollTop;

            //// correct for nested offsets in DOM
            //for (var node = parent; node; node = node.offsetParent) {
            //    localX -= node.offsetLeft;
            //    localY -= node.offsetTop;
            //}  
            //if (scale > 0) {
            //    map.zoomBy(0.9, localX, localY);
            //}
            //else if (delta < 0) {
            //    map.zoomBy(1.1, localX, localY);
            //}
        //}

        //panend
        //if (ev.type == "panend") {
        //    map.panBy(posX - last_posX, posY - last_posY);
        //   last_posX = posX < max_pos_x ? posX : max_pos_x;
        //   last_posY = posY < max_pos_y ? posY : max_pos_y;
        //}

        //if (scale != 1) {
        //    transform =
        //        "translate3d(" + posX + "px," + posY + "px, 0) " +
        //        "scale3d(" + scale + ", " + scale + ", 1)";
        //}

        //if (transform) {
        //    el.style.webkitTransform = transform;
        //}
        if (panning++ != 0)
            log("Panning busy");
        else
            switch (ev.type) {
                case "pan": log("pan"); break;
                case "panend": break; //map.panBy(ev.deltaX, ev.deltaY); break;
                case "pinch": scale = Math.max(.999, Math.min(last_scale * ev.scale, 3)); log("pinch=" + scale); break;
                case "pinchin": map.zoomBy(1.2, ev.center.x, ev.center.y); log("pinchin"); break;
                case "pinchout": map.zoomBy(0.8, ev.center.x, ev.center.y); log("pinchout"); break;
                case "pinchend": log("pinch delta x=" + ev.deltaX + ",y=" + ev.deltaY);
                    lastPanY = lastPanX = 0;
                    //if (ev.deltaX < 0 || ev.deltaY < 0 > 0) 
                    //    map.zoomBy(0.9, ev.center.x, ev.center.y);
                    //else 
                    //    map.zoomBy(1.1, ev.center.x, ev.center.y);
                    break;
                default:
                    log(ev.type + ' ' + ev.deltaX + ',' + ev.deltaY);
                    var x = ev.deltaX - lastPanX;
                    var y = ev.deltaY - lastPanY;
                    lastPanX = ev.deltaX;
                    lastPanY = ev.deltaY;
                    if (checkPan(ev.type, x, y))
                        map.panBy(x, y); break;
                }
            panning--;
    });

    var lastPanX=0, lastPanY=0;

    function checkPan(ptype, x, y){
        switch (ptype) {
            case "panleft": if (x <= 0) return true; break;
            case "panright": if (x >= 0) return true; break;
            case "panup": if (y <= 0) return true; break;
            case "pandown": if (y >= 0) return true; break;
        }
        log("panfail");
        return false;
    };
}