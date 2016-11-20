var cors = require('cors');
var express = require('express');
var _ = require('lodash');

var app = express();
app.use(cors());


function dec2hex(d) {
   return ('00' + Number(d).toString(16)).slice(-2);
}

function hsl2rgb(h, s, l) {
   h /= 360;
   s /= 100;
   l /= 100;
   var r, g, b;

   if (s === 0) {
     r = g = b = l; // achromatic
   } else {
     var hue2rgb = function(p, q, t) {
       if (t < 0) t += 1;
       if (t > 1) t -= 1;
       if (t < 1 / 6) return p + (q - p) * 6 * t;
       if (t < 1 / 2) return q;
       if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
       return p;
     };

     var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
     var p = 2 * l - q;
     r = hue2rgb(p, q, h + 1 / 3);
     g = hue2rgb(p, q, h);
     b = hue2rgb(p, q, h - 1 / 3);
   }
   return _.map([r, g, b], (c) => (dec2hex(Math.round(c * 255)))).join('');
}

app.get('/task2d', (req, res) => {
   let result = 'Invalid color';

   if(req.query.color)
   {
      let color = req.query.color.trim().toLowerCase();
      let hexColor, rgbColor, hslColor;

      // #000000
      if(hexColor = color.match(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/)) 
      {
         result = '#' + (hexColor[1].length == 3 ? _.map(hexColor[1], (s) => s + s).join('') : hexColor[1]);
      }
      // rgb(0, 0, 0)
      else if (rgbColor = color.replace(/\s/g, '').match(/^rgb\((\d+),(\d+),(\d+)\)$/i)) 
      {
         rgbColor = _.tail(rgbColor);
         if(_.every(rgbColor, (n) => n <= 255))
         {
            result = '#' + (_.map(rgbColor, (v) => dec2hex(v)).join(''));
         }
      }
      // hsl(359, 100%, 100%)
      else if (hslColor = color.replace(/(\s|%20)/g, '').match(/^hsl\((\d+\.?\d*),(\d+)%,(\d+)%\)$/i))
      {
         hslColor = _.tail(hslColor);
         if((hslColor[0] <= 359) && _.every(_.tail(hslColor), (p) => p <= 100))
         {
            result = '#' + hsl2rgb(hslColor[0], hslColor[1], hslColor[2]);
         }
      }
   }
   res.send(result);
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
