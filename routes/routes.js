const {createComment, getCommentsByPost} = require('../controllers/controllers')
const {Authorize} = require('../middlewares')
const express = require('express');

// initialize router
const router = express.Router()


router.post('/createComment',createComment)

router.get('/getPostsByPage/:pageNumber/:limitPerPage/:query',getCommentsByPost)


module.exports = router; 