# 🎨 Admin Practice Problems - Visual Guide

## 📸 What You'll See

### 1. Stats Dashboard (Top Section)
```
┌─────────────────────────────────────────────────────────────────┐
│                📝 Admin Practice Problems Manager                │
│              Upload and manage coding practice problems           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  📚          │ │  ⭐          │ │  🟡          │ │  🔴          │
│ Total        │ │ Easy         │ │ Medium       │ │ Hard         │
│ Problems     │ │              │ │              │ │              │
│    15        │ │     5        │ │     7        │ │     3        │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### 2. Tab Navigation
```
┌─────────────────────────────────────────────────────────────────┐
│  📤 Upload Problems    │    📚 Problems History (15)             │
│  ══════════════════    │                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📤 Upload Tab View

```
┌─────────────────────────────────────────────────────────────────┐
│ 📤 Upload Problems                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Number of Problems to Upload                                    │
│ ┌──────────────────────────────────────────┐                    │
│ │ 3                                        │                    │
│ └──────────────────────────────────────────┘                    │
│ Enter how many problems you want to upload                      │
│                                                                  │
│ Select JSON File                                                │
│ ┌──────────────────────────────────────────┐                    │
│ │ [Choose File]  practice-problems.json    │                    │
│ └──────────────────────────────────────────┘                    │
│ Upload a JSON file with your problems                           │
│                                                                  │
│ ┌──────────────────────────────────────────┐                    │
│ │ ✅ JSON Preview                          │                    │
│ │ Problems Found: 3                        │                    │
│ │ {                                        │                    │
│ │   "problems": [                          │                    │
│ │     { "title": "Two Sum", ... }          │                    │
│ │   ]                                      │                    │
│ │ }                                        │                    │
│ └──────────────────────────────────────────┘                    │
│                                                                  │
│        ┌─────────────────────────────────┐                      │
│        │  🚀 Validate & Upload          │                      │
│        └─────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 📋 Required JSON Format                                          │
├─────────────────────────────────────────────────────────────────┤
│ {                                                                │
│   "problems": [                                                  │
│     {                                                            │
│       "title": "Two Sum",                                        │
│       "description": "Find two numbers...",                      │
│       "difficulty": "Easy",                                      │
│       ...                                                        │
│     }                                                            │
│   ]                                                              │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 History Tab View

```
┌─────────────────────────────────────────────────────────────────┐
│ 📚 Uploaded Problems History                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌──────────────────────────────────────────────────────┐        │
│ │ 🔍 Search by title or description...                 │        │
│ └──────────────────────────────────────────────────────┘        │
│                                                                  │
│ ┌───────────────────────┐  ┌───────────────────────┐           │
│ │ All Difficulties   ▼  │  │ All Topics        ▼  │           │
│ └───────────────────────┘  └───────────────────────┘           │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ #  │ Title          │ Difficulty │ Topic   │ Test Cases │ ... │
│────┼────────────────┼────────────┼─────────┼────────────┼─────│
│ 1  │ Two Sum        │  Easy      │ Arrays  │ Total: 5   │ ✏️🗑️│
│    │ 🔧 twoSum      │            │         │ 🔒 2       │     │
│────┼────────────────┼────────────┼─────────┼────────────┼─────│
│ 2  │ Valid Parens   │  Easy      │ Strings │ Total: 4   │ ✏️🗑️│
│    │ 🔧 isValid     │            │         │ 🔒 2       │     │
│────┼────────────────┼────────────┼─────────┼────────────┼─────│
│ 3  │ Longest Sub... │  Medium    │ Strings │ Total: 6   │ ✏️🗑️│
│    │ 🔧 lengthOfL...│            │         │ 🔒 3       │     │
│────┼────────────────┼────────────┼─────────┼────────────┼─────│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✏️ Edit Modal View

```
        ┌───────────────────────────────────────────┐
        │ ✏️ Edit Problem                      ✖️  │
        ├───────────────────────────────────────────┤
        │                                           │
        │ Title                                     │
        │ ┌───────────────────────────────────────┐ │
        │ │ Two Sum                               │ │
        │ └───────────────────────────────────────┘ │
        │                                           │
        │ Description                               │
        │ ┌───────────────────────────────────────┐ │
        │ │ Given an array of integers nums and   │ │
        │ │ an integer target, return indices of  │ │
        │ │ the two numbers that add up to target │ │
        │ └───────────────────────────────────────┘ │
        │                                           │
        │ Difficulty          Topic                 │
        │ ┌────────────────┐  ┌──────────────────┐ │
        │ │ Easy        ▼ │  │ Arrays          │ │
        │ └────────────────┘  └──────────────────┘ │
        │                                           │
        │ Constraints                               │
        │ ┌───────────────────────────────────────┐ │
        │ │ 2 <= nums.length <= 10^4              │ │
        │ └───────────────────────────────────────┘ │
        │                                           │
        │ Hints (comma-separated)                   │
        │ ┌───────────────────────────────────────┐ │
        │ │ Use a hash map, Think O(n) solution   │ │
        │ └───────────────────────────────────────┘ │
        │                                           │
        ├───────────────────────────────────────────┤
        │               ┌────────┐  ┌────────────┐ │
        │               │ Cancel │  │ 💾 Save    │ │
        │               └────────┘  └────────────┘ │
        └───────────────────────────────────────────┘
```

---

## 🎨 Color Scheme

### Difficulty Badges
- **Easy**: Green background (`#d1fae5`), Dark green text (`#065f46`)
- **Medium**: Yellow background (`#fef3c7`), Dark orange text (`#92400e`)
- **Hard**: Red background (`#fee2e2`), Dark red text (`#991b1b`)

### Action Buttons
- **Edit (✏️)**: Blue background, hover effect
- **Delete (🗑️)**: Red background, hover effect

### Dark Mode
- Background: Dark gray (`#1a1a1a`)
- Cards: Slightly lighter (`#2d2d2d`)
- Text: White/light gray
- Badges: Darker backgrounds with lighter text

---

## 📊 Table Columns Explained

| Column | What It Shows | Example |
|--------|---------------|---------|
| # | Row number | 1, 2, 3... |
| Title | Problem name + function signature | "Two Sum<br>🔧 twoSum" |
| Difficulty | Easy/Medium/Hard badge | <span style="background:green;padding:4px 8px;border-radius:20px;">Easy</span> |
| Topic | Problem category | Arrays, Strings, DP |
| Test Cases | Total count + hidden count | "Total: 5<br>🔒 2" |
| Acceptance | Success rate percentage | 67.5% |
| Submissions | Total attempts | 120 |
| Actions | Edit & Delete buttons | ✏️ 🗑️ |

---

## 🔍 Search Examples

### Search by Title
```
Search: "two sum"
Result: Shows "Two Sum" problem
```

### Search by Description
```
Search: "valid parentheses"
Result: Shows "Valid Parentheses" problem
```

### Combined Filters
```
Search: "array"
Difficulty: Easy
Topic: Arrays
Result: Shows all Easy problems about Arrays containing "array"
```

---

## 🎯 Interactive Elements

### Hover Effects
- **Stats Cards**: Lift up, green border appears
- **Table Rows**: Background changes to highlight
- **Buttons**: Scale up slightly, color intensifies
- **Edit Button**: Changes from blue to darker blue
- **Delete Button**: Changes from red to darker red

### Click Effects
- **Tab**: Switches content, updates border color
- **Edit**: Opens modal with smooth fade-in
- **Delete**: Shows confirmation dialog
- **Modal Overlay**: Closes modal when clicked
- **Save Button**: Submits form, shows loading state

---

## 📱 Responsive Design

### Desktop (1400px+)
- Full table with all columns visible
- 4-column stats grid
- Side-by-side filters

### Tablet (768px - 1399px)
- Scrollable table
- 2-column stats grid
- Stacked filters

### Mobile (< 768px)
- Horizontal scroll table
- 1-column stats grid
- Full-width filters
- Modal takes 90% width

---

## ✨ Animations

### Page Load
- Stats cards fade in from top
- Table rows appear sequentially
- Smooth 0.3s transitions

### Tab Switch
- Content fades out, new content fades in
- Active tab border slides smoothly

### Modal
- Background overlay fades in (0.2s)
- Modal scales from 0.9 to 1.0
- Close with reverse animation

### Delete
- Row fades out before removal
- Success toast slides in from top

---

## 🎉 User Feedback

### Success Messages (Green Toast)
```
┌────────────────────────────────┐
│ ✅ 3 problem(s) uploaded!      │
└────────────────────────────────┘
```

### Error Messages (Red Toast)
```
┌────────────────────────────────┐
│ ❌ Failed to delete problem    │
└────────────────────────────────┘
```

### Loading States
```
Button: ⏳ Uploading...
Button: 💾 Saving...
```

### Confirmation Dialog
```
┌────────────────────────────────┐
│ Are you sure you want to       │
│ delete this problem?            │
│ This action cannot be undone.  │
│                                 │
│    [Cancel]    [OK, Delete]    │
└────────────────────────────────┘
```

---

## 🚀 Final Result

A **professional, production-ready** admin interface that looks like:
- LeetCode admin panel
- GitHub issues page
- Modern SaaS dashboard

With all CRUD operations beautifully designed and fully functional! ✨
