$(document).ready(()=>{
    $.get("/api/posts/" + postId, (results)=>{
        outPutPostsWithReplies(results , $('.postsContainer'));
    }) 
})

