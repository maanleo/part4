const getFn = (blog)=>{
    const authors = [];
    const blogCount = [];
    blogList.forEach((blog)=>{
        const value = authors.findIndex((element)=>element === blog.author)
        if(value === -1){
            authors.push(blog.author);
            blogCount.push(1);
        }
        else{
            blogCount[value]+=1;
        }
    })
    const maxIndex = blogCount.reduce((maxIndex,curr,index,array)=>
        curr > array[maxIndex] ? index : maxIndex
    ,0);
    return {author:authors[maxIndex],blogs:blogCount[maxIndex]}
}

module.exports = {getFn}