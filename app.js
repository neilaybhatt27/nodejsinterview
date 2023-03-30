const express = require('express');

const app = express();
const cache = {}

app.get('/task-1', (req,res) => {
    const number = req.query.number;

    if(cache[number]){
        res.send(cache[number]);
    }
    else{
        const arr = [];
        for(let i=1; i<=number; i++){
            if(i%3 === 0 && i%5 === 0){
                arr.push('FizBuz');
            }
            else if(i%3 === 0){
                arr.push('Fiz');
            }
            else if(i%5 === 0){
                arr.push('Buz');
            }
            else{
                arr.push(i);
            }
        }
        const msg = arr.join(' ');
        cache[number] = msg;
        res.send(msg);

    }
});

app.listen(3000, () => {
    console.log('Server listening to port 3000');
});