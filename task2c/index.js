import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/task2c', (req, res) => {
    var result = 'Invalid username';
    
    if (req.query.username)
    {
        var matches = req.query.username.match(/(?:(?:https?:)?(?:\/\/)?.*?(?:\/))?@?([^\?\s\/]+)/);
        !matches[1] || (result = '@' + matches[1]);
    }
    res.send(result);
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
