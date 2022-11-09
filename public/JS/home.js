$(document).ready(()=>{
    $.get("/api/posts" , (results)=>{
        outPutPosts(results , $('.postsContainer'));
    }) 
})

