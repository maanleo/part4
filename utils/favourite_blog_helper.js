const favouriteFn = (blogs)=>{
    let mostLikes=0
    let indexofMostLikes=0
    blogs.forEach((blog,index)=>{
        if(blog.likes > mostLikes){
            mostLikes=blog.likes;
            indexofMostLikes=index;
        }
    })
    return blogs[indexofMostLikes]
}

module.exports = {favouriteFn}