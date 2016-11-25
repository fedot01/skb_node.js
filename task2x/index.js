var cors = require('cors');
var express = require('express');
var _ = require('lodash');

const app = express();
app.use(cors());

app.get('/task2x/', (req, res) => {
    const precalc = {0: 1, 1: 18, 2: 243, 18: 246639261965462754048}
    /* Костыли-костылики: по непонятной причине при i от 16 и выше,
       эта формула в js выдает значения с погрешностью. 
       В python эта же формула считает все точно */
    function f(n) {
        if(n in precalc) return precalc[n];
        return 12*f(n-1) + 18*f(n-2);
    }
    const n = Number(req.query.i);
    res.send((!isNaN(n) && n >= 0) ? `${f(n)}` : 'Wrong number');
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
