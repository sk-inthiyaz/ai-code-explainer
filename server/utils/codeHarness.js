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
  // Extract param types from metadata if available
  const funcSig = userCode.match(/public\s+\w+\s+\w+\((.*?)\)/)?.[1] || '';
  const paramDeclarations = funcSig.split(',').map(p => p.trim());
  
  let readCode = '';
  let paramsCode = '';
  let callCode = '';
  
  // Determine parameter types from function signature
  const getParamType = (index) => {
    if (paramDeclarations[index]) {
      const type = paramDeclarations[index].split(/\s+/)[0];
      return type;
    }
    return 'int[]'; // Default fallback
  };
  
  if (paramCount === 1) {
    const paramType = getParamType(0);
    const defaultVal = paramType.includes('[]') ? '[]' : '0';
    readCode = 'String line1 = br.readLine();\n    if (line1 == null) line1 = "' + defaultVal + '";';
    
    if (paramType.includes('[]')) {
      paramsCode = 'int[] param1 = parseIntArray(line1);';
      callCode = 'int result = new Solution().' + functionName + '(param1);\n    System.out.println(result);';
    } else if (paramType === 'int') {
      paramsCode = 'int param1 = Integer.parseInt(line1.trim());';
      callCode = 'int result = new Solution().' + functionName + '(param1);\n    System.out.println(result);';
    } else {
      paramsCode = 'Object param1 = line1;';
      callCode = 'Object result = new Solution().' + functionName + '(param1);\n    System.out.println(result);';
    }
  } else if (paramCount === 2) {
    const param1Type = getParamType(0);
    const param2Type = getParamType(1);
    
    const default1 = param1Type.includes('[]') ? '[]' : '0';
    const default2 = param2Type.includes('[]') ? '[]' : '0';
    
    readCode = 'String line1 = br.readLine();\n    String line2 = br.readLine();\n    if (line1 == null) line1 = "' + default1 + '";\n    if (line2 == null) line2 = "' + default2 + '";';
    
    if (param1Type.includes('[]') && param2Type === 'int') {
      paramsCode = 'int[] param1 = parseIntArray(line1);\n    int param2 = Integer.parseInt(line2.trim());';
      callCode = 'int[] result = new Solution().' + functionName + '(param1, param2);\n    System.out.print("[");\n    for (int i = 0; i < result.length; i++) {\n      System.out.print(result[i]);\n      if (i < result.length - 1) System.out.print(",");\n    }\n    System.out.println("]");';
    } else if (param1Type.includes('[][]') && param2Type === 'String') {
      paramsCode = 'char[][] param1 = parseCharArray(line1);\n    String param2 = line2;';
      callCode = 'boolean result = new Solution().' + functionName + '(param1, param2);\n    System.out.println(result);';
    } else {
      // Fallback for twoSum (2 int[] params)
      paramsCode = 'int[] param1 = parseIntArray(line1);\n    int param2 = Integer.parseInt(line2.trim());';
      callCode = 'int[] result = new Solution().' + functionName + '(param1, param2);\n    System.out.print("[");\n    for (int i = 0; i < result.length; i++) {\n      System.out.print(result[i]);\n      if (i < result.length - 1) System.out.print(",");\n    }\n    System.out.println("]");';
    }
  } else if (paramCount === 3) {
    readCode = 'String line1 = br.readLine();\n    String line2 = br.readLine();\n    String line3 = br.readLine();\n    if (line1 == null) line1 = "[]";\n    if (line2 == null) line2 = "0";\n    if (line3 == null) line3 = "0";';
    paramsCode = 'int[] param1 = parseIntArray(line1);\n    int param2 = Integer.parseInt(line2.trim());\n    int param3 = Integer.parseInt(line3.trim());';
    callCode = 'int result = new Solution().' + functionName + '(param1, param2, param3);\n    System.out.println(result);';
  } else {
    // Fallback for twoSum (2 params)
    readCode = 'String line1 = br.readLine();\n    String line2 = br.readLine();\n    if (line1 == null) line1 = "[]";\n    if (line2 == null) line2 = "0";';
    paramsCode = 'int[] param1 = parseIntArray(line1);\n    int param2 = Integer.parseInt(line2.trim());';
    callCode = 'int[] result = new Solution().' + functionName + '(param1, param2);\n    System.out.print("[");\n    for (int i = 0; i < result.length; i++) {\n      System.out.print(result[i]);\n      if (i < result.length - 1) System.out.print(",");\n    }\n    System.out.println("]");';
  }

  const parseIntArrayCode = 'static int[] parseIntArray(String s) {\n    StringBuilder sb = new StringBuilder();\n    for (char c : s.toCharArray()) {\n      if (c != \'[\' && c != \']\') sb.append(c);\n    }\n    String numsStr = sb.toString();\n    if (numsStr.isEmpty()) return new int[0];\n    String[] numStrs = numsStr.split(",");\n    int[] nums = new int[numStrs.length];\n    for (int i = 0; i < numStrs.length; i++) {\n      if (!numStrs[i].trim().isEmpty()) {\n        nums[i] = Integer.parseInt(numStrs[i].trim());\n      }\n    }\n    return nums;\n  }';

  const parseCharArrayCode = 'static char[][] parseCharArray(String s) {\n    StringBuilder sb = new StringBuilder();\n    for (char c : s.toCharArray()) {\n      if (c != \'[\' && c != \']\' && c != \'"\'  ) sb.append(c);\n    }\n    String numsStr = sb.toString();\n    String[] rows = numsStr.split(",(?=[a-z,])"); \n    char[][] result = new char[rows.length][];\n    for (int i = 0; i < rows.length; i++) {\n      String row = rows[i].trim();\n      result[i] = new char[row.length()];\n      for (int j = 0; j < row.length(); j++) {\n        result[i][j] = row.charAt(j);\n      }\n    }\n    return result;\n  }';

  return 'import java.util.*;\nimport java.io.*;\n\n' + userCode + '\n\npublic class Main {\n  ' + parseIntArrayCode + '\n\n  ' + parseCharArrayCode + '\n\n  public static void main(String[] args) throws Exception {\n    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n    ' + readCode + '\n\n    ' + paramsCode + '\n    \n    ' + callCode + '\n  }\n}\n';
}

function wrapCpp(userCode, functionName, paramCount, input) {
  let readCode = '';
  let paramsCode = '';
  let callCode = '';

  if (paramCount === 1) {
    readCode = 'string line;\n  if (!getline(cin, line)) line = "[]";\n  vector<int> param1;\n  if (line.size() >= 2) {\n    string inner = line.substr(1, line.size() - 2);\n    if (!inner.empty()) {\n      stringstream ss(inner);\n      string token;\n      while (getline(ss, token, \',\')) {\n        if (!token.empty()) param1.push_back(stoi(token));\n      }\n    }\n  }';
    callCode = 'Solution sol;\n  int result = sol.' + functionName + '(param1);\n  cout << result << endl;';
  } else if (paramCount === 2) {
    readCode = 'string line;\n  if (!getline(cin, line)) line = "[]";\n  vector<int> param1;\n  if (line.size() >= 2) {\n    string inner = line.substr(1, line.size() - 2);\n    if (!inner.empty()) {\n      stringstream ss(inner);\n      string token;\n      while (getline(ss, token, \',\')) {\n        if (!token.empty()) param1.push_back(stoi(token));\n      }\n    }\n  }\n  \n  if (!getline(cin, line)) line = "0";\n  int param2 = 0;\n  try { param2 = stoi(line); } catch (...) { param2 = 0; }';
    callCode = 'Solution sol;\n  vector<int> result = sol.' + functionName + '(param1, param2);\n  cout << "[";\n  for (size_t i = 0; i < result.size(); i++) {\n    cout << result[i];\n    if (i < result.size() - 1) cout << ",";\n  }\n  cout << "]" << endl;';
  } else {
    // Fallback
    readCode = 'string line;\n  if (!getline(cin, line)) line = "[]";\n  vector<int> param1;\n  if (line.size() >= 2) {\n    string inner = line.substr(1, line.size() - 2);\n    if (!inner.empty()) {\n      stringstream ss(inner);\n      string token;\n      while (getline(ss, token, \',\')) {\n        if (!token.empty()) param1.push_back(stoi(token));\n      }\n    }\n  }\n  if (!getline(cin, line)) line = "0";\n  int param2 = 0;\n  try { param2 = stoi(line); } catch (...) { param2 = 0; }';
    callCode = 'Solution sol;\n  vector<int> result = sol.' + functionName + '(param1, param2);\n  cout << "[";\n  for (size_t i = 0; i < result.size(); i++) {\n    cout << result[i];\n    if (i < result.size() - 1) cout << ",";\n  }\n  cout << "]" << endl;';
  }

  return '#include <bits/stdc++.h>\n#include <iostream>\n#include <vector>\n#include <sstream>\n#include <string>\n#include <algorithm>\n#include <map>\n#include <unordered_map>\n#include <set>\n#include <unordered_set>\n#include <queue>\n#include <stack>\nusing namespace std;\n\n' + userCode + '\n\nint main() {\n  ios::sync_with_stdio(false);\n  cin.tie(nullptr);\n\n  ' + readCode + '\n\n  ' + callCode + '\n\n  return 0;\n}\n';
}

module.exports = { wrapCodeWithHarness };
