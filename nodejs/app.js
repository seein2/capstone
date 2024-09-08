const express = require('express');

const predictRouter = require('./routes/predictRouter');

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(express.json());

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기중');
});