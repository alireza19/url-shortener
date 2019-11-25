const express = require("express");
const router = express.Router();

const Url = require("../models/Url");

// @route GET /:code
// @desc Redirect to long or original URL
router.get(":/code", async (req, res) => {
  try {
    // check to see if there is a URL with that :/code
    const url = await Url.findOne({ urlCode: req.params.code });
    if (url) {
      // if there is then redirect to the long URL
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json("No url found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});
module.exports = router;
