# Admin Question Upload Format

## Overview
Admins can upload 5 streak questions at once (one for each level: Easy, Mid, Mid-Easy, Hard, Mix).

## Endpoint
**POST** `http://localhost:5000/api/streak/admin/daily`

## Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_ADMIN_TOKEN"
}
```

## Request Body Structure

```json
{
  "date": "2025-10-20",
  "questions": [
    {
      "title": "Two Sum",
      "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      "constraints": "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
      "hints": [
        "Use a hash map to store seen values",
        "Think about complements (target - current_value)"
      ],
      "starterCode": "// Starter code (optional, will use template if not provided)",
      "codeTemplate": {
        "javascript": "// Write your JavaScript solution here\nfunction twoSum(nums, target) {\n    // Your code\n}\nconsole.log(twoSum([2,7,11,15], 9));",
        "python": "# Write your Python solution here\ndef two_sum(nums, target):\n    # Your code\n    pass\n\nprint(two_sum([2,7,11,15], 9))",
        "java": "// Write your Java solution here\nimport java.util.*;\npublic class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        // Your code\n        return new int[]{};\n    }\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(twoSum(new int[]{2,7,11,15}, 9)));\n    }\n}",
        "cpp": "// Write your C++ solution here\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your code\n    return {};\n}\n\nint main() {\n    vector<int> nums = {2,7,11,15};\n    vector<int> result = twoSum(nums, 9);\n    // Print result\n    return 0;\n}"
      },
      "testCases": [
        {
          "input": "[2,7,11,15]\n9",
          "expectedOutput": "[0,1]",
          "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]",
          "isHidden": false
        },
        {
          "input": "[3,2,4]\n6",
          "expectedOutput": "[1,2]",
          "explanation": "nums[1] + nums[2] == 6",
          "isHidden": false
        },
        {
          "input": "[3,3]\n6",
          "expectedOutput": "[0,1]",
          "explanation": "nums[0] + nums[1] == 6",
          "isHidden": true
        },
        {
          "input": "[-1,-2,-3,-4,-5]\n-8",
          "expectedOutput": "[2,4]",
          "explanation": "Hidden test case with negative numbers",
          "isHidden": true
        }
      ]
    },
    {
      "title": "Level 2 Question - Reverse String",
      "description": "Write a function that reverses a string.",
      "constraints": "1 <= s.length <= 10^5\ns contains only ASCII characters",
      "hints": [
        "Two pointer approach",
        "Swap characters from both ends"
      ],
      "codeTemplate": {
        "javascript": "function reverseString(s) {\n    // Your code\n}\nconsole.log(reverseString('hello'));",
        "python": "def reverse_string(s):\n    # Your code\n    pass\nprint(reverse_string('hello'))",
        "java": "public class Main {\n    public static String reverseString(String s) {\n        // Your code\n        return \"\";\n    }\n    public static void main(String[] args) {\n        System.out.println(reverseString(\"hello\"));\n    }\n}",
        "cpp": "#include <iostream>\n#include <string>\nusing namespace std;\n\nstring reverseString(string s) {\n    // Your code\n    return \"\";\n}\n\nint main() {\n    cout << reverseString(\"hello\");\n    return 0;\n}"
      },
      "testCases": [
        {
          "input": "hello",
          "expectedOutput": "olleh",
          "isHidden": false
        },
        {
          "input": "world",
          "expectedOutput": "dlrow",
          "isHidden": false
        },
        {
          "input": "a",
          "expectedOutput": "a",
          "isHidden": true
        }
      ]
    },
    {
      "title": "Level 3 Question",
      "description": "...",
      "constraints": "...",
      "testCases": [
        {
          "input": "...",
          "expectedOutput": "...",
          "isHidden": false
        }
      ]
    },
    {
      "title": "Level 4 Question",
      "description": "...",
      "constraints": "...",
      "testCases": [
        {
          "input": "...",
          "expectedOutput": "...",
          "isHidden": false
        }
      ]
    },
    {
      "title": "Level 5 Question",
      "description": "...",
      "constraints": "...",
      "testCases": [
        {
          "input": "...",
          "expectedOutput": "...",
          "isHidden": false
        }
      ]
    }
  ]
}
```

## Field Explanations

### Top Level
- **date** (string, required): Date in YYYY-MM-DD format when these questions should be active
- **questions** (array, required): Must contain exactly 5 questions (levels 1-5)

### Question Object
- **title** (string, required): Question title
- **description** (string, required): Full problem description
- **constraints** (string, optional): Input constraints and limits
- **hints** (array of strings, optional): Hints to help users solve the problem
- **starterCode** (string, optional): Legacy field, use codeTemplate instead
- **codeTemplate** (object, optional): Language-specific boilerplate code
  - **javascript**: JS template
  - **python**: Python template
  - **java**: Java template (must have public class Main)
  - **cpp**: C++ template
- **testCases** (array, required): Test cases for validation

### Test Case Object
- **input** (string, required): Input for the test case (can be multi-line, use \n)
- **expectedOutput** (string, required): Expected output
- **explanation** (string, optional): Explanation of why this output is correct
- **isHidden** (boolean, required): 
  - `false` = **PUBLIC** test case (visible to users, runs with "Run" button)
  - `true` = **HIDDEN** test case (not visible to users, only runs with "Submit" button)

## Important Notes

### Test Case Visibility
- **Public test cases** (`isHidden: false`):
  - Visible in the UI under "Test Cases" tab
  - Run when user clicks "Run" button
  - Typically 2-3 test cases to help users understand the problem
  
- **Hidden test cases** (`isHidden: true`):
  - Not visible to users
  - Only run when user clicks "Submit" button
  - Used to thoroughly test the solution with edge cases
  - Typical distribution: 2-3 public, 5-10+ hidden

### Level Assignment
The backend automatically assigns levels 1-5 to the questions array:
- questions[0] → Level 1 (Easy)
- questions[1] → Level 2 (Mid)
- questions[2] → Level 3 (Mid-Easy)
- questions[3] → Level 4 (Hard)
- questions[4] → Level 5 (Mix)

### Code Templates
If you don't provide `codeTemplate`, the system uses default templates:
- **JavaScript**: `function solution() { // Your code }`
- **Python**: `def solution(): # Your code pass`
- **Java**: `public class Main { public static void main(String[] args) { } }`
- **C++**: `#include <iostream>\nusing namespace std;\nint main() { return 0; }`

### Input/Output Format
- **Input**: Can be multi-line. Use `\n` for line breaks.
- **Output**: Should match exactly (whitespace-sensitive). The Docker runner trims leading/trailing whitespace.
- For arrays: Use string representation like `[1,2,3]`
- For multiple inputs: Separate by newlines

## Example Minimal Upload (Quick Format)

```json
{
  "date": "2025-10-21",
  "questions": [
    {
      "title": "Add Two Numbers",
      "description": "Given two integers a and b, return their sum.",
      "testCases": [
        { "input": "2\n3", "expectedOutput": "5", "isHidden": false },
        { "input": "0\n0", "expectedOutput": "0", "isHidden": false },
        { "input": "-5\n10", "expectedOutput": "5", "isHidden": true },
        { "input": "999\n1", "expectedOutput": "1000", "isHidden": true }
      ]
    },
    { "title": "Level 2...", "description": "...", "testCases": [...] },
    { "title": "Level 3...", "description": "...", "testCases": [...] },
    { "title": "Level 4...", "description": "...", "testCases": [...] },
    { "title": "Level 5...", "description": "...", "testCases": [...] }
  ]
}
```

## Testing Your Upload

1. Get admin token by logging in as admin
2. Use Postman/Insomnia or curl:

```bash
curl -X POST http://localhost:5000/api/streak/admin/daily \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d @questions.json
```

3. Check response for success or error messages
4. Verify questions appear in admin dashboard
5. Test as a regular user by navigating to `/streak/solve`

## Common Mistakes to Avoid

❌ **Wrong**: Not providing exactly 5 questions
✅ **Correct**: Always provide 5 questions in the array

❌ **Wrong**: All test cases have `isHidden: true`
✅ **Correct**: Have at least 2 public test cases (`isHidden: false`)

❌ **Wrong**: Java template without `public class Main`
✅ **Correct**: Java must have `public class Main { public static void main... }`

❌ **Wrong**: Mismatched expected output (extra spaces, wrong format)
✅ **Correct**: Match exact output format, trim whitespace if needed

## Response Examples

### Success Response
```json
{
  "message": "5 daily questions added successfully!",
  "date": "2025-10-20T00:00:00.000Z",
  "questions": [
    { "_id": "...", "title": "Two Sum", "level": 1, ... },
    { "_id": "...", "title": "...", "level": 2, ... },
    ...
  ]
}
```

### Error Response
```json
{
  "message": "Please provide exactly 5 questions (one for each level)"
}
```

## Need Help?

- Check server logs for detailed error messages
- Verify all required fields are present
- Ensure JSON is valid (use a JSON validator)
- Test with minimal example first, then add complexity
