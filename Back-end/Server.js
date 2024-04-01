const express =require('express');
const app = express()

app.get('/swift',(req,res)=>{
    res.send('hi from the swift-pay')
})

app.listen(3000,()=>{
    console.log("connected to the port 3000")
})