const mongoose = require ('mongoose');
const initData=require("./data.js");
const Listing = require('../models/listing.js');

//Mongodb Setup
main().
    then(()=>{
    console.log("succesful connection of init");
    }).catch((err)=>{
    console.log(err);
    });

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

const initDB = async ()=>{
    await Listing.deleteMany({});
   initData.data = initData.data.map((obj)=>({
        ...obj,
        owner:"66c30337a0b4d895a610741a",
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
    const list = await Listing.find({});
    // console.log(list);
};


initDB();
