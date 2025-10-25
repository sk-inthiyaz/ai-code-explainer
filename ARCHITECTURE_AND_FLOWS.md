# 📊 Architecture & Flow Diagrams

## Error Display Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER WRITES CODE                            │
│  Writes C++ with syntax error: missing semicolon                 │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                   USER CLICKS "RUN"                              │
│  Frontend sends code + language to /api/streak/run               │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND: runCode() Function                         │
│  ✓ Extract language (cpp)                                        │
│  ✓ Wrap code with harness                                        │
│  ✓ Send to Docker for compilation                                │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DOCKER COMPILATION                             │
│  $ g++ solution.cpp -o solution.out                              │
│  stderr: solution.cpp:3:5: error: 'd' does not name a type       │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│           ERROR PARSER (errorParser.js)                          │
│  Input:  solution.cpp:3:5: error: 'd' does not name a type       │
│          solution.cpp:3:5: error: expected ';' before 'return'   │
│                                                                   │
│  Process:                                                         │
│  1. Detect language = 'cpp'                                       │
│  2. Use parseCppErrors()                                          │
│  3. Extract line numbers: 3, 3                                    │
│  4. Extract error types: error, error                             │
│  5. Format output                                                 │
│                                                                   │
│  Output: "Line 3: error: 'd' does not name a type                │
│           Line 3: error: expected ';' before 'return'            │
│           2 errors found"                                         │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│              API RESPONSE TO FRONTEND                             │
│  {                                                                │
│    success: false,                                                │
│    message: "❌ Compilation/Runtime Error - error",               │
│    hasCompileError: true,                                         │
│    compileError: "Line 3: error: 'd'...\n\n2 errors found",       │
│    errorType: "error",                                            │
│    ...                                                             │
│  }                                                                │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│           FRONTEND: SolvePage Component                          │
│  Receives response                                                │
│  Checks: hasCompileError === true                                │
│  Renders red error box with formatted message                    │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│           USER SEES FORMATTED ERROR                              │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │ 🔴 Compilation/Runtime Error                               │   │
│  │ Line 3: error: 'd' does not name a type                    │   │
│  │ Line 3: error: expected ';' before 'return'                │   │
│  │                                                             │   │
│  │ 2 errors found                                              │   │
│  └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Language Tracking Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER SOLVES PROBLEM                            │
│  Selects Language: Python                                        │
│  Writes working code                                             │
│  Clicks "Submit"                                                 │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│         BACKEND: submitSolution() Function                       │
│  ✓ Extract language = 'python'                                   │
│  ✓ Run all test cases                                            │
│  ✓ All pass → status = 'passed'                                  │
│  ✓ Prepare to update user                                        │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│        UPDATE USER: completedQuestions Array                      │
│                                                                   │
│  user.completedQuestions.push({                                  │
│    questionId: ObjectId("..."),                                  │
│    difficulty: "Level 5",                                        │
│    language: "python",        ← NEW FIELD!                       │
│    completedAt: Date.now()                                       │
│  })                                                               │
│                                                                   │
│  user.save()                                                      │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│        LATER: USER VIEWS SOLVED HISTORY                           │
│  Frontend: GET /api/streak/history                               │
│  Backend: Return completedQuestions array                        │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│          FRONTEND: StreakHistory Component                        │
│  Maps through items                                              │
│  Renders title + difficulty badge + LANGUAGE BADGE              │
│                                                                   │
│  Language badge selection:                                       │
│  if language === 'python' → blue badge                           │
│  if language === 'javascript' → gold badge                       │
│  if language === 'java' → dark blue badge                        │
│  if language === 'cpp' → teal badge                              │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│         USER SEES SOLVED HISTORY WITH LANGUAGES                  │
│                                                                   │
│  ✓ Single Number        Level 5  Python                          │
│    Solved: Oct 23, 2025 3:45 PM                                  │
│                                                                   │
│  ✓ Two Sum              Level 3  JavaScript                      │
│    Solved: Oct 23, 2025 2:30 PM                                  │
│                                                                   │
│  ✓ Contains Duplicate   Level 2  Java                            │
│    Solved: Oct 23, 2025 1:15 PM                                  │
│                                                                   │
│  ✓ Valid Parentheses    Level 4  C++                             │
│    Solved: Oct 22, 2025 5:00 PM                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Parser Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    errorParser.js Module                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  parseErrors(stderr, language)                                   │
│  ├─ Detects language                                             │
│  ├─ Routes to appropriate parser                                 │
│  └─ Returns formatted error string                               │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Language-Specific Parsers                                    │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │                                                               │ │
│  │ parseCppErrors()          parsePythonErrors()                │ │
│  │ ├─ Regex: file:line:col   ├─ Regex: File "...", line N      │ │
│  │ ├─ Extract: line, type    ├─ Extract: line, error type      │ │
│  │ └─ Format: "Line N: type" └─ Format with caret indicator    │ │
│  │                                                               │ │
│  │ parseJavaErrors()         parseJavaScriptErrors()            │ │
│  │ ├─ Regex: file:line:      ├─ Check for Error/Type/Warning   │ │
│  │ ├─ Extract: line, type    ├─ Extract line from at clause    │ │
│  │ └─ Format: "Line N: type" └─ Return full error message      │ │
│  │                                                               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  formatErrorForDisplay(stderr, language, code)                   │
│  ├─ Call parseErrors()                                           │
│  ├─ Extract error type                                           │
│  ├─ Extract line numbers                                         │
│  └─ Return structured object for UI                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Diagram

```
                    ┌──────────────────┐
                    │    SolvePage     │
                    │   Component      │
                    │   (Frontend)     │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
     ┌─────────────────┐          ┌──────────────────┐
     │ Run Button      │          │ Submit Button    │
     │ POST /run       │          │ POST /submit     │
     └────────┬────────┘          └────────┬─────────┘
              │                             │
              └──────────────┬──────────────┘
                             │
                      ┌──────▼────────┐
                      │   Backend     │
                      │  streakController
                      │   runCode()   │
                      │   submit()    │
                      └──────┬────────┘
                             │
                      ┌──────▼────────┐
                      │ Docker        │
                      │ Execution     │
                      │ Compile/Run   │
                      └──────┬────────┘
                             │
                      ┌──────▼────────┐
                      │  stderr       │
                      │  stdout       │
                      └──────┬────────┘
                             │
                      ┌──────▼────────────┐
                      │ errorParser.js    │
                      │ formatErrorDisplay│
                      └──────┬────────────┘
                             │
                      ┌──────▼────────┐
                      │ Formatted     │
                      │ Error Message │
                      │ with lines    │
                      └──────┬────────┘
                             │
                      ┌──────▼────────┐
                      │ API Response  │
                      │ + error data  │
                      └──────┬────────┘
                             │
                      ┌──────▼────────┐
                      │  Frontend     │
                      │ Displays      │
                      │ Red Error Box │
                      └───────────────┘
```

---

## Database Schema Update

```
┌─────────────────────────────────────────────────────────────┐
│ User Collection: completedQuestions Array                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ BEFORE:                                                       │
│ {                                                             │
│   questionId: ObjectId,                                       │
│   difficulty: "Level 5",                                      │
│   completedAt: Date                                           │
│ }                                                             │
│                                                               │
│ AFTER:                                                        │
│ {                                                             │
│   questionId: ObjectId,                                       │
│   difficulty: "Level 5",                                      │
│   language: "python",          ← NEW FIELD                    │
│   completedAt: Date                                           │
│ }                                                             │
│                                                               │
│ language enum: ['javascript', 'python', 'java', 'cpp']        │
│ language default: 'javascript'                                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## API Response Flow

```
┌─────────────────────────────────────────────────────────────┐
│              /api/streak/run Response (Old)                  │
├─────────────────────────────────────────────────────────────┤
│ {                                                             │
│   success: false,                                             │
│   message: "3/5 tests passed",                                │
│   passedCount: 3,                                             │
│   totalCount: 5,                                              │
│   testResults: [...]                                          │
│ }                                                             │
└─────────────────────────────────────────────────────────────┘

                            ▼

┌─────────────────────────────────────────────────────────────┐
│              /api/streak/run Response (New)                  │
├─────────────────────────────────────────────────────────────┤
│ {                                                             │
│   success: false,                                             │
│   message: "❌ Compilation/Runtime Error - SyntaxError",      │
│   passedCount: 0,                                             │
│   totalCount: 5,                                              │
│   testResults: [...],                                         │
│   hasCompileError: true,            ← NEW                     │
│   compileError: "Line 3: error: ...", ← NEW                  │
│   errorType: "SyntaxError",         ← NEW                     │
│   firstFailedCase: {...}                                      │
│ }                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Error Display Styling

```
┌─────────────────────────────────────────────────────────────┐
│           How Error is Rendered in Frontend                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ 🔴 Compilation/Runtime Error                           │   │
│  │                                                         │   │
│  │ Line 3: error: 'd' does not name a type                │   │
│  │ Line 3: error: expected ';' before 'return'            │   │
│  │                                                         │   │
│  │ 2 errors found                                          │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                               │
│  Styles Applied:                                              │
│  - backgroundColor: #fee (light red)                          │
│  - border: 2px solid #f44 (red)                               │
│  - fontFamily: monospace                                      │
│  - color: #c00 (dark red)                                     │
│  - whiteSpace: pre-wrap (preserves formatting)                │
│  - fontSize: 12px                                             │
│  - lineHeight: 1.5 (spacing)                                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Language Badge Colors

```
┌────────────────┬──────────────┬──────────────┬──────────────┐
│  Language      │ Light Theme  │ Dark Theme   │ Display      │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ JavaScript     │ #f7df1e      │ #d4af37      │ 🟡 Gold      │
│ Python         │ #3776ab      │ #1f6f9f      │ 🔵 Blue      │
│ Java           │ #007396      │ #004b87      │ 🟣 Purple    │
│ C++            │ #00599c      │ #003d73      │ 🔷 Teal      │
└────────────────┴──────────────┴──────────────┴──────────────┘
```

---

## Data Flow Summary

```
USER INPUT
    │
    ▼
FRONTEND (React)
    │
    ├─ Read: code, language, questionId
    ├─ Action: Send POST to /api/streak/run
    │
    ▼
BACKEND (Node.js)
    │
    ├─ runCode() or submitSolution()
    ├─ Execute in Docker
    ├─ Get stdout/stderr
    │
    ▼
ERROR PARSER (if stderr exists)
    │
    ├─ Detect language
    ├─ Parse errors
    ├─ Extract line numbers
    ├─ Format output
    │
    ▼
API RESPONSE
    │
    ├─ hasCompileError: boolean
    ├─ compileError: formatted string
    ├─ errorType: string
    │
    ▼
FRONTEND RENDER
    │
    └─ Show red error box with formatted message
```

---

**All architectures are backward compatible and production-ready! ✅**
