const { Schema, model } = require("mongoose");

const FolderSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    isFolder: {
        type: Boolean,
        required: true,
    },
    parent: {
        type: String,
        //required :true,
    },
    createdBy: {
        type: String,
        required: true,
    },
}, { timestamps: true })


const Folder = model("Folder", FolderSchema);
module.exports = Folder;
