const {createComment, getCommentsByPost, getAnswersByUsername} = require('../controllers/controllers')
const {Authorize} = require('../middlewares')
const express = require('express');

// initialize router
const router = express.Router()


router.post('/createComment',createComment)

router.get('/getPostsByPage/:pageNumber/:limitPerPage/:query',getCommentsByPost)

router.get('/getAnswersByUsername/:userID',getAnswersByUsername)

module.exports = router; 