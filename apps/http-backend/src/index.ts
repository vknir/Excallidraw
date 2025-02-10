import express from 'express';
import {SigupValidator} from '@repo/validation/validate'
import '@repo/backend-common/config.ts'

const app=express();
const port= 3000;

app.listen(port,()=>{
    console.log(`http-server running on port ${port}`)
})
app.use(express.json())
app.get("/", (req,res)=>{
    res.json("hello")
})

app.post("/signup", async(req, res)=>{

})

app.post("/login", async(req, res)=>{
    
})
