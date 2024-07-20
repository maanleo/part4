const totalLikesFn = (blogs)=>{
    return blogs.reduce((totalLikes,current)=>
            totalLikes +=current.likes
        ,0)
}

module.exports = {totalLikesFn}