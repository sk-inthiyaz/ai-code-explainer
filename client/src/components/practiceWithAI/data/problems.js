export const problems = {
  arrays: {
    beginner: [
      {
        id: 'array-sum',
        title: 'Array Sum',
        description: 'Write a function that calculates the sum of all elements in an array.',
        examples: [
          {
            input: '[1, 2, 3, 4, 5]',
            output: '15',
            explanation: 'The sum of all elements: 1 + 2 + 3 + 4 + 5 = 15'
          },
          {
            input: '[-1, 0, 1]',
            output: '0',
            explanation: 'The sum of all elements: -1 + 0 + 1 = 0'
          }
        ],
        starterCode: `function arraySum(arr) {
  // Write your code here
}`,
        testCases: [
          { input: [1, 2, 3, 4, 5], expectedOutput: 15 },
          { input: [-1, 0, 1], expectedOutput: 0 },
          { input: [10, 20, 30], expectedOutput: 60 }
        ],
        constraints: [
          '1 <= arr.length <= 1000',
          '-1000 <= arr[i] <= 1000'
        ],
        hints: [
          'Consider using a loop to iterate through the array',
          'Keep track of the running sum in a variable'
        ]
      }
    ],
    medium: [
      {
        id: 'two-sum',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
        examples: [
          {
            input: 'nums = [2, 7, 11, 15], target = 9',
            output: '[0, 1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1]'
          },
          {
            input: 'nums = [3, 2, 4], target = 6',
            output: '[1, 2]',
            explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2]'
          }
        ],
        starterCode: `function twoSum(nums, target) {
  // Write your code here
}`,
        testCases: [
          { input: [[2, 7, 11, 15], 9], expectedOutput: [0, 1] },
          { input: [[3, 2, 4], 6], expectedOutput: [1, 2] },
          { input: [[3, 3], 6], expectedOutput: [0, 1] }
        ],
        constraints: [
          '2 <= nums.length <= 104',
          '-109 <= nums[i] <= 109',
          '-109 <= target <= 109',
          'Only one valid answer exists'
        ],
        hints: [
          'Try using a hash map to store the numbers you\'ve seen',
          'For each number, check if its complement (target - num) exists in the hash map'
        ]
      }
    ],
    advanced: [
      {
        id: 'merge-intervals',
        title: 'Merge Intervals',
        description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.',
        examples: [
          {
            input: '[[1,3],[2,6],[8,10],[15,18]]',
            output: '[[1,6],[8,10],[15,18]]',
            explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6]'
          },
          {
            input: '[[1,4],[4,5]]',
            output: '[[1,5]]',
            explanation: 'Intervals [1,4] and [4,5] are considered overlapping'
          }
        ],
        starterCode: `function mergeIntervals(intervals) {
  // Write your code here
}`,
        testCases: [
          { 
            input: [[1,3],[2,6],[8,10],[15,18]], 
            expectedOutput: [[1,6],[8,10],[15,18]]
          },
          { 
            input: [[1,4],[4,5]], 
            expectedOutput: [[1,5]]
          }
        ],
        constraints: [
          '1 <= intervals.length <= 104',
          'intervals[i].length == 2',
          '0 <= starti <= endi <= 104'
        ],
        hints: [
          'Sort the intervals based on the start time',
          'Compare each interval with the next one for overlap',
          'Merge intervals when end time of current interval is greater than or equal to start time of next interval'
        ]
      }
    ]
  },
  strings: {
    beginner: [
      {
        id: 'reverse-string',
        title: 'Reverse String',
        description: 'Write a function that reverses a string.',
        examples: [
          {
            input: '"hello"',
            output: '"olleh"',
            explanation: 'Reverse the characters in the string'
          }
        ],
        starterCode: `function reverseString(str) {
  // Write your code here
}`,
        testCases: [
          { input: 'hello', expectedOutput: 'olleh' },
          { input: 'world', expectedOutput: 'dlrow' },
          { input: 'a', expectedOutput: 'a' }
        ],
        constraints: [
          '1 <= str.length <= 105',
          'str consists of printable ASCII characters'
        ],
        hints: [
          'Try converting the string to an array of characters',
          'You can reverse an array using various methods'
        ]
      }
    ]
  },
  // Add more topics and their problems here
};

export const getProblems = (topic, difficulty) => {
  return problems[topic]?.[difficulty] || [];
};

export const getProblem = (topic, difficulty, problemId) => {
  const problemList = getProblems(topic, difficulty);
  return problemList.find(p => p.id === problemId) || problemList[0];
};
