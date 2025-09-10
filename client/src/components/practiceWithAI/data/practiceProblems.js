const problems = {
  arrays: {
    beginner: [
      {
        id: "array_sum",
        title: "Array Sum",
        description: "Write a function that calculates the sum of all elements in an array.",
        starterCode: "function sumArray(arr) {\n  // Your code here\n}",
        testCases: [
          {
            input: [[1, 2, 3, 4, 5]],
            expectedOutput: 15,
            explanation: "1 + 2 + 3 + 4 + 5 = 15"
          },
          {
            input: [[-1, 0, 1]],
            expectedOutput: 0,
            explanation: "-1 + 0 + 1 = 0"
          }
        ],
        constraints: [
          "Array length will be between 1 and 1000",
          "Array elements will be integers between -1000 and 1000"
        ],
        hints: [
          "Use a loop to iterate through the array",
          "Keep track of the running sum in a variable"
        ]
      },
      {
        id: "two_sum",
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        starterCode: "function twoSum(nums, target) {\n  // Write your code here\n}",
        testCases: [
          {
            input: [[2, 7, 11, 15], 9],
            expectedOutput: [0, 1],
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
          }
        ],
        constraints: [
          "2 <= nums.length <= 104",
          "-109 <= nums[i] <= 109",
          "-109 <= target <= 109",
          "Only one valid answer exists."
        ],
        hints: [
          "Consider using a hash map to store seen numbers",
          "For each number, check if its complement exists"
        ]
      }
    ],
    medium: [
      {
        id: "three_sum",
        title: "Three Sum",
        description: "Given an integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
        starterCode: "function threeSum(nums) {\n  // Write your code here\n}",
        testCases: [
          {
            input: [[-1, 0, 1, 2, -1, -4]],
            expectedOutput: [[-1, -1, 2], [-1, 0, 1]],
            explanation: "The triplets that sum to 0 are [-1,0,1] and [-1,-1,2]."
          }
        ],
        constraints: [
          "3 <= nums.length <= 3000",
          "-105 <= nums[i] <= 105"
        ],
        hints: [
          "Sort the array first",
          "Use two pointers technique",
          "Skip duplicates to avoid duplicate triplets"
        ]
      }
    ]
  },
  strings: {
    beginner: [
      {
        id: "reverse_string",
        title: "Reverse String",
        description: "Write a function that reverses a string.",
        starterCode: "function reverseString(s) {\n  // Write your code here\n}",
        testCases: [
          {
            input: ["hello"],
            expectedOutput: "olleh",
            explanation: "The characters are reversed"
          }
        ],
        constraints: [
          "1 <= s.length <= 105",
          "s consists of printable ASCII characters"
        ],
        hints: [
          "Try using two pointers approach",
          "You can convert string to array for easier manipulation"
        ]
      }
    ]
  }
};

const practiceProblems = problems;
export default practiceProblems;
