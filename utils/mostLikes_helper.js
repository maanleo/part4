const mostLikesFn = (blogList)=>{
    const authors = [];
    const likes = [];
    blogList.forEach((blog)=>{
        const value = authors.findIndex((element)=>element === blog.author)
        if(value === -1){
            authors.push(blog.author);
            likes.push(blog.likes);
        }
        else{
            likes[value]+=blog.likes;
        }
    })
    const maxIndex = likes.reduce((maxIndex,curr,index,array)=>
        curr > array[maxIndex] ? index : maxIndex
    ,0);
    console.log(likes,maxIndex);
    return {author:authors[maxIndex],likes:likes[maxIndex]}
}

module.exports = {mostLikesFn}