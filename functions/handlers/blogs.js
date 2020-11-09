const { db, admin } = require("../util/admin");

exports.getAllBlogs = (req, res) => {
    db.collection('blogs')
    .orderBy("date", "desc")
    .get()
    .then((data) => {
        let events = [];
        data.forEach((doc) => {
            events.push({
                blogId: doc.id,
                artist: doc.data().artist,
                author: doc.data().author,
                instagramUrl: doc.data().instagramUrl,
                spotifyUrl: doc.data().spotifyUrl,
                body: doc.data().body,
            });
        });
        return res.json(events);
    })
    .catch((err) => console.error(err));
};

exports.createBlogEntry = (req, res) => {
    let createImageUrl = createImage(req);

    const newBlog = {
        title: req.body.title,
        artist: req.body.artist,
        date: db.Timestamp.fromDate(req.body.date),
        author: req.body.author,
        body: req.body.body,
        instagramUrl: req.body.instagramUrl,
        spotifyUrl: req.body.spotifyUrl,
        imageUrl: createImageUrl
    };

    db
        .collection('blogs')
        .add(newEvent)
        .then(doc => {
            res.json({message: `document ${doc.id} created successfully`});
        })
        .catch((err) => {
            res.status(500).json({error: 'Something went wrong'});
            console.error(err);
    });
};


const createImage = (req) => {
    const busboy = new BusBoy({ headers: req.headers });

    let imageUrl;
    let imageFileName;
    let imageToBeUploaded = {};
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
        return res.status(400).json({ error: `Wrong file type submitted` });
      }
      // my.image.png
      const imageExtension = filename.split(".")[filename.split(".").length - 1];
      // 1234891279234.png
      imageFileName = `${Math.round(
        Math.random() * 10000000000
      )}.${imageExtension}`;
      const filepath = path.join(os.tmpdir(), imageFileName);
      imageToBeUploaded = { filepath, mimetype };
      file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on("finish", () => {
      admin
        .storage()
        .bucket()
        .upload(imageToBeUploaded.filepath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToBeUploaded.mimetype,
            },
          },
        })
        .then(() => {
            imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        });
    });
    busboy.end(req.rawBody);
    return imageUrl;
}