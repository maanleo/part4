const {test,describe} = require('node:test');
const assert = require('node:assert')
const likesHelper = require('../utils/totalLikes_helper');

describe("Total Likes",()=>{
    const listWithOneBlog = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
          likes: 5,
          __v: 0
        }
      ]
    test('when list has only one blog, equals the likes of that',()=>{
        const helperLikes = likesHelper.totalLikesFn(listWithOneBlog);
        assert.strictEqual(helperLikes,5)
    })
})