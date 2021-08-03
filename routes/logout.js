const express = require('express');
const router = express.Router();

router.get('/logout/complete', (req, res) => {
    res.clearCookie("jwttoken");
    res.redirect('/');
})

module.exports = router;