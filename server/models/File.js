const { Schema, model } = require("mongoose");

const FileSchema = new Schema({
    name: {
        type: String,
        //required: true,
    },
    type: {
        type: String,
    },
    path: {
        type: String,
        //required :true,
    },
    size: {
        type: Number,
        //required :true,
    },
    parent: {
        type: String,
        //required :true,
    },
    transferNum: {
        type: Number,
        // unique: true,
    },
}, { timestamps: true })


const Data = model("File", FileSchema);
module.exports = Data;
