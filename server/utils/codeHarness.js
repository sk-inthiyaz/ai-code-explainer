/**
 * LeetCode-style test harness
 * Wraps user function code with test runner that calls the function with test inputs
 */

/**
 * Wraps user code with a test harness based on language
 * @param {string} userCode - The user's function code (without main)
 * @param {string} language - Programming language
 * @param {object} testCase - Test case with input and function signature
 * @returns {string} Complete runnable code
 */
function wrapCodeWithHarness(userCode, language, testCase) {
  const { functionName, inputs } = parseTestCase(testCase);
  
  switch (language) {
    case 'javascript':
      return wrapJavaScript(userCode, functionName, inputs);
    case 'python':
      return wrapPython(userCode, functionName, inputs);
    case 'java':
      return wrapJava(userCode, functionName, inputs);
    case 'cpp':
      return wrapCpp(userCode, functionName, inputs);
    default:
      return userCode;
  }
}

/**
 * Parse test case input to extract function name and parameters
 * Format: "functionName([1,2,3], 5)" or "nums=[1,2,3]; target=5"
 */
function parseTestCase(testCase) {
  // Try to extract function name and parameters from input
  // This is a simplified parser - can be enhanced
  
  const input = testCase.input || '';
  
  // Default to 'solution' if no function name found
  let functionName = 'twoSum'; // This should come from question metadata
  let inputs = input;
  
  return { functionName, inputs };
}

function wrapJavaScript(userCode, functionName, inputs) {
  // Read from stdin to avoid escaping issues; support class Solution style
  const callsViaSolution = /class\s+Solution/.test(userCode);
  return `
${userCode}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim();
// Use regex for cross-platform newlines; escape backslashes in template string
const lines = input.length ? input.split(/\\r?\\n/) : [];

// Parse input - adjust based on problem format
const nums = JSON.parse(lines[0]);
const target = parseInt(lines[1]);

// Call user function
const result = ${callsViaSolution ? `(new Solution()).${functionName}(nums, target)` : `${functionName}(nums, target)`};

// Print result as JSON
console.log(JSON.stringify(result));
`;
}

function wrapPython(userCode, functionName, inputs) {
  const callsViaSolution = /class\s+Solution/.test(userCode);
  return `
${userCode}

# Test harness
import json
import sys
# Use splitlines() to handle different newline formats without embedding escape sequences
data = sys.stdin.read().splitlines()
nums = json.loads(data[0]) if len(data) > 0 else []
target = int(data[1]) if len(data) > 1 else 0

# Call user function
result = ${callsViaSolution ? 'Solution().' + functionName + '(nums, target)' : functionName + '(nums, target)'}

# Print result as JSON
print(json.dumps(result, separators=(',',':')))
`;
}

function wrapJava(userCode, functionName, inputs) {
  // User code already contains "class Solution { ... }"
  // Read test input from STDIN to avoid string escaping issues
  return `
import java.util.*;
import java.io.*;

${userCode}

public class Main {
  public static void main(String[] args) throws Exception {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    String line1 = br.readLine();
    String line2 = br.readLine();
    if (line1 == null) line1 = "[]";
    if (line2 == null) line2 = "0";

    // Parse input
    String numsStr = line1.replaceAll("[\\\\[\\\\]]", "");
    String[] numStrs = numsStr.isEmpty() ? new String[0] : numsStr.split(",");
    int[] nums = new int[numStrs.length];
    for (int i = 0; i < numStrs.length; i++) {
      if (!numStrs[i].trim().isEmpty()) {
        nums[i] = Integer.parseInt(numStrs[i].trim());
      }
    }
    int target = Integer.parseInt(line2.trim());
        
    // Call user function
    Solution solution = new Solution();
    int[] result = solution.${functionName}(nums, target);
        
    // Print result
    System.out.print("[");
    for (int i = 0; i < result.length; i++) {
      System.out.print(result[i]);
      if (i < result.length - 1) System.out.print(",");
    }
    System.out.println("]");
  }
}
`;
}

function wrapCpp(userCode, functionName, inputs) {
  return `
#include <bits/stdc++.h>
#include <iostream>
#include <vector>
#include <sstream>
#include <string>
#include <algorithm>
#include <map>
#include <unordered_map>
#include <set>
#include <unordered_set>
#include <queue>
#include <stack>
using namespace std;

${userCode}

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);

  string line;
  if (!getline(cin, line)) line = "[]";
  vector<int> nums;
  // Simple parser for [1,2,3] format
  if (line.size() >= 2) {
    string inner = line.substr(1, line.size() - 2);
    if (!inner.empty()) {
      stringstream ss(inner);
      string token;
      while (getline(ss, token, ',')) {
        if (!token.empty()) nums.push_back(stoi(token));
      }
    }
  }

  if (!getline(cin, line)) line = "0";
  int target = 0;
  try { target = stoi(line); } catch (...) { target = 0; }

  // Call user function (class Solution method)
  Solution sol;
  vector<int> result = sol.${functionName}(nums, target);

  // Print result
  cout << "[";
  for (size_t i = 0; i < result.size(); i++) {
    cout << result[i];
    if (i < result.size() - 1) cout << ",";
  }
  cout << "]" << endl;

  return 0;
}
`;
}

module.exports = { wrapCodeWithHarness };
