# 🎨 LeetCode-Style Submission UI - Visual Guide

## Overall Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    LEFT PANEL                    │ RIGHT PANEL
│                                                  │
│ ┌──────────────────────────────────────────┐   │ ┌────────────────────┐
│ │ [⬅] Problem Title                    [✓]│   │ │ JavaScript  | ...  │
│ │                                        │   │ │ ┌──────────────────┐│
│ ├──────────────────────────────────────────┤   │ │                  ││
│ │ Difficulty: Medium    Topic: Arrays     │   │ │  Monaco Editor   ││
│ │ Acceptance: 45.2%                      │   │ │                  ││
│ ├──────────────────────────────────────────┤   │ │                  ││
│ │                                        │   │ └──────────────────┘│
│ │ [📋 Description] [✓ Submissions (0)]   │   │ ┌──────────────────┐│
│ │                                        │   │ │ [▶ Run] [Submit] ││
│ │ Description Content:                   │   │ └──────────────────┘│
│ │ - Problem statement                    │   │ └────────────────────┘
│ │ - Examples                             │
│ │ - Constraints                          │
│ │ - Hints                                │
│ │ - Test cases                           │
│ │                                        │
│ └──────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

---

## Back Button

```
┌────────────────────────────────────────┐
│ ┌──┐                                   │
│ │⬅│  Problem Title                    │
│ └──┘                                   │
│ • Click to go back to problems list   │
│ • Hover: border color changes         │
│ • Smooth animation                    │
│ • Mobile-friendly                     │
└────────────────────────────────────────┘

States:
┌──┐  →  ┌──┐  →  ┌──┐
│⬅│      │⬅│      │⬅│
└──┘      └──┘      └──┘
Normal    Hover    Active
```

---

## Tab Navigation

```
Description Tab        Submissions Tab
     ▼                      ▼
┌──────────────┬──────────────────────┐
│ 📋 Description  │ ✓ Submissions (2) │
└──────────────┴──────────────────────┘
│ ─────────────────                      ← Active underline (animated)
│
│ Content here...
```

### Tab States:

```
INACTIVE TAB:
┌──────────────┐
│ 📋 Description
└──────────────┘
(Gray text, no underline)

ACTIVE TAB:
┌──────────────┐
│ ✓ Submissions (2)
└──────────────┘
│══════════════  ← Purple gradient underline
(Purple text)
```

---

## Description Tab Content

```
┌─────────────────────────────────────┐
│ 📋 DESCRIPTION                      │
├─────────────────────────────────────┤
│                                     │
│ Given an array of integers, find    │
│ the sum of all elements.            │
│                                     │
│                                     │
│ 📝 EXAMPLES                         │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Input: [1, 2, 3]                │ │
│ │ Output: 6                       │ │
│ │ Explanation: 1 + 2 + 3 = 6      │ │
│ └─────────────────────────────────┘ │
│                                     │
│                                     │
│ ⚠️ CONSTRAINTS                      │
├─────────────────────────────────────┤
│ ⚠️ 1 ≤ n ≤ 10⁵                      │
│ ⚠️ -10⁹ ≤ nums[i] ≤ 10⁹            │
│                                     │
│                                     │
│ 💡 HINTS                            │
├─────────────────────────────────────┤
│ 💡 Use a simple loop to add numbers │
│ 💡 Watch out for integer overflow   │
│                                     │
└─────────────────────────────────────┘
```

---

## Submissions Tab - Accepted

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  ┌──┐                                                  │
│  │✓ │  Accepted                          Runtime: 45ms │
│  │  │  Your solution passed all          Memory: 12.5MB │
│  │  │  test cases!                                    │
│  └──┘                                                  │
│                                                        │
│  3/3 test cases passed                                │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Test Case 1 ✓ Passed                           │  │
│  ├─────────────────────────────────────────────────┤  │
│  │ Input:          [1, 2, 3]                       │  │
│  │ Expected Output: 6                              │  │
│  │ Your Output:    6                               │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Test Case 2 ✓ Passed                           │  │
│  ├─────────────────────────────────────────────────┤  │
│  │ Input:          [5, 10, 15]                     │  │
│  │ Expected Output: 30                             │  │
│  │ Your Output:    30                              │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Test Case 3 ✓ Passed                           │  │
│  ├─────────────────────────────────────────────────┤  │
│  │ Input:          [-1, 0, 1]                      │  │
│  │ Expected Output: 0                              │  │
│  │ Your Output:    0                               │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘

Color: Green gradient background
Border: #10b981 (Green)
Text: Dark green for status
```

---

## Submissions Tab - Failed

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  ┌──┐                                                  │
│  │✗ │  Not Accepted                    Runtime: 62ms  │
│  │  │  Some test cases failed          Memory: 15MB   │
│  │  │                                                 │
│  └──┘                                                  │
│                                                        │
│  2/3 test cases passed                                │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Test Case 1 ✓ Passed                           │  │
│  ├─────────────────────────────────────────────────┤  │
│  │ Input:          [1, 2, 3]                       │  │
│  │ Expected Output: 6                              │  │
│  │ Your Output:    6                               │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Test Case 2 ✗ Failed                           │  │
│  ├─────────────────────────────────────────────────┤  │
│  │ Input:          [5, 10, 15]                     │  │
│  │ Expected Output: 30                             │  │
│  │ Your Output:    35                              │  │
│  │ Error:          Off by 5                        │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Test Case 3 ✓ Passed                           │  │
│  ├─────────────────────────────────────────────────┤  │
│  │ Input:          [-1, 0, 1]                      │  │
│  │ Expected Output: 0                              │  │
│  │ Your Output:    0                               │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘

Color: Red gradient background
Border: #ef4444 (Red)
Text: Dark red for status
```

---

## Status Icons

### Success Icon
```
    ✓
   /│\
    │
   / \

Display: 56x56 circle
Background: #d1fae5 (Light green)
Color: #10b981 (Green)
Font: Large, bold
```

### Failed Icon
```
    ✗
   /│\
    │
   / \

Display: 56x56 circle
Background: #fee2e2 (Light red)
Color: #ef4444 (Red)
Font: Large, bold
```

---

## Test Case Result Colors

### Passed Test Case
```
┌────────────────┐
│ Test 1 ✓ Passed │  ← Green header
├────────────────┤
│ Content...     │  ← Light green border
└────────────────┘

Border: #d1fae5 (Green)
Header BG: rgba(16, 185, 129, 0.05)
Text: #10b981 (Green)
```

### Failed Test Case
```
┌────────────────┐
│ Test 2 ✗ Failed │  ← Red header
├────────────────┤
│ Content...     │  ← Light red border
└────────────────┘

Border: #fee2e2 (Red)
Header BG: rgba(239, 68, 68, 0.05)
Text: #ef4444 (Red)
```

---

## Submission History

```
┌──────────────────────────────────┐
│ Recent Submissions               │
├──────────────────────────────────┤
│ ✓ Accepted  | JavaScript | 10:45 │
├──────────────────────────────────┤
│ ✗ Failed    | Python    | 10:32 │
├──────────────────────────────────┤
│ ✓ Accepted  | Java      | 10:15 │
└──────────────────────────────────┘

Each item shows:
- Status (✓/✗)
- Language used
- Time submitted
```

---

## Empty State

```
┌────────────────────────────┐
│                            │
│          📨                │
│                            │
│     No submissions yet     │
│                            │
│  Submit your solution to   │
│  see results here          │
│                            │
└────────────────────────────┘

Shown when: Submissions tab has no history
Icon: 3rem size, 60% opacity
Messages: Primary + secondary text
```

---

## Color Palette

```
PRIMARY:
  #667eea - Purple (main interactive)
  #764ba2 - Purple (secondary)

SUCCESS:
  #d1fae5 - Light green background
  #10b981 - Green text/border

ERROR:
  #fee2e2 - Light red background
  #ef4444 - Red text/border

NEUTRAL:
  var(--text-primary)     - Main text
  var(--text-secondary)   - Secondary text
  var(--card-bg)          - Card background
  var(--bg-primary)       - Primary background
  var(--border-color)     - Borders
```

---

## Responsive Breakpoints

### Desktop (>1024px)
- Side-by-side layout
- Full panel widths
- All features visible

### Tablet (768px - 1024px)
- Slightly adjusted spacing
- Tabs still visible
- Touch-friendly buttons

### Mobile (<768px)
- Stacked layout
- Smaller back button (36px)
- Smaller fonts
- Adjusted padding
- Full-width content

---

## Animation Details

### Tab Switch
```
Duration: 0.3s
Effect: Fade in + slight slide down
Easing: ease
```

### Back Button Hover
```
Transform: translateX(-3px)  // Moves left
Border: Changes to #667eea
BG: Gradient animation
Transition: 0.3s ease
```

### Back Button Active
```
Transform: translateX(-1px)
Creates click feedback
```

---

## Accessibility Features

✓ Color contrast meets WCAG AA standards
✓ Back button has hover/active states
✓ Tabs are keyboard navigable
✓ Status icons have semantic meaning
✓ Status messages clear and descriptive
✓ Mobile touch targets are large enough
✓ Dark mode support for eye comfort
✓ Semantic HTML structure

---

## Pro Tips for Users

1. **Quick Feedback**: Run code first to catch errors
2. **Debug Mode**: Check test case details for failures
3. **History View**: See all previous attempts
4. **Tab Organization**: Description on left, Results on right (when needed)
5. **Mobile Tip**: Scroll down to see full test results

---

**Beautiful, Functional, LeetCode-Inspired UI** ✨
