// Problem database for C and Java languages
export const problemsDatabase = {
  c: {
    arrays: {
      beginner: [
        {
          id: 'c_array_1',
          title: 'Find Maximum Element',
          description: 'Write a program to find the maximum element in an array.',
          starterCode: `#include <stdio.h>

int findMax(int arr[], int n) {
    // Write your code here
    
}

int main() {
    int arr[] = {3, 5, 1, 9, 2};
    int n = 5;
    int max = findMax(arr, n);
    printf("Maximum element: %d\\n", max);
    return 0;
}`,
          testCases: [
            { input: [3, 5, 1, 9, 2], expected: 9, description: "Array with mixed numbers" },
            { input: [1], expected: 1, description: "Single element array" },
            { input: [-5, -2, -8, -1], expected: -1, description: "Array with negative numbers" }
          ],
          hints: ['Iterate through the array', 'Keep track of the maximum value seen so far', 'Initialize max with the first element']
        },
        {
          id: 'c_array_2',
          title: 'Array Sum',
          description: 'Calculate the sum of all elements in an array.',
          starterCode: `#include <stdio.h>

int arraySum(int arr[], int n) {
    // Write your code here
    
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int n = 5;
    int sum = arraySum(arr, n);
    printf("Sum: %d\\n", sum);
    return 0;
}`,
          testCases: [
            { input: [1, 2, 3, 4, 5], expected: 15, description: "Positive numbers" },
            { input: [0, 0, 0], expected: 0, description: "All zeros" },
            { input: [-1, 1, -2, 2], expected: 0, description: "Mixed positive and negative" }
          ],
          hints: ['Initialize sum to 0', 'Loop through each element', 'Add each element to the sum']
        },
        {
          id: 'c_array_3',
          title: 'Reverse Array',
          description: 'Reverse the elements of an array in place.',
          starterCode: `#include <stdio.h>

void reverseArray(int arr[], int n) {
    // Write your code here
    
}

void printArray(int arr[], int n) {
    for(int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int n = 5;
    reverseArray(arr, n);
    printArray(arr, n);
    return 0;
}`,
          testCases: [
            { input: [1, 2, 3, 4, 5], expected: [5, 4, 3, 2, 1], description: "Odd length array" },
            { input: [1, 2, 3, 4], expected: [4, 3, 2, 1], description: "Even length array" },
            { input: [42], expected: [42], description: "Single element" }
          ],
          hints: ['Use two pointers approach', 'Swap elements from both ends', 'Move pointers towards center']
        },
        {
          id: 'c_array_4',
          title: 'Count Occurrences',
          description: 'Count how many times a specific element appears in an array.',
          starterCode: `#include <stdio.h>

int countOccurrences(int arr[], int n, int target) {
    // Write your code here
    
}

int main() {
    int arr[] = {1, 2, 3, 2, 2, 4};
    int n = 6;
    int target = 2;
    int count = countOccurrences(arr, n, target);
    printf("Element %d appears %d times\\n", target, count);
    return 0;
}`,
          testCases: [
            { input: [[1, 2, 3, 2, 2, 4], 2], expected: 3, description: "Multiple occurrences" },
            { input: [[1, 2, 3, 4, 5], 6], expected: 0, description: "Element not found" },
            { input: [[5, 5, 5, 5], 5], expected: 4, description: "All elements same" }
          ],
          hints: ['Initialize counter to 0', 'Check each element against target', 'Increment counter when match found']
        },
        {
          id: 'c_array_5',
          title: 'Find Second Largest',
          description: 'Find the second largest element in an array.',
          starterCode: `#include <stdio.h>

int findSecondLargest(int arr[], int n) {
    // Write your code here
    
}

int main() {
    int arr[] = {3, 1, 4, 1, 5, 9, 2};
    int n = 7;
    int second = findSecondLargest(arr, n);
    printf("Second largest: %d\\n", second);
    return 0;
}`,
          testCases: [
            { input: [3, 1, 4, 1, 5, 9, 2], expected: 5, description: "Array with duplicates" },
            { input: [1, 2], expected: 1, description: "Two elements" },
            { input: [5, 5, 4, 4], expected: 4, description: "Multiple duplicates" }
          ],
          hints: ['Keep track of largest and second largest', 'Handle duplicates properly', 'Return -1 if no second largest exists']
        }
      ],
      medium: [
        {
          id: 'c_array_med_1',
          title: 'Two Sum Problem',
          description: 'Find two numbers in an array that add up to a target sum.',
          starterCode: `#include <stdio.h>

void twoSum(int arr[], int n, int target, int result[]) {
    // Write your code here
    // Store indices in result array: result[0] = first index, result[1] = second index
    // If no solution, set both to -1
    
}

int main() {
    int arr[] = {2, 7, 11, 15};
    int n = 4;
    int target = 9;
    int result[2];
    twoSum(arr, n, target, result);
    printf("Indices: %d, %d\\n", result[0], result[1]);
    return 0;
}`,
          testCases: [
            { input: [[2, 7, 11, 15], 9], expected: [0, 1], description: "Target found at beginning" },
            { input: [[3, 2, 4], 6], expected: [1, 2], description: "Target in middle/end" },
            { input: [[3, 3], 6], expected: [0, 1], description: "Same number twice" }
          ],
          hints: ['Use nested loops to check all pairs', 'Check if arr[i] + arr[j] equals target', 'Return indices when found']
        }
      ],
      advanced: [
        {
          id: 'c_array_adv_1',
          title: 'Merge Sorted Arrays',
          description: 'Merge two sorted arrays into one sorted array.',
          starterCode: `#include <stdio.h>

void mergeSortedArrays(int arr1[], int n1, int arr2[], int n2, int result[]) {
    // Write your code here
    
}

int main() {
    int arr1[] = {1, 3, 5};
    int arr2[] = {2, 4, 6};
    int n1 = 3, n2 = 3;
    int result[6];
    mergeSortedArrays(arr1, n1, arr2, n2, result);
    
    for(int i = 0; i < n1 + n2; i++) {
        printf("%d ", result[i]);
    }
    printf("\\n");
    return 0;
}`,
          testCases: [
            { input: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6], description: "Equal length arrays" },
            { input: [[1, 2, 3], [4, 5]], expected: [1, 2, 3, 4, 5], description: "Different length arrays" }
          ],
          hints: ['Use two pointers for both arrays', 'Compare elements and add smaller one', 'Handle remaining elements']
        }
      ]
    },
    strings: {
      beginner: [
        {
          id: 'c_string_1',
          title: 'String Length',
          description: 'Calculate the length of a string without using strlen().',
          starterCode: `#include <stdio.h>

int stringLength(char str[]) {
    // Write your code here
    
}

int main() {
    char str[] = "Hello World";
    int length = stringLength(str);
    printf("Length: %d\\n", length);
    return 0;
}`,
          testCases: [
            { input: "Hello World", expected: 11, description: "String with space" },
            { input: "", expected: 0, description: "Empty string" },
            { input: "C", expected: 1, description: "Single character" }
          ],
          hints: ['Iterate through characters until null terminator', 'Count each character', 'Stop at \\0']
        }
      ],
      medium: [
        {
          id: 'c_string_med_1',
          title: 'Palindrome Check',
          description: 'Check if a string is a palindrome (reads same forwards and backwards).',
          starterCode: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

int isPalindrome(char str[]) {
    // Write your code here
    // Return 1 if palindrome, 0 if not
    
}

int main() {
    char str[] = "racecar";
    if(isPalindrome(str)) {
        printf("The string is a palindrome\\n");
    } else {
        printf("The string is not a palindrome\\n");
    }
    return 0;
}`,
          testCases: [
            { input: "racecar", expected: 1, description: "Simple palindrome" },
            { input: "hello", expected: 0, description: "Not a palindrome" },
            { input: "A man a plan a canal Panama", expected: 1, description: "Palindrome with spaces" }
          ],
          hints: ['Compare characters from both ends', 'Use two pointers approach', 'Ignore spaces and case for advanced version']
        }
      ],
      advanced: [
        {
          id: 'c_string_adv_1',
          title: 'String Compression',
          description: 'Compress a string using counts of repeated characters.',
          starterCode: `#include <stdio.h>

void compressString(char str[], char result[]) {
    // Write your code here
    // Example: "aabcccccaaa" -> "a2b1c5a3"
    
}

int main() {
    char str[] = "aabcccccaaa";
    char result[100];
    compressString(str, result);
    printf("Compressed: %s\\n", result);
    return 0;
}`,
          testCases: [
            { input: "aabcccccaaa", expected: "a2b1c5a3", description: "Multiple groups" },
            { input: "abc", expected: "a1b1c1", description: "No compression needed" },
            { input: "aaa", expected: "a3", description: "Single character group" }
          ],
          hints: ['Count consecutive characters', 'Append character and count to result', 'Handle single character groups']
        }
      ]
    },
    loops: {
      beginner: [
        {
          id: 'c_loop_1',
          title: 'Print Numbers',
          description: 'Print numbers from 1 to N using a loop.',
          starterCode: `#include <stdio.h>

void printNumbers(int n) {
    // Write your code here
    
}

int main() {
    int n = 5;
    printNumbers(n);
    return 0;
}`,
          testCases: [
            { input: 5, expected: "1 2 3 4 5", description: "Print 1 to 5" },
            { input: 1, expected: "1", description: "Single number" },
            { input: 0, expected: "", description: "No output for 0" }
          ],
          hints: ['Use a for loop from 1 to n', 'Print each number followed by space', 'Add newline at end']
        }
      ],
      medium: [
        {
          id: 'c_loop_med_1',
          title: 'Factorial',
          description: 'Calculate factorial of a number using loops.',
          starterCode: `#include <stdio.h>

long long factorial(int n) {
    // Write your code here
    
}

int main() {
    int n = 5;
    long long result = factorial(n);
    printf("Factorial of %d is %lld\\n", n, result);
    return 0;
}`,
          testCases: [
            { input: 5, expected: 120, description: "5! = 120" },
            { input: 0, expected: 1, description: "0! = 1" },
            { input: 3, expected: 6, description: "3! = 6" }
          ],
          hints: ['Initialize result to 1', 'Multiply by each number from 1 to n', 'Handle special case of 0!']
        }
      ],
      advanced: [
        {
          id: 'c_loop_adv_1',
          title: 'Pattern Printing',
          description: 'Print a pyramid pattern using nested loops.',
          starterCode: `#include <stdio.h>

void printPyramid(int n) {
    // Write your code here
    // Print a pyramid like:
    //   *
    //  ***
    // *****
    
}

int main() {
    int n = 3;
    printPyramid(n);
    return 0;
}`,
          testCases: [
            { input: 3, expected: "  *\\n ***\\n*****", description: "3-level pyramid" },
            { input: 1, expected: "*", description: "Single level" },
            { input: 4, expected: "   *\\n  ***\\n *****\\n*******", description: "4-level pyramid" }
          ],
          hints: ['Use nested loops', 'Print spaces for alignment', 'Print stars based on level']
        }
      ]
    }
  },
  java: {
    arrays: {
      beginner: [
        {
          id: 'java_array_1',
          title: 'Find Maximum Element',
          description: 'Write a method to find the maximum element in an array.',
          starterCode: `public class Solution {
    public static int findMax(int[] arr) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        int[] arr = {3, 5, 1, 9, 2};
        int max = findMax(arr);
        System.out.println("Maximum element: " + max);
    }
}`,
          testCases: [
            { input: [3, 5, 1, 9, 2], expected: 9, description: "Array with mixed numbers" },
            { input: [1], expected: 1, description: "Single element array" },
            { input: [-5, -2, -8, -1], expected: -1, description: "Array with negative numbers" }
          ],
          hints: ['Iterate through the array', 'Keep track of the maximum value seen so far', 'Initialize max with the first element']
        },
        {
          id: 'java_array_2',
          title: 'Array Sum',
          description: 'Calculate the sum of all elements in an array.',
          starterCode: `public class Solution {
    public static int arraySum(int[] arr) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        int sum = arraySum(arr);
        System.out.println("Sum: " + sum);
    }
}`,
          testCases: [
            { input: [1, 2, 3, 4, 5], expected: 15, description: "Positive numbers" },
            { input: [0, 0, 0], expected: 0, description: "All zeros" },
            { input: [-1, 1, -2, 2], expected: 0, description: "Mixed positive and negative" }
          ],
          hints: ['Initialize sum to 0', 'Use enhanced for loop', 'Add each element to the sum']
        },
        {
          id: 'java_array_3',
          title: 'Reverse Array',
          description: 'Reverse the elements of an array in place.',
          starterCode: `import java.util.Arrays;

public class Solution {
    public static void reverseArray(int[] arr) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        reverseArray(arr);
        System.out.println(Arrays.toString(arr));
    }
}`,
          testCases: [
            { input: [1, 2, 3, 4, 5], expected: [5, 4, 3, 2, 1], description: "Odd length array" },
            { input: [1, 2, 3, 4], expected: [4, 3, 2, 1], description: "Even length array" },
            { input: [42], expected: [42], description: "Single element" }
          ],
          hints: ['Use two pointers approach', 'Swap elements from both ends', 'Move pointers towards center']
        },
        {
          id: 'java_array_4',
          title: 'Count Occurrences',
          description: 'Count how many times a specific element appears in an array.',
          starterCode: `public class Solution {
    public static int countOccurrences(int[] arr, int target) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 2, 2, 4};
        int target = 2;
        int count = countOccurrences(arr, target);
        System.out.println("Element " + target + " appears " + count + " times");
    }
}`,
          testCases: [
            { input: [[1, 2, 3, 2, 2, 4], 2], expected: 3, description: "Multiple occurrences" },
            { input: [[1, 2, 3, 4, 5], 6], expected: 0, description: "Element not found" },
            { input: [[5, 5, 5, 5], 5], expected: 4, description: "All elements same" }
          ],
          hints: ['Initialize counter to 0', 'Check each element against target', 'Increment counter when match found']
        },
        {
          id: 'java_array_5',
          title: 'Find Second Largest',
          description: 'Find the second largest element in an array.',
          starterCode: `public class Solution {
    public static int findSecondLargest(int[] arr) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        int[] arr = {3, 1, 4, 1, 5, 9, 2};
        int second = findSecondLargest(arr);
        System.out.println("Second largest: " + second);
    }
}`,
          testCases: [
            { input: [3, 1, 4, 1, 5, 9, 2], expected: 5, description: "Array with duplicates" },
            { input: [1, 2], expected: 1, description: "Two elements" },
            { input: [5, 5, 4, 4], expected: 4, description: "Multiple duplicates" }
          ],
          hints: ['Keep track of largest and second largest', 'Handle duplicates properly', 'Return -1 if no second largest exists']
        }
      ],
      medium: [
        {
          id: 'java_array_med_1',
          title: 'Two Sum Problem',
          description: 'Find two numbers in an array that add up to a target sum.',
          starterCode: `import java.util.Arrays;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your code here
        // Return array with indices of two numbers that add up to target
        
    }
    
    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);
        System.out.println("Indices: " + Arrays.toString(result));
    }
}`,
          testCases: [
            { input: [[2, 7, 11, 15], 9], expected: [0, 1], description: "Target found at beginning" },
            { input: [[3, 2, 4], 6], expected: [1, 2], description: "Target in middle/end" },
            { input: [[3, 3], 6], expected: [0, 1], description: "Same number twice" }
          ],
          hints: ['Use nested loops to check all pairs', 'Check if nums[i] + nums[j] equals target', 'Return indices when found']
        }
      ],
      advanced: [
        {
          id: 'java_array_adv_1',
          title: 'Merge Sorted Arrays',
          description: 'Merge two sorted arrays into one sorted array.',
          starterCode: `import java.util.Arrays;

public class Solution {
    public static int[] mergeSortedArrays(int[] arr1, int[] arr2) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        int[] arr1 = {1, 3, 5};
        int[] arr2 = {2, 4, 6};
        int[] result = mergeSortedArrays(arr1, arr2);
        System.out.println(Arrays.toString(result));
    }
}`,
          testCases: [
            { input: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6], description: "Equal length arrays" },
            { input: [[1, 2, 3], [4, 5]], expected: [1, 2, 3, 4, 5], description: "Different length arrays" }
          ],
          hints: ['Use two pointers for both arrays', 'Compare elements and add smaller one', 'Handle remaining elements']
        }
      ]
    },
    strings: {
      beginner: [
        {
          id: 'java_string_1',
          title: 'String Length',
          description: 'Calculate the length of a string without using length() method.',
          starterCode: `public class Solution {
    public static int stringLength(String str) {
        // Write your code here
        // Don't use str.length() method
        
    }
    
    public static void main(String[] args) {
        String str = "Hello World";
        int length = stringLength(str);
        System.out.println("Length: " + length);
    }
}`,
          testCases: [
            { input: "Hello World", expected: 11, description: "String with space" },
            { input: "", expected: 0, description: "Empty string" },
            { input: "J", expected: 1, description: "Single character" }
          ],
          hints: ['Convert string to char array', 'Count characters manually', 'Use try-catch for bounds']
        }
      ],
      medium: [
        {
          id: 'java_string_med_1',
          title: 'Palindrome Check',
          description: 'Check if a string is a palindrome (reads same forwards and backwards).',
          starterCode: `public class Solution {
    public static boolean isPalindrome(String str) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        String str = "racecar";
        if(isPalindrome(str)) {
            System.out.println("The string is a palindrome");
        } else {
            System.out.println("The string is not a palindrome");
        }
    }
}`,
          testCases: [
            { input: "racecar", expected: true, description: "Simple palindrome" },
            { input: "hello", expected: false, description: "Not a palindrome" },
            { input: "A man a plan a canal Panama", expected: true, description: "Palindrome with spaces" }
          ],
          hints: ['Compare characters from both ends', 'Use two pointers approach', 'Ignore spaces and case for advanced version']
        }
      ],
      advanced: [
        {
          id: 'java_string_adv_1',
          title: 'String Compression',
          description: 'Compress a string using counts of repeated characters.',
          starterCode: `public class Solution {
    public static String compressString(String str) {
        // Write your code here
        // Example: "aabcccccaaa" -> "a2b1c5a3"
        
    }
    
    public static void main(String[] args) {
        String str = "aabcccccaaa";
        String result = compressString(str);
        System.out.println("Compressed: " + result);
    }
}`,
          testCases: [
            { input: "aabcccccaaa", expected: "a2b1c5a3", description: "Multiple groups" },
            { input: "abc", expected: "a1b1c1", description: "No compression needed" },
            { input: "aaa", expected: "a3", description: "Single character group" }
          ],
          hints: ['Count consecutive characters', 'Use StringBuilder for efficiency', 'Handle single character groups']
        }
      ]
    },
    loops: {
      beginner: [
        {
          id: 'java_loop_1',
          title: 'Print Numbers',
          description: 'Print numbers from 1 to N using a loop.',
          starterCode: `public class Solution {
    public static void printNumbers(int n) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        int n = 5;
        printNumbers(n);
    }
}`,
          testCases: [
            { input: 5, expected: "1 2 3 4 5", description: "Print 1 to 5" },
            { input: 1, expected: "1", description: "Single number" },
            { input: 0, expected: "", description: "No output for 0" }
          ],
          hints: ['Use a for loop from 1 to n', 'Print each number followed by space', 'Add newline at end']
        }
      ],
      medium: [
        {
          id: 'java_loop_med_1',
          title: 'Factorial',
          description: 'Calculate factorial of a number using loops.',
          starterCode: `public class Solution {
    public static long factorial(int n) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        int n = 5;
        long result = factorial(n);
        System.out.println("Factorial of " + n + " is " + result);
    }
}`,
          testCases: [
            { input: 5, expected: 120, description: "5! = 120" },
            { input: 0, expected: 1, description: "0! = 1" },
            { input: 3, expected: 6, description: "3! = 6" }
          ],
          hints: ['Initialize result to 1', 'Multiply by each number from 1 to n', 'Handle special case of 0!']
        }
      ],
      advanced: [
        {
          id: 'java_loop_adv_1',
          title: 'Pattern Printing',
          description: 'Print a pyramid pattern using nested loops.',
          starterCode: `public class Solution {
    public static void printPyramid(int n) {
        // Write your code here
        // Print a pyramid like:
        //   *
        //  ***
        // *****
        
    }
    
    public static void main(String[] args) {
        int n = 3;
        printPyramid(n);
    }
}`,
          testCases: [
            { input: 3, expected: "  *\\n ***\\n*****", description: "3-level pyramid" },
            { input: 1, expected: "*", description: "Single level" },
            { input: 4, expected: "   *\\n  ***\\n *****\\n*******", description: "4-level pyramid" }
          ],
          hints: ['Use nested loops', 'Print spaces for alignment', 'Print stars based on level']
        }
      ]
    }
  }
};

// Function to get problems based on language, topic, and difficulty
export const getProblems = (language, topic, difficulty) => {
  try {
    const problems = problemsDatabase[language]?.[topic]?.[difficulty];
    return problems || [];
  } catch (error) {
    console.error('Error getting problems:', error);
    return [];
  }
};

// Function to get a random set of problems
export const getRandomProblems = (language, topic, difficulty, count = 5) => {
  const problems = getProblems(language, topic, difficulty);
  if (problems.length <= count) {
    return problems;
  }
  
  // Shuffle and return first 'count' problems
  const shuffled = [...problems].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
