/**
 * @param {number[]} nums
 * @return {number}
 */
function singleNumber(nums) {
    // Write your solution here
    let result = 0;
    for (let num of nums) {
        result ^= num; // XOR operation
    }
    return result;
}
