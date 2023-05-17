const express=require('express');
require('dotenv').config();
const authRouter=require('./routes/auth');
const userRouter=require('./routes/user');
const categoryRouter=require('./routes/category');
const productRouter=require('./routes/product');
const cors=require('cors');

const mongoose=require('mongoose');

// APP
const app=express();

// MIDDLEWARES
app.use(express.json());
app.use(cors());

// ROUTES Middlewares
app.use('/api',authRouter);
app.use('/api/users',userRouter);
app.use('/api/category',categoryRouter);
app.use('/api/products',productRouter);

mongoose.connect(process.env.DB,{
    useNewUrlParser:true,
})
.then(()=>{
    console.log(`connected to ${process.env.DB} `)
})
const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('server is listening on port 8000')
});