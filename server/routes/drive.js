const { Router } = require("express");
const User = require("../models/User");
const isLoggedIn = require("../controllers/isLoggedIn");
const Folder = require("../models/Folder")
const File = require("../models/File")
const multer = require('multer');
const router = Router();
const fs = require('fs');
const path = require('path');

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
    try {
        const folders = await Folder.find({
            createdBy: req.user._id,
            parent: null,
            isFolder: true,
        });

        // Return the list of folders
        res.status(200).json(folders);
    } catch (err) {
        // console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { folderName } = req.body;

        // console.log("user from drivve", req.user);
        // Create a new File object for the folder
        const newFolder = await Folder.create({
            name: folderName,
            isFolder: true,
            parent: null,
            createdBy: req.user._id
        });


        // Return the new folder object as a response
        res.status(200).json(newFolder);
    } catch (err) {
        // console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
})

// /drive/"id"



router.get("/:id", async (req, res) => {
    try {
        const folders = await Folder.find({
            createdBy: req.user._id,
            parent: req.params['id'],
            isFolder: true,
        });
        // const files = await File.find({ parent: req.params['id'] });
        // Return the list of folders
        res.status(200).json(folders);
    } catch (err) {
        // console.log(err);
        res.status(500).json({ error: "Server error" });
    }
})
router.get("/:id/files", async (req, res) => {
    try {
        const file = await File.find({
            parent: req.params['id'],
        });
        // const files = await File.find({ parent: req.params['id'] });
        // Return the list of folders
        res.status(200).json(file);
    } catch (err) {
        // console.log(err);
        res.status(500).json({ error: "Server error" });
    }
})



router.post("/files/:id/commonDBS", upload.single('file'), async (req, res) => {
    const min = 100000; // Minimum value (inclusive)
    const max = 999999; // Maximum value (inclusive)
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    try {
        const fileId = req.params.id;
        var remainingTime = 60000;
        const updatedFile = await File.findByIdAndUpdate(
            fileId,
            { $set: { transferNum: randomNumber } },
            { new: true, upsert: true }
        );

        setTimeout(async () => {
            await File.findOneAndUpdate({ _id: fileId }, { $set: { transferNum: null } });
            // console.log(`TransferNum reset to null for file with ID: ${fileId}`);
        }, remainingTime);

        res.status(200).json({ updatedFile, remainingTime });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

});


router.get("/:id/files/download", async (req, res) => {
    // console.log("hello");
    const { id } = req.params;
    const item = await File.findById(id);
    // console.log(item);
    if (!item) {
        return Error(new Error("No item found"));
    }
    const file = item.path;
    // // console.log(__dirname);
    // // console.log(`../${file}`);
    const filePath = path.join(__dirname, `../${file}`);
    // console.log("filepaath", filePath);
    res.download(filePath);
})

router.delete("/:id/files/delete", async (req, res) => {
    const { id } = req.params;
    try {
        const file = await File.findByIdAndDelete(id);
        res.status(200).json({ message: "file deleted succesfully" })
    } catch (error) {
        res.status(500).json({ message: 'error deleting file' })
    }
})

router.delete("/DeleteFolder/:id", async (req, res) => {
    // console.log("i am inside dbs");
    const { id } = req.params;
    // console.log(id);
    try {
        const file = await Folder.findByIdAndDelete(id);
        // console.log(file);
        res.status(200).json({ message: 'folder deleted succesfully' })
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: 'error deleting folder' })
    }
})


router.patch("/filetransfer/:id", async (req, res) => {
    const { id } = req.params;
    // console.log("hello");
    try {
        // console.log("hi");
        const file = await File.findByIdAndUpdate(id, { transferNum: null });
        res.status(200).json({ message: "success" })
    } catch (error) {
        res.status(500).json({ message: 'error updating file' })
    }
})

router.get("/checktransnum/:id", async (req, res) => {
    try {
        // // console.log("hello");
        const { id } = req.params;
        const checktransnum = await File.findOne({ _id: id }).then(document => {
            if (document) {
                // // console.log("hiii");
                // Document found, access the transfernum field
                const transfernum = document.transferNum;
                // // console.log('Transfer Number:', transfernum);
                // return transfernum;
                res.status(200).json(transfernum);
            } else {
                // console.log('Document not found');
            }
            // // console.log(checktransnum);
        })

    } catch (error) {
        // console.log(error);
        res.status(500).json({ message: 'error ucored' })
    }
})


router.get("/fileTransfer/receiver/:key", async (req, res) => {
    try {
        const { key } = req.params;
        let newFolder;
        // const item = await File.findOne({ transferNum: { $eq: key } });
        // const item = await File.findOne({ transferNum: key });
        const item = await File.findOneAndUpdate({ transferNum: key }, { transferNum: null });
        // console.log("item", item);
        const checkFolder = await Folder.findOne({ name: 'downloads' })
        // console.log("checkFolder", checkFolder);
        if (checkFolder === null) {
            console.log("oy bhaiii");
            newFolder = await Folder.create({
                name: "downloads",
                isFolder: true,
                parent: null,
                createdBy: req.user._id
            });
        }
        // console.log("newfolder", newFolder);
        const file = await File.create({
            name: item.name,
            type: item.type,
            size: item.size,
            path: item.path,
            parent: (checkFolder !== null) ? checkFolder._id : newFolder._id ///here it is 
        });
        if (!item) {
            res.status(404).json({ message: "file not found" });
        }
        else {
            res.status(200).json({ message: "file found", data: item, });
        }
    } catch (error) {
        console.error(error)
    }

})

// router.post("/addedFile", async (req, res) => {
//     try {
//         // console.log("inside addedfile");
//         // const { folderName } = req.body;
//         const folderName = "downloads";
//         // console.log(folderName);
//         // // console.log("user from addedfile", req.user);
//         // Create a new File object for the folder
//         const newFolder = await Folder.create({
//             name: folderName,
//             isFolder: true,
//             parent: null,
//             createdBy: req.user._id
//         });
//         // Return the new folder object as a response
//         res.status(200).json(newFolder);
//     } catch (err) {
//         // console.log(err);
//         res.status(500).json({ error: 'Server error' });
//     }
// })

router.post("/:id", async (req, res) => {
    try {
        const { name } = req.body;
        const newFolder = await Folder.create({
            name,
            isFolder: true,
            parent: req.params['id'],
            createdBy: req.user._id
        });
        res.status(200).json(newFolder);
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: 'Server error' });
    }

})

router.post("/:id/files", upload.single('file'), async (req, res) => {
    try {
        // console.log("filwe", req.file);
        const { originalname, path, mimetype, size } = req.file;

        const file = new File({
            name: originalname,
            type: mimetype,
            size,
            path,
            parent: req.params['id'],
        });

        await file.save();

        res.status(201).json(file);
    } catch (err) {
        // console.error(err);
        res.status(500).json({ message: 'Server error' });
    }

})

module.exports = router;
