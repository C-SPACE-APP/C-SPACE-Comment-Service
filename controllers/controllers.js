const establishConnection = require('../utils/establishConnection')
const axios = require('axios')

const createComment = async (req,res) => {
    const reqLength = Object.keys(req.body).length
    const {comment,postID,userID,isReply,parentID} = req.body
    let postPayload
    
    // request validation, if either title,description, or username is not included in the request parameters,
    // the request will fail.
    if( (reqLength != 4 && reqLength != 5) || !comment || !postID || !userID || isReply === null)
        return res.status(400).json({message:"Bad request"})

    if(reqLength == 5 && !parentID && isReply)
        return res.status(400).json({message:"parentID does not exist"})

    if(isReply)
        IDOfCommentToReply = parentID
    else
        IDOfCommentToReply = null

    let connection = await establishConnection(true)
    try
    {
        commentPayload = await connection.execute("INSERT INTO Comment VALUES (0,?,NOW(),NOW())",[comment])
        commentID = commentPayload[0]["insertId"]
        // axios call to interaction (creating new data for interaction)
        await axios({ 
            method: 'post',
            data:{
                userID:userID,
                postID:postID,
                commentID:commentID,
                parentID:IDOfCommentToReply,
            },
            url: 'http://localhost:3005/createCommentInteraction/'
        })
    }
    catch(err)
    {
        await connection.destroy()
        return res.status(400).json({returnData:null,message:`${err}`})
    }
    await connection.destroy()
    return res.status(200).json({returnData:postPayload,message:"Successfully created comment!"}) 
}


const getCommentsByPost = async (req,res) => {
    const reqLength = Object.keys(req.params).length
    const {postID} = req.params
    let commentArr
    // request validation, if either username or password is not included in the request parameters,
    // the request will fail.
    if( reqLength != 1 || !postID)
        return res.status(400).json({
            message:"Bad request"
        })
    
    
    let connection = await establishConnection(true)
    try
    {
        //query that uses the like keyword
        commentArr = await connection.execute("SELECT * FROM InteractionService.interaction JOIN CommentService.\`comment\` ON InteractionService.interaction.commentID = CommentService.\`comment\`.commentID WHERE InteractionService.interaction.commentID IS NOT NULL AND InteractionService.interaction.postID = ?",[postID])   
    }
    catch(err)
    {
        await connection.destroy()
        return res.status(400).json({returnData:null,message:`${err}`})
    }
    await connection.destroy()

    // returns either true or false depending if the credentials matched with the database
    if (commentArr)
        res.status(200).json({returnData:commentArr})
    else
        res.status(200).json({returnData:false})
}



module.exports = {createComment,getCommentsByPost}