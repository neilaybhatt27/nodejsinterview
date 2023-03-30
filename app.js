const express = require('express');
const https = require('https');
const mongoose = require('mongoose');

const app = express();
const cache = {}

//Task-1
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

//Task-2
// Get all users
https.get('https://reqres.in/api/users', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const users = JSON.parse(data).data;
    // Find first user whose name starts with 'a'
    const user = users.find((u) => u.first_name.toLowerCase().startsWith('a'));
    if (user) {
      // Update job title of the user found
      const postData = JSON.stringify({
        job: 'boss'
      });
      const options = {
        hostname: 'reqres.in',
        path: `/api/users/${user.id}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': postData.length
        }
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          console.log(`Job title of user ${user.id} updated successfully!`);
          // Delete all other users in parallel
          const promises = users.filter((u) => u.id !== user.id).map((u) => {
            return new Promise((resolve, reject) => {
              const options = {
                hostname: 'reqres.in',
                path: `/api/users/${u.id}`,
                method: 'DELETE'
              };
              const req = https.request(options, (res) => {
                if (res.statusCode === 204) {
                  console.log(`User ${u.id} deleted successfully!`);
                  resolve();
                } else {
                  reject(`Failed to delete user ${u.id}`);
                }
              });
              req.on('error', (error) => {
                reject(`Failed to delete user ${u.id}: ${error.message}`);
              });
              req.end();
            });
          });
          Promise.all(promises)
            .then(() => console.log('All other users deleted successfully!'))
            .catch((error) => console.error(error));
        });
      });
      req.on('error', (error) => {
        console.error(`Failed to update job title of user ${user.id}: ${error.message}`);
      });
      req.write(postData);
      req.end();
    } else {
      console.log('No user found whose name starts with "a"');
    }
  });
}).on('error', (error) => {
  console.error(`Failed to get users: ${error.message}`);
});

//Task-3
//Connect to MongoDB
mongoose.connect('mongodb+srv://rootUser:rootUser@nodejsinteriew.elagaxf.mongodb.net/?retryWrites=true&w=majority');

//Create model
const User = mongoose.model('User', {
    name: String,
    email: String,
});

app.use(express.json());

//Create user
app.post('/users', async (req,res) => {
    const {name, email} = req.body;
    const user = new User({
        name,
        email,
    });

    try{
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

//Get all users
app.get('/users', async (req,res) => {
    try{
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

//Get user by id
app.get('/users/:id', async (req,res) => {
    const {id} = req.params;
    try{
        const userbyid = await User.findById(id);
        if(!userbyid) {
            res.status(404).send();
        } 
        else{
            res.send(userbyid);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(3000, () => {
    console.log('Server listening to port 3000');
});