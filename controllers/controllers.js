const establishConnection = require('../utils/establishConnection')
const axios = require('axios')

const createPost = async (req,res) => {
    const reqLength = Object.keys(req.body).length
    const {title, description,userID} = req.body
    let postPayload
    
    // request validation, if either title,description, or username is not included in the request parameters,
    // the request will fail.
    if(reqLength != 3 || !title || !description || !userID)
        return res.status(400).json({message:"Bad request"})
    
    let connection = await establishConnection(true)
    try
    {
        postPayload = await connection.execute("INSERT INTO Post VALUES (0,?,?,NOW(),NOW())",[title,description])
        postID = postPayload[0]["insertId"]
        // axios call to interaction (creating new data for interaction)
        await axios({
            method: 'post',
            data:{
                userID:userID,
                postID:postID
            },
            url: 'http://localhost:3005/createPostInteraction/'
        })
    }
    catch(err)
    {
        await connection.destroy()
        return res.status(400).json({returnData:null,message:`${err}`})
    }
    await connection.destroy()
    return res.status(200).json({returnData:postPayload,message:"Successfully created post!"}) 
}

const getPostsByPage = async (req,res) => {
    const reqLength = Object.keys(req.params).length
    const {pageNumber,limitPerPage,query} = req.params
    const offset = String((pageNumber - 1) * limitPerPage)
    // request validation, if either username or password is not included in the request parameters,
    // the request will fail.
    if( (reqLength != 2 && reqLength != 3) || !pageNumber || !limitPerPage)
        return res.status(400).json({
            message:"Bad request"
        })
    
    // use this when using the like keyword
    const searchQuery = query? `%${query}%`:`%`

    // use this instead when using the regex equivalent
    // const searchQuery = query? `(\s){0,}${query}(\s){0,}`:`.*`
    
    let connection = await establishConnection(true)
    try
    {
        //query that uses the like keyword
        postArr = await connection.execute("SELECT * FROM InteractionService.interaction LEFT JOIN PostService.post ON InteractionService.interaction.postID = PostService.post.postID WHERE PostService.post.title LIKE ? AND InteractionService.interaction.commentID IS NULL AND InteractionService.interaction.parentID IS NULL ORDER BY InteractionService.Interaction.postID ASC LIMIT ? OFFSET ?",[searchQuery,limitPerPage,offset])
        
        // query that uses regex
        //postArr = await connection.execute("SELECT * FROM InteractionService.interaction LEFT JOIN PostService.post ON InteractionService.interaction.postID = PostService.post.postID WHERE PostService.post.title REGEXP ? AND InteractionService.interaction.commentID IS NULL AND InteractionService.interaction.parentID IS NULL ORDER BY InteractionService.Interaction.postID ASC LIMIT ? OFFSET ?",[searchQuery,limitPerPage,offset])
    }   
    catch(err)
    {
        await connection.destroy()
        return res.status(400).json({returnData:null,message:`${err}`})
    }
    await connection.destroy()

    // returns either true or false depending if the credentials matched with the database
    if (postArr)
        res.status(200).json({returnData:postArr[0]})
    else
        res.status(200).json({returnData:false})
}


const getHotPostsByPage = async (req,res) => {
    const reqLength = Object.keys(req.params).length
    const {pageNumber,limitPerPage,query} = req.params
    const offset = String((pageNumber - 1) * limitPerPage)
    // request validation, if either username or password is not included in the request parameters,
    // the request will fail.
    if( (reqLength != 2 && reqLength != 3) || !pageNumber || !limitPerPage)
        return res.status(400).json({
            message:"Bad request"
        })
    
    // use this when using the like keyword
    const searchQuery = query? `%${query}%`:`%`

    // use this instead when using the regex equivalent
    // const searchQuery = query? `(\s){0,}${query}(\s){0,}`:`.*`
    
    let connection = await establishConnection(true)
    try
    {
        //query that uses the like keyword
        postArr = await connection.execute("SELECT * FROM InteractionService.vote RIGHT JOIN InteractionService.interaction ON InteractionService.vote.interactionID = InteractionService.interaction.interactionID LEFT JOIN PostService.post ON InteractionService.interaction.postID = PostService.post.postID WHERE PostService.post.title LIKE ? AND InteractionService.interaction.commentID IS NULL AND InteractionService.interaction.parentID IS NULL GROUP BY InteractionService.vote.voteID ORDER BY (COUNT(CASE WHEN InteractionService.vote.vote = 1 THEN 1 ELSE NULL END) - COUNT(CASE WHEN InteractionService.vote.vote = 0 THEN 1 ELSE NULL END)) / TIMESTAMPDIFF(MINUTE,PostService.post.createdAt,NOW()) DESC LIMIT ? OFFSET ?",[searchQuery,limitPerPage,offset])
        
    }   
    catch(err)
    {
        await connection.destroy()
        return res.status(400).json({returnData:null,message:`${err}`})
    }
    await connection.destroy()

    // returns either true or false depending if the credentials matched with the database
    if (postArr)
        res.status(200).json({returnData:postArr[0]})
    else
        res.status(200).json({returnData:false})
}


const getNewPostsByPage = async (req,res) => {
    const reqLength = Object.keys(req.params).length
    const {pageNumber,limitPerPage,query} = req.params
    const offset = String((pageNumber - 1) * limitPerPage)
    // request validation, if either username or password is not included in the request parameters,
    // the request will fail.
    if( (reqLength != 2 && reqLength != 3) || !pageNumber || !limitPerPage)
        return res.status(400).json({
            message:"Bad request"
        })
    
    // use this when using the like keyword
    const searchQuery = query? `%${query}%`:`%`

    // use this instead when using the regex equivalent
    // const searchQuery = query? `(\s){0,}${query}(\s){0,}`:`.*`
    
    let connection = await establishConnection(true)
    try
    {
        //query that uses the like keyword
        postArr = await connection.execute("SELECT * FROM InteractionService.interaction LEFT JOIN PostService.post ON InteractionService.interaction.postID = PostService.post.postID WHERE PostService.post.title LIKE ? AND InteractionService.interaction.commentID IS NULL AND InteractionService.interaction.parentID IS NULL GROUP BY InteractionService.interaction.interactionID ORDER BY PostService.post.createdAt DESC LIMIT ? OFFSET ?",[searchQuery,limitPerPage,offset])
        
    }   
    catch(err)
    {
        await connection.destroy()
        return res.status(400).json({returnData:null,message:`${err}`})
    }
    await connection.destroy()

    // returns either true or false depending if the credentials matched with the database
    if (postArr)
        res.status(200).json({returnData:postArr[0]})
    else
        res.status(200).json({returnData:false})
}


const getTopPostsByPage = async (req,res) => {
    const reqLength = Object.keys(req.params).length
    const {pageNumber,limitPerPage,query} = req.params
    const offset = String((pageNumber - 1) * limitPerPage)
    // request validation, if either username or password is not included in the request parameters,
    // the request will fail.
    if( (reqLength != 2 && reqLength != 3) || !pageNumber || !limitPerPage)
        return res.status(400).json({
            message:"Bad request"
        })
    
    // use this when using the like keyword
    const searchQuery = query? `%${query}%`:`%`

    // use this instead when using the regex equivalent
    // const searchQuery = query? `(\s){0,}${query}(\s){0,}`:`.*`
    
    let connection = await establishConnection(true)
    try
    {
        //query that uses the like keyword
        postArr = await connection.execute("SELECT * FROM InteractionService.vote RIGHT JOIN InteractionService.interaction ON InteractionService.vote.interactionID = InteractionService.interaction.interactionID LEFT JOIN PostService.post ON InteractionService.interaction.postID = PostService.post.postID WHERE PostService.post.title LIKE ? AND InteractionService.interaction.commentID IS NULL AND InteractionService.interaction.parentID IS NULL GROUP BY InteractionService.vote.voteID ORDER BY COUNT(CASE WHEN InteractionService.vote.vote = 1 THEN 1 ELSE NULL END) - COUNT(CASE WHEN InteractionService.vote.vote = 0 THEN 1 ELSE NULL END) DESC LIMIT ? OFFSET ?",[searchQuery,limitPerPage,offset])
        
    }   
    catch(err)
    {
        await connection.destroy()
        return res.status(400).json({returnData:null,message:`${err}`})
    }
    await connection.destroy()

    // returns either true or false depending if the credentials matched with the database
    if (postArr)
        res.status(200).json({returnData:postArr[0]})
    else
        res.status(200).json({returnData:false})
}



const getPostOne = async (req,res) => {
    const reqLength = Object.keys(req.params).length
    const {postID} = req.params
    // request validation, if postID is not included in the request parameters,
    // the request will fail.
    if(reqLength != 1 || !postID)
        return res.status(400).json({
            message:"Bad request"
        })
    
    let connection = await establishConnection(true)
    
    try
    {
        postArr = await connection.execute("SELECT * FROM PostService.post WHERE PostService.post.postID = ? LIMIT 1",[postID])
    }   
    catch(err)
    {
        await connection.destroy()
        return res.status(400).json({returnData:null,message:`${err}`})
    }
    await connection.destroy()

    // returns either true or false depending if the credentials matched with the database
    if (postArr)
        res.status(200).json({returnData:postArr[0]})
    else
        res.status(200).json({returnData:false})
}




module.exports = {createPost,getPostsByPage,getHotPostsByPage,getNewPostsByPage,getTopPostsByPage,getPostOne}