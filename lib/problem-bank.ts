/**
 * Static problem bank — LeetCode-style problems with full data.
 * No AI generation. Each problem has description, examples, constraints,
 * starter code for all languages, and test cases.
 */

export interface ProblemExample {
  input: string
  output: string
  explanation?: string
}

export interface ProblemTestCase {
  /** Python test harness script appended after student code */
  script: string
  expected: string
  isPublic: boolean
}

export interface StaticProblem {
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  desc: string
  examples: ProblemExample[]
  constraints: string[]
  /** Function signature hint shown below constraints */
  functionSignature?: string
  starters: Record<string, string>
  testCases: ProblemTestCase[]
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const py  = (s: string) => s
const js  = (s: string) => s
const ts  = (s: string) => s
const java = (s: string) => s
const cpp  = (s: string) => s

// ─────────────────────────────────────────────────────────────────────────────
// PROBLEMS
// ─────────────────────────────────────────────────────────────────────────────
export const PROBLEM_BANK: Record<string, StaticProblem> = {

// ── Two Sum ───────────────────────────────────────────────────────────────────
"Two Sum": {
  title: "Two Sum",
  difficulty: "Easy",
  desc: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  examples: [
    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9, so return [0, 1]." },
    { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    { input: "nums = [3,3], target = 6", output: "[0,1]" },
  ],
  constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "-10⁹ ≤ target ≤ 10⁹", "Only one valid answer exists."],
  functionSignature: "def twoSum(self, nums: List[int], target: int) -> List[int]:",
  starters: {
    Python: `from typing import List\n\nclass Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your solution here\n        pass\n`,
    JavaScript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};\n`,
    TypeScript: `function twoSum(nums: number[], target: number): number[] {\n    \n};\n`,
    Java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}\n`,
    "C++": `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};\n`,
  },
  testCases: [
    { script: `sol = Solution()\nprint(sol.twoSum([2,7,11,15], 9))`, expected: "[0, 1]", isPublic: true },
    { script: `sol = Solution()\nprint(sol.twoSum([3,2,4], 6))`, expected: "[1, 2]", isPublic: true },
    { script: `sol = Solution()\nprint(sol.twoSum([3,3], 6))`, expected: "[0, 1]", isPublic: false },
    { script: `sol = Solution()\nprint(sol.twoSum([1,2,3,4,5], 9))`, expected: "[3, 4]", isPublic: false },
  ],
},

// ── Contains Duplicate ────────────────────────────────────────────────────────
"Contains Duplicate": {
  title: "Contains Duplicate",
  difficulty: "Easy",
  desc: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
  examples: [
    { input: "nums = [1,2,3,1]", output: "true" },
    { input: "nums = [1,2,3,4]", output: "false" },
    { input: "nums = [1,1,1,3,3,4,3,2,4,2]", output: "true" },
  ],
  constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁹ ≤ nums[i] ≤ 10⁹"],
  functionSignature: "def containsDuplicate(self, nums: List[int]) -> bool:",
  starters: {
    Python: `from typing import List\n\nclass Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        pass\n`,
    JavaScript: `/**\n * @param {number[]} nums\n * @return {boolean}\n */\nvar containsDuplicate = function(nums) {\n    \n};\n`,
    TypeScript: `function containsDuplicate(nums: number[]): boolean {\n    \n};\n`,
    Java: `class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        \n    }\n}\n`,
    "C++": `class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        \n    }\n};\n`,
  },
  testCases: [
    { script: `sol = Solution()\nprint(sol.containsDuplicate([1,2,3,1]))`, expected: "True", isPublic: true },
    { script: `sol = Solution()\nprint(sol.containsDuplicate([1,2,3,4]))`, expected: "False", isPublic: true },
    { script: `sol = Solution()\nprint(sol.containsDuplicate([1,1,1,3,3,4]))`, expected: "True", isPublic: false },
    { script: `sol = Solution()\nprint(sol.containsDuplicate([]))`, expected: "False", isPublic: false },
  ],
},

// ── Best Time to Buy and Sell Stock ──────────────────────────────────────────
"Best Time to Buy and Sell Stock": {
  title: "Best Time to Buy and Sell Stock",
  difficulty: "Easy",
  desc: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
  examples: [
    { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 6-1 = 5." },
    { input: "prices = [7,6,4,3,1]", output: "0", explanation: "No transactions are done and the max profit = 0." },
  ],
  constraints: ["1 ≤ prices.length ≤ 10⁵", "0 ≤ prices[i] ≤ 10⁴"],
  functionSignature: "def maxProfit(self, prices: List[int]) -> int:",
  starters: {
    Python: `from typing import List\n\nclass Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        pass\n`,
    JavaScript: `var maxProfit = function(prices) {\n    \n};\n`,
    TypeScript: `function maxProfit(prices: number[]): number {\n    \n};\n`,
    Java: `class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}\n`,
    "C++": `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};\n`,
  },
  testCases: [
    { script: `sol = Solution()\nprint(sol.maxProfit([7,1,5,3,6,4]))`, expected: "5", isPublic: true },
    { script: `sol = Solution()\nprint(sol.maxProfit([7,6,4,3,1]))`, expected: "0", isPublic: true },
    { script: `sol = Solution()\nprint(sol.maxProfit([1,2]))`, expected: "1", isPublic: false },
    { script: `sol = Solution()\nprint(sol.maxProfit([2,4,1]))`, expected: "2", isPublic: false },
  ],
},

// ── Maximum Subarray ─────────────────────────────────────────────────────────
"Maximum Subarray": {
  title: "Maximum Subarray",
  difficulty: "Medium",
  desc: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
  examples: [
    { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
    { input: "nums = [1]", output: "1" },
    { input: "nums = [5,4,-1,7,8]", output: "23" },
  ],
  constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
  functionSignature: "def maxSubArray(self, nums: List[int]) -> int:",
  starters: {
    Python: `from typing import List\n\nclass Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        pass\n`,
    JavaScript: `var maxSubArray = function(nums) {\n    \n};\n`,
    TypeScript: `function maxSubArray(nums: number[]): number {\n    \n};\n`,
    Java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        \n    }\n}\n`,
    "C++": `class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        \n    }\n};\n`,
  },
  testCases: [
    { script: `sol = Solution()\nprint(sol.maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))`, expected: "6", isPublic: true },
    { script: `sol = Solution()\nprint(sol.maxSubArray([1]))`, expected: "1", isPublic: true },
    { script: `sol = Solution()\nprint(sol.maxSubArray([5,4,-1,7,8]))`, expected: "23", isPublic: false },
    { script: `sol = Solution()\nprint(sol.maxSubArray([-1,-2,-3]))`, expected: "-1", isPublic: false },
  ],
},

// ── Valid Anagram ─────────────────────────────────────────────────────────────
"Valid Anagram": {
  title: "Valid Anagram",
  difficulty: "Easy",
  desc: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise. An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
  examples: [
    { input: 's = "anagram", t = "nagaram"', output: "true" },
    { input: 's = "rat", t = "car"', output: "false" },
  ],
  constraints: ["1 ≤ s.length, t.length ≤ 5 × 10⁴", "s and t consist of lowercase English letters."],
  functionSignature: "def isAnagram(self, s: str, t: str) -> bool:",
  starters: {
    Python: `class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass\n`,
    JavaScript: `var isAnagram = function(s, t) {\n    \n};\n`,
    TypeScript: `function isAnagram(s: string, t: string): boolean {\n    \n};\n`,
    Java: `class Solution {\n    public boolean isAnagram(String s, String t) {\n        \n    }\n}\n`,
    "C++": `class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        \n    }\n};\n`,
  },
  testCases: [
    { script: `sol = Solution()\nprint(sol.isAnagram("anagram", "nagaram"))`, expected: "True", isPublic: true },
    { script: `sol = Solution()\nprint(sol.isAnagram("rat", "car"))`, expected: "False", isPublic: true },
    { script: `sol = Solution()\nprint(sol.isAnagram("a", "a"))`, expected: "True", isPublic: false },
    { script: `sol = Solution()\nprint(sol.isAnagram("ab", "a"))`, expected: "False", isPublic: false },
  ],
},

// ── Valid Palindrome ──────────────────────────────────────────────────────────
"Valid Palindrome": {
  title: "Valid Palindrome",
  difficulty: "Easy",
  desc: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
  examples: [
    { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: '"amanaplanacanalpanama" is a palindrome.' },
    { input: 's = "race a car"', output: "false" },
    { input: 's = " "', output: "true", explanation: "s is an empty string after removing non-alphanumeric characters. An empty string reads the same forward and backward." },
  ],
  constraints: ["1 ≤ s.length ≤ 2 × 10⁵", "s consists only of printable ASCII characters."],
  functionSignature: "def isPalindrome(self, s: str) -> bool:",
  starters: {
    Python: `class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        pass\n`,
    JavaScript: `var isPalindrome = function(s) {\n    \n};\n`,
    TypeScript: `function isPalindrome(s: string): boolean {\n    \n};\n`,
    Java: `class Solution {\n    public boolean isPalindrome(String s) {\n        \n    }\n}\n`,
    "C++": `class Solution {\npublic:\n    bool isPalindrome(string s) {\n        \n    }\n};\n`,
  },
  testCases: [
    { script: `sol = Solution()\nprint(sol.isPalindrome("A man, a plan, a canal: Panama"))`, expected: "True", isPublic: true },
    { script: `sol = Solution()\nprint(sol.isPalindrome("race a car"))`, expected: "False", isPublic: true },
    { script: `sol = Solution()\nprint(sol.isPalindrome(" "))`, expected: "True", isPublic: false },
    { script: `sol = Solution()\nprint(sol.isPalindrome("0P"))`, expected: "False", isPublic: false },
  ],
},

// ── Reverse String ────────────────────────────────────────────────────────────
"Reverse String": {
  title: "Reverse String",
  difficulty: "Easy",
  desc: "Write a function that reverses a string. The input string is given as an array of characters `s`. You must do this by modifying the input array in-place with O(1) extra memory.",
  examples: [
    { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
    { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
  ],
  constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ASCII character."],
  functionSignature: "def reverseString(self, s: List[str]) -> None:",
  starters: {
    Python: `from typing import List\n\nclass Solution:\n    def reverseString(self, s: List[str]) -> None:\n        \"\"\"\n        Do not return anything, modify s in-place instead.\n        \"\"\"\n        pass\n`,
    JavaScript: `var reverseString = function(s) {\n    \n};\n`,
    TypeScript: `function reverseString(s: string[]): void {\n    \n};\n`,
    Java: `class Solution {\n    public void reverseString(char[] s) {\n        \n    }\n}\n`,
    "C++": `class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        \n    }\n};\n`,
  },
  testCases: [
    { script: `sol = Solution()\ns = ["h","e","l","l","o"]\nsol.reverseString(s)\nprint(s)`, expected: "['o', 'l', 'l', 'e', 'h']", isPublic: true },
    { script: `sol = Solution()\ns = ["H","a","n","n","a","h"]\nsol.reverseString(s)\nprint(s)`, expected: "['h', 'a', 'n', 'n', 'a', 'H']", isPublic: true },
    { script: `sol = Solution()\ns = ["a"]\nsol.reverseString(s)\nprint(s)`, expected: "['a']", isPublic: false },
    { script: `sol = Solution()\ns = ["a","b"]\nsol.reverseString(s)\nprint(s)`, expected: "['b', 'a']", isPublic: false },
  ],
},

// ── Missing Number ────────────────────────────────────────────────────────────
"Missing Number": {
  title: "Missing Number",
  difficulty: "Easy",
  desc: "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
  examples: [
    { input: "nums = [3,0,1]", output: "2", explanation: "n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number." },
    { input: "nums = [0,1]", output: "2" },
    { input: "nums = [9,6,4,2,3,5,7,0,1]", output: "8" },
  ],
  constraints: ["n == nums.length", "1 ≤ n ≤ 10⁴", "0 ≤ nums[i] ≤ n", "All the numbers of nums are unique."],
  functionSignature: "def missingNumber(self, nums: List[int]) -> int:",
  starters: {
    Python: `from typing import List\n\nclass Solution:\n    def missingNumber(self, nums: List[int]) -> int:\n        pass\n`,
    JavaScript: `var missingNumber = function(nums) {\n    \n};\n`,
    TypeScript: `function missingNumber(nums: number[]): number {\n    \n};\n`,
    Java: `class Solution {\n    public int missingNumber(int[] nums) {\n        \n    }\n}\n`,
    "C++": `class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        \n    }\n};\n`,
  },
  testCases: [
    { script: `sol = Solution()\nprint(sol.missingNumber([3,0,1]))`, expected: "2", isPublic: true },
    { script: `sol = Solution()\nprint(sol.missingNumber([0,1]))`, expected: "2", isPublic: true },
    { script: `sol = Solution()\nprint(sol.missingNumber([9,6,4,2,3,5,7,0,1]))`, expected: "8", isPublic: false },
    { script: `sol = Solution()\nprint(sol.missingNumber([0]))`, expected: "1", isPublic: false },
  ],
},

// ── Longest Substring Without Repeating Characters ───────────────────────────
"Longest Substring Without Repeating Characters": {
  title: "Longest Substring Without Repeating Characters",
  difficulty: "Medium",
  desc: "Given a string `s`, find the length of the longest substring without repeating characters.",
  examples: [
    { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
    { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with the length of 1.' },
    { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke", with the length of 3.' },
  ],
  constraints: ["0 ≤ s.length ≤ 5 × 10⁴", "s consists of English letters, digits, symbols and spaces."],
  functionSignature: "def lengthOfLongestSubstring(self, s: str) -> int:",
  starters: {
    Python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass\n`,
    JavaScript: `var lengthOfLongestSubstring = function(s) {\n    \n};\n`,
    TypeScript: `function lengthOfLongestSubstring(s: string): number {\n    \n};\n`,
    Java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}\n`,
    "C++": `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};\n`,
  },
  testCases: [
    { script: `sol = Solution()\nprint(sol.lengthOfLongestSubstring("abcabcbb"))`, expected: "3", isPublic: true },
    { script: `sol = Solution()\nprint(sol.lengthOfLongestSubstring("bbbbb"))`, expected: "1", isPublic: true },
    { script: `sol = Solution()\nprint(sol.lengthOfLongestSubstring("pwwkew"))`, expected: "3", isPublic: false },
    { script: `sol = Solution()\nprint(sol.lengthOfLongestSubstring(""))`, expected: "0", isPublic: false },
  ],
},

// ── Reverse Linked List ───────────────────────────────────────────────────────
"Reverse Linked List": {
  title: "Reverse Linked List",
  difficulty: "Easy",
  desc: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
  examples: [
    { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
    { input: "head = [1,2]", output: "[2,1]" },
    { input: "head = []", output: "[]" },
  ],
  constraints: ["The number of nodes in the list is in the range [0, 5000].", "-5000 ≤ Node.val ≤ 5000"],
  functionSignature: "def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:",
  starters: {
    Python: `from typing import Optional\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        pass\n`,
    JavaScript: `var reverseList = function(head) {\n    \n};\n`,
    TypeScript: `function reverseList(head: ListNode | null): ListNode | null {\n    \n};\n`,
    Java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        \n    }\n}\n`,
    "C++": `class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        \n    }\n};\n`,
  },
  testCases: [
    { script: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\ndef mk(lst):\n    d = ListNode(0); c = d\n    for v in lst: c.next = ListNode(v); c = c.next\n    return d.next\ndef toList(h):\n    r = []\n    while h: r.append(h.val); h = h.next\n    return r\nsol = Solution()\nprint(toList(sol.reverseList(mk([1,2,3,4,5]))))`, expected: "[5, 4, 3, 2, 1]", isPublic: true },
    { script: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\ndef mk(lst):\n    d = ListNode(0); c = d\n    for v in lst: c.next = ListNode(v); c = c.next\n    return d.next\ndef toList(h):\n    r = []\n    while h: r.append(h.val); h = h.next\n    return r\nsol = Solution()\nprint(toList(sol.reverseList(mk([1,2]))))`, expected: "[2, 1]", isPublic: true },
    { script: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\ndef toList(h):\n    r = []\n    while h: r.append(h.val); h = h.next\n    return r\nsol = Solution()\nprint(toList(sol.reverseList(None)))`, expected: "[]", isPublic: false },
    { script: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\ndef mk(lst):\n    d = ListNode(0); c = d\n    for v in lst: c.next = ListNode(v); c = c.next\n    return d.next\ndef toList(h):\n    r = []\n    while h: r.append(h.val); h = h.next\n    return r\nsol = Solution()\nprint(toList(sol.reverseList(mk([1,2,3]))))`, expected: "[3, 2, 1]", isPublic: false },
  ],
},

// ── Valid Parentheses ─────────────────────────────────────────────────────────
"Valid Parentheses": {
  title: "Valid Parentheses",
  difficulty: "Easy",
  desc: 'Given a string `s` containing just the characters `\'(\'`, `\')\'`, `\'{\'`, `\'}\'`, `\'[\'` and `\']\'`, determine if the input string is valid. An input string is valid if: open brackets are closed by the same type of brackets, open brackets are closed in the correct order, and every close bracket has a corresponding open bracket of the same type.',
  examples: [
    { input: 's = "()"', output: "true" },
    { input: 's = "()[]{}"', output: "true" },
    { input: 's = "(]"', output: "false" },
  ],
  constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only '()[]{}'."],
  functionSignature: "def isValid(self, s: str) -> bool:",
  starters: {
    Python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        pass\n`,
    JavaScript: `var isValid = function(s) {\n    \n};\n`,
    TypeScript: `function isValid(s: string): boolean {\n    \n};\n`,
    Java: `class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}\n`,
    "C++": `class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};\n`,
  },
  testCases: [
    { script: `sol = Solution()\nprint(sol.isValid("()"))`, expected: "True", isPublic: true },
    { script: `sol = Solution()\nprint(sol.isValid("()[]{}"))`, expected: "True", isPublic: true },
    { script: `sol = Solution()\nprint(sol.isValid("(]"))`, expected: "False", isPublic: false },
    { script: `sol = Solution()\nprint(sol.isValid("([)]"))`, expected: "False", isPublic: false },
  ],
},

// ── Product of Array Except Self ──────────────────────────────────────────────
"Product of Array Except Self": {
  title: "Product of Array Except Self",
  difficulty: "Medium",
  desc: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. The product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.",
  examples: [
    { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
    { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
  ],
  constraints: ["2 ≤ nums.length ≤ 10⁵", "-30 ≤ nums[i] ≤ 30", "The product of any prefix or suffix is guaranteed to fit in a 32-bit integer."],
  functionSignature: "def productExceptSelf(self, nums: List[int]) -> List[int]:",
  starters: {
    Python: `from typing import List\n\nclass Solution:\n    def productExceptSelf(self, nums: List[int]) -> List[int]:\n        pass\n`,
    JavaScript: `var productExceptSelf = function(nums) {\n    \n};\n`,
    TypeScript: `function productExceptSelf(nums: number[]): number[] {\n    \n};\n`,
    Java: `class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        \n    }\n}\n`,
    "C++": `class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        \n    }\n};\n`,
  },
  testCases: [
    { script: `sol = Solution()\nprint(sol.productExceptSelf([1,2,3,4]))`, expected: "[24, 12, 8, 6]", isPublic: true },
    { script: `sol = Solution()\nprint(sol.productExceptSelf([-1,1,0,-3,3]))`, expected: "[0, 0, 9, 0, 0]", isPublic: true },
    { script: `sol = Solution()\nprint(sol.productExceptSelf([1,2]))`, expected: "[2, 1]", isPublic: false },
    { script: `sol = Solution()\nprint(sol.productExceptSelf([2,3,4,5]))`, expected: "[60, 40, 30, 24]", isPublic: false },
  ],
},

// ── Merge Two Sorted Lists ────────────────────────────────────────────────────
"Merge Two Sorted Lists": {
  title: "Merge Two Sorted Lists",
  difficulty: "Easy",
  desc: "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
  examples: [
    { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
    { input: "list1 = [], list2 = []", output: "[]" },
    { input: "list1 = [], list2 = [0]", output: "[0]" },
  ],
  constraints: ["The number of nodes in both lists is in the range [0, 50].", "-100 ≤ Node.val ≤ 100", "Both list1 and list2 are sorted in non-decreasing order."],
  functionSignature: "def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:",
  starters: {
    Python: `from typing import Optional\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\nclass Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        pass\n`,
    JavaScript: `var mergeTwoLists = function(list1, list2) {\n    \n};\n`,
    TypeScript: `function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {\n    \n};\n`,
    Java: `class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        \n    }\n}\n`,
    "C++": `class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        \n    }\n};\n`,
  },
  testCases: [
    { script: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val; self.next = next\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.mergeTwoLists(mk([1,2,4]),mk([1,3,4]))))`, expected: "[1, 1, 2, 3, 4, 4]", isPublic: true },
    { script: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val; self.next = next\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.mergeTwoLists(None,None)))`, expected: "[]", isPublic: true },
    { script: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val; self.next = next\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.mergeTwoLists(None,mk([0]))))`, expected: "[0]", isPublic: false },
    { script: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val; self.next = next\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.mergeTwoLists(mk([1,3,5]),mk([2,4,6]))))`, expected: "[1, 2, 3, 4, 5, 6]", isPublic: false },
  ],
},

} // end PROBLEM_BANK

// ─────────────────────────────────────────────────────────────────────────────
// Lookup helper — returns problem by title (case-insensitive)
// ─────────────────────────────────────────────────────────────────────────────
export function getProblem(title: string): StaticProblem | null {
  const exact = PROBLEM_BANK[title]
  if (exact) return exact
  const lower = title.toLowerCase()
  const found = Object.values(PROBLEM_BANK).find(p => p.title.toLowerCase() === lower)
  return found ?? null
}
