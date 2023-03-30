const express = require('express');

const app = express();

app.get('/task-1', (req,res) => {
    const number = req.query.number;
    const result = [];

    for(let i=1; i<=number; i++){
        if(i%3 === 0 && i%5 === 0){
            result.push('FizBuz');
        }
        else if(i%3 === 0){
            result.push('Fiz');
        }
        else if(i%5 === 0){
            result.push('Buz');
        }
        else{
            result.push(i);
        }
    }

    res.send(result.join(' '));
});

app.listen(3000, () => {
    console.log('Server listening to port 3000');
});