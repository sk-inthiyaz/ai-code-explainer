# Auto-Import System - LeetCode Style 🚀

## Overview
The system automatically wraps user code with necessary imports and test harness - users write ONLY the function/class, never the main() or imports.

---

## ✅ What's Fixed

### Problem Before:
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();  // ❌ ERROR: cannot find symbol
    }
}
```

### Solution Now:
When user writes their code, the backend **automatically wraps it**:

```java
import java.util.*;  // ✅ Auto-added by system

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();  // ✅ Works!
        // ... user code ...
    }
}

public class Main {
    public static void main(String[] args) {
        // ✅ Auto-generated test harness
        Solution solution = new Solution();
        int[] result = solution.twoSum(nums, target);
        System.out.println(Arrays.toString(result));
    }
}
```

---

## 🔧 How It Works

### 1. User Writes Function Only
```java
class Solution {
    public int[] threeSum(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        // ... user logic ...
        return result;
    }
}
```

### 2. Backend Auto-Wraps (codeHarness.js)
```java
import java.util.*;  // All Java utilities available

class Solution {
    // User code pasted here unchanged
}

public class Main {
    public static void main(String[] args) {
        // Parse test case input
        // Call user's Solution class
        // Print output for comparison
    }
}
```

### 3. Docker Executes
- Compiles: `javac Main.java`
- Runs: `java Main`
- Returns output to compare with expected

---

## 📝 Available Imports by Language

### Java
```java
import java.util.*;
```
**Includes:**
- `Map`, `HashMap`, `LinkedHashMap`, `TreeMap`
- `List`, `ArrayList`, `LinkedList`
- `Set`, `HashSet`, `LinkedHashSet`, `TreeSet`
- `Queue`, `Deque`, `PriorityQueue`
- `Arrays`, `Collections`
- `Stack`, `Vector`

### Python
```python
# No explicit imports needed in harness
# User can use: list, dict, set, tuple, etc.
```

### JavaScript
```javascript
// No imports needed
// User can use: Array, Map, Set, Object, etc.
```

### C++
```cpp
#include <iostream>
#include <vector>
#include <sstream>
#include <string>
using namespace std;
```
**Includes:**
- `vector`, `string`
- `map`, `unordered_map`
- `set`, `unordered_set`
- Basic I/O

---

## 🎯 Template System

### Admin Uploads Question:
```json
{
  "title": "Three Sum",
  "description": "Find all unique triplets...",
  "codeTemplate": {
    "java": "class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Write your solution here\n        \n    }\n}",
    "python": "class Solution:\n    def threeSum(self, nums):\n        # Write your solution here\n        pass",
    "javascript": "function threeSum(nums) {\n    // Write your solution here\n}",
    "cpp": "class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        // Write your solution here\n        \n    }\n};"
  },
  "functionSignature": {
    "name": "threeSum",
    "params": ["int[] nums"],
    "returnType": "List<List<Integer>>"
  },
  "testCases": [
    {
      "input": "[-1,0,1,2,-1,-4]",
      "expectedOutput": "[[-1,-1,2],[-1,0,1]]",
      "isHidden": false
    }
  ]
}
```

### User Sees in Editor:
```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Write your solution here
        
    }
}
```

✅ **Template automatically loads when user selects Java**
✅ **User never sees or writes `import java.util.*;`**
✅ **User never writes `public class Main`**

---

## 🔄 Code Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Frontend: User writes class Solution { ... }            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. POST /api/streak/run                                     │
│    Body: { code: "class Solution {...}", language: "java" }│
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. streakController.js - runCode()                          │
│    wrappedCode = wrapCodeWithHarness(code, language, test) │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. codeHarness.js - wrapJava()                             │
│    Adds: import java.util.*;                                │
│    Adds: public class Main { main() { ... } }              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. dockerRunner.js - runCodeInDocker()                     │
│    Writes to temp file: /tmp/Main.java                     │
│    Runs: docker run openjdk:17-alpine javac & java         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Output returned to frontend                              │
│    { passed: true, actualOutput: "[0,1]" }                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `server/utils/codeHarness.js` | **Wraps user code with imports + test harness** |
| `server/utils/dockerRunner.js` | Executes wrapped code in Docker |
| `server/controllers/streakController.js` | Calls `wrapCodeWithHarness()` before Docker run |
| `server/models/StreakQuestion.js` | Stores `codeTemplate` for each language |
| `client/src/components/StreakQuestion/SolvePage.jsx` | Loads template, sends code to backend |

---

## 🧪 Testing Your Code

### Example: Two Sum with HashMap

**User Writes:**
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        
        return new int[0];
    }
}
```

**System Auto-Wraps:**
```java
import java.util.*;  // ← Automatically added

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();  // ← Works!
        // ... rest of user code ...
    }
}

public class Main {  // ← Automatically added
    public static void main(String[] args) {
        // Parse: "[2,7,11,15]\n9"
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        
        Solution solution = new Solution();
        int[] result = solution.twoSum(nums, target);
        
        System.out.print("[");
        for (int i = 0; i < result.length; i++) {
            System.out.print(result[i]);
            if (i < result.length - 1) System.out.print(",");
        }
        System.out.println("]");
        // Output: [0,1]
    }
}
```

---

## ✅ Integration Checklist

- [x] Created `codeHarness.js` with language-specific wrappers
- [x] Added `import java.util.*;` to Java wrapper
- [x] Integrated `wrapCodeWithHarness()` into `runCode()` endpoint
- [x] Integrated `wrapCodeWithHarness()` into `submitSolution()` endpoint
- [x] Updated `StreakQuestion` model with `codeTemplate` field
- [x] Updated `StreakQuestion` model with `functionSignature` field
- [x] Frontend loads template on language change
- [x] Docker images updated (gcc:latest instead of Alpine)

---

## 🎓 For Admins: Creating Questions

### Template Structure:
```json
{
  "codeTemplate": {
    "java": "class Solution {\n    public ReturnType functionName(ParamType param) {\n        \n    }\n}"
  }
}
```

### DO NOT Include:
- ❌ `import` statements (system adds automatically)
- ❌ `public class Main`
- ❌ `public static void main()`
- ❌ Input parsing logic
- ❌ Output printing logic

### ONLY Include:
- ✅ `class Solution { ... }`
- ✅ Function signature
- ✅ Comment placeholder for user code

---

## 🐛 Troubleshooting

### "Cannot find symbol: HashMap"
**Cause:** Old code without harness integration
**Fix:** Server restarted with new `wrapCodeWithHarness()` calls ✅

### "Class Solution not found"
**Cause:** Template missing `class Solution`
**Fix:** Ensure template has `class Solution { ... }`

### "No such file or directory"
**Cause:** Docker runner issue
**Fix:** Check Docker is running, images pulled

---

## 🚀 What Users Can Now Use

### Java - All java.util Classes:
```java
Map<String, Integer> map = new HashMap<>();
List<Integer> list = new ArrayList<>();
Set<String> set = new HashSet<>();
Queue<Integer> queue = new LinkedList<>();
PriorityQueue<Integer> pq = new PriorityQueue<>();
Stack<Integer> stack = new Stack<>();
Arrays.sort(arr);
Collections.reverse(list);
```

### C++ - STL Containers:
```cpp
vector<int> nums;
map<int, int> freq;
unordered_map<char, int> count;
set<int> unique;
queue<int> q;
stack<int> s;
```

### Python - Built-in Types:
```python
nums = [1, 2, 3]
freq = {}
unique = set()
from collections import deque, Counter
```

### JavaScript - ES6 Features:
```javascript
const map = new Map();
const set = new Set();
const arr = [...nums];
const result = nums.filter(x => x > 0);
```

---

## 📊 Summary

| Feature | Status |
|---------|--------|
| Auto-imports for Java | ✅ Working |
| Auto-imports for C++ | ✅ Working |
| Function-only templates | ✅ Working |
| Test harness auto-wrap | ✅ Integrated |
| Docker execution | ✅ Working |
| Template auto-load | ✅ Working |

**Now users write pure logic - system handles all boilerplate!** 🎉
