class Solution {
    public int singleNumber(int[] nums) {
        // Write your solution here
        int result = 0;
        
        for (int num : nums) {
            result ^= num; // XOR operation
        }
        
        return result;
        
    }
}
