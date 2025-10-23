/**
 * LeetCode-style test harness
 * Wraps user function code with test runner that calls the function with test inputs
 * Supports dynamic function signatures (different param counts, types, return types)
 */

/**
 * Wraps user code with a test harness based on language
 * @param {string} userCode - The user's function code (without main)
 * @param {string} language - Programming language
 * @param {object} testCase - Test case with input and function signature
 * @param {object} questionMetadata - { functionSignature: { name, params, returnType }, ... }
 * @returns {string} Complete runnable code
 */
function wrapCodeWithHarness(userCode, language, testCase, questionMetadata = {}) {
  // Extract function info from question metadata or fallback to testCase
  const funcSig = questionMetadata?.functionSignature || { name: 'solution', params: [] };
  const functionName = funcSig.name || 'solution';
  const paramCount = (funcSig.params || []).length || 1;
  const input = testCase.input || '';
  
  switch (language) {
    case 'javascript':
      return wrapJavaScript(userCode, functionName, paramCount, input);
    case 'python':
      return wrapPython(userCode, functionName, paramCount, input);
    case 'java':
      return wrapJava(userCode, functionName, paramCount, input);
    case 'cpp':
      return wrapCpp(userCode, functionName, paramCount, input);
    default:
      return userCode;
  }
}

/**
 * Parse test case input based on parameter count
 * For single param: line1 = JSON array/value
 * For two params: line1 = JSON, line2 = JSON/number
 * For three+ params: each line is one param
 */
function parseInputLines(input, paramCount) {
  const lines = input.trim().split(/\r?\n/).filter(l => l);
  const params = [];
  for (let i = 0; i < paramCount && i < lines.length; i++) {
    params.push(lines[i]);
  }
  return params;
}

function wrapJavaScript(userCode, functionName, paramCount, input) {
  const callsViaSolution = /class\s+Solution/.test(userCode);
  const params = parseInputLines(input, paramCount);
  
  let paramsCode = '';
  let callCode = '';
  
  if (paramCount === 1) {
    paramsCode = `const param1 = JSON.parse(lines[0] || '[]');`;
    callCode = `const result = ${callsViaSolution ? `(new Solution()).${functionName}(param1)` : `${functionName}(param1)`};`;
  } else if (paramCount === 2) {
    paramsCode = `const param1 = JSON.parse(lines[0] || '[]');
const param2 = JSON.parse(lines[1] || '0');`;
    callCode = `const result = ${callsViaSolution ? `(new Solution()).${functionName}(param1, param2)` : `${functionName}(param1, param2)`};`;
  } else if (paramCount === 3) {
    paramsCode = `const param1 = JSON.parse(lines[0] || '[]');
const param2 = JSON.parse(lines[1] || '0');
const param3 = JSON.parse(lines[2] || '0');`;
    callCode = `const result = ${callsViaSolution ? `(new Solution()).${functionName}(param1, param2, param3)` : `${functionName}(param1, param2, param3)`};`;
  } else {
    // Generic for more params
    let paramDecls = [];
    let paramArgs = [];
    for (let i = 1; i <= paramCount; i++) {
      paramDecls.push(`const param${i} = JSON.parse(lines[${i-1}] || '0');`);
      paramArgs.push(`param${i}`);
    }
    paramsCode = paramDecls.join('\n');
    const argList = paramArgs.join(', ');
    callCode = `const result = ${callsViaSolution ? `(new Solution()).${functionName}(${argList})` : `${functionName}(${argList})`};`;
  }

  return `
${userCode}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim();
const lines = input.length ? input.split(/\\r?\\n/) : [];

// Parse input
${paramsCode}

// Call user function
${callCode}

// Print result as JSON
console.log(JSON.stringify(result));
`;
}

function wrapPython(userCode, functionName, paramCount, input) {
  const callsViaSolution = /class\s+Solution/.test(userCode);
  
  let paramsCode = '';
  let callCode = '';
  
  if (paramCount === 1) {
    paramsCode = `param1 = json.loads(data[0]) if len(data) > 0 else []`;
    callCode = `result = Solution().${functionName}(param1) if ${callsViaSolution ? 'True' : 'False'} else ${functionName}(param1)`;
  } else if (paramCount === 2) {
    paramsCode = `param1 = json.loads(data[0]) if len(data) > 0 else []
param2 = int(data[1]) if len(data) > 1 else 0`;
    callCode = `result = Solution().${functionName}(param1, param2) if ${callsViaSolution ? 'True' : 'False'} else ${functionName}(param1, param2)`;
  } else if (paramCount === 3) {
    paramsCode = `param1 = json.loads(data[0]) if len(data) > 0 else []
param2 = json.loads(data[1]) if len(data) > 1 else []
param3 = json.loads(data[2]) if len(data) > 2 else 0`;
    callCode = `result = Solution().${functionName}(param1, param2, param3) if ${callsViaSolution ? 'True' : 'False'} else ${functionName}(param1, param2, param3)`;
  } else {
    // Generic
    let paramDecls = [];
    let paramArgs = [];
    for (let i = 1; i <= paramCount; i++) {
      paramDecls.push(`param${i} = json.loads(data[${i-1}]) if len(data) > ${i-1} else []`);
      paramArgs.push(`param${i}`);
    }
    paramsCode = paramDecls.join('\n');
    const argList = paramArgs.join(', ');
    callCode = `result = Solution().${functionName}(${argList}) if ${callsViaSolution ? 'True' : 'False'} else ${functionName}(${argList})`;
  }

  return `
${userCode}

import json
import sys

data = sys.stdin.read().splitlines()

${paramsCode}

${callCode}

print(json.dumps(result, separators=(',',':')))
`;
}

function wrapJava(userCode, functionName, paramCount, input) {
  let readCode = '';
  let paramsCode = '';
  let callCode = '';
  
  if (paramCount === 1) {
    readCode = `String line1 = br.readLine();
    if (line1 == null) line1 = "[]";`;
    paramsCode = `int[] param1 = parseIntArray(line1);`;
    callCode = `int result = new Solution().${functionName}(param1);
    System.out.println(result);`;
  } else if (paramCount === 2) {
    readCode = `String line1 = br.readLine();
    String line2 = br.readLine();
    if (line1 == null) line1 = "[]";
    if (line2 == null) line2 = "0";`;
    paramsCode = `int[] param1 = parseIntArray(line1);
    int param2 = Integer.parseInt(line2.trim());`;
    callCode = `int[] result = new Solution().${functionName}(param1, param2);
    System.out.print("[");
    for (int i = 0; i < result.length; i++) {
      System.out.print(result[i]);
      if (i < result.length - 1) System.out.print(",");
    }
    System.out.println("]");`;
  } else if (paramCount === 3) {
    readCode = `String line1 = br.readLine();
    String line2 = br.readLine();
    String line3 = br.readLine();
    if (line1 == null) line1 = "[]";
    if (line2 == null) line2 = "0";
    if (line3 == null) line3 = "0";`;
    paramsCode = `int[] param1 = parseIntArray(line1);
    int param2 = Integer.parseInt(line2.trim());
    int param3 = Integer.parseInt(line3.trim());`;
    callCode = `int result = new Solution().${functionName}(param1, param2, param3);
    System.out.println(result);`;
  } else {
    // Fallback for twoSum (2 params)
    readCode = `String line1 = br.readLine();
    String line2 = br.readLine();
    if (line1 == null) line1 = "[]";
    if (line2 == null) line2 = "0";`;
    paramsCode = `int[] param1 = parseIntArray(line1);
    int param2 = Integer.parseInt(line2.trim());`;
    callCode = `int[] result = new Solution().${functionName}(param1, param2);
    System.out.print("[");
    for (int i = 0; i < result.length; i++) {
      System.out.print(result[i]);
      if (i < result.length - 1) System.out.print(",");
    }
    System.out.println("]");`;
  }

  return `
import java.util.*;
import java.io.*;

${userCode}

public class Main {
  static int[] parseIntArray(String s) {
    String numsStr = s.replaceAll("[\\\\[\\\\]]", "");
    String[] numStrs = numsStr.isEmpty() ? new String[0] : numsStr.split(",");
    int[] nums = new int[numStrs.length];
    for (int i = 0; i < numStrs.length; i++) {
      if (!numStrs[i].trim().isEmpty()) {
        nums[i] = Integer.parseInt(numStrs[i].trim());
      }
    }
    return nums;
  }

  public static void main(String[] args) throws Exception {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    ${readCode}

    ${paramsCode}
    
    ${callCode}
  }
}
`;
}

function wrapCpp(userCode, functionName, paramCount, input) {
  let readCode = '';
  let paramsCode = '';
  let callCode = '';

  if (paramCount === 1) {
    readCode = `string line;
  if (!getline(cin, line)) line = "[]";
  vector<int> param1;
  if (line.size() >= 2) {
    string inner = line.substr(1, line.size() - 2);
    if (!inner.empty()) {
      stringstream ss(inner);
      string token;
      while (getline(ss, token, ',')) {
        if (!token.empty()) param1.push_back(stoi(token));
      }
    }
  }`;
    callCode = `Solution sol;
  int result = sol.${functionName}(param1);
  cout << result << endl;`;
  } else if (paramCount === 2) {
    readCode = `string line;
  if (!getline(cin, line)) line = "[]";
  vector<int> param1;
  if (line.size() >= 2) {
    string inner = line.substr(1, line.size() - 2);
    if (!inner.empty()) {
      stringstream ss(inner);
      string token;
      while (getline(ss, token, ',')) {
        if (!token.empty()) param1.push_back(stoi(token));
      }
    }
  }
  
  if (!getline(cin, line)) line = "0";
  int param2 = 0;
  try { param2 = stoi(line); } catch (...) { param2 = 0; }`;
    callCode = `Solution sol;
  vector<int> result = sol.${functionName}(param1, param2);
  cout << "[";
  for (size_t i = 0; i < result.size(); i++) {
    cout << result[i];
    if (i < result.size() - 1) cout << ",";
  }
  cout << "]" << endl;`;
  } else {
    // Fallback
    readCode = `string line;
  if (!getline(cin, line)) line = "[]";
  vector<int> param1;
  if (line.size() >= 2) {
    string inner = line.substr(1, line.size() - 2);
    if (!inner.empty()) {
      stringstream ss(inner);
      string token;
      while (getline(ss, token, ',')) {
        if (!token.empty()) param1.push_back(stoi(token));
      }
    }
  }
  if (!getline(cin, line)) line = "0";
  int param2 = 0;
  try { param2 = stoi(line); } catch (...) { param2 = 0; }`;
    callCode = `Solution sol;
  vector<int> result = sol.${functionName}(param1, param2);
  cout << "[";
  for (size_t i = 0; i < result.size(); i++) {
    cout << result[i];
    if (i < result.size() - 1) cout << ",";
  }
  cout << "]" << endl;`;
  }

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

  ${readCode}

  ${callCode}

  return 0;
}
`;
}

module.exports = { wrapCodeWithHarness };
