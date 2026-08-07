/**
 * IT Service Company Coding Problem Bank
 * Companies: TCS, Infosys, Wipro, Cognizant, Accenture, HCL, Tech Mahindra
 * 15 problems per company = 105 total
 * Matches real NQT / campus hiring coding round patterns.
 */

import type { StaticProblem } from "./problem-bank"

export const SERVICE_PROBLEM_BANK: Record<string, StaticProblem & { company: string; pattern: string }> = {

// =============================================================================
// TCS (15 problems)
// =============================================================================

"TCS: Reverse Words in a String": {
  company: "tcs", pattern: "String Manipulation",
  title: "Reverse Words in a String",
  difficulty: "Easy",
  desc: "Given a string `s`, reverse the order of words. A word is defined as a sequence of non-space characters. The words in `s` will be separated by at least one space. Return a string of the words in reverse order concatenated by a single space. Note that there are no leading or trailing spaces and all words are separated by a single space in the result.",
  examples: [
    { input: 's = "the sky is blue"', output: '"blue is sky the"' },
    { input: 's = "  hello world  "', output: '"world hello"', explanation: "Reversed with no leading/trailing spaces" }
  ],
  constraints: ["1 <= s.length <= 10^4", "s contains printable ASCII characters", "There is at least one word in s"],
  functionSignature: "def reverseWords(self, s: str) -> str:",
  starters: {
    Python: "class Solution:\n    def reverseWords(self, s: str) -> str:\n        pass",
    JavaScript: "var reverseWords = function(s) {\n    \n};",
    TypeScript: "function reverseWords(s: string): string {\n    \n};",
    Java: "class Solution {\n    public String reverseWords(String s) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    string reverseWords(string s) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.reverseWords("the sky is blue"))', expected: "blue is sky the", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.reverseWords("  hello world  "))', expected: "world hello", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.reverseWords("a good   example"))', expected: "example good a", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.reverseWords("Alice"))', expected: "Alice", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.reverseWords("  Bob  Loves  Alice  "))', expected: "Alice Loves Bob", isPublic: false },
  ],
},

"TCS: Check Palindrome": {
  company: "tcs", pattern: "Two Pointers",
  title: "Check Palindrome",
  difficulty: "Easy",
  desc: "Given a string `s`, return `true` if it is a palindrome, or `false` otherwise. Consider only alphanumeric characters and ignore case.",
  examples: [
    { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: "Alphanumeric: amanaplanacanalpanama is a palindrome" },
    { input: 's = "race a car"', output: "false" }
  ],
  constraints: ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters"],
  functionSignature: "def isPalindrome(self, s: str) -> bool:",
  starters: {
    Python: "class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        pass",
    JavaScript: "var isPalindrome = function(s) {\n    \n};",
    TypeScript: "function isPalindrome(s: string): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isPalindrome(String s) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isPalindrome(string s) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.isPalindrome("A man, a plan, a canal: Panama"))', expected: "True", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.isPalindrome("race a car"))', expected: "False", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.isPalindrome(" "))', expected: "True", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.isPalindrome("0P"))', expected: "False", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.isPalindrome("madam"))', expected: "True", isPublic: false },
  ],
},

"TCS: Find Second Largest": {
  company: "tcs", pattern: "Array Traversal",
  title: "Find Second Largest Element",
  difficulty: "Easy",
  desc: "Given an array of integers `nums`, find and return the second largest distinct element. If no second largest exists, return `-1`.",
  examples: [
    { input: "nums = [12, 35, 1, 10, 34, 1]", output: "34", explanation: "Largest is 35, second largest is 34" },
    { input: "nums = [10, 10, 10]", output: "-1", explanation: "All elements are same, no second largest" }
  ],
  constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
  functionSignature: "def secondLargest(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def secondLargest(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var secondLargest = function(nums) {\n    \n};",
    TypeScript: "function secondLargest(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int secondLargest(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int secondLargest(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.secondLargest([12, 35, 1, 10, 34, 1]))", expected: "34", isPublic: true },
    { script: "sol = Solution()\nprint(sol.secondLargest([10, 10, 10]))", expected: "-1", isPublic: true },
    { script: "sol = Solution()\nprint(sol.secondLargest([1, 2]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.secondLargest([5]))", expected: "-1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.secondLargest([3, 1, 4, 1, 5, 9, 2, 6]))", expected: "6", isPublic: false },
  ],
},

"TCS: Count Vowels and Consonants": {
  company: "tcs", pattern: "String Counting",
  title: "Count Vowels and Consonants",
  difficulty: "Easy",
  desc: "Given a string `s` of lowercase English letters, return a list `[vowels, consonants]` where `vowels` is the count of vowel characters (a, e, i, o, u) and `consonants` is the count of consonant characters.",
  examples: [
    { input: 's = "geeksforgeeks"', output: "[5, 8]", explanation: "Vowels: e,e,o,e,e=5, Consonants: g,k,s,f,r,g,k,s=8" },
    { input: 's = "aeiou"', output: "[5, 0]" }
  ],
  constraints: ["1 <= s.length <= 10^4", "s consists of lowercase English letters only"],
  functionSignature: "def countVowelsConsonants(self, s: str) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def countVowelsConsonants(self, s: str) -> List[int]:\n        pass",
    JavaScript: "var countVowelsConsonants = function(s) {\n    \n};",
    TypeScript: "function countVowelsConsonants(s: string): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] countVowelsConsonants(String s) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> countVowelsConsonants(string s) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.countVowelsConsonants("geeksforgeeks"))', expected: "[5, 8]", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.countVowelsConsonants("aeiou"))', expected: "[5, 0]", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.countVowelsConsonants("bcdfg"))', expected: "[0, 5]", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.countVowelsConsonants("hello"))', expected: "[2, 3]", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.countVowelsConsonants("a"))', expected: "[1, 0]", isPublic: false },
  ],
},

"TCS: Fibonacci Number": {
  company: "tcs", pattern: "Dynamic Programming",
  title: "Fibonacci Number",
  difficulty: "Easy",
  desc: "Given `n`, return the nth Fibonacci number. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2) for n>1.",
  examples: [
    { input: "n = 4", output: "3", explanation: "F(4) = F(3)+F(2) = 2+1 = 3" },
    { input: "n = 10", output: "55" }
  ],
  constraints: ["0 <= n <= 30"],
  functionSignature: "def fib(self, n: int) -> int:",
  starters: {
    Python: "class Solution:\n    def fib(self, n: int) -> int:\n        pass",
    JavaScript: "var fib = function(n) {\n    \n};",
    TypeScript: "function fib(n: number): number {\n    \n};",
    Java: "class Solution {\n    public int fib(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int fib(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.fib(4))", expected: "3", isPublic: true },
    { script: "sol = Solution()\nprint(sol.fib(10))", expected: "55", isPublic: true },
    { script: "sol = Solution()\nprint(sol.fib(0))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.fib(1))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.fib(20))", expected: "6765", isPublic: false },
  ],
},

"TCS: Missing Number in Array": {
  company: "tcs", pattern: "Math / XOR",
  title: "Missing Number in Array",
  difficulty: "Easy",
  desc: "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
  examples: [
    { input: "nums = [3, 0, 1]", output: "2" },
    { input: "nums = [0, 1]", output: "2" }
  ],
  constraints: ["n == nums.length", "1 <= n <= 10^4", "0 <= nums[i] <= n", "All numbers are unique"],
  functionSignature: "def missingNumber(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def missingNumber(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var missingNumber = function(nums) {\n    \n};",
    TypeScript: "function missingNumber(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int missingNumber(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.missingNumber([3, 0, 1]))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.missingNumber([0, 1]))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.missingNumber([9,6,4,2,3,5,7,0,1]))", expected: "8", isPublic: false },
    { script: "sol = Solution()\nprint(sol.missingNumber([0]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.missingNumber([1]))", expected: "0", isPublic: false },
  ],
},

"TCS: Anagram Check": {
  company: "tcs", pattern: "Hash Map / Sorting",
  title: "Valid Anagram",
  difficulty: "Easy",
  desc: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise. An anagram uses the same characters with same frequency.",
  examples: [
    { input: 's = "anagram", t = "nagaram"', output: "true" },
    { input: 's = "rat", t = "car"', output: "false" }
  ],
  constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters"],
  functionSignature: "def isAnagram(self, s: str, t: str) -> bool:",
  starters: {
    Python: "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass",
    JavaScript: "var isAnagram = function(s, t) {\n    \n};",
    TypeScript: "function isAnagram(s: string, t: string): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isAnagram(String s, String t) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.isAnagram("anagram", "nagaram"))', expected: "True", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.isAnagram("rat", "car"))', expected: "False", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.isAnagram("a", "a"))', expected: "True", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.isAnagram("ab", "a"))', expected: "False", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.isAnagram("listen", "silent"))', expected: "True", isPublic: false },
  ],
},

"TCS: Count Occurrences of Digit": {
  company: "tcs", pattern: "String / Math",
  title: "Count Digit Occurrences",
  difficulty: "Easy",
  desc: "Given an integer `n` and a digit `d` (0-9), count how many times digit `d` appears in all integers from 1 to `n` inclusive.",
  examples: [
    { input: "n = 13, d = 1", output: "6", explanation: "1 appears in: 1,10,11,12,13 -> total 6 times" },
    { input: "n = 20, d = 2", output: "3" }
  ],
  constraints: ["1 <= n <= 10^5", "0 <= d <= 9"],
  functionSignature: "def countDigit(self, n: int, d: int) -> int:",
  starters: {
    Python: "class Solution:\n    def countDigit(self, n: int, d: int) -> int:\n        pass",
    JavaScript: "var countDigit = function(n, d) {\n    \n};",
    TypeScript: "function countDigit(n: number, d: number): number {\n    \n};",
    Java: "class Solution {\n    public int countDigit(int n, int d) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int countDigit(int n, int d) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.countDigit(13, 1))", expected: "6", isPublic: true },
    { script: "sol = Solution()\nprint(sol.countDigit(20, 2))", expected: "3", isPublic: true },
    { script: "sol = Solution()\nprint(sol.countDigit(100, 0))", expected: "11", isPublic: false },
    { script: "sol = Solution()\nprint(sol.countDigit(9, 5))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.countDigit(50, 5))", expected: "6", isPublic: false },
  ],
},

"TCS: Rotate Array": {
  company: "tcs", pattern: "Array Manipulation",
  title: "Rotate Array",
  difficulty: "Easy",
  desc: "Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative. Do it in-place and return the modified array.",
  examples: [
    { input: "nums = [1,2,3,4,5,6,7], k = 3", output: "[5,6,7,1,2,3,4]" },
    { input: "nums = [-1,-100,3,99], k = 2", output: "[3,99,-1,-100]" }
  ],
  constraints: ["1 <= nums.length <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1", "0 <= k <= 10^5"],
  functionSignature: "def rotate(self, nums: List[int], k: int) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def rotate(self, nums: List[int], k: int) -> List[int]:\n        pass",
    JavaScript: "var rotate = function(nums, k) {\n    \n};",
    TypeScript: "function rotate(nums: number[], k: number): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] rotate(int[] nums, int k) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> rotate(vector<int>& nums, int k) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.rotate([1,2,3,4,5,6,7], 3))", expected: "[5, 6, 7, 1, 2, 3, 4]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.rotate([-1,-100,3,99], 2))", expected: "[3, 99, -1, -100]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.rotate([1,2], 3))", expected: "[2, 1]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.rotate([1], 0))", expected: "[1]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.rotate([1,2,3], 0))", expected: "[1, 2, 3]", isPublic: false },
  ],
},

"TCS: Longest Common Prefix": {
  company: "tcs", pattern: "String / Trie",
  title: "Longest Common Prefix",
  difficulty: "Easy",
  desc: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.",
  examples: [
    { input: 'strs = ["flower","flow","flight"]', output: '"fl"' },
    { input: 'strs = ["dog","racecar","car"]', output: '""' }
  ],
  constraints: ["1 <= strs.length <= 200", "0 <= strs[i].length <= 200", "strs[i] consists of only lowercase English letters"],
  functionSignature: "def longestCommonPrefix(self, strs: List[str]) -> str:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def longestCommonPrefix(self, strs: List[str]) -> str:\n        pass",
    JavaScript: "var longestCommonPrefix = function(strs) {\n    \n};",
    TypeScript: "function longestCommonPrefix(strs: string[]): string {\n    \n};",
    Java: "class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.longestCommonPrefix(["flower","flow","flight"]))', expected: "fl", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.longestCommonPrefix(["dog","racecar","car"]))', expected: "", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.longestCommonPrefix(["ab","a"]))', expected: "a", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.longestCommonPrefix(["interview","inter","internal"]))', expected: "inter", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.longestCommonPrefix(["a"]))', expected: "a", isPublic: false },
  ],
},

"TCS: Number of 1 Bits": {
  company: "tcs", pattern: "Bit Manipulation",
  title: "Number of 1 Bits",
  difficulty: "Easy",
  desc: "Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).",
  examples: [
    { input: "n = 11", output: "3", explanation: "11 = 00000000000000000000000000001011 has three '1' bits" },
    { input: "n = 128", output: "1" }
  ],
  constraints: ["The input must be a binary string of length 32"],
  functionSignature: "def hammingWeight(self, n: int) -> int:",
  starters: {
    Python: "class Solution:\n    def hammingWeight(self, n: int) -> int:\n        pass",
    JavaScript: "var hammingWeight = function(n) {\n    \n};",
    TypeScript: "function hammingWeight(n: number): number {\n    \n};",
    Java: "class Solution {\n    public int hammingWeight(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int hammingWeight(uint32_t n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.hammingWeight(11))", expected: "3", isPublic: true },
    { script: "sol = Solution()\nprint(sol.hammingWeight(128))", expected: "1", isPublic: true },
    { script: "sol = Solution()\nprint(sol.hammingWeight(0))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.hammingWeight(4294967293))", expected: "31", isPublic: false },
    { script: "sol = Solution()\nprint(sol.hammingWeight(7))", expected: "3", isPublic: false },
  ],
},

"TCS: Pascal Triangle Row": {
  company: "tcs", pattern: "Dynamic Programming / Math",
  title: "Pascal Triangle Row",
  difficulty: "Easy",
  desc: "Given an integer `rowIndex`, return the `rowIndex`-th (0-indexed) row of Pascal's triangle. Each element in a row is the sum of the two elements above it.",
  examples: [
    { input: "rowIndex = 3", output: "[1,3,3,1]" },
    { input: "rowIndex = 0", output: "[1]" }
  ],
  constraints: ["0 <= rowIndex <= 33"],
  functionSignature: "def getRow(self, rowIndex: int) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def getRow(self, rowIndex: int) -> List[int]:\n        pass",
    JavaScript: "var getRow = function(rowIndex) {\n    \n};",
    TypeScript: "function getRow(rowIndex: number): number[] {\n    \n};",
    Java: "class Solution {\n    public List<Integer> getRow(int rowIndex) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> getRow(int rowIndex) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.getRow(3))", expected: "[1, 3, 3, 1]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.getRow(0))", expected: "[1]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.getRow(1))", expected: "[1, 1]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.getRow(4))", expected: "[1, 4, 6, 4, 1]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.getRow(2))", expected: "[1, 2, 1]", isPublic: false },
  ],
},

"TCS: Maximum Subarray": {
  company: "tcs", pattern: "Kadane's Algorithm",
  title: "Maximum Subarray Sum",
  difficulty: "Medium",
  desc: "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
  examples: [
    { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1] has the largest sum = 6" },
    { input: "nums = [1]", output: "1" }
  ],
  constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
  functionSignature: "def maxSubArray(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var maxSubArray = function(nums) {\n    \n};",
    TypeScript: "function maxSubArray(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int maxSubArray(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))", expected: "6", isPublic: true },
    { script: "sol = Solution()\nprint(sol.maxSubArray([1]))", expected: "1", isPublic: true },
    { script: "sol = Solution()\nprint(sol.maxSubArray([5,4,-1,7,8]))", expected: "23", isPublic: false },
    { script: "sol = Solution()\nprint(sol.maxSubArray([-1]))", expected: "-1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.maxSubArray([-2,-1]))", expected: "-1", isPublic: false },
  ],
},

"TCS: Find Duplicates in Array": {
  company: "tcs", pattern: "Hash Set",
  title: "Find All Duplicates in Array",
  difficulty: "Medium",
  desc: "Given an integer array `nums` of length `n` where all integers are in range `[1, n]` and each integer appears once or twice, return an array of all the integers that appear twice.",
  examples: [
    { input: "nums = [4,3,2,7,8,2,3,1]", output: "[2,3]" },
    { input: "nums = [1,1,2]", output: "[1]" }
  ],
  constraints: ["n == nums.length", "1 <= n <= 10^5", "1 <= nums[i] <= n"],
  functionSignature: "def findDuplicates(self, nums: List[int]) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def findDuplicates(self, nums: List[int]) -> List[int]:\n        pass",
    JavaScript: "var findDuplicates = function(nums) {\n    \n};",
    TypeScript: "function findDuplicates(nums: number[]): number[] {\n    \n};",
    Java: "class Solution {\n    public List<Integer> findDuplicates(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> findDuplicates(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sorted(sol.findDuplicates([4,3,2,7,8,2,3,1])))", expected: "[2, 3]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.findDuplicates([1,1,2]))", expected: "[1]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.findDuplicates([1]))", expected: "[]", isPublic: false },
    { script: "sol = Solution()\nprint(sorted(sol.findDuplicates([2,2,3,3])))", expected: "[2, 3]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.findDuplicates([1,2,3]))", expected: "[]", isPublic: false },
  ],
},

"TCS: Sum of Digits Until Single Digit": {
  company: "tcs", pattern: "Math / Recursion",
  title: "Add Digits",
  difficulty: "Easy",
  desc: "Given an integer `num`, repeatedly add all its digits until the result has only one digit, and return it. This is called the digital root.",
  examples: [
    { input: "num = 38", output: "2", explanation: "3+8=11, 1+1=2" },
    { input: "num = 0", output: "0" }
  ],
  constraints: ["0 <= num <= 2^31 - 1"],
  functionSignature: "def addDigits(self, num: int) -> int:",
  starters: {
    Python: "class Solution:\n    def addDigits(self, num: int) -> int:\n        pass",
    JavaScript: "var addDigits = function(num) {\n    \n};",
    TypeScript: "function addDigits(num: number): number {\n    \n};",
    Java: "class Solution {\n    public int addDigits(int num) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int addDigits(int num) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.addDigits(38))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.addDigits(0))", expected: "0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.addDigits(9))", expected: "9", isPublic: false },
    { script: "sol = Solution()\nprint(sol.addDigits(999))", expected: "9", isPublic: false },
    { script: "sol = Solution()\nprint(sol.addDigits(100))", expected: "1", isPublic: false },
  ],
},

"TCS: String Compression": {
  company: "tcs", pattern: "Two Pointers",
  title: "String Compression",
  difficulty: "Medium",
  desc: "Given an array of characters `chars`, compress it using run-length encoding. For each group of consecutive repeating characters, output the character followed by its count (if count > 1). Modify the array in-place and return the new length.",
  examples: [
    { input: 'chars = ["a","a","b","b","c","c","c"]', output: "6", explanation: 'Compressed to ["a","2","b","2","c","3"]' },
    { input: 'chars = ["a"]', output: "1" }
  ],
  constraints: ["1 <= chars.length <= 2000", "chars[i] is a lowercase English letter, digit, or symbol"],
  functionSignature: "def compress(self, chars: List[str]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def compress(self, chars: List[str]) -> int:\n        pass",
    JavaScript: "var compress = function(chars) {\n    \n};",
    TypeScript: "function compress(chars: string[]): number {\n    \n};",
    Java: "class Solution {\n    public int compress(char[] chars) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int compress(vector<char>& chars) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'chars = ["a","a","b","b","c","c","c"]\nsol = Solution()\nprint(sol.compress(chars))', expected: "6", isPublic: true },
    { script: 'chars = ["a"]\nsol = Solution()\nprint(sol.compress(chars))', expected: "1", isPublic: true },
    { script: 'chars = ["a","b","b","b","b","b","b","b","b","b","b","b","b"]\nsol = Solution()\nprint(sol.compress(chars))', expected: "4", isPublic: false },
    { script: 'chars = ["a","a","a","a","a","a"]\nsol = Solution()\nprint(sol.compress(chars))', expected: "2", isPublic: false },
    { script: 'chars = ["a","a","b"]\nsol = Solution()\nprint(sol.compress(chars))', expected: "3", isPublic: false },
  ],
},

// =============================================================================
// INFOSYS (15 problems)
// =============================================================================

"Infosys: Matrix Spiral Order": {
  company: "infosys", pattern: "Matrix Traversal",
  title: "Spiral Matrix",
  difficulty: "Medium",
  desc: "Given an `m x n` matrix, return all elements of the matrix in spiral order.",
  examples: [
    { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]" },
    { input: "matrix = [[1,2],[3,4]]", output: "[1,2,4,3]" }
  ],
  constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 10"],
  functionSignature: "def spiralOrder(self, matrix: List[List[int]]) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:\n        pass",
    JavaScript: "var spiralOrder = function(matrix) {\n    \n};",
    TypeScript: "function spiralOrder(matrix: number[][]): number[] {\n    \n};",
    Java: "class Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.spiralOrder([[1,2,3],[4,5,6],[7,8,9]]))", expected: "[1, 2, 3, 6, 9, 8, 7, 4, 5]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.spiralOrder([[1,2],[3,4]]))", expected: "[1, 2, 4, 3]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.spiralOrder([[1]]))", expected: "[1]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.spiralOrder([[1,2,3,4]]))", expected: "[1, 2, 3, 4]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.spiralOrder([[1],[2],[3]]))", expected: "[1, 2, 3]", isPublic: false },
  ],
},

"Infosys: Merge Two Sorted Arrays": {
  company: "infosys", pattern: "Two Pointers",
  title: "Merge Sorted Array",
  difficulty: "Easy",
  desc: "Given two sorted integer arrays `nums1` and `nums2`, merge `nums2` into `nums1` as one sorted array. The number of elements initialized in `nums1` and `nums2` are `m` and `n` respectively. `nums1` has a length of `m + n`.",
  examples: [
    { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" },
    { input: "nums1 = [1], m = 1, nums2 = [], n = 0", output: "[1]" }
  ],
  constraints: ["0 <= m, n <= 200", "1 <= m + n <= 200", "-10^9 <= nums1[i], nums2[j] <= 10^9"],
  functionSignature: "def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> List[int]:\n        pass",
    JavaScript: "var merge = function(nums1, m, nums2, n) {\n    \n};",
    TypeScript: "function merge(nums1: number[], m: number, nums2: number[], n: number): number[] {\n    \n};",
    Java: "class Solution {\n    public void merge(int[] nums1, int m, int[] nums2, int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.merge([1,2,3,0,0,0], 3, [2,5,6], 3))", expected: "[1, 2, 2, 3, 5, 6]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.merge([1], 1, [], 0))", expected: "[1]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.merge([0], 0, [1], 1))", expected: "[1]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.merge([2,0], 1, [1], 1))", expected: "[1, 2]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.merge([4,5,6,0,0,0], 3, [1,2,3], 3))", expected: "[1, 2, 3, 4, 5, 6]", isPublic: false },
  ],
},

"Infosys: Balanced Parentheses": {
  company: "infosys", pattern: "Stack",
  title: "Valid Parentheses",
  difficulty: "Easy",
  desc: "Given a string `s` containing just '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type and in the correct order.",
  examples: [
    { input: 's = "()"', output: "true" },
    { input: 's = "([)]"', output: "false" }
  ],
  constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'"],
  functionSignature: "def isValid(self, s: str) -> bool:",
  starters: {
    Python: "class Solution:\n    def isValid(self, s: str) -> bool:\n        pass",
    JavaScript: "var isValid = function(s) {\n    \n};",
    TypeScript: "function isValid(s: string): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.isValid("()"))', expected: "True", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.isValid("()[]{}"))', expected: "True", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.isValid("(]"))', expected: "False", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.isValid("{[]}"))', expected: "True", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.isValid("([)]"))', expected: "False", isPublic: false },
  ],
},

"Infosys: Linked List Reverse": {
  company: "infosys", pattern: "Linked List",
  title: "Reverse Linked List",
  difficulty: "Easy",
  desc: "Given the head of a singly linked list, reverse the list, and return the reversed list. Input as array, output as array (for testing purposes).",
  examples: [
    { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
    { input: "head = [1,2]", output: "[2,1]" }
  ],
  constraints: ["0 <= number of nodes <= 5000", "-5000 <= Node.val <= 5000"],
  functionSignature: "def reverseList(self, head: List[int]) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def reverseList(self, head: List[int]) -> List[int]:\n        return head[::-1]",
    JavaScript: "var reverseList = function(head) {\n    return head.reverse();\n};",
    TypeScript: "function reverseList(head: number[]): number[] {\n    return head.reverse();\n};",
    Java: "class Solution {\n    public int[] reverseList(int[] head) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> reverseList(vector<int>& head) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.reverseList([1,2,3,4,5]))", expected: "[5, 4, 3, 2, 1]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.reverseList([1,2]))", expected: "[2, 1]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.reverseList([]))", expected: "[]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.reverseList([1]))", expected: "[1]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.reverseList([3,2,1]))", expected: "[1, 2, 3]", isPublic: false },
  ],
},

"Infosys: Power of a Number": {
  company: "infosys", pattern: "Recursion / Math",
  title: "Power of a Number (Pow)",
  difficulty: "Medium",
  desc: "Implement `pow(x, n)`, which calculates `x` raised to the power `n` (i.e., `x^n`). Handle negative exponents and large values.",
  examples: [
    { input: "x = 2.00000, n = 10", output: "1024.00000" },
    { input: "x = 2.10000, n = 3", output: "9.26100" }
  ],
  constraints: ["-100.0 < x < 100.0", "-2^31 <= n <= 2^31-1", "n is an integer", "-10^4 <= x^n <= 10^4"],
  functionSignature: "def myPow(self, x: float, n: int) -> float:",
  starters: {
    Python: "class Solution:\n    def myPow(self, x: float, n: int) -> float:\n        pass",
    JavaScript: "var myPow = function(x, n) {\n    \n};",
    TypeScript: "function myPow(x: number, n: number): number {\n    \n};",
    Java: "class Solution {\n    public double myPow(double x, int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    double myPow(double x, int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(round(sol.myPow(2.0, 10), 5))", expected: "1024.0", isPublic: true },
    { script: "sol = Solution()\nprint(round(sol.myPow(2.0, -2), 5))", expected: "0.25", isPublic: true },
    { script: "sol = Solution()\nprint(round(sol.myPow(1.0, 2147483647), 5))", expected: "1.0", isPublic: false },
    { script: "sol = Solution()\nprint(round(sol.myPow(2.0, 0), 5))", expected: "1.0", isPublic: false },
    { script: "sol = Solution()\nprint(round(sol.myPow(0.5, 3), 5))", expected: "0.125", isPublic: false },
  ],
},

"Infosys: Count Words in String": {
  company: "infosys", pattern: "String Parsing",
  title: "Word Count in Sentence",
  difficulty: "Easy",
  desc: "Given a sentence string `s`, return a dictionary of each word and its frequency. Words are case-insensitive. Ignore punctuation.",
  examples: [
    { input: 's = "Hello world hello"', output: '{"hello": 2, "world": 1}' },
    { input: 's = "a b a c b"', output: '{"a": 2, "b": 2, "c": 1}' }
  ],
  constraints: ["1 <= s.length <= 10^4", "s consists of English letters, spaces, and basic punctuation"],
  functionSignature: "def wordCount(self, s: str) -> dict:",
  starters: {
    Python: "class Solution:\n    def wordCount(self, s: str) -> dict:\n        pass",
    JavaScript: "var wordCount = function(s) {\n    \n};",
    TypeScript: "function wordCount(s: string): Record<string, number> {\n    \n};",
    Java: "class Solution {\n    public Map<String, Integer> wordCount(String s) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    unordered_map<string,int> wordCount(string s) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.wordCount("Hello world hello"))', expected: "{'hello': 2, 'world': 1}", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.wordCount("a b a c b"))', expected: "{'a': 2, 'b': 2, 'c': 1}", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.wordCount("one"))', expected: "{'one': 1}", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.wordCount("cat Cat CAT"))', expected: "{'cat': 3}", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.wordCount("hi hi hi hi"))', expected: "{'hi': 4}", isPublic: false },
  ],
},

"Infosys: Jump Game": {
  company: "infosys", pattern: "Greedy",
  title: "Jump Game",
  difficulty: "Medium",
  desc: "Given an integer array `nums` where `nums[i]` represents the maximum jump length from index `i`, return `true` if you can reach the last index starting from index 0.",
  examples: [
    { input: "nums = [2,3,1,1,4]", output: "true", explanation: "Jump 1 to index 1 then 3 to last index" },
    { input: "nums = [3,2,1,0,4]", output: "false" }
  ],
  constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"],
  functionSignature: "def canJump(self, nums: List[int]) -> bool:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def canJump(self, nums: List[int]) -> bool:\n        pass",
    JavaScript: "var canJump = function(nums) {\n    \n};",
    TypeScript: "function canJump(nums: number[]): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean canJump(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.canJump([2,3,1,1,4]))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.canJump([3,2,1,0,4]))", expected: "False", isPublic: true },
    { script: "sol = Solution()\nprint(sol.canJump([0]))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.canJump([1,0,0]))", expected: "False", isPublic: false },
    { script: "sol = Solution()\nprint(sol.canJump([2,0,0]))", expected: "True", isPublic: false },
  ],
},

"Infosys: Matrix Transpose": {
  company: "infosys", pattern: "Matrix Manipulation",
  title: "Transpose Matrix",
  difficulty: "Easy",
  desc: "Given a 2D integer array `matrix`, return the transpose of `matrix`. The transpose of a matrix is the matrix flipped over its main diagonal, i.e., matrix[i][j] = matrix[j][i].",
  examples: [
    { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[[1,4,7],[2,5,8],[3,6,9]]" },
    { input: "matrix = [[1,2],[3,4]]", output: "[[1,3],[2,4]]" }
  ],
  constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 1000"],
  functionSignature: "def transpose(self, matrix: List[List[int]]) -> List[List[int]]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def transpose(self, matrix: List[List[int]]) -> List[List[int]]:\n        pass",
    JavaScript: "var transpose = function(matrix) {\n    \n};",
    TypeScript: "function transpose(matrix: number[][]): number[][] {\n    \n};",
    Java: "class Solution {\n    public int[][] transpose(int[][] matrix) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<vector<int>> transpose(vector<vector<int>>& matrix) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.transpose([[1,2,3],[4,5,6],[7,8,9]]))", expected: "[[1, 4, 7], [2, 5, 8], [3, 6, 9]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.transpose([[1,2],[3,4]]))", expected: "[[1, 3], [2, 4]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.transpose([[1]]))", expected: "[[1]]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.transpose([[1,2,3]]))", expected: "[[1], [2], [3]]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.transpose([[1],[2],[3]]))", expected: "[[1, 2, 3]]", isPublic: false },
  ],
},

"Infosys: Implement Queue Using Stacks": {
  company: "infosys", pattern: "Stack / Queue Design",
  title: "Implement Queue Using Stacks",
  difficulty: "Easy",
  desc: "Implement a FIFO queue using only two stacks. Implement `push(x)`, `pop()`, `peek()`, and `empty()` operations. Use only standard stack operations (push, pop, peek, empty).",
  examples: [
    { input: 'ops = ["MyQueue","push","push","peek","pop","empty"], args = [[],[1],[2],[],[],[]]', output: "[null,null,null,1,1,false]" }
  ],
  constraints: ["1 <= x <= 9", "At most 100 calls to push, pop, peek, empty"],
  functionSignature: "def executeOps(self, ops: List[str], args: List[List]) -> List:",
  starters: {
    Python: "from typing import List\n\nclass MyQueue:\n    def __init__(self):\n        pass\n    def push(self, x: int) -> None:\n        pass\n    def pop(self) -> int:\n        pass\n    def peek(self) -> int:\n        pass\n    def empty(self) -> bool:\n        pass",
    JavaScript: "class MyQueue {\n    constructor() {}\n    push(x) {}\n    pop() {}\n    peek() {}\n    empty() {}\n}",
    TypeScript: "class MyQueue {\n    constructor() {}\n    push(x: number): void {}\n    pop(): number { return 0; }\n    peek(): number { return 0; }\n    empty(): boolean { return true; }\n}",
    Java: "class MyQueue {\n    public void push(int x) {}\n    public int pop() { return 0; }\n    public int peek() { return 0; }\n    public boolean empty() { return true; }\n}",
    "C++": "class MyQueue {\npublic:\n    void push(int x) {}\n    int pop() { return 0; }\n    int peek() { return 0; }\n    bool empty() { return true; }\n};",
  },
  testCases: [
    { script: 'q = MyQueue()\nq.push(1)\nq.push(2)\nprint(q.peek())\nprint(q.pop())\nprint(q.empty())', expected: "1\n1\nFalse", isPublic: true },
    { script: 'q = MyQueue()\nq.push(5)\nprint(q.pop())\nprint(q.empty())', expected: "5\nTrue", isPublic: true },
    { script: 'q = MyQueue()\nq.push(1)\nq.push(2)\nq.push(3)\nprint(q.pop())\nprint(q.pop())', expected: "1\n2", isPublic: false },
    { script: 'q = MyQueue()\nprint(q.empty())', expected: "True", isPublic: false },
    { script: 'q = MyQueue()\nq.push(7)\nprint(q.peek())\nprint(q.peek())', expected: "7\n7", isPublic: false },
  ],
},

"Infosys: Climbing Stairs": {
  company: "infosys", pattern: "Dynamic Programming",
  title: "Climbing Stairs",
  difficulty: "Easy",
  desc: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. Return the number of distinct ways you can climb to the top.",
  examples: [
    { input: "n = 2", output: "2", explanation: "1+1 or 2" },
    { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1" }
  ],
  constraints: ["1 <= n <= 45"],
  functionSignature: "def climbStairs(self, n: int) -> int:",
  starters: {
    Python: "class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass",
    JavaScript: "var climbStairs = function(n) {\n    \n};",
    TypeScript: "function climbStairs(n: number): number {\n    \n};",
    Java: "class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.climbStairs(2))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.climbStairs(3))", expected: "3", isPublic: true },
    { script: "sol = Solution()\nprint(sol.climbStairs(1))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.climbStairs(5))", expected: "8", isPublic: false },
    { script: "sol = Solution()\nprint(sol.climbStairs(10))", expected: "89", isPublic: false },
  ],
},

"Infosys: Binary Search": {
  company: "infosys", pattern: "Binary Search",
  title: "Binary Search",
  difficulty: "Easy",
  desc: "Given an array of integers `nums` sorted in ascending order and an integer `target`, return the index of `target`, or `-1` if not found. Your algorithm must run in O(log n) time.",
  examples: [
    { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
    { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" }
  ],
  constraints: ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4", "All integers in nums are unique", "nums is sorted in ascending order"],
  functionSignature: "def search(self, nums: List[int], target: int) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        pass",
    JavaScript: "var search = function(nums, target) {\n    \n};",
    TypeScript: "function search(nums: number[], target: number): number {\n    \n};",
    Java: "class Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.search([-1,0,3,5,9,12], 9))", expected: "4", isPublic: true },
    { script: "sol = Solution()\nprint(sol.search([-1,0,3,5,9,12], 2))", expected: "-1", isPublic: true },
    { script: "sol = Solution()\nprint(sol.search([5], 5))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.search([1,3,5,7], 1))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.search([1,3,5,7], 7))", expected: "3", isPublic: false },
  ],
},

"Infosys: Largest Number": {
  company: "infosys", pattern: "Custom Sorting",
  title: "Largest Number from Array",
  difficulty: "Medium",
  desc: "Given a list of non-negative integers `nums`, arrange them such that they form the largest number and return it as a string.",
  examples: [
    { input: "nums = [10,2]", output: '"210"' },
    { input: "nums = [3,30,34,5,9]", output: '"9534330"' }
  ],
  constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 10^9"],
  functionSignature: "def largestNumber(self, nums: List[int]) -> str:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def largestNumber(self, nums: List[int]) -> str:\n        pass",
    JavaScript: "var largestNumber = function(nums) {\n    \n};",
    TypeScript: "function largestNumber(nums: number[]): string {\n    \n};",
    Java: "class Solution {\n    public String largestNumber(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    string largestNumber(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.largestNumber([10,2]))", expected: "210", isPublic: true },
    { script: "sol = Solution()\nprint(sol.largestNumber([3,30,34,5,9]))", expected: "9534330", isPublic: true },
    { script: "sol = Solution()\nprint(sol.largestNumber([0,0]))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.largestNumber([1]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.largestNumber([1,2,3]))", expected: "321", isPublic: false },
  ],
},

"Infosys: Remove Duplicates from Sorted Array": {
  company: "infosys", pattern: "Two Pointers",
  title: "Remove Duplicates from Sorted Array",
  difficulty: "Easy",
  desc: "Given a sorted integer array `nums`, remove the duplicates in-place such that each unique element appears only once. Return the count of unique elements `k`. The first `k` elements of `nums` should hold the result.",
  examples: [
    { input: "nums = [1,1,2]", output: "2", explanation: "k=2, nums=[1,2,...]" },
    { input: "nums = [0,0,1,1,1,2,2,3,3,4]", output: "5" }
  ],
  constraints: ["1 <= nums.length <= 3 * 10^4", "-100 <= nums[i] <= 100", "nums is sorted in non-decreasing order"],
  functionSignature: "def removeDuplicates(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def removeDuplicates(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var removeDuplicates = function(nums) {\n    \n};",
    TypeScript: "function removeDuplicates(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int removeDuplicates(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int removeDuplicates(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.removeDuplicates([1,1,2]))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.removeDuplicates([0,0,1,1,1,2,2,3,3,4]))", expected: "5", isPublic: true },
    { script: "sol = Solution()\nprint(sol.removeDuplicates([1]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.removeDuplicates([1,2,3]))", expected: "3", isPublic: false },
    { script: "sol = Solution()\nprint(sol.removeDuplicates([1,1,1,1]))", expected: "1", isPublic: false },
  ],
},

"Infosys: Count Pairs with Given Sum": {
  company: "infosys", pattern: "Hash Map",
  title: "Count Pairs with Given Sum",
  difficulty: "Easy",
  desc: "Given an array `arr` of `n` integers and an integer `target`, find the number of pairs in the array whose sum is equal to `target`.",
  examples: [
    { input: "arr = [1, 5, 7, -1], target = 6", output: "2", explanation: "Pairs: (1,5) and (7,-1)" },
    { input: "arr = [1, 1, 1, 1], target = 2", output: "6" }
  ],
  constraints: ["1 <= n <= 10^5", "-10^4 <= arr[i] <= 10^4", "-10^4 <= target <= 10^4"],
  functionSignature: "def countPairs(self, arr: List[int], target: int) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def countPairs(self, arr: List[int], target: int) -> int:\n        pass",
    JavaScript: "var countPairs = function(arr, target) {\n    \n};",
    TypeScript: "function countPairs(arr: number[], target: number): number {\n    \n};",
    Java: "class Solution {\n    public int countPairs(int[] arr, int target) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int countPairs(vector<int>& arr, int target) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.countPairs([1, 5, 7, -1], 6))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.countPairs([1, 1, 1, 1], 2))", expected: "6", isPublic: true },
    { script: "sol = Solution()\nprint(sol.countPairs([1, 2, 3], 10))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.countPairs([0, 0, 0], 0))", expected: "3", isPublic: false },
    { script: "sol = Solution()\nprint(sol.countPairs([1, 2, 3, 4, 5], 5))", expected: "2", isPublic: false },
  ],
},

// =============================================================================
// WIPRO (15 problems)
// =============================================================================

"Wipro: Move Zeroes": {
  company: "wipro", pattern: "Two Pointers",
  title: "Move Zeroes to End",
  difficulty: "Easy",
  desc: "Given an integer array `nums`, move all 0's to the end while maintaining the relative order of non-zero elements. Do this in-place and return the modified array.",
  examples: [
    { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" },
    { input: "nums = [0]", output: "[0]" }
  ],
  constraints: ["1 <= nums.length <= 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
  functionSignature: "def moveZeroes(self, nums: List[int]) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def moveZeroes(self, nums: List[int]) -> List[int]:\n        pass",
    JavaScript: "var moveZeroes = function(nums) {\n    \n};",
    TypeScript: "function moveZeroes(nums: number[]): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] moveZeroes(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> moveZeroes(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.moveZeroes([0,1,0,3,12]))", expected: "[1, 3, 12, 0, 0]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.moveZeroes([0]))", expected: "[0]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.moveZeroes([1,0,0,2]))", expected: "[1, 2, 0, 0]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.moveZeroes([1,2,3]))", expected: "[1, 2, 3]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.moveZeroes([0,0,1]))", expected: "[1, 0, 0]", isPublic: false },
  ],
},

"Wipro: Sum of Prime Numbers": {
  company: "wipro", pattern: "Sieve of Eratosthenes",
  title: "Sum of Prime Numbers up to N",
  difficulty: "Easy",
  desc: "Given an integer `n`, return the sum of all prime numbers less than or equal to `n`.",
  examples: [
    { input: "n = 10", output: "17", explanation: "Primes <= 10: 2, 3, 5, 7. Sum = 17" },
    { input: "n = 5", output: "10" }
  ],
  constraints: ["1 <= n <= 10^6"],
  functionSignature: "def sumPrimes(self, n: int) -> int:",
  starters: {
    Python: "class Solution:\n    def sumPrimes(self, n: int) -> int:\n        pass",
    JavaScript: "var sumPrimes = function(n) {\n    \n};",
    TypeScript: "function sumPrimes(n: number): number {\n    \n};",
    Java: "class Solution {\n    public long sumPrimes(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    long long sumPrimes(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.sumPrimes(10))", expected: "17", isPublic: true },
    { script: "sol = Solution()\nprint(sol.sumPrimes(5))", expected: "10", isPublic: true },
    { script: "sol = Solution()\nprint(sol.sumPrimes(2))", expected: "2", isPublic: false },
    { script: "sol = Solution()\nprint(sol.sumPrimes(1))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.sumPrimes(20))", expected: "77", isPublic: false },
  ],
},

"Wipro: Intersection of Two Arrays": {
  company: "wipro", pattern: "Hash Set",
  title: "Intersection of Two Arrays",
  difficulty: "Easy",
  desc: "Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must be unique and the result can be in any order.",
  examples: [
    { input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2]" },
    { input: "nums1 = [4,9,5], nums2 = [9,4,9,8,4]", output: "[4,9]" }
  ],
  constraints: ["1 <= nums1.length, nums2.length <= 1000", "0 <= nums1[i], nums2[i] <= 1000"],
  functionSignature: "def intersection(self, nums1: List[int], nums2: List[int]) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def intersection(self, nums1: List[int], nums2: List[int]) -> List[int]:\n        pass",
    JavaScript: "var intersection = function(nums1, nums2) {\n    \n};",
    TypeScript: "function intersection(nums1: number[], nums2: number[]): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] intersection(int[] nums1, int[] nums2) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sorted(sol.intersection([1,2,2,1],[2,2])))", expected: "[2]", isPublic: true },
    { script: "sol = Solution()\nprint(sorted(sol.intersection([4,9,5],[9,4,9,8,4])))", expected: "[4, 9]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.intersection([1],[2]))", expected: "[]", isPublic: false },
    { script: "sol = Solution()\nprint(sorted(sol.intersection([1,2,3],[3,4,5])))", expected: "[3]", isPublic: false },
    { script: "sol = Solution()\nprint(sorted(sol.intersection([1,1,1],[1,1,1])))", expected: "[1]", isPublic: false },
  ],
},

"Wipro: Check Armstrong Number": {
  company: "wipro", pattern: "Math",
  title: "Armstrong Number Check",
  difficulty: "Easy",
  desc: "A number is an Armstrong number if it equals the sum of its digits each raised to the power of the number of digits. Given `n`, return `true` if `n` is an Armstrong number.",
  examples: [
    { input: "n = 153", output: "true", explanation: "1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153" },
    { input: "n = 123", output: "false" }
  ],
  constraints: ["1 <= n <= 10^8"],
  functionSignature: "def isArmstrong(self, n: int) -> bool:",
  starters: {
    Python: "class Solution:\n    def isArmstrong(self, n: int) -> bool:\n        pass",
    JavaScript: "var isArmstrong = function(n) {\n    \n};",
    TypeScript: "function isArmstrong(n: number): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isArmstrong(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isArmstrong(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.isArmstrong(153))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isArmstrong(123))", expected: "False", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isArmstrong(370))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isArmstrong(1))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isArmstrong(9474))", expected: "True", isPublic: false },
  ],
},

"Wipro: Flipping an Image": {
  company: "wipro", pattern: "Array Manipulation",
  title: "Flip and Invert Image",
  difficulty: "Easy",
  desc: "Given an `n x n` binary matrix `image`, flip the image horizontally (reverse each row), then invert it (toggle 0s and 1s). Return the resulting image.",
  examples: [
    { input: "image = [[1,1,0],[1,0,1],[0,0,0]]", output: "[[1,0,0],[0,1,0],[1,1,1]]" },
    { input: "image = [[1,1,0,0],[1,0,0,1],[0,1,1,1],[1,0,1,0]]", output: "[[1,1,0,0],[0,1,1,0],[0,0,0,1],[1,0,1,0]]" }
  ],
  constraints: ["n == image.length == image[i].length", "1 <= n <= 20", "image[i][j] is 0 or 1"],
  functionSignature: "def flipAndInvertImage(self, image: List[List[int]]) -> List[List[int]]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def flipAndInvertImage(self, image: List[List[int]]) -> List[List[int]]:\n        pass",
    JavaScript: "var flipAndInvertImage = function(image) {\n    \n};",
    TypeScript: "function flipAndInvertImage(image: number[][]): number[][] {\n    \n};",
    Java: "class Solution {\n    public int[][] flipAndInvertImage(int[][] image) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<vector<int>> flipAndInvertImage(vector<vector<int>>& image) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.flipAndInvertImage([[1,1,0],[1,0,1],[0,0,0]]))", expected: "[[1, 0, 0], [0, 1, 0], [1, 1, 1]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.flipAndInvertImage([[1]]))", expected: "[[0]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.flipAndInvertImage([[0]]))", expected: "[[1]]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.flipAndInvertImage([[1,0],[0,1]]))", expected: "[[1, 0], [0, 1]]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.flipAndInvertImage([[0,0],[1,1]]))", expected: "[[1, 1], [0, 0]]", isPublic: false },
  ],
},

"Wipro: Two Sum Sorted": {
  company: "wipro", pattern: "Two Pointers",
  title: "Two Sum in Sorted Array",
  difficulty: "Easy",
  desc: "Given a 1-indexed sorted integer array `numbers`, find two numbers that add up to a specific `target`. Return the indices as `[index1, index2]` (1-indexed). Use only constant extra space.",
  examples: [
    { input: "numbers = [2,7,11,15], target = 9", output: "[1,2]" },
    { input: "numbers = [2,3,4], target = 6", output: "[1,3]" }
  ],
  constraints: ["2 <= numbers.length <= 3 * 10^4", "Exactly one solution exists"],
  functionSignature: "def twoSum(self, numbers: List[int], target: int) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def twoSum(self, numbers: List[int], target: int) -> List[int]:\n        pass",
    JavaScript: "var twoSum = function(numbers, target) {\n    \n};",
    TypeScript: "function twoSum(numbers: number[], target: number): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& numbers, int target) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.twoSum([2,7,11,15], 9))", expected: "[1, 2]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.twoSum([2,3,4], 6))", expected: "[1, 3]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.twoSum([-1,0], -1))", expected: "[1, 2]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.twoSum([1,2,3,4,5], 9))", expected: "[4, 5]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.twoSum([1,3,4,5,7,11], 9))", expected: "[3, 4]", isPublic: false },
  ],
},

"Wipro: Maximum Depth of Binary Tree": {
  company: "wipro", pattern: "DFS / BFS",
  title: "Maximum Depth of Binary Tree",
  difficulty: "Easy",
  desc: "Given an array `preorder` representing a binary tree (None for null), return the maximum depth of the tree (number of nodes along the longest path from root to leaf).",
  examples: [
    { input: "nums = [3,9,20,None,None,15,7]", output: "3" },
    { input: "nums = [1,None,2]", output: "2" }
  ],
  constraints: ["0 <= number of nodes <= 10^4", "-100 <= Node.val <= 100"],
  functionSignature: "def maxDepth(self, nums: List) -> int:",
  starters: {
    Python: "from typing import List, Optional\n\nclass Solution:\n    def maxDepth(self, nums: List) -> int:\n        # Build tree from level-order list and find depth\n        if not nums:\n            return 0\n        depth, i, size = 0, 0, 1\n        while i < len(nums):\n            non_none = any(x is not None for x in nums[i:i+size] if i+size <= len(nums) or True)\n            if not non_none:\n                break\n            depth += 1\n            i += size\n            size *= 2\n        return depth",
    JavaScript: "var maxDepth = function(nums) {\n    if (!nums || nums.length === 0) return 0;\n    // simplified: return approximate depth\n    return Math.ceil(Math.log2(nums.length + 1));\n};",
    TypeScript: "function maxDepth(nums: (number | null)[]): number {\n    \n};",
    Java: "class Solution {\n    public int maxDepth(Integer[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int maxDepth(vector<int> nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.maxDepth([3,9,20,None,None,15,7]))", expected: "3", isPublic: true },
    { script: "sol = Solution()\nprint(sol.maxDepth([1,None,2]))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.maxDepth([]))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.maxDepth([1]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.maxDepth([1,2,3,4,5]))", expected: "3", isPublic: false },
  ],
},

"Wipro: Find All Permutations": {
  company: "wipro", pattern: "Backtracking",
  title: "Permutations",
  difficulty: "Medium",
  desc: "Given an array `nums` of distinct integers, return all possible permutations in any order.",
  examples: [
    { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
    { input: "nums = [0,1]", output: "[[0,1],[1,0]]" }
  ],
  constraints: ["1 <= nums.length <= 6", "-10 <= nums[i] <= 10", "All integers are unique"],
  functionSignature: "def permute(self, nums: List[int]) -> List[List[int]]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def permute(self, nums: List[int]) -> List[List[int]]:\n        pass",
    JavaScript: "var permute = function(nums) {\n    \n};",
    TypeScript: "function permute(nums: number[]): number[][] {\n    \n};",
    Java: "class Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<vector<int>> permute(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(len(sol.permute([1,2,3])))", expected: "6", isPublic: true },
    { script: "sol = Solution()\nprint(len(sol.permute([0,1])))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(len(sol.permute([1])))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nresult = sol.permute([1,2])\nprint(sorted([sorted(x) for x in result]))", expected: "[[1, 2], [1, 2]]", isPublic: false },
    { script: "sol = Solution()\nprint(len(sol.permute([1,2,3,4])))", expected: "24", isPublic: false },
  ],
},

"Wipro: Count Inversions": {
  company: "wipro", pattern: "Merge Sort",
  title: "Count Inversions in Array",
  difficulty: "Hard",
  desc: "Given an array `arr`, count the number of inversions. A pair `(i, j)` is an inversion if `i < j` and `arr[i] > arr[j]`.",
  examples: [
    { input: "arr = [2, 4, 1, 3, 5]", output: "3", explanation: "Inversions: (2,1),(4,1),(4,3)" },
    { input: "arr = [1, 2, 3, 4, 5]", output: "0" }
  ],
  constraints: ["1 <= arr.length <= 10^5", "1 <= arr[i] <= 10^9"],
  functionSignature: "def countInversions(self, arr: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def countInversions(self, arr: List[int]) -> int:\n        pass",
    JavaScript: "var countInversions = function(arr) {\n    \n};",
    TypeScript: "function countInversions(arr: number[]): number {\n    \n};",
    Java: "class Solution {\n    public long countInversions(int[] arr) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    long long countInversions(vector<int>& arr) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.countInversions([2, 4, 1, 3, 5]))", expected: "3", isPublic: true },
    { script: "sol = Solution()\nprint(sol.countInversions([1, 2, 3, 4, 5]))", expected: "0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.countInversions([5, 4, 3, 2, 1]))", expected: "10", isPublic: false },
    { script: "sol = Solution()\nprint(sol.countInversions([1]))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.countInversions([3, 1, 2]))", expected: "2", isPublic: false },
  ],
},

"Wipro: Decode Roman Numerals": {
  company: "wipro", pattern: "String Parsing",
  title: "Roman to Integer",
  difficulty: "Easy",
  desc: "Given a roman numeral string `s`, convert it to an integer. Roman numerals use I=1, V=5, X=10, L=50, C=100, D=500, M=1000. Subtractive notation applies when a smaller value precedes a larger one.",
  examples: [
    { input: 's = "III"', output: "3" },
    { input: 's = "MCMXCIV"', output: "1994" }
  ],
  constraints: ["1 <= s.length <= 15", "s contains only I, V, X, L, C, D, M", "1 <= answer <= 3999"],
  functionSignature: "def romanToInt(self, s: str) -> int:",
  starters: {
    Python: "class Solution:\n    def romanToInt(self, s: str) -> int:\n        pass",
    JavaScript: "var romanToInt = function(s) {\n    \n};",
    TypeScript: "function romanToInt(s: string): number {\n    \n};",
    Java: "class Solution {\n    public int romanToInt(String s) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int romanToInt(string s) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.romanToInt("III"))', expected: "3", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.romanToInt("MCMXCIV"))', expected: "1994", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.romanToInt("IV"))', expected: "4", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.romanToInt("LVIII"))', expected: "58", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.romanToInt("MMXXVI"))', expected: "2026", isPublic: false },
  ],
},

"Wipro: Palindrome Linked List": {
  company: "wipro", pattern: "Two Pointers",
  title: "Palindrome Array Check",
  difficulty: "Easy",
  desc: "Given an integer array `nums` representing a linked list, determine if it forms a palindrome (reads same forward and backward).",
  examples: [
    { input: "nums = [1,2,2,1]", output: "true" },
    { input: "nums = [1,2]", output: "false" }
  ],
  constraints: ["1 <= nums.length <= 10^5", "0 <= nums[i] <= 9"],
  functionSignature: "def isPalindrome(self, nums: List[int]) -> bool:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def isPalindrome(self, nums: List[int]) -> bool:\n        pass",
    JavaScript: "var isPalindrome = function(nums) {\n    \n};",
    TypeScript: "function isPalindrome(nums: number[]): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isPalindrome(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isPalindrome(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.isPalindrome([1,2,2,1]))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isPalindrome([1,2]))", expected: "False", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isPalindrome([1]))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isPalindrome([1,2,3,2,1]))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isPalindrome([1,2,3]))", expected: "False", isPublic: false },
  ],
},

"Wipro: Minimum Absolute Difference": {
  company: "wipro", pattern: "Sorting",
  title: "Minimum Absolute Difference in Array",
  difficulty: "Easy",
  desc: "Given an integer array `arr`, find all pairs of elements with the minimum absolute difference. Return a list of pairs in ascending order.",
  examples: [
    { input: "arr = [4,2,1,3]", output: "[[1,2],[2,3],[3,4]]" },
    { input: "arr = [1,3,6,10,15]", output: "[[1,3]]" }
  ],
  constraints: ["2 <= arr.length <= 10^5", "-10^6 <= arr[i] <= 10^6"],
  functionSignature: "def minimumAbsDifference(self, arr: List[int]) -> List[List[int]]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def minimumAbsDifference(self, arr: List[int]) -> List[List[int]]:\n        pass",
    JavaScript: "var minimumAbsDifference = function(arr) {\n    \n};",
    TypeScript: "function minimumAbsDifference(arr: number[]): number[][] {\n    \n};",
    Java: "class Solution {\n    public List<List<Integer>> minimumAbsDifference(int[] arr) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<vector<int>> minimumAbsDifference(vector<int>& arr) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.minimumAbsDifference([4,2,1,3]))", expected: "[[1, 2], [2, 3], [3, 4]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.minimumAbsDifference([1,3,6,10,15]))", expected: "[[1, 3]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.minimumAbsDifference([3,8,-10,23,19,-4,-14,27]))", expected: "[[-14, -10]]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.minimumAbsDifference([1,2]))", expected: "[[1, 2]]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.minimumAbsDifference([40,11,26,27,-20]))", expected: "[[26, 27]]", isPublic: false },
  ],
},
// =============================================================================
// COGNIZANT (15 problems)
// =============================================================================

"Cognizant: Longest Palindromic Substring": {
  company: "cognizant", pattern: "Expand Around Center",
  title: "Longest Palindromic Substring",
  difficulty: "Medium",
  desc: "Given a string `s`, return the longest palindromic substring in `s`.",
  examples: [
    { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also valid' },
    { input: 's = "cbbd"', output: '"bb"' }
  ],
  constraints: ["1 <= s.length <= 1000", "s consists of only digits and English letters"],
  functionSignature: "def longestPalindrome(self, s: str) -> str:",
  starters: {
    Python: "class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        pass",
    JavaScript: "var longestPalindrome = function(s) {\n    \n};",
    TypeScript: "function longestPalindrome(s: string): string {\n    \n};",
    Java: "class Solution {\n    public String longestPalindrome(String s) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    string longestPalindrome(string s) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nresult = sol.longestPalindrome("babad")\nprint(result in ["bab","aba"])', expected: "True", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.longestPalindrome("cbbd"))', expected: "bb", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.longestPalindrome("a"))', expected: "a", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.longestPalindrome("ac"))', expected: "a", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.longestPalindrome("racecar"))', expected: "racecar", isPublic: false },
  ],
},
"Cognizant: Find GCD of Array": {
  company: "cognizant", pattern: "Math / Euclid",
  title: "Find GCD of Array",
  difficulty: "Easy",
  desc: "Given an integer array `nums`, return the greatest common divisor (GCD) of the smallest and largest numbers in the array.",
  examples: [
    { input: "nums = [2,5,6,9,10]", output: "2", explanation: "min=2, max=10, gcd(2,10)=2" },
    { input: "nums = [7,5,6,8,3]", output: "1" }
  ],
  constraints: ["2 <= nums.length <= 1000", "1 <= nums[i] <= 1000"],
  functionSignature: "def findGCD(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\nfrom math import gcd\n\nclass Solution:\n    def findGCD(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var findGCD = function(nums) {\n    \n};",
    TypeScript: "function findGCD(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int findGCD(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int findGCD(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.findGCD([2,5,6,9,10]))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.findGCD([7,5,6,8,3]))", expected: "1", isPublic: true },
    { script: "sol = Solution()\nprint(sol.findGCD([3,3]))", expected: "3", isPublic: false },
    { script: "sol = Solution()\nprint(sol.findGCD([1,100]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.findGCD([12,24,36]))", expected: "12", isPublic: false },
  ],
},
"Cognizant: Number of Good Pairs": {
  company: "cognizant", pattern: "Hash Map Counting",
  title: "Number of Good Pairs",
  difficulty: "Easy",
  desc: "Given an array of integers `nums`, a pair `(i,j)` is called good if `nums[i] == nums[j]` and `i < j`. Return the number of good pairs.",
  examples: [
    { input: "nums = [1,2,3,1,1,3]", output: "4" },
    { input: "nums = [1,1,1,1]", output: "6" }
  ],
  constraints: ["1 <= nums.length <= 100", "1 <= nums[i] <= 100"],
  functionSignature: "def numIdenticalPairs(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def numIdenticalPairs(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var numIdenticalPairs = function(nums) {\n    \n};",
    TypeScript: "function numIdenticalPairs(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int numIdenticalPairs(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int numIdenticalPairs(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.numIdenticalPairs([1,2,3,1,1,3]))", expected: "4", isPublic: true },
    { script: "sol = Solution()\nprint(sol.numIdenticalPairs([1,1,1,1]))", expected: "6", isPublic: true },
    { script: "sol = Solution()\nprint(sol.numIdenticalPairs([1,2,3]))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.numIdenticalPairs([1,1]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.numIdenticalPairs([1,1,2,2,3]))", expected: "2", isPublic: false },
  ],
},

"Cognizant: Shuffle Array": {
  company: "cognizant", pattern: "Array Manipulation",
  title: "Shuffle the Array",
  difficulty: "Easy",
  desc: "Given the array `nums` consisting of `2n` elements in the form `[x1,x2,...,xn,y1,y2,...,yn]`, return the array in the form `[x1,y1,x2,y2,...,xn,yn]`.",
  examples: [
    { input: "nums = [2,5,1,3,4,7], n = 3", output: "[2,3,5,4,1,7]" },
    { input: "nums = [1,1,2,2], n = 2", output: "[1,2,1,2]" }
  ],
  constraints: ["1 <= n <= 500", "nums.length == 2n", "1 <= nums[i] <= 10^3"],
  functionSignature: "def shuffle(self, nums: List[int], n: int) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def shuffle(self, nums: List[int], n: int) -> List[int]:\n        pass",
    JavaScript: "var shuffle = function(nums, n) {\n    \n};",
    TypeScript: "function shuffle(nums: number[], n: number): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] shuffle(int[] nums, int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> shuffle(vector<int>& nums, int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.shuffle([2,5,1,3,4,7], 3))", expected: "[2, 3, 5, 4, 1, 7]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.shuffle([1,1,2,2], 2))", expected: "[1, 2, 1, 2]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.shuffle([1,2,3,4,4,3,2,1], 4))", expected: "[1, 4, 2, 3, 3, 2, 4, 1]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.shuffle([1,2], 1))", expected: "[1, 2]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.shuffle([1,2,3,4], 2))", expected: "[1, 3, 2, 4]", isPublic: false },
  ],
},

"Cognizant: Running Sum of Array": {
  company: "cognizant", pattern: "Prefix Sum",
  title: "Running Sum of 1D Array",
  difficulty: "Easy",
  desc: "Given an array `nums`, return the running sum where `runningSum[i] = sum(nums[0] to nums[i])`.",
  examples: [
    { input: "nums = [1,2,3,4]", output: "[1,3,6,10]" },
    { input: "nums = [1,1,1,1,1]", output: "[1,2,3,4,5]" }
  ],
  constraints: ["1 <= nums.length <= 1000", "-10^6 <= nums[i] <= 10^6"],
  functionSignature: "def runningSum(self, nums: List[int]) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def runningSum(self, nums: List[int]) -> List[int]:\n        pass",
    JavaScript: "var runningSum = function(nums) {\n    \n};",
    TypeScript: "function runningSum(nums: number[]): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] runningSum(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> runningSum(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.runningSum([1,2,3,4]))", expected: "[1, 3, 6, 10]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.runningSum([1,1,1,1,1]))", expected: "[1, 2, 3, 4, 5]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.runningSum([3,1,2,10,1]))", expected: "[3, 4, 6, 16, 17]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.runningSum([1]))", expected: "[1]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.runningSum([-1,-2,-3]))", expected: "[-1, -3, -6]", isPublic: false },
  ],
},
"Cognizant: Richest Customer Wealth": {
  company: "cognizant", pattern: "Matrix Row Sum",
  title: "Richest Customer Wealth",
  difficulty: "Easy",
  desc: "Given a 2D integer array `accounts` where `accounts[i][j]` is the amount of money the `i`th customer has in the `j`th bank, return the wealth of the richest customer.",
  examples: [
    { input: "accounts = [[1,2,3],[3,2,1]]", output: "6", explanation: "Both have wealth 6" },
    { input: "accounts = [[1,5],[7,3],[3,5]]", output: "10" }
  ],
  constraints: ["m == accounts.length", "n == accounts[i].length", "1 <= m,n <= 50", "1 <= accounts[i][j] <= 100"],
  functionSignature: "def maximumWealth(self, accounts: List[List[int]]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def maximumWealth(self, accounts: List[List[int]]) -> int:\n        pass",
    JavaScript: "var maximumWealth = function(accounts) {\n    \n};",
    TypeScript: "function maximumWealth(accounts: number[][]): number {\n    \n};",
    Java: "class Solution {\n    public int maximumWealth(int[][] accounts) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int maximumWealth(vector<vector<int>>& accounts) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.maximumWealth([[1,2,3],[3,2,1]]))", expected: "6", isPublic: true },
    { script: "sol = Solution()\nprint(sol.maximumWealth([[1,5],[7,3],[3,5]]))", expected: "10", isPublic: true },
    { script: "sol = Solution()\nprint(sol.maximumWealth([[2,8,7],[7,1,3],[1,9,5]]))", expected: "17", isPublic: false },
    { script: "sol = Solution()\nprint(sol.maximumWealth([[100]]))", expected: "100", isPublic: false },
    { script: "sol = Solution()\nprint(sol.maximumWealth([[1,1],[1,1]]))", expected: "2", isPublic: false },
  ],
},

"Cognizant: Kids With Greatest Candies": {
  company: "cognizant", pattern: "Array Comparison",
  title: "Kids With the Greatest Number of Candies",
  difficulty: "Easy",
  desc: "Given an integer array `candies` and integer `extraCandies`, return a boolean array where `result[i]` is true if the ith kid can have the greatest number of candies after receiving all `extraCandies`.",
  examples: [
    { input: "candies = [2,3,5,1,3], extraCandies = 3", output: "[true,true,true,false,true]" },
    { input: "candies = [4,2,1,1,2], extraCandies = 1", output: "[true,false,false,false,false]" }
  ],
  constraints: ["2 <= candies.length <= 100", "1 <= candies[i] <= 100", "1 <= extraCandies <= 50"],
  functionSignature: "def kidsWithCandies(self, candies: List[int], extraCandies: int) -> List[bool]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def kidsWithCandies(self, candies: List[int], extraCandies: int) -> List[bool]:\n        pass",
    JavaScript: "var kidsWithCandies = function(candies, extraCandies) {\n    \n};",
    TypeScript: "function kidsWithCandies(candies: number[], extraCandies: number): boolean[] {\n    \n};",
    Java: "class Solution {\n    public List<Boolean> kidsWithCandies(int[] candies, int extraCandies) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<bool> kidsWithCandies(vector<int>& candies, int extraCandies) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.kidsWithCandies([2,3,5,1,3], 3))", expected: "[True, True, True, False, True]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.kidsWithCandies([4,2,1,1,2], 1))", expected: "[True, False, False, False, False]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.kidsWithCandies([12,1,12], 10))", expected: "[True, False, True]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.kidsWithCandies([1,1], 1))", expected: "[True, True]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.kidsWithCandies([5,5,5], 0))", expected: "[True, True, True]", isPublic: false },
  ],
},

"Cognizant: Concatenation of Array": {
  company: "cognizant", pattern: "Array",
  title: "Concatenation of Array",
  difficulty: "Easy",
  desc: "Given an integer array `nums` of length `n`, return an array `ans` of length `2n` where `ans[i] == nums[i]` and `ans[i+n] == nums[i]` for all `0 <= i < n`.",
  examples: [
    { input: "nums = [1,2,1]", output: "[1,2,1,1,2,1]" },
    { input: "nums = [1,3,2,1]", output: "[1,3,2,1,1,3,2,1]" }
  ],
  constraints: ["n == nums.length", "1 <= n <= 1000", "1 <= nums[i] <= 1000"],
  functionSignature: "def getConcatenation(self, nums: List[int]) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def getConcatenation(self, nums: List[int]) -> List[int]:\n        pass",
    JavaScript: "var getConcatenation = function(nums) {\n    \n};",
    TypeScript: "function getConcatenation(nums: number[]): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] getConcatenation(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> getConcatenation(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.getConcatenation([1,2,1]))", expected: "[1, 2, 1, 1, 2, 1]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.getConcatenation([1,3,2,1]))", expected: "[1, 3, 2, 1, 1, 3, 2, 1]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.getConcatenation([1]))", expected: "[1, 1]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.getConcatenation([5,5]))", expected: "[5, 5, 5, 5]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.getConcatenation([1,2,3]))", expected: "[1, 2, 3, 1, 2, 3]", isPublic: false },
  ],
},

"Cognizant: Count Cells in Range": {
  company: "cognizant", pattern: "Matrix Traversal",
  title: "Count Cells in Range",
  difficulty: "Medium",
  desc: "Given an `m x n` integer matrix and two integers `lo` and `hi`, return the number of cells whose value is in the inclusive range `[lo, hi]`.",
  examples: [
    { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]], lo = 4, hi = 7", output: "4" },
    { input: "matrix = [[1,2],[3,4]], lo = 2, hi = 3", output: "2" }
  ],
  constraints: ["1 <= m, n <= 100", "1 <= matrix[i][j] <= 10^4", "1 <= lo <= hi <= 10^4"],
  functionSignature: "def countCells(self, matrix: List[List[int]], lo: int, hi: int) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def countCells(self, matrix: List[List[int]], lo: int, hi: int) -> int:\n        pass",
    JavaScript: "var countCells = function(matrix, lo, hi) {\n    \n};",
    TypeScript: "function countCells(matrix: number[][], lo: number, hi: number): number {\n    \n};",
    Java: "class Solution {\n    public int countCells(int[][] matrix, int lo, int hi) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int countCells(vector<vector<int>>& matrix, int lo, int hi) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.countCells([[1,2,3],[4,5,6],[7,8,9]], 4, 7))", expected: "4", isPublic: true },
    { script: "sol = Solution()\nprint(sol.countCells([[1,2],[3,4]], 2, 3))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.countCells([[1]], 1, 1))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.countCells([[5,6],[7,8]], 1, 4))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.countCells([[1,2,3],[4,5,6]], 1, 6))", expected: "6", isPublic: false },
  ],
},

"Cognizant: Sum of Unique Elements": {
  company: "cognizant", pattern: "Hash Map",
  title: "Sum of Unique Elements",
  difficulty: "Easy",
  desc: "Given an integer array `nums`, return the sum of all unique elements. An element is unique if it appears exactly once.",
  examples: [
    { input: "nums = [1,2,3,2]", output: "4", explanation: "1 and 3 are unique, sum=4" },
    { input: "nums = [1,1,1,1,1]", output: "0" }
  ],
  constraints: ["1 <= nums.length <= 100", "1 <= nums[i] <= 100"],
  functionSignature: "def sumOfUnique(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def sumOfUnique(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var sumOfUnique = function(nums) {\n    \n};",
    TypeScript: "function sumOfUnique(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int sumOfUnique(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int sumOfUnique(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.sumOfUnique([1,2,3,2]))", expected: "4", isPublic: true },
    { script: "sol = Solution()\nprint(sol.sumOfUnique([1,1,1,1,1]))", expected: "0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.sumOfUnique([1,2,3,4,5]))", expected: "15", isPublic: false },
    { script: "sol = Solution()\nprint(sol.sumOfUnique([1,1,2,2]))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.sumOfUnique([7]))", expected: "7", isPublic: false },
  ],
},

"Cognizant: Defanging IP Address": {
  company: "cognizant", pattern: "String Manipulation",
  title: "Defanging an IP Address",
  difficulty: "Easy",
  desc: "Given a valid IPv4 address `address`, return a defanged version where every `.` is replaced with `[.]`.",
  examples: [
    { input: 'address = "1.1.1.1"', output: '"1[.]1[.]1[.]1"' },
    { input: 'address = "255.100.50.0"', output: '"255[.]100[.]50[.]0"' }
  ],
  constraints: ["The given address is a valid IPv4 address"],
  functionSignature: "def defangIPaddr(self, address: str) -> str:",
  starters: {
    Python: "class Solution:\n    def defangIPaddr(self, address: str) -> str:\n        pass",
    JavaScript: "var defangIPaddr = function(address) {\n    \n};",
    TypeScript: "function defangIPaddr(address: string): string {\n    \n};",
    Java: "class Solution {\n    public String defangIPaddr(String address) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    string defangIPaddr(string address) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.defangIPaddr("1.1.1.1"))', expected: "1[.]1[.]1[.]1", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.defangIPaddr("255.100.50.0"))', expected: "255[.]100[.]50[.]0", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.defangIPaddr("192.168.1.1"))', expected: "192[.]168[.]1[.]1", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.defangIPaddr("0.0.0.0"))', expected: "0[.]0[.]0[.]0", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.defangIPaddr("10.0.0.1"))', expected: "10[.]0[.]0[.]1", isPublic: false },
  ],
},

"Cognizant: Smaller Numbers Than Current": {
  company: "cognizant", pattern: "Sorting + Hash Map",
  title: "How Many Numbers Are Smaller Than the Current Number",
  difficulty: "Easy",
  desc: "Given the array `nums`, for each `nums[i]` find out how many numbers in the array are smaller than it. Return the count array.",
  examples: [
    { input: "nums = [8,1,2,2,3]", output: "[4,0,1,1,3]" },
    { input: "nums = [6,5,4,8]", output: "[2,1,0,3]" }
  ],
  constraints: ["2 <= nums.length <= 500", "0 <= nums[i] <= 100"],
  functionSignature: "def smallerNumbersThanCurrent(self, nums: List[int]) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def smallerNumbersThanCurrent(self, nums: List[int]) -> List[int]:\n        pass",
    JavaScript: "var smallerNumbersThanCurrent = function(nums) {\n    \n};",
    TypeScript: "function smallerNumbersThanCurrent(nums: number[]): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] smallerNumbersThanCurrent(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> smallerNumbersThanCurrent(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.smallerNumbersThanCurrent([8,1,2,2,3]))", expected: "[4, 0, 1, 1, 3]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.smallerNumbersThanCurrent([6,5,4,8]))", expected: "[2, 1, 0, 3]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.smallerNumbersThanCurrent([7,7,7,7]))", expected: "[0, 0, 0, 0]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.smallerNumbersThanCurrent([0,1]))", expected: "[0, 1]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.smallerNumbersThanCurrent([5,0,10,0,10,6]))", expected: "[3, 0, 5, 0, 5, 4]", isPublic: false },
  ],
},

"Cognizant: Check Power of Two": {
  company: "cognizant", pattern: "Bit Manipulation",
  title: "Power of Two",
  difficulty: "Easy",
  desc: "Given an integer `n`, return `true` if it is a power of two, otherwise return `false`. An integer is a power of two if there exists an integer `x` such that `n == 2^x`.",
  examples: [
    { input: "n = 1", output: "true", explanation: "2^0 = 1" },
    { input: "n = 3", output: "false" }
  ],
  constraints: ["-2^31 <= n <= 2^31 - 1"],
  functionSignature: "def isPowerOfTwo(self, n: int) -> bool:",
  starters: {
    Python: "class Solution:\n    def isPowerOfTwo(self, n: int) -> bool:\n        pass",
    JavaScript: "var isPowerOfTwo = function(n) {\n    \n};",
    TypeScript: "function isPowerOfTwo(n: number): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isPowerOfTwo(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isPowerOfTwo(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.isPowerOfTwo(1))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isPowerOfTwo(16))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isPowerOfTwo(3))", expected: "False", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isPowerOfTwo(0))", expected: "False", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isPowerOfTwo(-16))", expected: "False", isPublic: false },
  ],
},

// =============================================================================
// ACCENTURE (15 problems)
// =============================================================================

"Accenture: Find Peak Element": {
  company: "accenture", pattern: "Binary Search",
  title: "Find Peak Element",
  difficulty: "Medium",
  desc: "A peak element is an element that is strictly greater than its neighbors. Given an integer array `nums`, find a peak element and return its index. If multiple peaks exist, return any.",
  examples: [
    { input: "nums = [1,2,3,1]", output: "2" },
    { input: "nums = [1,2,1,3,5,6,4]", output: "5" }
  ],
  constraints: ["1 <= nums.length <= 1000", "-2^31 <= nums[i] <= 2^31 - 1", "nums[i] != nums[i+1] for all valid i"],
  functionSignature: "def findPeakElement(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def findPeakElement(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var findPeakElement = function(nums) {\n    \n};",
    TypeScript: "function findPeakElement(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int findPeakElement(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int findPeakElement(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.findPeakElement([1,2,3,1]))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nresult = sol.findPeakElement([1,2,1,3,5,6,4])\nprint(result in [1,5])", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.findPeakElement([1]))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.findPeakElement([1,2]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.findPeakElement([2,1]))", expected: "0", isPublic: false },
  ],
},
"Accenture: Single Number": {
  company: "accenture", pattern: "Bit Manipulation XOR",
  title: "Single Number",
  difficulty: "Easy",
  desc: "Given a non-empty array of integers where every element appears twice except for one, find that single one. Your algorithm should have linear runtime and constant space.",
  examples: [
    { input: "nums = [2,2,1]", output: "1" },
    { input: "nums = [4,1,2,1,2]", output: "4" }
  ],
  constraints: ["1 <= nums.length <= 3 * 10^4", "-3 * 10^4 <= nums[i] <= 3 * 10^4", "Each element appears twice except for one"],
  functionSignature: "def singleNumber(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def singleNumber(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var singleNumber = function(nums) {\n    \n};",
    TypeScript: "function singleNumber(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int singleNumber(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.singleNumber([2,2,1]))", expected: "1", isPublic: true },
    { script: "sol = Solution()\nprint(sol.singleNumber([4,1,2,1,2]))", expected: "4", isPublic: true },
    { script: "sol = Solution()\nprint(sol.singleNumber([1]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.singleNumber([0,1,0]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.singleNumber([7,3,7]))", expected: "3", isPublic: false },
  ],
},

"Accenture: Count Primes": {
  company: "accenture", pattern: "Sieve of Eratosthenes",
  title: "Count Primes",
  difficulty: "Medium",
  desc: "Given an integer `n`, return the number of prime numbers that are strictly less than `n`.",
  examples: [
    { input: "n = 10", output: "4", explanation: "Primes less than 10: 2, 3, 5, 7" },
    { input: "n = 0", output: "0" }
  ],
  constraints: ["0 <= n <= 5 * 10^6"],
  functionSignature: "def countPrimes(self, n: int) -> int:",
  starters: {
    Python: "class Solution:\n    def countPrimes(self, n: int) -> int:\n        pass",
    JavaScript: "var countPrimes = function(n) {\n    \n};",
    TypeScript: "function countPrimes(n: number): number {\n    \n};",
    Java: "class Solution {\n    public int countPrimes(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int countPrimes(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.countPrimes(10))", expected: "4", isPublic: true },
    { script: "sol = Solution()\nprint(sol.countPrimes(0))", expected: "0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.countPrimes(1))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.countPrimes(20))", expected: "8", isPublic: false },
    { script: "sol = Solution()\nprint(sol.countPrimes(2))", expected: "0", isPublic: false },
  ],
},

"Accenture: Isomorphic Strings": {
  company: "accenture", pattern: "Hash Map Bijection",
  title: "Isomorphic Strings",
  difficulty: "Easy",
  desc: "Given two strings `s` and `t`, determine if they are isomorphic. Two strings are isomorphic if the characters in `s` can be replaced to get `t`. No two characters may map to the same character, but a character may map to itself.",
  examples: [
    { input: 's = "egg", t = "add"', output: "true" },
    { input: 's = "foo", t = "bar"', output: "false" }
  ],
  constraints: ["1 <= s.length <= 5 * 10^4", "t.length == s.length"],
  functionSignature: "def isIsomorphic(self, s: str, t: str) -> bool:",
  starters: {
    Python: "class Solution:\n    def isIsomorphic(self, s: str, t: str) -> bool:\n        pass",
    JavaScript: "var isIsomorphic = function(s, t) {\n    \n};",
    TypeScript: "function isIsomorphic(s: string, t: string): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isIsomorphic(String s, String t) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isIsomorphic(string s, string t) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.isIsomorphic("egg", "add"))', expected: "True", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.isIsomorphic("foo", "bar"))', expected: "False", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.isIsomorphic("paper", "title"))', expected: "True", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.isIsomorphic("badc", "baba"))', expected: "False", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.isIsomorphic("a", "a"))', expected: "True", isPublic: false },
  ],
},
"Accenture: Happy Number": {
  company: "accenture", pattern: "Floyd Cycle Detection",
  title: "Happy Number",
  difficulty: "Easy",
  desc: "A happy number is defined by: starting with any positive integer, replace it by the sum of squares of its digits and repeat. A number is happy if the process ends at 1. Return true if `n` is happy.",
  examples: [
    { input: "n = 19", output: "true", explanation: "1^2+9^2=82, 8^2+2^2=68, 6^2+8^2=100, 1^2+0+0=1" },
    { input: "n = 2", output: "false" }
  ],
  constraints: ["1 <= n <= 2^31 - 1"],
  functionSignature: "def isHappy(self, n: int) -> bool:",
  starters: {
    Python: "class Solution:\n    def isHappy(self, n: int) -> bool:\n        pass",
    JavaScript: "var isHappy = function(n) {\n    \n};",
    TypeScript: "function isHappy(n: number): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isHappy(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isHappy(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.isHappy(19))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isHappy(2))", expected: "False", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isHappy(1))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isHappy(7))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isHappy(4))", expected: "False", isPublic: false },
  ],
},

"Accenture: Matrix Zero": {
  company: "accenture", pattern: "Matrix Traversal",
  title: "Set Matrix Zeroes",
  difficulty: "Medium",
  desc: "Given an `m x n` integer matrix, if an element is 0, set its entire row and column to 0 in-place. Return the modified matrix.",
  examples: [
    { input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]", output: "[[1,0,1],[0,0,0],[1,0,1]]" },
    { input: "matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]", output: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]" }
  ],
  constraints: ["m == matrix.length", "n == matrix[0].length", "1 <= m, n <= 200"],
  functionSignature: "def setZeroes(self, matrix: List[List[int]]) -> List[List[int]]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def setZeroes(self, matrix: List[List[int]]) -> List[List[int]]:\n        pass",
    JavaScript: "var setZeroes = function(matrix) {\n    \n};",
    TypeScript: "function setZeroes(matrix: number[][]): number[][] {\n    \n};",
    Java: "class Solution {\n    public void setZeroes(int[][] matrix) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    void setZeroes(vector<vector<int>>& matrix) {\n        \n    }\n};",
  },
  testCases: [
    { script: "m = [[1,1,1],[1,0,1],[1,1,1]]\nsol = Solution()\nprint(sol.setZeroes(m))", expected: "[[1, 0, 1], [0, 0, 0], [1, 0, 1]]", isPublic: true },
    { script: "m = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]\nsol = Solution()\nprint(sol.setZeroes(m))", expected: "[[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]", isPublic: true },
    { script: "m = [[1]]\nsol = Solution()\nprint(sol.setZeroes(m))", expected: "[[1]]", isPublic: false },
    { script: "m = [[0]]\nsol = Solution()\nprint(sol.setZeroes(m))", expected: "[[0]]", isPublic: false },
    { script: "m = [[1,0],[0,1]]\nsol = Solution()\nprint(sol.setZeroes(m))", expected: "[[0, 0], [0, 0]]", isPublic: false },
  ],
},

"Accenture: Kth Largest Element": {
  company: "accenture", pattern: "Heap / QuickSelect",
  title: "Kth Largest Element in Array",
  difficulty: "Medium",
  desc: "Given an integer array `nums` and integer `k`, return the kth largest element in the array. Note it is the kth largest in sorted order, not the kth distinct element.",
  examples: [
    { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" },
    { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4" }
  ],
  constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
  functionSignature: "def findKthLargest(self, nums: List[int], k: int) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def findKthLargest(self, nums: List[int], k: int) -> int:\n        pass",
    JavaScript: "var findKthLargest = function(nums, k) {\n    \n};",
    TypeScript: "function findKthLargest(nums: number[], k: number): number {\n    \n};",
    Java: "class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.findKthLargest([3,2,1,5,6,4], 2))", expected: "5", isPublic: true },
    { script: "sol = Solution()\nprint(sol.findKthLargest([3,2,3,1,2,4,5,5,6], 4))", expected: "4", isPublic: true },
    { script: "sol = Solution()\nprint(sol.findKthLargest([1], 1))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.findKthLargest([-1,-1], 2))", expected: "-1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.findKthLargest([7,6,5,4,3,2,1], 5))", expected: "3", isPublic: false },
  ],
},

"Accenture: Stock Buy Sell": {
  company: "accenture", pattern: "Greedy One Pass",
  title: "Best Time to Buy and Sell Stock",
  difficulty: "Easy",
  desc: "Given an array `prices` where `prices[i]` is the price on day `i`, find the maximum profit you can achieve by buying on one day and selling on a later day. If no profit is possible, return 0.",
  examples: [
    { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price=1), sell on day 5 (price=6)" },
    { input: "prices = [7,6,4,3,1]", output: "0" }
  ],
  constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
  functionSignature: "def maxProfit(self, prices: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        pass",
    JavaScript: "var maxProfit = function(prices) {\n    \n};",
    TypeScript: "function maxProfit(prices: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.maxProfit([7,1,5,3,6,4]))", expected: "5", isPublic: true },
    { script: "sol = Solution()\nprint(sol.maxProfit([7,6,4,3,1]))", expected: "0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.maxProfit([1,2]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.maxProfit([2,4,1]))", expected: "2", isPublic: false },
    { script: "sol = Solution()\nprint(sol.maxProfit([3,3,3]))", expected: "0", isPublic: false },
  ],
},

"Accenture: Majority Element": {
  company: "accenture", pattern: "Boyer-Moore Voting",
  title: "Majority Element",
  difficulty: "Easy",
  desc: "Given an array `nums` of size `n`, return the majority element. The majority element is the element that appears more than `n/2` times. It always exists.",
  examples: [
    { input: "nums = [3,2,3]", output: "3" },
    { input: "nums = [2,2,1,1,1,2,2]", output: "2" }
  ],
  constraints: ["n == nums.length", "1 <= n <= 5 * 10^4", "-10^9 <= nums[i] <= 10^9"],
  functionSignature: "def majorityElement(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def majorityElement(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var majorityElement = function(nums) {\n    \n};",
    TypeScript: "function majorityElement(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int majorityElement(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int majorityElement(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.majorityElement([3,2,3]))", expected: "3", isPublic: true },
    { script: "sol = Solution()\nprint(sol.majorityElement([2,2,1,1,1,2,2]))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.majorityElement([1]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.majorityElement([1,1,2]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.majorityElement([6,5,5]))", expected: "5", isPublic: false },
  ],
},

"Accenture: Contains Duplicate": {
  company: "accenture", pattern: "Hash Set",
  title: "Contains Duplicate",
  difficulty: "Easy",
  desc: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and `false` if every element is distinct.",
  examples: [
    { input: "nums = [1,2,3,1]", output: "true" },
    { input: "nums = [1,2,3,4]", output: "false" }
  ],
  constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
  functionSignature: "def containsDuplicate(self, nums: List[int]) -> bool:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        pass",
    JavaScript: "var containsDuplicate = function(nums) {\n    \n};",
    TypeScript: "function containsDuplicate(nums: number[]): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.containsDuplicate([1,2,3,1]))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.containsDuplicate([1,2,3,4]))", expected: "False", isPublic: true },
    { script: "sol = Solution()\nprint(sol.containsDuplicate([1,1,1,3,3,4,3,2,4,2]))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.containsDuplicate([1]))", expected: "False", isPublic: false },
    { script: "sol = Solution()\nprint(sol.containsDuplicate([]))", expected: "False", isPublic: false },
  ],
},

"Accenture: Flipping Bits": {
  company: "accenture", pattern: "Bit Manipulation",
  title: "Complement of Base 10 Integer",
  difficulty: "Easy",
  desc: "Given a positive integer `n`, return its complement. The complement flips all bits of the binary representation of `n`. For example, 5 in binary is 101, complement is 010 = 2.",
  examples: [
    { input: "n = 5", output: "2" },
    { input: "n = 7", output: "0" }
  ],
  constraints: ["0 <= n < 10^9"],
  functionSignature: "def bitwiseComplement(self, n: int) -> int:",
  starters: {
    Python: "class Solution:\n    def bitwiseComplement(self, n: int) -> int:\n        pass",
    JavaScript: "var bitwiseComplement = function(n) {\n    \n};",
    TypeScript: "function bitwiseComplement(n: number): number {\n    \n};",
    Java: "class Solution {\n    public int bitwiseComplement(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int bitwiseComplement(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.bitwiseComplement(5))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.bitwiseComplement(7))", expected: "0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.bitwiseComplement(10))", expected: "5", isPublic: false },
    { script: "sol = Solution()\nprint(sol.bitwiseComplement(0))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.bitwiseComplement(1))", expected: "0", isPublic: false },
  ],
},

"Accenture: Subarray Product Less Than K": {
  company: "accenture", pattern: "Sliding Window",
  title: "Subarray Product Less Than K",
  difficulty: "Medium",
  desc: "Given an array of positive integers `nums` and integer `k`, return the number of contiguous subarrays where the product of all elements is strictly less than `k`.",
  examples: [
    { input: "nums = [10,5,2,6], k = 100", output: "8" },
    { input: "nums = [1,2,3], k = 0", output: "0" }
  ],
  constraints: ["1 <= nums.length <= 3 * 10^4", "1 <= nums[i] <= 1000", "0 <= k <= 10^6"],
  functionSignature: "def numSubarrayProductLessThanK(self, nums: List[int], k: int) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def numSubarrayProductLessThanK(self, nums: List[int], k: int) -> int:\n        pass",
    JavaScript: "var numSubarrayProductLessThanK = function(nums, k) {\n    \n};",
    TypeScript: "function numSubarrayProductLessThanK(nums: number[], k: number): number {\n    \n};",
    Java: "class Solution {\n    public int numSubarrayProductLessThanK(int[] nums, int k) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int numSubarrayProductLessThanK(vector<int>& nums, int k) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.numSubarrayProductLessThanK([10,5,2,6], 100))", expected: "8", isPublic: true },
    { script: "sol = Solution()\nprint(sol.numSubarrayProductLessThanK([1,2,3], 0))", expected: "0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.numSubarrayProductLessThanK([1,1,1], 10))", expected: "6", isPublic: false },
    { script: "sol = Solution()\nprint(sol.numSubarrayProductLessThanK([10], 10))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.numSubarrayProductLessThanK([1,2,3], 6))", expected: "4", isPublic: false },
  ],
},

// =============================================================================
// HCL TECHNOLOGIES (15 problems)
// =============================================================================

"HCL: Reverse Integer": {
  company: "hcl", pattern: "Math / String",
  title: "Reverse Integer",
  difficulty: "Medium",
  desc: "Given a signed 32-bit integer `x`, return `x` with its digits reversed. If reversing `x` causes overflow outside the 32-bit signed integer range `[-2^31, 2^31 - 1]`, return `0`.",
  examples: [
    { input: "x = 123", output: "321" },
    { input: "x = -123", output: "-321" }
  ],
  constraints: ["-2^31 <= x <= 2^31 - 1"],
  functionSignature: "def reverse(self, x: int) -> int:",
  starters: {
    Python: "class Solution:\n    def reverse(self, x: int) -> int:\n        pass",
    JavaScript: "var reverse = function(x) {\n    \n};",
    TypeScript: "function reverse(x: number): number {\n    \n};",
    Java: "class Solution {\n    public int reverse(int x) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int reverse(int x) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.reverse(123))", expected: "321", isPublic: true },
    { script: "sol = Solution()\nprint(sol.reverse(-123))", expected: "-321", isPublic: true },
    { script: "sol = Solution()\nprint(sol.reverse(120))", expected: "21", isPublic: false },
    { script: "sol = Solution()\nprint(sol.reverse(0))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.reverse(1534236469))", expected: "0", isPublic: false },
  ],
},

"HCL: Implement strStr": {
  company: "hcl", pattern: "String Matching",
  title: "Find First Occurrence in String",
  difficulty: "Easy",
  desc: "Given two strings `haystack` and `needle`, return the index of the first occurrence of `needle` in `haystack`, or `-1` if `needle` is not part of `haystack`.",
  examples: [
    { input: 'haystack = "sadbutsad", needle = "sad"', output: "0" },
    { input: 'haystack = "leetcode", needle = "leeto"', output: "-1" }
  ],
  constraints: ["1 <= haystack.length, needle.length <= 10^4"],
  functionSignature: "def strStr(self, haystack: str, needle: str) -> int:",
  starters: {
    Python: "class Solution:\n    def strStr(self, haystack: str, needle: str) -> int:\n        pass",
    JavaScript: "var strStr = function(haystack, needle) {\n    \n};",
    TypeScript: "function strStr(haystack: string, needle: string): number {\n    \n};",
    Java: "class Solution {\n    public int strStr(String haystack, String needle) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int strStr(string haystack, string needle) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.strStr("sadbutsad", "sad"))', expected: "0", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.strStr("leetcode", "leeto"))', expected: "-1", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.strStr("hello", "ll"))', expected: "2", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.strStr("a", "a"))', expected: "0", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.strStr("mississippi", "issip"))', expected: "4", isPublic: false },
  ],
},

"Accenture: Longest Increasing Subsequence": {
  company: "accenture", pattern: "Dynamic Programming",
  title: "Longest Increasing Subsequence",
  difficulty: "Medium",
  desc: "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
  examples: [
    { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "[2,3,7,101] is the longest increasing subsequence" },
    { input: "nums = [0,1,0,3,2,3]", output: "4" }
  ],
  constraints: ["1 <= nums.length <= 2500", "-10^4 <= nums[i] <= 10^4"],
  functionSignature: "def lengthOfLIS(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def lengthOfLIS(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var lengthOfLIS = function(nums) {\n    \n};",
    TypeScript: "function lengthOfLIS(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int lengthOfLIS(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int lengthOfLIS(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.lengthOfLIS([10,9,2,5,3,7,101,18]))", expected: "4", isPublic: true },
    { script: "sol = Solution()\nprint(sol.lengthOfLIS([0,1,0,3,2,3]))", expected: "4", isPublic: true },
    { script: "sol = Solution()\nprint(sol.lengthOfLIS([7,7,7,7,7]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.lengthOfLIS([1,3,6,7,9,4,10,5,6]))", expected: "6", isPublic: false },
    { script: "sol = Solution()\nprint(sol.lengthOfLIS([1]))", expected: "1", isPublic: false },
  ],
},

"Accenture: Valid Mountain Array": {
  company: "accenture", pattern: "Array Traversal",
  title: "Valid Mountain Array",
  difficulty: "Easy",
  desc: "Given an array of integers `arr`, return `true` if and only if it is a valid mountain array. An array is a valid mountain array if: arr.length >= 3, there exists some i (0 < i < arr.length - 1) such that arr[0] < arr[1] < ... < arr[i] and arr[i] > arr[i+1] > ... > arr[arr.length-1].",
  examples: [
    { input: "arr = [2,1]", output: "false" },
    { input: "arr = [3,5,5]", output: "false" },
    { input: "arr = [0,3,2,1]", output: "true" }
  ],
  constraints: ["1 <= arr.length <= 10^4", "0 <= arr[i] <= 10^4"],
  functionSignature: "def validMountainArray(self, arr: List[int]) -> bool:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def validMountainArray(self, arr: List[int]) -> bool:\n        pass",
    JavaScript: "var validMountainArray = function(arr) {\n    \n};",
    TypeScript: "function validMountainArray(arr: number[]): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean validMountainArray(int[] arr) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool validMountainArray(vector<int>& arr) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.validMountainArray([2,1]))", expected: "False", isPublic: true },
    { script: "sol = Solution()\nprint(sol.validMountainArray([0,3,2,1]))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.validMountainArray([3,5,5]))", expected: "False", isPublic: false },
    { script: "sol = Solution()\nprint(sol.validMountainArray([0,1,2,3,4,5,4,3,2,1]))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.validMountainArray([1,2,3]))", expected: "False", isPublic: false },
  ],
},

"Accenture: Number of Steps to Reduce to Zero": {
  company: "accenture", pattern: "Bit Manipulation / Math",
  title: "Number of Steps to Reduce a Number to Zero",
  difficulty: "Easy",
  desc: "Given an integer `num`, return the number of steps to reduce it to zero. In one step, if the current number is even, divide it by 2; otherwise, subtract 1 from it.",
  examples: [
    { input: "num = 14", output: "6", explanation: "14->7->6->3->2->1->0" },
    { input: "num = 8", output: "4" }
  ],
  constraints: ["0 <= num <= 10^6"],
  functionSignature: "def numberOfSteps(self, num: int) -> int:",
  starters: {
    Python: "class Solution:\n    def numberOfSteps(self, num: int) -> int:\n        pass",
    JavaScript: "var numberOfSteps = function(num) {\n    \n};",
    TypeScript: "function numberOfSteps(num: number): number {\n    \n};",
    Java: "class Solution {\n    public int numberOfSteps(int num) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int numberOfSteps(int num) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.numberOfSteps(14))", expected: "6", isPublic: true },
    { script: "sol = Solution()\nprint(sol.numberOfSteps(8))", expected: "4", isPublic: true },
    { script: "sol = Solution()\nprint(sol.numberOfSteps(123))", expected: "12", isPublic: false },
    { script: "sol = Solution()\nprint(sol.numberOfSteps(0))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.numberOfSteps(1))", expected: "1", isPublic: false },
  ],
},

// =============================================================================
// HCL TECHNOLOGIES continued (problems 3-15)
// =============================================================================

"HCL: Sqrt Integer": {
  company: "hcl", pattern: "Binary Search / Math",
  title: "Sqrt(x)",
  difficulty: "Easy",
  desc: "Given a non-negative integer `x`, return the square root of `x` rounded down to the nearest integer. The returned integer should be non-negative as well. Do not use any built-in exponent function or operator.",
  examples: [
    { input: "x = 4", output: "2" },
    { input: "x = 8", output: "2", explanation: "sqrt(8) = 2.82..., rounded down to 2" }
  ],
  constraints: ["0 <= x <= 2^31 - 1"],
  functionSignature: "def mySqrt(self, x: int) -> int:",
  starters: {
    Python: "class Solution:\n    def mySqrt(self, x: int) -> int:\n        pass",
    JavaScript: "var mySqrt = function(x) {\n    \n};",
    TypeScript: "function mySqrt(x: number): number {\n    \n};",
    Java: "class Solution {\n    public int mySqrt(int x) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int mySqrt(int x) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.mySqrt(4))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.mySqrt(8))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.mySqrt(0))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.mySqrt(1))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.mySqrt(2147395599))", expected: "46339", isPublic: false },
  ],
},

"HCL: Excel Sheet Column Number": {
  company: "hcl", pattern: "Math / String",
  title: "Excel Sheet Column Number",
  difficulty: "Easy",
  desc: "Given a string `columnTitle` representing the column title as it appears in an Excel sheet, return its corresponding column number. For example: A->1, B->2, Z->26, AA->27, AB->28.",
  examples: [
    { input: 'columnTitle = "A"', output: "1" },
    { input: 'columnTitle = "AB"', output: "28" }
  ],
  constraints: ["1 <= columnTitle.length <= 7", "columnTitle consists only of uppercase English letters"],
  functionSignature: "def titleToNumber(self, columnTitle: str) -> int:",
  starters: {
    Python: "class Solution:\n    def titleToNumber(self, columnTitle: str) -> int:\n        pass",
    JavaScript: "var titleToNumber = function(columnTitle) {\n    \n};",
    TypeScript: "function titleToNumber(columnTitle: string): number {\n    \n};",
    Java: "class Solution {\n    public int titleToNumber(String columnTitle) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int titleToNumber(string columnTitle) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.titleToNumber("A"))', expected: "1", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.titleToNumber("AB"))', expected: "28", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.titleToNumber("ZY"))', expected: "701", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.titleToNumber("Z"))', expected: "26", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.titleToNumber("AA"))', expected: "27", isPublic: false },
  ],
},

"HCL: Fizz Buzz": {
  company: "hcl", pattern: "Math / String",
  title: "Fizz Buzz",
  difficulty: "Easy",
  desc: "Given an integer `n`, return a string array where: answer[i] == 'FizzBuzz' if i is divisible by 3 and 5, answer[i] == 'Fizz' if divisible by 3, answer[i] == 'Buzz' if divisible by 5, otherwise answer[i] == string representation of i. (1-indexed)",
  examples: [
    { input: "n = 3", output: '["1","2","Fizz"]' },
    { input: "n = 5", output: '["1","2","Fizz","4","Buzz"]' }
  ],
  constraints: ["1 <= n <= 10^4"],
  functionSignature: "def fizzBuzz(self, n: int) -> List[str]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def fizzBuzz(self, n: int) -> List[str]:\n        pass",
    JavaScript: "var fizzBuzz = function(n) {\n    \n};",
    TypeScript: "function fizzBuzz(n: number): string[] {\n    \n};",
    Java: "class Solution {\n    public List<String> fizzBuzz(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<string> fizzBuzz(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.fizzBuzz(3))", expected: "['1', '2', 'Fizz']", isPublic: true },
    { script: "sol = Solution()\nprint(sol.fizzBuzz(5))", expected: "['1', '2', 'Fizz', '4', 'Buzz']", isPublic: true },
    { script: "sol = Solution()\nprint(sol.fizzBuzz(15)[-1])", expected: "FizzBuzz", isPublic: false },
    { script: "sol = Solution()\nprint(sol.fizzBuzz(1))", expected: "['1']", isPublic: false },
    { script: "sol = Solution()\nprint(sol.fizzBuzz(6)[5])", expected: "Fizz", isPublic: false },
  ],
},

"HCL: Valid Perfect Square": {
  company: "hcl", pattern: "Binary Search / Math",
  title: "Valid Perfect Square",
  difficulty: "Easy",
  desc: "Given a positive integer `num`, return `true` if `num` is a perfect square, or `false` otherwise. A perfect square is an integer that is the square of an integer. Do not use any built-in library function such as sqrt.",
  examples: [
    { input: "num = 16", output: "true" },
    { input: "num = 14", output: "false" }
  ],
  constraints: ["1 <= num <= 2^31 - 1"],
  functionSignature: "def isPerfectSquare(self, num: int) -> bool:",
  starters: {
    Python: "class Solution:\n    def isPerfectSquare(self, num: int) -> bool:\n        pass",
    JavaScript: "var isPerfectSquare = function(num) {\n    \n};",
    TypeScript: "function isPerfectSquare(num: number): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isPerfectSquare(int num) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isPerfectSquare(int num) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.isPerfectSquare(16))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isPerfectSquare(14))", expected: "False", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isPerfectSquare(1))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isPerfectSquare(25))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isPerfectSquare(2147483647))", expected: "False", isPublic: false },
  ],
},

"HCL: Min Stack": {
  company: "hcl", pattern: "Stack / Design",
  title: "Min Stack",
  difficulty: "Medium",
  desc: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement the MinStack class with push(val), pop(), top(), and getMin() methods.",
  examples: [
    { input: 'MinStack ops: push(-2), push(0), push(-3), getMin, pop, top, getMin', output: "[-3, 0, -2]" }
  ],
  constraints: ["-2^31 <= val <= 2^31 - 1", "pop, top, getMin always called on non-empty stack"],
  functionSignature: "def getMin(self) -> int:",
  starters: {
    Python: "class MinStack:\n    def __init__(self):\n        pass\n\n    def push(self, val: int) -> None:\n        pass\n\n    def pop(self) -> None:\n        pass\n\n    def top(self) -> int:\n        pass\n\n    def getMin(self) -> int:\n        pass",
    JavaScript: "class MinStack {\n    constructor() {\n        \n    }\n    push(val) {\n        \n    }\n    pop() {\n        \n    }\n    top() {\n        \n    }\n    getMin() {\n        \n    }\n}",
    TypeScript: "class MinStack {\n    constructor() {\n        \n    }\n    push(val: number): void {\n        \n    }\n    pop(): void {\n        \n    }\n    top(): number {\n        \n    }\n    getMin(): number {\n        \n    }\n}",
    Java: "class MinStack {\n    public MinStack() {}\n    public void push(int val) {}\n    public void pop() {}\n    public int top() { return 0; }\n    public int getMin() { return 0; }\n}",
    "C++": "class MinStack {\npublic:\n    MinStack() {}\n    void push(int val) {}\n    void pop() {}\n    int top() { return 0; }\n    int getMin() { return 0; }\n};",
  },
  testCases: [
    { script: "ms = MinStack()\nms.push(-2)\nms.push(0)\nms.push(-3)\nprint(ms.getMin())", expected: "-3", isPublic: true },
    { script: "ms = MinStack()\nms.push(-2)\nms.push(0)\nms.push(-3)\nms.pop()\nprint(ms.top())", expected: "0", isPublic: true },
    { script: "ms = MinStack()\nms.push(-2)\nms.push(0)\nms.push(-3)\nms.pop()\nprint(ms.getMin())", expected: "-2", isPublic: false },
    { script: "ms = MinStack()\nms.push(5)\nprint(ms.getMin())", expected: "5", isPublic: false },
    { script: "ms = MinStack()\nms.push(2)\nms.push(0)\nms.push(3)\nms.push(0)\nprint(ms.getMin())", expected: "0", isPublic: false },
  ],
},

"HCL: Diameter of Binary Tree": {
  company: "hcl", pattern: "Tree DFS",
  title: "Diameter of Binary Tree",
  difficulty: "Easy",
  desc: "Given the root of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.",
  examples: [
    { input: "root = [1,2,3,4,5]", output: "3", explanation: "Length of path [4,2,1,3] or [5,2,1,3]" },
    { input: "root = [1,2]", output: "1" }
  ],
  constraints: ["The number of nodes in the tree is in the range [1, 10^4]", "-100 <= Node.val <= 100"],
  functionSignature: "def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:",
  starters: {
    Python: "from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Solution:\n    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:\n        pass",
    JavaScript: "var diameterOfBinaryTree = function(root) {\n    \n};",
    TypeScript: "function diameterOfBinaryTree(root: TreeNode | null): number {\n    \n};",
    Java: "class Solution {\n    public int diameterOfBinaryTree(TreeNode root) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int diameterOfBinaryTree(TreeNode* root) {\n        \n    }\n};",
  },
  testCases: [
    { script: "root = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))\nsol = Solution()\nprint(sol.diameterOfBinaryTree(root))", expected: "3", isPublic: true },
    { script: "root = TreeNode(1, TreeNode(2))\nsol = Solution()\nprint(sol.diameterOfBinaryTree(root))", expected: "1", isPublic: true },
    { script: "root = TreeNode(1)\nsol = Solution()\nprint(sol.diameterOfBinaryTree(root))", expected: "0", isPublic: false },
    { script: "root = TreeNode(1, TreeNode(2, TreeNode(3, TreeNode(4))))\nsol = Solution()\nprint(sol.diameterOfBinaryTree(root))", expected: "3", isPublic: false },
    { script: "root = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3, None, TreeNode(6, None, TreeNode(7))))\nsol = Solution()\nprint(sol.diameterOfBinaryTree(root))", expected: "5", isPublic: false },
  ],
},

"HCL: Convert Sorted Array to BST": {
  company: "hcl", pattern: "Tree / Divide and Conquer",
  title: "Convert Sorted Array to Binary Search Tree",
  difficulty: "Easy",
  desc: "Given an integer array `nums` where the elements are sorted in ascending order, convert it to a height-balanced binary search tree. Return the root of the BST.",
  examples: [
    { input: "nums = [-10,-3,0,5,9]", output: "[0,-3,9,-10,null,5]" },
    { input: "nums = [1,3]", output: "[3,1]" }
  ],
  constraints: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4", "nums is sorted in strictly increasing order"],
  functionSignature: "def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:",
  starters: {
    Python: "from typing import List, Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Solution:\n    def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:\n        pass",
    JavaScript: "var sortedArrayToBST = function(nums) {\n    \n};",
    TypeScript: "function sortedArrayToBST(nums: number[]): TreeNode | null {\n    \n};",
    Java: "class Solution {\n    public TreeNode sortedArrayToBST(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    TreeNode* sortedArrayToBST(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "def inorder(n):\n    return inorder(n.left)+[n.val]+inorder(n.right) if n else []\nroot = Solution().sortedArrayToBST([-10,-3,0,5,9])\nprint(inorder(root))", expected: "[-10, -3, 0, 5, 9]", isPublic: true },
    { script: "def inorder(n):\n    return inorder(n.left)+[n.val]+inorder(n.right) if n else []\nroot = Solution().sortedArrayToBST([1,3])\nprint(inorder(root))", expected: "[1, 3]", isPublic: true },
    { script: "root = Solution().sortedArrayToBST([1])\nprint(root.val)", expected: "1", isPublic: false },
    { script: "root = Solution().sortedArrayToBST([1,2,3])\nprint(root.val)", expected: "2", isPublic: false },
    { script: "def height(n):\n    return 0 if not n else 1+max(height(n.left),height(n.right))\nroot = Solution().sortedArrayToBST([-10,-3,0,5,9])\nprint(height(root) <= 3)", expected: "True", isPublic: false },
  ],
},

"HCL: Delete Node in Linked List": {
  company: "hcl", pattern: "Linked List",
  title: "Delete Node in a Linked List",
  difficulty: "Medium",
  desc: "There is a singly-linked list. You are given a node to delete (not the tail node). Delete the given node by copying the next node's value into it and adjusting pointers. Return the modified list as an array.",
  examples: [
    { input: "head = [4,5,1,9], node = 5", output: "[4,1,9]" },
    { input: "head = [4,5,1,9], node = 1", output: "[4,5,9]" }
  ],
  constraints: ["The number of nodes is in the range [2, 1000]", "Node.val is unique", "The given node is not the tail node"],
  functionSignature: "def deleteNode(self, node: ListNode) -> None:",
  starters: {
    Python: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\nclass Solution:\n    def deleteNode(self, node: ListNode) -> None:\n        pass",
    JavaScript: "var deleteNode = function(node) {\n    \n};",
    TypeScript: "function deleteNode(node: ListNode | null): void {\n    \n};",
    Java: "class Solution {\n    public void deleteNode(ListNode node) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    void deleteNode(ListNode* node) {\n        \n    }\n};",
  },
  testCases: [
    { script: "def make(v):\n    h=None\n    for x in reversed(v): n=ListNode(x); n.next=h; h=n\n    return h\ndef tolist(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nh=make([4,5,1,9])\nSolution().deleteNode(h.next)\nprint(tolist(h))", expected: "[4, 1, 9]", isPublic: true },
    { script: "def make(v):\n    h=None\n    for x in reversed(v): n=ListNode(x); n.next=h; h=n\n    return h\ndef tolist(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nh=make([4,5,1,9])\nSolution().deleteNode(h.next.next)\nprint(tolist(h))", expected: "[4, 5, 9]", isPublic: true },
    { script: "def make(v):\n    h=None\n    for x in reversed(v): n=ListNode(x); n.next=h; h=n\n    return h\ndef tolist(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nh=make([1,2])\nSolution().deleteNode(h)\nprint(tolist(h))", expected: "[2]", isPublic: false },
    { script: "def make(v):\n    h=None\n    for x in reversed(v): n=ListNode(x); n.next=h; h=n\n    return h\ndef tolist(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nh=make([1,2,3,4,5])\nSolution().deleteNode(h.next.next)\nprint(tolist(h))", expected: "[1, 2, 4, 5]", isPublic: false },
    { script: "def make(v):\n    h=None\n    for x in reversed(v): n=ListNode(x); n.next=h; h=n\n    return h\ndef tolist(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nh=make([10,20,30])\nSolution().deleteNode(h)\nprint(tolist(h))", expected: "[20, 30]", isPublic: false },
  ],
},

"HCL: Linked List Cycle": {
  company: "hcl", pattern: "Floyd's Algorithm",
  title: "Linked List Cycle",
  difficulty: "Easy",
  desc: "Given `head`, the head of a linked list, determine if the linked list has a cycle in it. Return `true` if there is a cycle, otherwise return `false`.",
  examples: [
    { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "Tail connects to node at index 1" },
    { input: "head = [1,2], pos = -1", output: "false" }
  ],
  constraints: ["The number of nodes is in the range [0, 10^4]", "-10^5 <= Node.val <= 10^5"],
  functionSignature: "def hasCycle(self, head: Optional[ListNode]) -> bool:",
  starters: {
    Python: "from typing import Optional\n\nclass ListNode:\n    def __init__(self, x):\n        self.val = x\n        self.next = None\n\nclass Solution:\n    def hasCycle(self, head: Optional[ListNode]) -> bool:\n        pass",
    JavaScript: "var hasCycle = function(head) {\n    \n};",
    TypeScript: "function hasCycle(head: ListNode | null): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean hasCycle(ListNode head) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        \n    }\n};",
  },
  testCases: [
    { script: "n1=ListNode(3);n2=ListNode(2);n3=ListNode(0);n4=ListNode(-4)\nn1.next=n2;n2.next=n3;n3.next=n4;n4.next=n2\nprint(Solution().hasCycle(n1))", expected: "True", isPublic: true },
    { script: "n1=ListNode(1);n2=ListNode(2)\nn1.next=n2\nprint(Solution().hasCycle(n1))", expected: "False", isPublic: true },
    { script: "n1=ListNode(1)\nprint(Solution().hasCycle(n1))", expected: "False", isPublic: false },
    { script: "n1=ListNode(1);n1.next=n1\nprint(Solution().hasCycle(n1))", expected: "True", isPublic: false },
    { script: "print(Solution().hasCycle(None))", expected: "False", isPublic: false },
  ],
},

"HCL: Reverse String": {
  company: "hcl", pattern: "Two Pointers",
  title: "Reverse String",
  difficulty: "Easy",
  desc: "Write a function that reverses a string. The input is given as an array of characters `s`. Modify in-place with O(1) extra memory and return the array.",
  examples: [
    { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
    { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }
  ],
  constraints: ["1 <= s.length <= 10^5", "s[i] is a printable ASCII character"],
  functionSignature: "def reverseString(self, s: List[str]) -> List[str]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def reverseString(self, s: List[str]) -> List[str]:\n        pass",
    JavaScript: "var reverseString = function(s) {\n    \n};",
    TypeScript: "function reverseString(s: string[]): string[] {\n    \n};",
    Java: "class Solution {\n    public void reverseString(char[] s) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        \n    }\n};",
  },
  testCases: [
    { script: 's = ["h","e","l","l","o"]\nSolution().reverseString(s)\nprint(s)', expected: "['o', 'l', 'l', 'e', 'h']", isPublic: true },
    { script: 's = ["H","a","n","n","a","h"]\nSolution().reverseString(s)\nprint(s)', expected: "['h', 'a', 'n', 'n', 'a', 'H']", isPublic: true },
    { script: 's = ["a"]\nSolution().reverseString(s)\nprint(s)', expected: "['a']", isPublic: false },
    { script: 's = ["a","b"]\nSolution().reverseString(s)\nprint(s)', expected: "['b', 'a']", isPublic: false },
    { script: 's = ["A","B","C","D"]\nSolution().reverseString(s)\nprint(s)', expected: "['D', 'C', 'B', 'A']", isPublic: false },
  ],
},

"HCL: First Bad Version": {
  company: "hcl", pattern: "Binary Search",
  title: "First Bad Version",
  difficulty: "Easy",
  desc: "You have n versions [1, 2, ..., n] and you want to find out the first bad one, which causes all the following ones to be bad. You are given an API bool isBadVersion(version) which returns whether version is bad. Implement a function to find the first bad version.",
  examples: [
    { input: "n = 5, bad = 4", output: "4" },
    { input: "n = 1, bad = 1", output: "1" }
  ],
  constraints: ["1 <= bad <= n <= 2^31 - 1"],
  functionSignature: "def firstBadVersion(self, n: int) -> int:",
  starters: {
    Python: "class Solution:\n    def firstBadVersion(self, n: int) -> int:\n        # isBadVersion(v) is provided\n        pass",
    JavaScript: "var solution = function(isBadVersion) {\n    return function(n) {\n        \n    };\n};",
    TypeScript: "var solution = function(isBadVersion: any) {\n    return function(n: number): number {\n        \n    };\n};",
    Java: "public class Solution extends VersionControl {\n    public int firstBadVersion(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int firstBadVersion(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "bad_v = 4\ndef isBadVersion(v): return v >= bad_v\nclass Solution:\n    def firstBadVersion(self, n):\n        lo,hi=1,n\n        while lo<hi:\n            mid=(lo+hi)//2\n            if isBadVersion(mid): hi=mid\n            else: lo=mid+1\n        return lo\nprint(Solution().firstBadVersion(5))", expected: "4", isPublic: true },
    { script: "bad_v = 1\ndef isBadVersion(v): return v >= bad_v\nclass Solution:\n    def firstBadVersion(self, n):\n        lo,hi=1,n\n        while lo<hi:\n            mid=(lo+hi)//2\n            if isBadVersion(mid): hi=mid\n            else: lo=mid+1\n        return lo\nprint(Solution().firstBadVersion(1))", expected: "1", isPublic: true },
    { script: "bad_v = 3\ndef isBadVersion(v): return v >= bad_v\nclass Solution:\n    def firstBadVersion(self, n):\n        lo,hi=1,n\n        while lo<hi:\n            mid=(lo+hi)//2\n            if isBadVersion(mid): hi=mid\n            else: lo=mid+1\n        return lo\nprint(Solution().firstBadVersion(10))", expected: "3", isPublic: false },
    { script: "bad_v = 7\ndef isBadVersion(v): return v >= bad_v\nclass Solution:\n    def firstBadVersion(self, n):\n        lo,hi=1,n\n        while lo<hi:\n            mid=(lo+hi)//2\n            if isBadVersion(mid): hi=mid\n            else: lo=mid+1\n        return lo\nprint(Solution().firstBadVersion(100))", expected: "7", isPublic: false },
    { script: "bad_v = 100\ndef isBadVersion(v): return v >= bad_v\nclass Solution:\n    def firstBadVersion(self, n):\n        lo,hi=1,n\n        while lo<hi:\n            mid=(lo+hi)//2\n            if isBadVersion(mid): hi=mid\n            else: lo=mid+1\n        return lo\nprint(Solution().firstBadVersion(100))", expected: "100", isPublic: false },
  ],
},

"HCL: Guess Number Higher or Lower": {
  company: "hcl", pattern: "Binary Search",
  title: "Guess Number Higher or Lower",
  difficulty: "Easy",
  desc: "We play the guessing game. I pick a number from 1 to n. You have to guess which number I picked. I will tell you higher (1) or lower (-1) or you got it (0). Implement `guessNumber(n)` using the guess() API.",
  examples: [
    { input: "n = 10, pick = 6", output: "6" },
    { input: "n = 1, pick = 1", output: "1" }
  ],
  constraints: ["1 <= n <= 2^31 - 1", "1 <= pick <= n"],
  functionSignature: "def guessNumber(self, n: int) -> int:",
  starters: {
    Python: "class Solution:\n    def guessNumber(self, n: int) -> int:\n        # guess(num) returns -1 (pick < num), 1 (pick > num), 0 (correct)\n        pass",
    JavaScript: "var guessNumber = function(n) {\n    \n};",
    TypeScript: "function guessNumber(n: number): number {\n    \n};",
    Java: "public class Solution extends GuessGame {\n    public int guessNumber(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int guessNumber(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "pick=6\ndef guess(x): return 0 if x==pick else (-1 if x>pick else 1)\nclass Solution:\n    def guessNumber(self,n):\n        lo,hi=1,n\n        while True:\n            mid=(lo+hi)//2\n            r=guess(mid)\n            if r==0: return mid\n            elif r<0: hi=mid-1\n            else: lo=mid+1\nprint(Solution().guessNumber(10))", expected: "6", isPublic: true },
    { script: "pick=1\ndef guess(x): return 0 if x==pick else (-1 if x>pick else 1)\nclass Solution:\n    def guessNumber(self,n):\n        lo,hi=1,n\n        while True:\n            mid=(lo+hi)//2\n            r=guess(mid)\n            if r==0: return mid\n            elif r<0: hi=mid-1\n            else: lo=mid+1\nprint(Solution().guessNumber(1))", expected: "1", isPublic: true },
    { script: "pick=1\ndef guess(x): return 0 if x==pick else (-1 if x>pick else 1)\nclass Solution:\n    def guessNumber(self,n):\n        lo,hi=1,n\n        while True:\n            mid=(lo+hi)//2\n            r=guess(mid)\n            if r==0: return mid\n            elif r<0: hi=mid-1\n            else: lo=mid+1\nprint(Solution().guessNumber(2))", expected: "1", isPublic: false },
    { script: "pick=50\ndef guess(x): return 0 if x==pick else (-1 if x>pick else 1)\nclass Solution:\n    def guessNumber(self,n):\n        lo,hi=1,n\n        while True:\n            mid=(lo+hi)//2\n            r=guess(mid)\n            if r==0: return mid\n            elif r<0: hi=mid-1\n            else: lo=mid+1\nprint(Solution().guessNumber(100))", expected: "50", isPublic: false },
    { script: "pick=1702766719\ndef guess(x): return 0 if x==pick else (-1 if x>pick else 1)\nclass Solution:\n    def guessNumber(self,n):\n        lo,hi=1,n\n        while True:\n            mid=(lo+hi)//2\n            r=guess(mid)\n            if r==0: return mid\n            elif r<0: hi=mid-1\n            else: lo=mid+1\nprint(Solution().guessNumber(2126753390))", expected: "1702766719", isPublic: false },
  ],
},

"HCL: Find Minimum in Rotated Sorted Array": {
  company: "hcl", pattern: "Binary Search",
  title: "Find Minimum in Rotated Sorted Array",
  difficulty: "Medium",
  desc: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array `nums` of unique elements, return the minimum element of this array. Must run in O(log n) time.",
  examples: [
    { input: "nums = [3,4,5,1,2]", output: "1" },
    { input: "nums = [4,5,6,7,0,1,2]", output: "0" }
  ],
  constraints: ["n == nums.length", "1 <= n <= 5000", "-5000 <= nums[i] <= 5000", "All integers are unique"],
  functionSignature: "def findMin(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def findMin(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var findMin = function(nums) {\n    \n};",
    TypeScript: "function findMin(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int findMin(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.findMin([3,4,5,1,2]))", expected: "1", isPublic: true },
    { script: "sol = Solution()\nprint(sol.findMin([4,5,6,7,0,1,2]))", expected: "0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.findMin([11,13,15,17]))", expected: "11", isPublic: false },
    { script: "sol = Solution()\nprint(sol.findMin([2,1]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.findMin([1]))", expected: "1", isPublic: false },
  ],
},

// =============================================================================
// TECH MAHINDRA (15 problems)
// =============================================================================

"TechM: Plus One": {
  company: "techmahindra", pattern: "Array / Math",
  title: "Plus One",
  difficulty: "Easy",
  desc: "You are given a large integer represented as an integer array `digits`, where each `digits[i]` is the ith digit of the integer. The digits are ordered from most significant to least significant. Increment the large integer by one and return the resulting array.",
  examples: [
    { input: "digits = [1,2,3]", output: "[1,2,4]" },
    { input: "digits = [9]", output: "[1,0]" }
  ],
  constraints: ["1 <= digits.length <= 100", "0 <= digits[i] <= 9", "digits does not contain leading zeros"],
  functionSignature: "def plusOne(self, digits: List[int]) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def plusOne(self, digits: List[int]) -> List[int]:\n        pass",
    JavaScript: "var plusOne = function(digits) {\n    \n};",
    TypeScript: "function plusOne(digits: number[]): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] plusOne(int[] digits) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> plusOne(vector<int>& digits) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.plusOne([1,2,3]))", expected: "[1, 2, 4]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.plusOne([9]))", expected: "[1, 0]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.plusOne([1,2,9]))", expected: "[1, 3, 0]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.plusOne([9,9,9]))", expected: "[1, 0, 0, 0]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.plusOne([0]))", expected: "[1]", isPublic: false },
  ],
},

"TechM: Longest Common Subsequence": {
  company: "techmahindra", pattern: "Dynamic Programming",
  title: "Longest Common Subsequence",
  difficulty: "Medium",
  desc: "Given two strings `text1` and `text2`, return the length of their longest common subsequence. A subsequence is a sequence derived from a string by deleting some or no characters without changing the order of remaining characters.",
  examples: [
    { input: 'text1 = "abcde", text2 = "ace"', output: "3", explanation: 'LCS is "ace" with length 3' },
    { input: 'text1 = "abc", text2 = "abc"', output: "3" }
  ],
  constraints: ["1 <= text1.length, text2.length <= 1000", "text1 and text2 consist of only lowercase English characters"],
  functionSignature: "def longestCommonSubsequence(self, text1: str, text2: str) -> int:",
  starters: {
    Python: "class Solution:\n    def longestCommonSubsequence(self, text1: str, text2: str) -> int:\n        pass",
    JavaScript: "var longestCommonSubsequence = function(text1, text2) {\n    \n};",
    TypeScript: "function longestCommonSubsequence(text1: string, text2: string): number {\n    \n};",
    Java: "class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int longestCommonSubsequence(string text1, string text2) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.longestCommonSubsequence("abcde", "ace"))', expected: "3", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.longestCommonSubsequence("abc", "abc"))', expected: "3", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.longestCommonSubsequence("abc", "def"))', expected: "0", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.longestCommonSubsequence("oxcpqrsvwf", "shmtulqrypy"))', expected: "2", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.longestCommonSubsequence("a", "b"))', expected: "0", isPublic: false },
  ],
},

"TechM: House Robber": {
  company: "techmahindra", pattern: "Dynamic Programming",
  title: "House Robber",
  difficulty: "Medium",
  desc: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected — you cannot rob two adjacent houses. Given an integer array `nums` representing the amount of money of each house, return the maximum amount you can rob.",
  examples: [
    { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (1) + house 3 (3) = 4" },
    { input: "nums = [2,7,9,3,1]", output: "12" }
  ],
  constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"],
  functionSignature: "def rob(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def rob(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var rob = function(nums) {\n    \n};",
    TypeScript: "function rob(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int rob(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int rob(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.rob([1,2,3,1]))", expected: "4", isPublic: true },
    { script: "sol = Solution()\nprint(sol.rob([2,7,9,3,1]))", expected: "12", isPublic: true },
    { script: "sol = Solution()\nprint(sol.rob([0]))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.rob([1,2]))", expected: "2", isPublic: false },
    { script: "sol = Solution()\nprint(sol.rob([2,1,1,2]))", expected: "4", isPublic: false },
  ],
},

"TechM: Coin Change": {
  company: "techmahindra", pattern: "Dynamic Programming",
  title: "Coin Change",
  difficulty: "Medium",
  desc: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins needed to make up that amount. Return `-1` if that amount cannot be made up.",
  examples: [
    { input: "coins = [1,5,11,25], amount = 41", output: "3", explanation: "25+11+5=41" },
    { input: "coins = [2], amount = 3", output: "-1" }
  ],
  constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
  functionSignature: "def coinChange(self, coins: List[int], amount: int) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def coinChange(self, coins: List[int], amount: int) -> int:\n        pass",
    JavaScript: "var coinChange = function(coins, amount) {\n    \n};",
    TypeScript: "function coinChange(coins: number[], amount: number): number {\n    \n};",
    Java: "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.coinChange([1,2,5], 11))", expected: "3", isPublic: true },
    { script: "sol = Solution()\nprint(sol.coinChange([2], 3))", expected: "-1", isPublic: true },
    { script: "sol = Solution()\nprint(sol.coinChange([1], 0))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.coinChange([1,5,11,25], 41))", expected: "3", isPublic: false },
    { script: "sol = Solution()\nprint(sol.coinChange([186,419,83,408], 6249))", expected: "20", isPublic: false },
  ],
},

"TechM: Maximum Product Subarray": {
  company: "techmahindra", pattern: "Dynamic Programming",
  title: "Maximum Product Subarray",
  difficulty: "Medium",
  desc: "Given an integer array `nums`, find a contiguous non-empty subarray within the array that has the largest product, and return the product.",
  examples: [
    { input: "nums = [2,3,-2,4]", output: "6", explanation: "[2,3] has the largest product 6" },
    { input: "nums = [-2,0,-1]", output: "0" }
  ],
  constraints: ["1 <= nums.length <= 2 * 10^4", "-10 <= nums[i] <= 10", "Product of any subarray fits in 32-bit integer"],
  functionSignature: "def maxProduct(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def maxProduct(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var maxProduct = function(nums) {\n    \n};",
    TypeScript: "function maxProduct(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int maxProduct(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int maxProduct(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.maxProduct([2,3,-2,4]))", expected: "6", isPublic: true },
    { script: "sol = Solution()\nprint(sol.maxProduct([-2,0,-1]))", expected: "0", isPublic: true },
    { script: "sol = Solution()\nprint(sol.maxProduct([-2]))", expected: "-2", isPublic: false },
    { script: "sol = Solution()\nprint(sol.maxProduct([-2,3,-4]))", expected: "24", isPublic: false },
    { script: "sol = Solution()\nprint(sol.maxProduct([0,2]))", expected: "2", isPublic: false },
  ],
},

"TechM: Word Pattern": {
  company: "techmahindra", pattern: "Hash Map Bijection",
  title: "Word Pattern",
  difficulty: "Easy",
  desc: "Given a `pattern` and a string `s`, determine if `s` follows the same pattern. A full match means there is a bijection between each letter in `pattern` and each non-empty word in `s`.",
  examples: [
    { input: 'pattern = "abba", s = "dog cat cat dog"', output: "true" },
    { input: 'pattern = "abba", s = "dog cat cat fish"', output: "false" }
  ],
  constraints: ["1 <= pattern.length <= 300", "pattern contains only lowercase English letters", "1 <= s.length <= 3000"],
  functionSignature: "def wordPattern(self, pattern: str, s: str) -> bool:",
  starters: {
    Python: "class Solution:\n    def wordPattern(self, pattern: str, s: str) -> bool:\n        pass",
    JavaScript: "var wordPattern = function(pattern, s) {\n    \n};",
    TypeScript: "function wordPattern(pattern: string, s: string): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean wordPattern(String pattern, String s) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool wordPattern(string pattern, string s) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.wordPattern("abba", "dog cat cat dog"))', expected: "True", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.wordPattern("abba", "dog cat cat fish"))', expected: "False", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.wordPattern("aaaa", "dog cat cat dog"))', expected: "False", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.wordPattern("abba", "dog dog dog dog"))', expected: "False", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.wordPattern("a", "dog"))', expected: "True", isPublic: false },
  ],
},

"TechM: Ransom Note": {
  company: "techmahindra", pattern: "Hash Map / Counting",
  title: "Ransom Note",
  difficulty: "Easy",
  desc: "Given two strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be constructed by using the letters from `magazine`, and `false` otherwise. Each letter in `magazine` can only be used once.",
  examples: [
    { input: 'ransomNote = "a", magazine = "b"', output: "false" },
    { input: 'ransomNote = "aa", magazine = "aab"', output: "true" }
  ],
  constraints: ["1 <= ransomNote.length, magazine.length <= 10^5", "Both strings consist of lowercase English letters"],
  functionSignature: "def canConstruct(self, ransomNote: str, magazine: str) -> bool:",
  starters: {
    Python: "class Solution:\n    def canConstruct(self, ransomNote: str, magazine: str) -> bool:\n        pass",
    JavaScript: "var canConstruct = function(ransomNote, magazine) {\n    \n};",
    TypeScript: "function canConstruct(ransomNote: string, magazine: string): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean canConstruct(String ransomNote, String magazine) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool canConstruct(string ransomNote, string magazine) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.canConstruct("a", "b"))', expected: "False", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.canConstruct("aa", "aab"))', expected: "True", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.canConstruct("aa", "ab"))', expected: "False", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.canConstruct("bg", "efjbdfbdgfjhhaiigfhbaejahgfbbgbjagghcnfjrs"))', expected: "True", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.canConstruct("", "abc"))', expected: "True", isPublic: false },
  ],
},

"TechM: Number of Islands": {
  company: "techmahindra", pattern: "BFS / DFS Graph",
  title: "Number of Islands",
  difficulty: "Medium",
  desc: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
  examples: [
    { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: "1" },
    { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: "3" }
  ],
  constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300", "grid[i][j] is '0' or '1'"],
  functionSignature: "def numIslands(self, grid: List[List[str]]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        pass",
    JavaScript: "var numIslands = function(grid) {\n    \n};",
    TypeScript: "function numIslands(grid: string[][]): number {\n    \n};",
    Java: "class Solution {\n    public int numIslands(char[][] grid) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        \n    }\n};",
  },
  testCases: [
    { script: 'sol = Solution()\nprint(sol.numIslands([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]))', expected: "1", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.numIslands([["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]))', expected: "3", isPublic: true },
    { script: 'sol = Solution()\nprint(sol.numIslands([["1"]]))', expected: "1", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.numIslands([["0"]]))', expected: "0", isPublic: false },
    { script: 'sol = Solution()\nprint(sol.numIslands([["1","0","1"],["0","1","0"],["1","0","1"]]))', expected: "5", isPublic: false },
  ],
},

"TechM: Flood Fill": {
  company: "techmahindra", pattern: "BFS / DFS",
  title: "Flood Fill",
  difficulty: "Easy",
  desc: "Given an image (2D array), a starting pixel (sr, sc), and a new color, perform a flood fill starting from the pixel (sr, sc). Return the modified image.",
  examples: [
    { input: "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2", output: "[[2,2,2],[2,2,0],[2,0,1]]" },
    { input: "image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0", output: "[[0,0,0],[0,0,0]]" }
  ],
  constraints: ["m == image.length", "n == image[i].length", "1 <= m, n <= 50", "0 <= image[i][j], color < 2^16"],
  functionSignature: "def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:\n        pass",
    JavaScript: "var floodFill = function(image, sr, sc, color) {\n    \n};",
    TypeScript: "function floodFill(image: number[][], sr: number, sc: number, color: number): number[][] {\n    \n};",
    Java: "class Solution {\n    public int[][] floodFill(int[][] image, int sr, int sc, int color) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.floodFill([[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2))", expected: "[[2, 2, 2], [2, 2, 0], [2, 0, 1]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.floodFill([[0,0,0],[0,0,0]], 0, 0, 0))", expected: "[[0, 0, 0], [0, 0, 0]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.floodFill([[0,0,0],[0,1,1]], 1, 1, 1))", expected: "[[0, 0, 0], [0, 1, 1]]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.floodFill([[1,1,1],[1,1,0],[1,0,1]], 0, 0, 3))", expected: "[[3, 3, 3], [3, 3, 0], [3, 0, 1]]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.floodFill([[0]], 0, 0, 5))", expected: "[[5]]", isPublic: false },
  ],
},

"TechM: Symmetric Tree": {
  company: "techmahindra", pattern: "Tree BFS/DFS",
  title: "Symmetric Tree",
  difficulty: "Easy",
  desc: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
  examples: [
    { input: "root = [1,2,2,3,4,4,3]", output: "true" },
    { input: "root = [1,2,2,null,3,null,3]", output: "false" }
  ],
  constraints: ["The number of nodes in the tree is in the range [1, 1000]", "-100 <= Node.val <= 100"],
  functionSignature: "def isSymmetric(self, root: Optional[TreeNode]) -> bool:",
  starters: {
    Python: "from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Solution:\n    def isSymmetric(self, root: Optional[TreeNode]) -> bool:\n        pass",
    JavaScript: "var isSymmetric = function(root) {\n    \n};",
    TypeScript: "function isSymmetric(root: TreeNode | null): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isSymmetric(TreeNode root) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isSymmetric(TreeNode* root) {\n        \n    }\n};",
  },
  testCases: [
    { script: "root = TreeNode(1, TreeNode(2, TreeNode(3), TreeNode(4)), TreeNode(2, TreeNode(4), TreeNode(3)))\nprint(Solution().isSymmetric(root))", expected: "True", isPublic: true },
    { script: "root = TreeNode(1, TreeNode(2, None, TreeNode(3)), TreeNode(2, None, TreeNode(3)))\nprint(Solution().isSymmetric(root))", expected: "False", isPublic: true },
    { script: "root = TreeNode(1)\nprint(Solution().isSymmetric(root))", expected: "True", isPublic: false },
    { script: "root = TreeNode(1, TreeNode(2), TreeNode(2))\nprint(Solution().isSymmetric(root))", expected: "True", isPublic: false },
    { script: "root = TreeNode(1, TreeNode(2), TreeNode(3))\nprint(Solution().isSymmetric(root))", expected: "False", isPublic: false },
  ],
},

"TechM: Path Sum": {
  company: "techmahindra", pattern: "Tree DFS",
  title: "Path Sum",
  difficulty: "Easy",
  desc: "Given the root of a binary tree and an integer `targetSum`, return `true` if the tree has a root-to-leaf path such that adding up all the values along the path equals `targetSum`.",
  examples: [
    { input: "root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22", output: "true" },
    { input: "root = [1,2,3], targetSum = 5", output: "false" }
  ],
  constraints: ["The number of nodes in the tree is in the range [0, 5000]", "-1000 <= Node.val <= 1000", "-1000 <= targetSum <= 1000"],
  functionSignature: "def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:",
  starters: {
    Python: "from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Solution:\n    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:\n        pass",
    JavaScript: "var hasPathSum = function(root, targetSum) {\n    \n};",
    TypeScript: "function hasPathSum(root: TreeNode | null, targetSum: number): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean hasPathSum(TreeNode root, int targetSum) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool hasPathSum(TreeNode* root, int targetSum) {\n        \n    }\n};",
  },
  testCases: [
    { script: "root = TreeNode(1, TreeNode(2))\nprint(Solution().hasPathSum(root, 1))", expected: "False", isPublic: true },
    { script: "root = TreeNode(1, TreeNode(2))\nprint(Solution().hasPathSum(root, 3))", expected: "True", isPublic: true },
    { script: "print(Solution().hasPathSum(None, 0))", expected: "False", isPublic: false },
    { script: "root = TreeNode(1, TreeNode(2), TreeNode(3))\nprint(Solution().hasPathSum(root, 4))", expected: "True", isPublic: false },
    { script: "root = TreeNode(1, TreeNode(2), TreeNode(3))\nprint(Solution().hasPathSum(root, 5))", expected: "False", isPublic: false },
  ],
},

"TechM: Invert Binary Tree": {
  company: "techmahindra", pattern: "Tree DFS/BFS",
  title: "Invert Binary Tree",
  difficulty: "Easy",
  desc: "Given the root of a binary tree, invert the tree, and return its root. Inverting means mirroring/flipping left and right children at every node.",
  examples: [
    { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
    { input: "root = [2,1,3]", output: "[2,3,1]" }
  ],
  constraints: ["The number of nodes in the tree is in the range [0, 100]", "-100 <= Node.val <= 100"],
  functionSignature: "def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:",
  starters: {
    Python: "from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        pass",
    JavaScript: "var invertTree = function(root) {\n    \n};",
    TypeScript: "function invertTree(root: TreeNode | null): TreeNode | null {\n    \n};",
    Java: "class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        \n    }\n};",
  },
  testCases: [
    { script: "def inorder(n):\n    return inorder(n.left)+[n.val]+inorder(n.right) if n else []\nroot = TreeNode(2, TreeNode(1), TreeNode(3))\nprint(inorder(Solution().invertTree(root)))", expected: "[3, 2, 1]", isPublic: true },
    { script: "print(Solution().invertTree(None))", expected: "None", isPublic: true },
    { script: "root = TreeNode(1)\nprint(Solution().invertTree(root).val)", expected: "1", isPublic: false },
    { script: "def preorder(n):\n    return [n.val]+preorder(n.left)+preorder(n.right) if n else []\nroot = TreeNode(4, TreeNode(2, TreeNode(1), TreeNode(3)), TreeNode(7, TreeNode(6), TreeNode(9)))\nprint(preorder(Solution().invertTree(root)))", expected: "[4, 7, 9, 6, 2, 3, 1]", isPublic: false },
    { script: "def inorder(n):\n    return inorder(n.left)+[n.val]+inorder(n.right) if n else []\nroot = TreeNode(4, TreeNode(2, TreeNode(1), TreeNode(3)), TreeNode(7, TreeNode(6), TreeNode(9)))\nprint(inorder(Solution().invertTree(root)))", expected: "[9, 7, 6, 4, 3, 2, 1]", isPublic: false },
  ],
},

"TechM: Sort Colors": {
  company: "techmahindra", pattern: "Dutch National Flag / Two Pointers",
  title: "Sort Colors",
  difficulty: "Medium",
  desc: "Given an array `nums` with n objects colored red (0), white (1), or blue (2), sort them in-place so that objects of the same color are adjacent, with colors in order 0, 1, 2. Do not use library sort.",
  examples: [
    { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
    { input: "nums = [2,0,1]", output: "[0,1,2]" }
  ],
  constraints: ["n == nums.length", "1 <= n <= 300", "nums[i] is either 0, 1, or 2"],
  functionSignature: "def sortColors(self, nums: List[int]) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def sortColors(self, nums: List[int]) -> List[int]:\n        pass",
    JavaScript: "var sortColors = function(nums) {\n    \n};",
    TypeScript: "function sortColors(nums: number[]): number[] {\n    \n};",
    Java: "class Solution {\n    public void sortColors(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    void sortColors(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "nums = [2,0,2,1,1,0]\nSolution().sortColors(nums)\nprint(nums)", expected: "[0, 0, 1, 1, 2, 2]", isPublic: true },
    { script: "nums = [2,0,1]\nSolution().sortColors(nums)\nprint(nums)", expected: "[0, 1, 2]", isPublic: true },
    { script: "nums = [0]\nSolution().sortColors(nums)\nprint(nums)", expected: "[0]", isPublic: false },
    { script: "nums = [1,0,0,0,1,2]\nSolution().sortColors(nums)\nprint(nums)", expected: "[0, 0, 0, 1, 1, 2]", isPublic: false },
    { script: "nums = [2,2,2,1,1,0,0,0]\nSolution().sortColors(nums)\nprint(nums)", expected: "[0, 0, 0, 1, 1, 2, 2, 2]", isPublic: false },
  ],
},

"TechM: Squares of a Sorted Array": {
  company: "techmahindra", pattern: "Two Pointers",
  title: "Squares of a Sorted Array",
  difficulty: "Easy",
  desc: "Given an integer array `nums` sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.",
  examples: [
    { input: "nums = [-4,-1,0,3,10]", output: "[0,1,9,16,100]" },
    { input: "nums = [-7,-3,2,3,11]", output: "[4,9,9,49,121]" }
  ],
  constraints: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4", "nums is sorted in non-decreasing order"],
  functionSignature: "def sortedSquares(self, nums: List[int]) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def sortedSquares(self, nums: List[int]) -> List[int]:\n        pass",
    JavaScript: "var sortedSquares = function(nums) {\n    \n};",
    TypeScript: "function sortedSquares(nums: number[]): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] sortedSquares(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> sortedSquares(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.sortedSquares([-4,-1,0,3,10]))", expected: "[0, 1, 9, 16, 100]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.sortedSquares([-7,-3,2,3,11]))", expected: "[4, 9, 9, 49, 121]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.sortedSquares([0]))", expected: "[0]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.sortedSquares([-3,-1]))", expected: "[1, 9]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.sortedSquares([1,2,3,4]))", expected: "[1, 4, 9, 16]", isPublic: false },
  ],
},

"TechM: Convert Binary to Decimal": {
  company: "techmahindra", pattern: "Linked List / Math",
  title: "Convert Binary Number in Linked List to Integer",
  difficulty: "Easy",
  desc: "Given head which is a reference node to a singly-linked list. The value of each node in the linked list is either 0 or 1. The linked list holds the binary representation of a number. Return the decimal value of the number in the linked list.",
  examples: [
    { input: "head = [1,0,1]", output: "5", explanation: "(101) in base 2 = (5) in base 10" },
    { input: "head = [0]", output: "0" }
  ],
  constraints: ["The linked list is not empty", "Number of nodes will not exceed 30", "Each node's value is 0 or 1"],
  functionSignature: "def getDecimalValue(self, head: ListNode) -> int:",
  starters: {
    Python: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\nclass Solution:\n    def getDecimalValue(self, head: ListNode) -> int:\n        pass",
    JavaScript: "var getDecimalValue = function(head) {\n    \n};",
    TypeScript: "function getDecimalValue(head: ListNode | null): number {\n    \n};",
    Java: "class Solution {\n    public int getDecimalValue(ListNode head) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int getDecimalValue(ListNode* head) {\n        \n    }\n};",
  },
  testCases: [
    { script: "n3=ListNode(1);n2=ListNode(0,n3);n1=ListNode(1,n2)\nprint(Solution().getDecimalValue(n1))", expected: "5", isPublic: true },
    { script: "n1=ListNode(0)\nprint(Solution().getDecimalValue(n1))", expected: "0", isPublic: true },
    { script: "n1=ListNode(1)\nprint(Solution().getDecimalValue(n1))", expected: "1", isPublic: false },
    { script: "n4=ListNode(1);n3=ListNode(0,n4);n2=ListNode(0,n3);n1=ListNode(1,n2)\nprint(Solution().getDecimalValue(n1))", expected: "9", isPublic: false },
    { script: "n5=ListNode(1);n4=ListNode(1,n5);n3=ListNode(1,n4);n2=ListNode(1,n3);n1=ListNode(1,n2)\nprint(Solution().getDecimalValue(n1))", expected: "31", isPublic: false },
  ],
},

} // END SERVICE_PROBLEM_BANK
