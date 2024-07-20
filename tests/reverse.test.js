const { test } = require('node:test')
const assert = require('node:assert')
const reverse = require('../utils/for_testing').reverse


test('reverse_of_a',()=>{
    assert.strictEqual(reverse('bilal'),'lalib')
})