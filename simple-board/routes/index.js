const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res.redirect('/posts');

//   res.render('index');
});

module.exports = router;