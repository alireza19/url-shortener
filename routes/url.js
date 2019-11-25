const express = require("express");
const router = express.Router();
const validUrl = require("valid-url");
const shortid = require("shortid");
// need base URL
const config = require("config");

const Url = require("../models/Url");

// @route POST /api/url/shorten
// @desc create short url
// post request
router.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;
  // base url on port 5000
  const baseUrl = config.get("baseUrl");
  // make sure this is a valid URL
  if (validUrl.isUri()) {
    return res.status(400).json("Invalid base url");
  }
  // create URL code
  const urlCode = shortid.generate();
  // check long URL from client (above)
  if (validUrl.isUri(longUrl)) {
    try {
      // check if url is already in database
      let url = await Url.findOne({ longUrl });
      // if a url is found
      if (url) {
        // contains all the database fields
        res.json(url);
      } else {
        // construct our short URL - local host 5000/somerandomcode
        const shortUrl = baseUrl + "/" + urlCode;

        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date()
        });
        // save the instance of the new URL which returns a promise
        await url.save();
      }
    } catch (error) {
      // anything goes wrong, likely a server error
      console.error(error);
      // response from server
      res.status(500).json("Server error");
    }
  } else {
    res.status(401).json("Invalid long url");
  }
});

module.exports = router;
