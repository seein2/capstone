const express = require('express');

const diaryRouter = require('./routes/diary');

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(express.json());

app.use('/diary', diaryRouter);

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기중');
});