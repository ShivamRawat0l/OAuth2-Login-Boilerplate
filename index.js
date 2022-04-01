import express from 'express'

const app = express();

app.get('/test', (req,res)=>{
  res.send('Test Successful'); 
})

app.post('/login',(req,res)=>{
  res.send("Login Successfull");
})

app.listen(8000)
