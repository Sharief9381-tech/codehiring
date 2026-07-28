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

// ── Single Number ─────────────────────────────────────────────────────────────
"Single Number": {
  title: "Single Number", difficulty: "Easy",
  desc: "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one. You must implement a solution with linear runtime complexity and use only constant extra space.",
  examples: [{ input: "nums = [2,2,1]", output: "1" }, { input: "nums = [4,1,2,1,2]", output: "4" }, { input: "nums = [1]", output: "1" }],
  constraints: ["1 ≤ nums.length ≤ 3×10⁴", "-3×10⁴ ≤ nums[i] ≤ 3×10⁴", "Each element appears twice except for one."],
  functionSignature: "def singleNumber(self, nums: List[int]) -> int:",
  starters: {
    Python: `from typing import List\n\nclass Solution:\n    def singleNumber(self, nums: List[int]) -> int:\n        pass\n`,
    JavaScript: `var singleNumber = function(nums) {\n    \n};\n`,
    TypeScript: `function singleNumber(nums: number[]): number {\n    \n};\n`,
    Java: `class Solution {\n    public int singleNumber(int[] nums) {\n        \n    }\n}\n`,
    "C++": `class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        \n    }\n};\n`,
  },
  testCases: [
    { script: `sol = Solution()\nprint(sol.singleNumber([2,2,1]))`, expected: "1", isPublic: true },
    { script: `sol = Solution()\nprint(sol.singleNumber([4,1,2,1,2]))`, expected: "4", isPublic: true },
    { script: `sol = Solution()\nprint(sol.singleNumber([1]))`, expected: "1", isPublic: false },
    { script: `sol = Solution()\nprint(sol.singleNumber([0,1,0]))`, expected: "1", isPublic: false },
  ],
},
// ── Move Zeroes ───────────────────────────────────────────────────────────────
"Move Zeroes": {
  title: "Move Zeroes", difficulty: "Easy",
  desc: "Given an integer array `nums`, move all `0`s to the end of it while maintaining the relative order of the non-zero elements. Note that you must do this in-place without making a copy of the array.",
  examples: [{ input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" }, { input: "nums = [0]", output: "[0]" }],
  constraints: ["1 ≤ nums.length ≤ 10⁴", "-2³¹ ≤ nums[i] ≤ 2³¹-1"],
  functionSignature: "def moveZeroes(self, nums: List[int]) -> None:",
  starters: {
    Python: `from typing import List\n\nclass Solution:\n    def moveZeroes(self, nums: List[int]) -> None:\n        pass\n`,
    JavaScript: `var moveZeroes = function(nums) {\n    \n};\n`,
    TypeScript: `function moveZeroes(nums: number[]): void {\n    \n};\n`,
    Java: `class Solution {\n    public void moveZeroes(int[] nums) {\n        \n    }\n}\n`,
    "C++": `class Solution {\npublic:\n    void moveZeroes(vector<int>& nums) {\n        \n    }\n};\n`,
  },
  testCases: [
    { script: `sol = Solution()\nnums = [0,1,0,3,12]\nsol.moveZeroes(nums)\nprint(nums)`, expected: "[1, 3, 12, 0, 0]", isPublic: true },
    { script: `sol = Solution()\nnums = [0]\nsol.moveZeroes(nums)\nprint(nums)`, expected: "[0]", isPublic: true },
    { script: `sol = Solution()\nnums = [1,0,0,2]\nsol.moveZeroes(nums)\nprint(nums)`, expected: "[1, 2, 0, 0]", isPublic: false },
    { script: `sol = Solution()\nnums = [0,0,1]\nsol.moveZeroes(nums)\nprint(nums)`, expected: "[1, 0, 0]", isPublic: false },
  ],
},
// ── Find All Numbers Disappeared ──────────────────────────────────────────────
"Find All Numbers Disappeared": {
  title: "Find All Numbers Disappeared", difficulty: "Easy",
  desc: "Given an array `nums` of `n` integers where `nums[i]` is in the range `[1, n]`, return an array of all the integers in the range `[1, n]` that do not appear in `nums`.",
  examples: [{ input: "nums = [4,3,2,7,8,2,3,1]", output: "[5,6]" }, { input: "nums = [1,1]", output: "[2]" }],
  constraints: ["n == nums.length", "1 ≤ n ≤ 10⁵", "1 ≤ nums[i] ≤ n"],
  functionSignature: "def findDisappearedNumbers(self, nums: List[int]) -> List[int]:",
  starters: {
    Python: `from typing import List\n\nclass Solution:\n    def findDisappearedNumbers(self, nums: List[int]) -> List[int]:\n        pass\n`,
    JavaScript: `var findDisappearedNumbers = function(nums) {\n    \n};\n`,
    TypeScript: `function findDisappearedNumbers(nums: number[]): number[] {\n    \n};\n`,
    Java: `class Solution {\n    public List<Integer> findDisappearedNumbers(int[] nums) {\n        \n    }\n}\n`,
    "C++": `class Solution {\npublic:\n    vector<int> findDisappearedNumbers(vector<int>& nums) {\n        \n    }\n};\n`,
  },
  testCases: [
    { script: `sol = Solution()\nprint(sol.findDisappearedNumbers([4,3,2,7,8,2,3,1]))`, expected: "[5, 6]", isPublic: true },
    { script: `sol = Solution()\nprint(sol.findDisappearedNumbers([1,1]))`, expected: "[2]", isPublic: true },
    { script: `sol = Solution()\nprint(sol.findDisappearedNumbers([1]))`, expected: "[]", isPublic: false },
    { script: `sol = Solution()\nprint(sol.findDisappearedNumbers([2,2]))`, expected: "[1]", isPublic: false },
  ],
},
// ── Squares of Sorted Array ───────────────────────────────────────────────────
"Squares of Sorted Array": {
  title: "Squares of Sorted Array", difficulty: "Easy",
  desc: "Given an integer array `nums` sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.",
  examples: [{ input: "nums = [-4,-1,0,3,10]", output: "[0,1,9,16,100]", explanation: "After squaring, the array becomes [16,1,0,9,100]. After sorting, it becomes [0,1,9,16,100]." }, { input: "nums = [-7,-3,2,3,11]", output: "[4,9,9,49,121]" }],
  constraints: ["1 ≤ nums.length ≤ 10⁴", "-10⁴ ≤ nums[i] ≤ 10⁴", "nums is sorted in non-decreasing order."],
  functionSignature: "def sortedSquares(self, nums: List[int]) -> List[int]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def sortedSquares(self, nums: List[int]) -> List[int]:\n        pass\n`, JavaScript: `var sortedSquares = function(nums) {\n    \n};\n`, TypeScript: `function sortedSquares(nums: number[]): number[] {\n    \n};\n`, Java: `class Solution {\n    public int[] sortedSquares(int[] nums) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<int> sortedSquares(vector<int>& nums) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.sortedSquares([-4,-1,0,3,10]))`, expected: "[0, 1, 9, 16, 100]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.sortedSquares([-7,-3,2,3,11]))`, expected: "[4, 9, 9, 49, 121]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.sortedSquares([1]))`, expected: "[1]", isPublic: false },
    { script: `sol=Solution()\nprint(sol.sortedSquares([-1,0,1]))`, expected: "[0, 1, 1]", isPublic: false },
  ],
},
// ── Running Sum of 1D Array ───────────────────────────────────────────────────
"Running Sum of 1D Array": {
  title: "Running Sum of 1D Array", difficulty: "Easy",
  desc: "Given an array `nums`, return the running sum of it. The running sum of an array is defined as `runningSum[i] = sum(nums[0]…nums[i])`.",
  examples: [{ input: "nums = [1,2,3,4]", output: "[1,3,6,10]" }, { input: "nums = [1,1,1,1,1]", output: "[1,2,3,4,5]" }],
  constraints: ["1 ≤ nums.length ≤ 1000", "-10⁶ ≤ nums[i] ≤ 10⁶"],
  functionSignature: "def runningSum(self, nums: List[int]) -> List[int]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def runningSum(self, nums: List[int]) -> List[int]:\n        pass\n`, JavaScript: `var runningSum = function(nums) {\n    \n};\n`, TypeScript: `function runningSum(nums: number[]): number[] {\n    \n};\n`, Java: `class Solution {\n    public int[] runningSum(int[] nums) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<int> runningSum(vector<int>& nums) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.runningSum([1,2,3,4]))`, expected: "[1, 3, 6, 10]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.runningSum([1,1,1,1,1]))`, expected: "[1, 2, 3, 4, 5]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.runningSum([3,1,2,10,1]))`, expected: "[3, 4, 6, 16, 17]", isPublic: false },
    { script: `sol=Solution()\nprint(sol.runningSum([1]))`, expected: "[1]", isPublic: false },
  ],
},
// ── 3Sum ─────────────────────────────────────────────────────────────────────
"3Sum": {
  title: "3Sum", difficulty: "Medium",
  desc: "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. The solution set must not contain duplicate triplets.",
  examples: [{ input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }, { input: "nums = [0,1,1]", output: "[]" }, { input: "nums = [0,0,0]", output: "[[0,0,0]]" }],
  constraints: ["3 ≤ nums.length ≤ 3000", "-10⁵ ≤ nums[i] ≤ 10⁵"],
  functionSignature: "def threeSum(self, nums: List[int]) -> List[List[int]]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def threeSum(self, nums: List[int]) -> List[List[int]]:\n        pass\n`, JavaScript: `var threeSum = function(nums) {\n    \n};\n`, TypeScript: `function threeSum(nums: number[]): number[][] {\n    \n};\n`, Java: `class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sorted([sorted(t) for t in sol.threeSum([-1,0,1,2,-1,-4])]))`, expected: "[[-1, -1, 2], [-1, 0, 1]]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.threeSum([0,1,1]))`, expected: "[]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.threeSum([0,0,0]))`, expected: "[[0, 0, 0]]", isPublic: false },
    { script: `sol=Solution()\nprint(len(sol.threeSum([-2,0,0,2,2])))`, expected: "1", isPublic: false },
  ],
},
// ── Container With Most Water ─────────────────────────────────────────────────
"Container With Most Water": {
  title: "Container With Most Water", difficulty: "Medium",
  desc: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`th line are `(i, 0)` and `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
  examples: [{ input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "The max area is between index 1 and 8, min(8,7)×7 = 49." }, { input: "height = [1,1]", output: "1" }],
  constraints: ["n == height.length", "2 ≤ n ≤ 10⁵", "0 ≤ height[i] ≤ 10⁴"],
  functionSignature: "def maxArea(self, height: List[int]) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def maxArea(self, height: List[int]) -> int:\n        pass\n`, JavaScript: `var maxArea = function(height) {\n    \n};\n`, TypeScript: `function maxArea(height: number[]): number {\n    \n};\n`, Java: `class Solution {\n    public int maxArea(int[] height) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.maxArea([1,8,6,2,5,4,8,3,7]))`, expected: "49", isPublic: true },
    { script: `sol=Solution()\nprint(sol.maxArea([1,1]))`, expected: "1", isPublic: true },
    { script: `sol=Solution()\nprint(sol.maxArea([4,3,2,1,4]))`, expected: "16", isPublic: false },
    { script: `sol=Solution()\nprint(sol.maxArea([1,2,1]))`, expected: "2", isPublic: false },
  ],
},
// ── Find Minimum in Rotated Sorted Array ──────────────────────────────────────
"Find Minimum in Rotated Sorted Array": {
  title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium",
  desc: "Suppose an array of length `n` sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array `nums` of unique elements, return the minimum element of this array. You must write an algorithm that runs in O(log n) time.",
  examples: [{ input: "nums = [3,4,5,1,2]", output: "1" }, { input: "nums = [4,5,6,7,0,1,2]", output: "0" }, { input: "nums = [11,13,15,17]", output: "11" }],
  constraints: ["n == nums.length", "1 ≤ n ≤ 5000", "-5000 ≤ nums[i] ≤ 5000", "All the integers are unique.", "nums is sorted and rotated between 1 and n times."],
  functionSignature: "def findMin(self, nums: List[int]) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def findMin(self, nums: List[int]) -> int:\n        pass\n`, JavaScript: `var findMin = function(nums) {\n    \n};\n`, TypeScript: `function findMin(nums: number[]): number {\n    \n};\n`, Java: `class Solution {\n    public int findMin(int[] nums) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.findMin([3,4,5,1,2]))`, expected: "1", isPublic: true },
    { script: `sol=Solution()\nprint(sol.findMin([4,5,6,7,0,1,2]))`, expected: "0", isPublic: true },
    { script: `sol=Solution()\nprint(sol.findMin([11,13,15,17]))`, expected: "11", isPublic: false },
    { script: `sol=Solution()\nprint(sol.findMin([2,1]))`, expected: "1", isPublic: false },
  ],
},
// ── Search in Rotated Sorted Array ───────────────────────────────────────────
"Search in Rotated Sorted Array": {
  title: "Search in Rotated Sorted Array", difficulty: "Medium",
  desc: "There is an integer array `nums` sorted in ascending order (with distinct values). Given the array rotated at some pivot and a target integer `target`, return the index of target if it is in `nums`, or `-1` if it is not in `nums`. You must write an algorithm with O(log n) runtime complexity.",
  examples: [{ input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" }, { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" }, { input: "nums = [1], target = 0", output: "-1" }],
  constraints: ["1 ≤ nums.length ≤ 5000", "-10⁴ ≤ nums[i] ≤ 10⁴", "All values are unique.", "nums is sorted and possibly rotated."],
  functionSignature: "def search(self, nums: List[int], target: int) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        pass\n`, JavaScript: `var search = function(nums, target) {\n    \n};\n`, TypeScript: `function search(nums: number[], target: number): number {\n    \n};\n`, Java: `class Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.search([4,5,6,7,0,1,2],0))`, expected: "4", isPublic: true },
    { script: `sol=Solution()\nprint(sol.search([4,5,6,7,0,1,2],3))`, expected: "-1", isPublic: true },
    { script: `sol=Solution()\nprint(sol.search([1],0))`, expected: "-1", isPublic: false },
    { script: `sol=Solution()\nprint(sol.search([1,3],3))`, expected: "1", isPublic: false },
  ],
},
// ── Subarray Sum Equals K ─────────────────────────────────────────────────────
"Subarray Sum Equals K": {
  title: "Subarray Sum Equals K", difficulty: "Medium",
  desc: "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.",
  examples: [{ input: "nums = [1,1,1], k = 2", output: "2" }, { input: "nums = [1,2,3], k = 3", output: "2" }],
  constraints: ["1 ≤ nums.length ≤ 2×10⁴", "-1000 ≤ nums[i] ≤ 1000", "-10⁷ ≤ k ≤ 10⁷"],
  functionSignature: "def subarraySum(self, nums: List[int], k: int) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def subarraySum(self, nums: List[int], k: int) -> int:\n        pass\n`, JavaScript: `var subarraySum = function(nums, k) {\n    \n};\n`, TypeScript: `function subarraySum(nums: number[], k: number): number {\n    \n};\n`, Java: `class Solution {\n    public int subarraySum(int[] nums, int k) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.subarraySum([1,1,1],2))`, expected: "2", isPublic: true },
    { script: `sol=Solution()\nprint(sol.subarraySum([1,2,3],3))`, expected: "2", isPublic: true },
    { script: `sol=Solution()\nprint(sol.subarraySum([1],1))`, expected: "1", isPublic: false },
    { script: `sol=Solution()\nprint(sol.subarraySum([-1,-1,1],0))`, expected: "1", isPublic: false },
  ],
},
// ── Maximum Product Subarray ──────────────────────────────────────────────────
"Maximum Product Subarray": {
  title: "Maximum Product Subarray", difficulty: "Medium",
  desc: "Given an integer array `nums`, find a subarray that has the largest product, and return the product.",
  examples: [{ input: "nums = [2,3,-2,4]", output: "6" }, { input: "nums = [-2,0,-1]", output: "0" }],
  constraints: ["1 ≤ nums.length ≤ 2×10⁴", "-10 ≤ nums[i] ≤ 10", "The product of any subarray is guaranteed to fit in a 32-bit integer."],
  functionSignature: "def maxProduct(self, nums: List[int]) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def maxProduct(self, nums: List[int]) -> int:\n        pass\n`, JavaScript: `var maxProduct = function(nums) {\n    \n};\n`, TypeScript: `function maxProduct(nums: number[]): number {\n    \n};\n`, Java: `class Solution {\n    public int maxProduct(int[] nums) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int maxProduct(vector<int>& nums) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.maxProduct([2,3,-2,4]))`, expected: "6", isPublic: true },
    { script: `sol=Solution()\nprint(sol.maxProduct([-2,0,-1]))`, expected: "0", isPublic: true },
    { script: `sol=Solution()\nprint(sol.maxProduct([-2]))`, expected: "-2", isPublic: false },
    { script: `sol=Solution()\nprint(sol.maxProduct([-2,3,-4]))`, expected: "24", isPublic: false },
  ],
},
// ── Spiral Matrix ─────────────────────────────────────────────────────────────
"Spiral Matrix": {
  title: "Spiral Matrix", difficulty: "Medium",
  desc: "Given an `m x n` matrix, return all elements of the matrix in spiral order.",
  examples: [{ input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]" }, { input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]", output: "[1,2,3,4,8,12,11,10,9,5,6,7]" }],
  constraints: ["m == matrix.length", "n == matrix[i].length", "1 ≤ m, n ≤ 10", "-100 ≤ matrix[i][j] ≤ 100"],
  functionSignature: "def spiralOrder(self, matrix: List[List[int]]) -> List[int]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:\n        pass\n`, JavaScript: `var spiralOrder = function(matrix) {\n    \n};\n`, TypeScript: `function spiralOrder(matrix: number[][]): number[] {\n    \n};\n`, Java: `class Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.spiralOrder([[1,2,3],[4,5,6],[7,8,9]]))`, expected: "[1, 2, 3, 6, 9, 8, 7, 4, 5]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.spiralOrder([[1,2,3,4],[5,6,7,8],[9,10,11,12]]))`, expected: "[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.spiralOrder([[1]]))`, expected: "[1]", isPublic: false },
    { script: `sol=Solution()\nprint(sol.spiralOrder([[1,2],[3,4]]))`, expected: "[1, 2, 4, 3]", isPublic: false },
  ],
},
// ── Merge Intervals ───────────────────────────────────────────────────────────
"Merge Intervals": {
  title: "Merge Intervals", difficulty: "Medium",
  desc: "Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
  examples: [{ input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "Intervals [1,3] and [2,6] overlap, merge them into [1,6]." }, { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" }],
  constraints: ["1 ≤ intervals.length ≤ 10⁴", "intervals[i].length == 2", "0 ≤ starti ≤ endi ≤ 10⁴"],
  functionSignature: "def merge(self, intervals: List[List[int]]) -> List[List[int]]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        pass\n`, JavaScript: `var merge = function(intervals) {\n    \n};\n`, TypeScript: `function merge(intervals: number[][]): number[][] {\n    \n};\n`, Java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.merge([[1,3],[2,6],[8,10],[15,18]]))`, expected: "[[1, 6], [8, 10], [15, 18]]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.merge([[1,4],[4,5]]))`, expected: "[[1, 5]]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.merge([[1,4],[0,4]]))`, expected: "[[0, 4]]", isPublic: false },
    { script: `sol=Solution()\nprint(sol.merge([[1,4],[2,3]]))`, expected: "[[1, 4]]", isPublic: false },
  ],
},
// ── Trapping Rain Water ───────────────────────────────────────────────────────
"Trapping Rain Water": {
  title: "Trapping Rain Water", difficulty: "Hard",
  desc: "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.",
  examples: [{ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }, { input: "height = [4,2,0,3,2,5]", output: "9" }],
  constraints: ["n == height.length", "1 ≤ n ≤ 2×10⁴", "0 ≤ height[i] ≤ 10⁵"],
  functionSignature: "def trap(self, height: List[int]) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def trap(self, height: List[int]) -> int:\n        pass\n`, JavaScript: `var trap = function(height) {\n    \n};\n`, TypeScript: `function trap(height: number[]): number {\n    \n};\n`, Java: `class Solution {\n    public int trap(int[] height) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.trap([0,1,0,2,1,0,1,3,2,1,2,1]))`, expected: "6", isPublic: true },
    { script: `sol=Solution()\nprint(sol.trap([4,2,0,3,2,5]))`, expected: "9", isPublic: true },
    { script: `sol=Solution()\nprint(sol.trap([3,0,2,0,4]))`, expected: "7", isPublic: false },
    { script: `sol=Solution()\nprint(sol.trap([1,0,1]))`, expected: "1", isPublic: false },
  ],
},
// ── First Missing Positive ────────────────────────────────────────────────────
"First Missing Positive": {
  title: "First Missing Positive", difficulty: "Hard",
  desc: "Given an unsorted integer array `nums`, return the smallest missing positive integer. You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.",
  examples: [{ input: "nums = [1,2,0]", output: "3" }, { input: "nums = [3,4,-1,1]", output: "2" }, { input: "nums = [7,8,9,11,12]", output: "1" }],
  constraints: ["1 ≤ nums.length ≤ 10⁵", "-2³¹ ≤ nums[i] ≤ 2³¹-1"],
  functionSignature: "def firstMissingPositive(self, nums: List[int]) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def firstMissingPositive(self, nums: List[int]) -> int:\n        pass\n`, JavaScript: `var firstMissingPositive = function(nums) {\n    \n};\n`, TypeScript: `function firstMissingPositive(nums: number[]): number {\n    \n};\n`, Java: `class Solution {\n    public int firstMissingPositive(int[] nums) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int firstMissingPositive(vector<int>& nums) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.firstMissingPositive([1,2,0]))`, expected: "3", isPublic: true },
    { script: `sol=Solution()\nprint(sol.firstMissingPositive([3,4,-1,1]))`, expected: "2", isPublic: true },
    { script: `sol=Solution()\nprint(sol.firstMissingPositive([7,8,9,11,12]))`, expected: "1", isPublic: false },
    { script: `sol=Solution()\nprint(sol.firstMissingPositive([1,2,3]))`, expected: "4", isPublic: false },
  ],
},
// ── Group Anagrams ────────────────────────────────────────────────────────────
"Group Anagrams": {
  title: "Group Anagrams", difficulty: "Medium",
  desc: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order. An anagram is a word or phrase formed by rearranging the letters of a different word.",
  examples: [{ input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }, { input: 'strs = [""]', output: '[[""]]' }],
  constraints: ["1 ≤ strs.length ≤ 10⁴", "0 ≤ strs[i].length ≤ 100", "strs[i] consists of lowercase English letters."],
  functionSignature: "def groupAnagrams(self, strs: List[str]) -> List[List[str]]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:\n        pass\n`, JavaScript: `var groupAnagrams = function(strs) {\n    \n};\n`, TypeScript: `function groupAnagrams(strs: string[]): string[][] {\n    \n};\n`, Java: `class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nresult=sol.groupAnagrams(["eat","tea","tan","ate","nat","bat"])\nprint(sorted([sorted(g) for g in result]))`, expected: "[['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.groupAnagrams([""]))`, expected: '[[""]]', isPublic: true },
    { script: `sol=Solution()\nprint(sol.groupAnagrams(["a"]))`, expected: '[["a"]]', isPublic: false },
    { script: `sol=Solution()\nresult=sol.groupAnagrams(["ab","ba"])\nprint(sorted([sorted(g) for g in result]))`, expected: "[['ab', 'ba']]", isPublic: false },
  ],
},
// ── Top K Frequent Elements ───────────────────────────────────────────────────
"Top K Frequent Elements": {
  title: "Top K Frequent Elements", difficulty: "Medium",
  desc: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.",
  examples: [{ input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" }, { input: "nums = [1], k = 1", output: "[1]" }],
  constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴", "k is in the range [1, the number of unique elements in nums].", "The answer is unique."],
  functionSignature: "def topKFrequent(self, nums: List[int], k: int) -> List[int]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def topKFrequent(self, nums: List[int], k: int) -> List[int]:\n        pass\n`, JavaScript: `var topKFrequent = function(nums, k) {\n    \n};\n`, TypeScript: `function topKFrequent(nums: number[], k: number): number[] {\n    \n};\n`, Java: `class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sorted(sol.topKFrequent([1,1,1,2,2,3],2)))`, expected: "[1, 2]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.topKFrequent([1],1))`, expected: "[1]", isPublic: true },
    { script: `sol=Solution()\nprint(sorted(sol.topKFrequent([1,2],2)))`, expected: "[1, 2]", isPublic: false },
    { script: `sol=Solution()\nprint(sol.topKFrequent([4,4,4,3,3,2,1],1))`, expected: "[4]", isPublic: false },
  ],
},
// ── Climbing Stairs ───────────────────────────────────────────────────────────
"Climbing Stairs": {
  title: "Climbing Stairs", difficulty: "Easy",
  desc: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
  examples: [{ input: "n = 2", output: "2", explanation: "1+1 or 2." }, { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, or 2+1." }],
  constraints: ["1 ≤ n ≤ 45"],
  functionSignature: "def climbStairs(self, n: int) -> int:",
  starters: { Python: `class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass\n`, JavaScript: `var climbStairs = function(n) {\n    \n};\n`, TypeScript: `function climbStairs(n: number): number {\n    \n};\n`, Java: `class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.climbStairs(2))`, expected: "2", isPublic: true },
    { script: `sol=Solution()\nprint(sol.climbStairs(3))`, expected: "3", isPublic: true },
    { script: `sol=Solution()\nprint(sol.climbStairs(1))`, expected: "1", isPublic: false },
    { script: `sol=Solution()\nprint(sol.climbStairs(5))`, expected: "8", isPublic: false },
  ],
},
// ── House Robber ──────────────────────────────────────────────────────────────
"House Robber": {
  title: "House Robber", difficulty: "Medium",
  desc: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected — if two adjacent houses are broken into on the same night, the police will be alerted. Given an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
  examples: [{ input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (1) then house 3 (3). Total = 4." }, { input: "nums = [2,7,9,3,1]", output: "12", explanation: "Rob house 1 (2), house 3 (9), house 5 (1). Total = 12." }],
  constraints: ["1 ≤ nums.length ≤ 100", "0 ≤ nums[i] ≤ 400"],
  functionSignature: "def rob(self, nums: List[int]) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def rob(self, nums: List[int]) -> int:\n        pass\n`, JavaScript: `var rob = function(nums) {\n    \n};\n`, TypeScript: `function rob(nums: number[]): number {\n    \n};\n`, Java: `class Solution {\n    public int rob(int[] nums) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int rob(vector<int>& nums) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.rob([1,2,3,1]))`, expected: "4", isPublic: true },
    { script: `sol=Solution()\nprint(sol.rob([2,7,9,3,1]))`, expected: "12", isPublic: true },
    { script: `sol=Solution()\nprint(sol.rob([2,1]))`, expected: "2", isPublic: false },
    { script: `sol=Solution()\nprint(sol.rob([1]))`, expected: "1", isPublic: false },
  ],
},
// ── Coin Change ───────────────────────────────────────────────────────────────
"Coin Change": {
  title: "Coin Change", difficulty: "Medium",
  desc: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`. You may assume that you have an infinite number of each kind of coin.",
  examples: [{ input: "coins = [1,5,11], amount = 11", output: "3" }, { input: "coins = [2], amount = 3", output: "-1" }, { input: "coins = [1], amount = 0", output: "0" }],
  constraints: ["1 ≤ coins.length ≤ 12", "1 ≤ coins[i] ≤ 2³¹-1", "0 ≤ amount ≤ 10⁴"],
  functionSignature: "def coinChange(self, coins: List[int], amount: int) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def coinChange(self, coins: List[int], amount: int) -> int:\n        pass\n`, JavaScript: `var coinChange = function(coins, amount) {\n    \n};\n`, TypeScript: `function coinChange(coins: number[], amount: number): number {\n    \n};\n`, Java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.coinChange([1,5,11],11))`, expected: "1", isPublic: true },
    { script: `sol=Solution()\nprint(sol.coinChange([2],3))`, expected: "-1", isPublic: true },
    { script: `sol=Solution()\nprint(sol.coinChange([1],0))`, expected: "0", isPublic: false },
    { script: `sol=Solution()\nprint(sol.coinChange([1,2,5],11))`, expected: "3", isPublic: false },
  ],
},
// ── Binary Search ─────────────────────────────────────────────────────────────
"Binary Search": {
  title: "Binary Search", difficulty: "Easy",
  desc: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If target exists, then return its index. Otherwise, return `-1`. You must write an algorithm with O(log n) runtime complexity.",
  examples: [{ input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" }, { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" }],
  constraints: ["1 ≤ nums.length ≤ 10⁴", "-10⁴ < nums[i], target < 10⁴", "All integers in nums are unique.", "nums is sorted in ascending order."],
  functionSignature: "def search(self, nums: List[int], target: int) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        pass\n`, JavaScript: `var search = function(nums, target) {\n    \n};\n`, TypeScript: `function search(nums: number[], target: number): number {\n    \n};\n`, Java: `class Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.search([-1,0,3,5,9,12],9))`, expected: "4", isPublic: true },
    { script: `sol=Solution()\nprint(sol.search([-1,0,3,5,9,12],2))`, expected: "-1", isPublic: true },
    { script: `sol=Solution()\nprint(sol.search([5],5))`, expected: "0", isPublic: false },
    { script: `sol=Solution()\nprint(sol.search([1,3,5],3))`, expected: "1", isPublic: false },
  ],
},
// ── Number of Islands ─────────────────────────────────────────────────────────
"Number of Islands": {
  title: "Number of Islands", difficulty: "Medium",
  desc: "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
  examples: [{ input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: "1" }, { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: "3" }],
  constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 300", "grid[i][j] is '0' or '1'."],
  functionSignature: "def numIslands(self, grid: List[List[str]]) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        pass\n`, JavaScript: `var numIslands = function(grid) {\n    \n};\n`, TypeScript: `function numIslands(grid: string[][]): number {\n    \n};\n`, Java: `class Solution {\n    public int numIslands(char[][] grid) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.numIslands([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]))`, expected: "1", isPublic: true },
    { script: `sol=Solution()\nprint(sol.numIslands([["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]))`, expected: "3", isPublic: true },
    { script: `sol=Solution()\nprint(sol.numIslands([["1"]]))`, expected: "1", isPublic: false },
    { script: `sol=Solution()\nprint(sol.numIslands([["0"]]))`, expected: "0", isPublic: false },
  ],
},
// ── Course Schedule ───────────────────────────────────────────────────────────
"Course Schedule": {
  title: "Course Schedule", difficulty: "Medium",
  desc: "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses-1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`. Return `true` if you can finish all courses, otherwise return `false`.",
  examples: [{ input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" }, { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false" }],
  constraints: ["1 ≤ numCourses ≤ 2000", "0 ≤ prerequisites.length ≤ 5000", "prerequisites[i].length == 2", "0 ≤ ai, bi < numCourses", "All the pairs are unique."],
  functionSignature: "def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:\n        pass\n`, JavaScript: `var canFinish = function(numCourses, prerequisites) {\n    \n};\n`, TypeScript: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {\n    \n};\n`, Java: `class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.canFinish(2,[[1,0]]))`, expected: "True", isPublic: true },
    { script: `sol=Solution()\nprint(sol.canFinish(2,[[1,0],[0,1]]))`, expected: "False", isPublic: true },
    { script: `sol=Solution()\nprint(sol.canFinish(1,[]))`, expected: "True", isPublic: false },
    { script: `sol=Solution()\nprint(sol.canFinish(3,[[1,0],[2,1],[0,2]]))`, expected: "False", isPublic: false },
  ],
},
// ── Invert Binary Tree ────────────────────────────────────────────────────────
"Invert Binary Tree": {
  title: "Invert Binary Tree", difficulty: "Easy",
  desc: "Given the `root` of a binary tree, invert the tree, and return its root.",
  examples: [{ input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" }, { input: "root = [2,1,3]", output: "[2,3,1]" }, { input: "root = []", output: "[]" }],
  constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 ≤ Node.val ≤ 100"],
  functionSignature: "def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:",
  starters: { Python: `from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        pass\n`, JavaScript: `var invertTree = function(root) {\n    \n};\n`, TypeScript: `function invertTree(root: TreeNode | null): TreeNode | null {\n    \n};\n`, Java: `class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        \n    }\n};\n` },
  testCases: [
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\ndef bfs(r):\n    if not r: return []\n    q=[r];res=[]\n    while q:\n        n=q.pop(0)\n        if n: res.append(n.val);q.append(n.left);q.append(n.right)\n        else: res.append(None)\n    while res and res[-1] is None: res.pop()\n    return res\nsol=Solution()\nprint(bfs(sol.invertTree(mk([4,2,7,1,3,6,9]))))`, expected: "[4, 7, 2, 9, 6, 3, 1]", isPublic: true },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\ndef bfs(r):\n    if not r: return []\n    q=[r];res=[]\n    while q:\n        n=q.pop(0)\n        if n: res.append(n.val);q.append(n.left);q.append(n.right)\n        else: res.append(None)\n    while res and res[-1] is None: res.pop()\n    return res\nsol=Solution()\nprint(bfs(sol.invertTree(mk([2,1,3]))))`, expected: "[2, 3, 1]", isPublic: true },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\nsol=Solution()\nprint(sol.invertTree(None))`, expected: "None", isPublic: false },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nr=sol.invertTree(mk([1]))\nprint(r.val)`, expected: "1", isPublic: false },
  ],
},
// ── Maximum Depth of Binary Tree ──────────────────────────────────────────────
"Maximum Depth of Binary Tree": {
  title: "Maximum Depth of Binary Tree", difficulty: "Easy",
  desc: "Given the `root` of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
  examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "3" }, { input: "root = [1,null,2]", output: "2" }],
  constraints: ["The number of nodes in the tree is in the range [0, 10⁴].", "-100 ≤ Node.val ≤ 100"],
  functionSignature: "def maxDepth(self, root: Optional[TreeNode]) -> int:",
  starters: { Python: `from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        pass\n`, JavaScript: `var maxDepth = function(root) {\n    \n};\n`, TypeScript: `function maxDepth(root: TreeNode | null): number {\n    \n};\n`, Java: `class Solution {\n    public int maxDepth(TreeNode root) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        \n    }\n};\n` },
  testCases: [
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.maxDepth(mk([3,9,20,None,None,15,7])))`, expected: "3", isPublic: true },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.maxDepth(mk([1,None,2])))`, expected: "2", isPublic: true },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\nsol=Solution()\nprint(sol.maxDepth(None))`, expected: "0", isPublic: false },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.maxDepth(mk([1,2,3,4,5])))`, expected: "3", isPublic: false },
  ],
},
// ── Letter Combinations of Phone Number ───────────────────────────────────────
"Letter Combinations of Phone Number": {
  title: "Letter Combinations of Phone Number", difficulty: "Medium",
  desc: "Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. Return the answer in any order. A mapping of digits to letters (just like on the telephone buttons) is given.",
  examples: [{ input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' }, { input: 'digits = ""', output: "[]" }, { input: 'digits = "2"', output: '["a","b","c"]' }],
  constraints: ["0 ≤ digits.length ≤ 4", "digits[i] is a digit in the range ['2', '9']."],
  functionSignature: "def letterCombinations(self, digits: str) -> List[str]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def letterCombinations(self, digits: str) -> List[str]:\n        pass\n`, JavaScript: `var letterCombinations = function(digits) {\n    \n};\n`, TypeScript: `function letterCombinations(digits: string): string[] {\n    \n};\n`, Java: `class Solution {\n    public List<String> letterCombinations(String digits) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<string> letterCombinations(string digits) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sorted(sol.letterCombinations("23")))`, expected: "['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']", isPublic: true },
    { script: `sol=Solution()\nprint(sol.letterCombinations(""))`, expected: "[]", isPublic: true },
    { script: `sol=Solution()\nprint(sorted(sol.letterCombinations("2")))`, expected: "['a', 'b', 'c']", isPublic: false },
    { script: `sol=Solution()\nprint(len(sol.letterCombinations("234")))`, expected: "27", isPublic: false },
  ],
},
// ── Word Break ────────────────────────────────────────────────────────────────
"Word Break": {
  title: "Word Break", difficulty: "Medium",
  desc: "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words. Note that the same word in the dictionary may be reused multiple times in the segmentation.",
  examples: [{ input: 's = "leetcode", wordDict = ["leet","code"]', output: "true" }, { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: "true" }, { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: "false" }],
  constraints: ["1 ≤ s.length ≤ 300", "1 ≤ wordDict.length ≤ 1000", "1 ≤ wordDict[i].length ≤ 20", "s and wordDict[i] consist of only lowercase English letters.", "All the strings of wordDict are unique."],
  functionSignature: "def wordBreak(self, s: str, wordDict: List[str]) -> bool:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def wordBreak(self, s: str, wordDict: List[str]) -> bool:\n        pass\n`, JavaScript: `var wordBreak = function(s, wordDict) {\n    \n};\n`, TypeScript: `function wordBreak(s: string, wordDict: string[]): boolean {\n    \n};\n`, Java: `class Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    bool wordBreak(string s, vector<string>& wordDict) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.wordBreak("leetcode",["leet","code"]))`, expected: "True", isPublic: true },
    { script: `sol=Solution()\nprint(sol.wordBreak("applepenapple",["apple","pen"]))`, expected: "True", isPublic: true },
    { script: `sol=Solution()\nprint(sol.wordBreak("catsandog",["cats","dog","sand","and","cat"]))`, expected: "False", isPublic: false },
    { script: `sol=Solution()\nprint(sol.wordBreak("a",["a"]))`, expected: "True", isPublic: false },
  ],
},
// ── Unique Paths ──────────────────────────────────────────────────────────────
"Unique Paths": {
  title: "Unique Paths", difficulty: "Medium",
  desc: "There is a robot on an `m x n` grid. The robot is initially located at the top-left corner and wants to move to the bottom-right corner. The robot can only move either down or right at any point in time. Given the two integers `m` and `n`, return the number of possible unique paths.",
  examples: [{ input: "m = 3, n = 7", output: "28" }, { input: "m = 3, n = 2", output: "3" }],
  constraints: ["1 ≤ m, n ≤ 100"],
  functionSignature: "def uniquePaths(self, m: int, n: int) -> int:",
  starters: { Python: `class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        pass\n`, JavaScript: `var uniquePaths = function(m, n) {\n    \n};\n`, TypeScript: `function uniquePaths(m: number, n: number): number {\n    \n};\n`, Java: `class Solution {\n    public int uniquePaths(int m, int n) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int uniquePaths(int m, int n) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.uniquePaths(3,7))`, expected: "28", isPublic: true },
    { script: `sol=Solution()\nprint(sol.uniquePaths(3,2))`, expected: "3", isPublic: true },
    { script: `sol=Solution()\nprint(sol.uniquePaths(1,1))`, expected: "1", isPublic: false },
    { script: `sol=Solution()\nprint(sol.uniquePaths(7,3))`, expected: "28", isPublic: false },
  ],
},
// ── Fibonacci Number ──────────────────────────────────────────────────────────
"Fibonacci Number": {
  title: "Fibonacci Number", difficulty: "Easy",
  desc: "The Fibonacci numbers form the sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34... Given `n`, calculate `F(n)`. `F(0) = 0`, `F(1) = 1`, `F(n) = F(n-1) + F(n-2)` for `n > 1`.",
  examples: [{ input: "n = 2", output: "1", explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1." }, { input: "n = 3", output: "2" }, { input: "n = 4", output: "3" }],
  constraints: ["0 ≤ n ≤ 30"],
  functionSignature: "def fib(self, n: int) -> int:",
  starters: { Python: `class Solution:\n    def fib(self, n: int) -> int:\n        pass\n`, JavaScript: `var fib = function(n) {\n    \n};\n`, TypeScript: `function fib(n: number): number {\n    \n};\n`, Java: `class Solution {\n    public int fib(int n) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int fib(int n) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.fib(2))`, expected: "1", isPublic: true },
    { script: `sol=Solution()\nprint(sol.fib(3))`, expected: "2", isPublic: true },
    { script: `sol=Solution()\nprint(sol.fib(0))`, expected: "0", isPublic: false },
    { script: `sol=Solution()\nprint(sol.fib(10))`, expected: "55", isPublic: false },
  ],
},
// ── Min Cost Climbing Stairs ──────────────────────────────────────────────────
"Min Cost Climbing Stairs": {
  title: "Min Cost Climbing Stairs", difficulty: "Easy",
  desc: "You are given an integer array `cost` where `cost[i]` is the cost of the `i`th step on a staircase. Once you pay the cost, you can either climb one or two steps. You can either start from the step with index `0` or index `1`. Return the minimum cost to reach the top of the floor.",
  examples: [{ input: "cost = [10,15,20]", output: "15" }, { input: "cost = [1,100,1,1,1,100,1,1,100,1]", output: "6" }],
  constraints: ["2 ≤ cost.length ≤ 1000", "0 ≤ cost[i] ≤ 999"],
  functionSignature: "def minCostClimbingStairs(self, cost: List[int]) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def minCostClimbingStairs(self, cost: List[int]) -> int:\n        pass\n`, JavaScript: `var minCostClimbingStairs = function(cost) {\n    \n};\n`, TypeScript: `function minCostClimbingStairs(cost: number[]): number {\n    \n};\n`, Java: `class Solution {\n    public int minCostClimbingStairs(int[] cost) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int minCostClimbingStairs(vector<int>& cost) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.minCostClimbingStairs([10,15,20]))`, expected: "15", isPublic: true },
    { script: `sol=Solution()\nprint(sol.minCostClimbingStairs([1,100,1,1,1,100,1,1,100,1]))`, expected: "6", isPublic: true },
    { script: `sol=Solution()\nprint(sol.minCostClimbingStairs([0,0]))`, expected: "0", isPublic: false },
    { script: `sol=Solution()\nprint(sol.minCostClimbingStairs([1,2,3]))`, expected: "2", isPublic: false },
  ],
},
// ── Longest Common Subsequence ────────────────────────────────────────────────
"Longest Common Subsequence": {
  title: "Longest Common Subsequence", difficulty: "Medium",
  desc: "Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return `0`. A subsequence is a sequence derived from the original string by deleting some characters without changing relative order.",
  examples: [{ input: 'text1 = "abcde", text2 = "ace"', output: "3", explanation: 'The LCS is "ace" with length 3.' }, { input: 'text1 = "abc", text2 = "abc"', output: "3" }, { input: 'text1 = "abc", text2 = "def"', output: "0" }],
  constraints: ["1 ≤ text1.length, text2.length ≤ 1000", "text1 and text2 consist of only lowercase English characters."],
  functionSignature: "def longestCommonSubsequence(self, text1: str, text2: str) -> int:",
  starters: { Python: `class Solution:\n    def longestCommonSubsequence(self, text1: str, text2: str) -> int:\n        pass\n`, JavaScript: `var longestCommonSubsequence = function(text1, text2) {\n    \n};\n`, TypeScript: `function longestCommonSubsequence(text1: string, text2: string): number {\n    \n};\n`, Java: `class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int longestCommonSubsequence(string text1, string text2) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.longestCommonSubsequence("abcde","ace"))`, expected: "3", isPublic: true },
    { script: `sol=Solution()\nprint(sol.longestCommonSubsequence("abc","abc"))`, expected: "3", isPublic: true },
    { script: `sol=Solution()\nprint(sol.longestCommonSubsequence("abc","def"))`, expected: "0", isPublic: false },
    { script: `sol=Solution()\nprint(sol.longestCommonSubsequence("oxcpqrsvwf","shmtulqrypy"))`, expected: "2", isPublic: false },
  ],
},
// ── Longest Increasing Subsequence ────────────────────────────────────────────
"Longest Increasing Subsequence": {
  title: "Longest Increasing Subsequence", difficulty: "Medium",
  desc: "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
  examples: [{ input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "The LIS is [2,3,7,101] with length 4." }, { input: "nums = [0,1,0,3,2,3]", output: "4" }, { input: "nums = [7,7,7,7,7,7,7]", output: "1" }],
  constraints: ["1 ≤ nums.length ≤ 2500", "-10⁴ ≤ nums[i] ≤ 10⁴"],
  functionSignature: "def lengthOfLIS(self, nums: List[int]) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def lengthOfLIS(self, nums: List[int]) -> int:\n        pass\n`, JavaScript: `var lengthOfLIS = function(nums) {\n    \n};\n`, TypeScript: `function lengthOfLIS(nums: number[]): number {\n    \n};\n`, Java: `class Solution {\n    public int lengthOfLIS(int[] nums) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int lengthOfLIS(vector<int>& nums) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.lengthOfLIS([10,9,2,5,3,7,101,18]))`, expected: "4", isPublic: true },
    { script: `sol=Solution()\nprint(sol.lengthOfLIS([0,1,0,3,2,3]))`, expected: "4", isPublic: true },
    { script: `sol=Solution()\nprint(sol.lengthOfLIS([7,7,7,7,7,7,7]))`, expected: "1", isPublic: false },
    { script: `sol=Solution()\nprint(sol.lengthOfLIS([1,2,3,4,5]))`, expected: "5", isPublic: false },
  ],
},
// ── Target Sum ────────────────────────────────────────────────────────────────
"Target Sum": {
  title: "Target Sum", difficulty: "Medium",
  desc: "You are given an integer array `nums` and an integer `target`. You want to build an expression out of nums by adding one of the symbols `'+'` and `'-'` before each integer and then concatenate all the integers. Return the number of different expressions that you can build which evaluates to `target`.",
  examples: [{ input: "nums = [1,1,1,1,1], target = 3", output: "5" }, { input: "nums = [1], target = 1", output: "1" }],
  constraints: ["1 ≤ nums.length ≤ 20", "0 ≤ nums[i] ≤ 1000", "0 ≤ sum(nums[i]) ≤ 1000", "-1000 ≤ target ≤ 1000"],
  functionSignature: "def findTargetSumWays(self, nums: List[int], target: int) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def findTargetSumWays(self, nums: List[int], target: int) -> int:\n        pass\n`, JavaScript: `var findTargetSumWays = function(nums, target) {\n    \n};\n`, TypeScript: `function findTargetSumWays(nums: number[], target: number): number {\n    \n};\n`, Java: `class Solution {\n    public int findTargetSumWays(int[] nums, int target) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int findTargetSumWays(vector<int>& nums, int target) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.findTargetSumWays([1,1,1,1,1],3))`, expected: "5", isPublic: true },
    { script: `sol=Solution()\nprint(sol.findTargetSumWays([1],1))`, expected: "1", isPublic: true },
    { script: `sol=Solution()\nprint(sol.findTargetSumWays([1],2))`, expected: "0", isPublic: false },
    { script: `sol=Solution()\nprint(sol.findTargetSumWays([0,0,0,0,0,0,0,0,1],1))`, expected: "256", isPublic: false },
  ],
},
// ── Decode Ways ───────────────────────────────────────────────────────────────
"Decode Ways": {
  title: "Decode Ways", difficulty: "Medium",
  desc: "A message containing letters from `A-Z` can be encoded into numbers using `'A' -> '1', 'B' -> '2', ..., 'Z' -> '26'`. Given a string `s` containing only digits, return the number of ways to decode it.",
  examples: [{ input: 's = "12"', output: "2", explanation: '"12" could be decoded as "AB" (1 2) or "L" (12).' }, { input: 's = "226"', output: "3" }, { input: 's = "06"', output: "0" }],
  constraints: ["1 ≤ s.length ≤ 100", "s contains only digits and may contain leading zeros."],
  functionSignature: "def numDecodings(self, s: str) -> int:",
  starters: { Python: `class Solution:\n    def numDecodings(self, s: str) -> int:\n        pass\n`, JavaScript: `var numDecodings = function(s) {\n    \n};\n`, TypeScript: `function numDecodings(s: string): number {\n    \n};\n`, Java: `class Solution {\n    public int numDecodings(String s) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int numDecodings(string s) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.numDecodings("12"))`, expected: "2", isPublic: true },
    { script: `sol=Solution()\nprint(sol.numDecodings("226"))`, expected: "3", isPublic: true },
    { script: `sol=Solution()\nprint(sol.numDecodings("06"))`, expected: "0", isPublic: false },
    { script: `sol=Solution()\nprint(sol.numDecodings("1"))`, expected: "1", isPublic: false },
  ],
},
// ── Jump Game ─────────────────────────────────────────────────────────────────
"Jump Game": {
  title: "Jump Game", difficulty: "Medium",
  desc: "You are given an integer array `nums`. You are initially positioned at the first index. Each element represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.",
  examples: [{ input: "nums = [2,3,1,1,4]", output: "true" }, { input: "nums = [3,2,1,0,4]", output: "false" }],
  constraints: ["1 ≤ nums.length ≤ 10⁴", "0 ≤ nums[i] ≤ 10⁵"],
  functionSignature: "def canJump(self, nums: List[int]) -> bool:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def canJump(self, nums: List[int]) -> bool:\n        pass\n`, JavaScript: `var canJump = function(nums) {\n    \n};\n`, TypeScript: `function canJump(nums: number[]): boolean {\n    \n};\n`, Java: `class Solution {\n    public boolean canJump(int[] nums) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.canJump([2,3,1,1,4]))`, expected: "True", isPublic: true },
    { script: `sol=Solution()\nprint(sol.canJump([3,2,1,0,4]))`, expected: "False", isPublic: true },
    { script: `sol=Solution()\nprint(sol.canJump([0]))`, expected: "True", isPublic: false },
    { script: `sol=Solution()\nprint(sol.canJump([1,0,0]))`, expected: "False", isPublic: false },
  ],
},
// ── Partition Equal Subset Sum ────────────────────────────────────────────────
"Partition Equal Subset Sum": {
  title: "Partition Equal Subset Sum", difficulty: "Medium",
  desc: "Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal, or `false` otherwise.",
  examples: [{ input: "nums = [1,5,11,5]", output: "true", explanation: "Can be partitioned as [1,5,5] and [11]." }, { input: "nums = [1,2,3,5]", output: "false" }],
  constraints: ["1 ≤ nums.length ≤ 200", "1 ≤ nums[i] ≤ 100"],
  functionSignature: "def canPartition(self, nums: List[int]) -> bool:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def canPartition(self, nums: List[int]) -> bool:\n        pass\n`, JavaScript: `var canPartition = function(nums) {\n    \n};\n`, TypeScript: `function canPartition(nums: number[]): boolean {\n    \n};\n`, Java: `class Solution {\n    public boolean canPartition(int[] nums) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    bool canPartition(vector<int>& nums) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.canPartition([1,5,11,5]))`, expected: "True", isPublic: true },
    { script: `sol=Solution()\nprint(sol.canPartition([1,2,3,5]))`, expected: "False", isPublic: true },
    { script: `sol=Solution()\nprint(sol.canPartition([1,1]))`, expected: "True", isPublic: false },
    { script: `sol=Solution()\nprint(sol.canPartition([1,2,5]))`, expected: "False", isPublic: false },
  ],
},
// ── Search Insert Position ────────────────────────────────────────────────────
"Search Insert Position": {
  title: "Search Insert Position", difficulty: "Easy",
  desc: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order. You must write an algorithm with O(log n) runtime complexity.",
  examples: [{ input: "nums = [1,3,5,6], target = 5", output: "2" }, { input: "nums = [1,3,5,6], target = 2", output: "1" }, { input: "nums = [1,3,5,6], target = 7", output: "4" }],
  constraints: ["1 ≤ nums.length ≤ 10⁴", "-10⁴ ≤ nums[i] ≤ 10⁴", "nums contains distinct values sorted in ascending order.", "-10⁴ ≤ target ≤ 10⁴"],
  functionSignature: "def searchInsert(self, nums: List[int], target: int) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def searchInsert(self, nums: List[int], target: int) -> int:\n        pass\n`, JavaScript: `var searchInsert = function(nums, target) {\n    \n};\n`, TypeScript: `function searchInsert(nums: number[], target: number): number {\n    \n};\n`, Java: `class Solution {\n    public int searchInsert(int[] nums, int target) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.searchInsert([1,3,5,6],5))`, expected: "2", isPublic: true },
    { script: `sol=Solution()\nprint(sol.searchInsert([1,3,5,6],2))`, expected: "1", isPublic: true },
    { script: `sol=Solution()\nprint(sol.searchInsert([1,3,5,6],7))`, expected: "4", isPublic: false },
    { script: `sol=Solution()\nprint(sol.searchInsert([1,3,5,6],0))`, expected: "0", isPublic: false },
  ],
},
// ── First Bad Version ─────────────────────────────────────────────────────────
"First Bad Version": {
  title: "First Bad Version", difficulty: "Easy",
  desc: "You are a product manager and want to find the first bad version. You have `n` versions and your goal is to find the first bad one, which causes all the following ones to be bad. The API `isBadVersion(version)` returns whether a version is bad. Implement a function to find the first bad version. You should minimize the number of calls to the API.",
  examples: [{ input: "n = 5, bad = 4", output: "4" }, { input: "n = 1, bad = 1", output: "1" }],
  constraints: ["1 ≤ bad ≤ n ≤ 2³¹-1"],
  functionSignature: "def firstBadVersion(self, n: int) -> int:",
  starters: { Python: `class Solution:\n    def firstBadVersion(self, n: int) -> int:\n        # isBadVersion is provided as built-in\n        pass\n`, JavaScript: `var solution = function(isBadVersion) {\n    return function(n) {\n        \n    };\n};\n`, TypeScript: `var solution = function(isBadVersion: any) {\n    return function(n: number): number {\n        \n    };\n};\n`, Java: `public class Solution extends VersionControl {\n    public int firstBadVersion(int n) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int firstBadVersion(int n) {\n        \n    }\n};\n` },
  testCases: [
    { script: `class Solution:\n    def firstBadVersion(self, n: int) -> int:\n        bad = 4\n        lo, hi = 1, n\n        while lo < hi:\n            mid = (lo + hi) // 2\n            if mid >= bad: hi = mid\n            else: lo = mid + 1\n        return lo\nprint(Solution().firstBadVersion(5))`, expected: "4", isPublic: true },
    { script: `class Solution:\n    def firstBadVersion(self, n: int) -> int:\n        bad = 1\n        lo, hi = 1, n\n        while lo < hi:\n            mid = (lo + hi) // 2\n            if mid >= bad: hi = mid\n            else: lo = mid + 1\n        return lo\nprint(Solution().firstBadVersion(1))`, expected: "1", isPublic: true },
    { script: `sol=Solution()\nprint(sol.firstBadVersion(1))`, expected: "1", isPublic: false },
    { script: `sol=Solution()\nprint(type(sol.firstBadVersion(5)) == int)`, expected: "True", isPublic: false },
  ],
},
// ── Koko Eating Bananas ───────────────────────────────────────────────────────
"Koko Eating Bananas": {
  title: "Koko Eating Bananas", difficulty: "Medium",
  desc: "Koko loves to eat bananas. There are `n` piles of bananas, the `i`th pile has `piles[i]` bananas. The guards have gone and will come back in `h` hours. Koko can decide her bananas-per-hour eating speed `k`. Each hour she eats from one pile. Return the minimum integer `k` such that she can eat all the bananas within `h` hours.",
  examples: [{ input: "piles = [3,6,7,11], h = 8", output: "4" }, { input: "piles = [30,11,23,4,20], h = 5", output: "30" }],
  constraints: ["1 ≤ piles.length ≤ 10⁴", "piles.length ≤ h ≤ 10⁹", "1 ≤ piles[i] ≤ 10⁹"],
  functionSignature: "def minEatingSpeed(self, piles: List[int], h: int) -> int:",
  starters: { Python: `from typing import List\nimport math\n\nclass Solution:\n    def minEatingSpeed(self, piles: List[int], h: int) -> int:\n        pass\n`, JavaScript: `var minEatingSpeed = function(piles, h) {\n    \n};\n`, TypeScript: `function minEatingSpeed(piles: number[], h: number): number {\n    \n};\n`, Java: `class Solution {\n    public int minEatingSpeed(int[] piles, int h) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int minEatingSpeed(vector<int>& piles, int h) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.minEatingSpeed([3,6,7,11],8))`, expected: "4", isPublic: true },
    { script: `sol=Solution()\nprint(sol.minEatingSpeed([30,11,23,4,20],5))`, expected: "30", isPublic: true },
    { script: `sol=Solution()\nprint(sol.minEatingSpeed([1,1,1,1],2))`, expected: "1", isPublic: false },
    { script: `sol=Solution()\nprint(sol.minEatingSpeed([312884470],312884469))`, expected: "2", isPublic: false },
  ],
},
// ── Find Peak Element ─────────────────────────────────────────────────────────
"Find Peak Element": {
  title: "Find Peak Element", difficulty: "Medium",
  desc: "A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array `nums`, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks. `nums[-1]` and `nums[n]` are conceptually `-∞`. You must write an algorithm that runs in O(log n) time.",
  examples: [{ input: "nums = [1,2,3,1]", output: "2", explanation: "3 is a peak element." }, { input: "nums = [1,2,1,3,5,6,4]", output: "5", explanation: "Your function can return either index 1 or 5." }],
  constraints: ["1 ≤ nums.length ≤ 1000", "-2³¹ ≤ nums[i] ≤ 2³¹-1", "nums[i] != nums[i+1] for all valid i."],
  functionSignature: "def findPeakElement(self, nums: List[int]) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def findPeakElement(self, nums: List[int]) -> int:\n        pass\n`, JavaScript: `var findPeakElement = function(nums) {\n    \n};\n`, TypeScript: `function findPeakElement(nums: number[]): number {\n    \n};\n`, Java: `class Solution {\n    public int findPeakElement(int[] nums) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int findPeakElement(vector<int>& nums) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nresult=sol.findPeakElement([1,2,3,1])\nprint(result==2)`, expected: "True", isPublic: true },
    { script: `sol=Solution()\nresult=sol.findPeakElement([1,2,1,3,5,6,4])\nprint(result in [1,5])`, expected: "True", isPublic: true },
    { script: `sol=Solution()\nprint(sol.findPeakElement([1]))`, expected: "0", isPublic: false },
    { script: `sol=Solution()\nresult=sol.findPeakElement([1,2])\nprint(result==1)`, expected: "True", isPublic: false },
  ],
},
// ── Merge Sorted Array ────────────────────────────────────────────────────────
"Merge Sorted Array": {
  title: "Merge Sorted Array", difficulty: "Easy",
  desc: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively. Merge `nums2` into `nums1` as one sorted array in-place. The final sorted array should be stored inside `nums1`.",
  examples: [{ input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" }, { input: "nums1 = [1], m = 1, nums2 = [], n = 0", output: "[1]" }],
  constraints: ["nums1.length == m + n", "nums2.length == n", "0 ≤ m, n ≤ 200", "1 ≤ m + n ≤ 200"],
  functionSignature: "def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:\n        pass\n`, JavaScript: `var merge = function(nums1, m, nums2, n) {\n    \n};\n`, TypeScript: `function merge(nums1: number[], m: number, nums2: number[], n: number): void {\n    \n};\n`, Java: `class Solution {\n    public void merge(int[] nums1, int m, int[] nums2, int n) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nnums1=[1,2,3,0,0,0]\nsol.merge(nums1,3,[2,5,6],3)\nprint(nums1)`, expected: "[1, 2, 2, 3, 5, 6]", isPublic: true },
    { script: `sol=Solution()\nnums1=[1]\nsol.merge(nums1,1,[],0)\nprint(nums1)`, expected: "[1]", isPublic: true },
    { script: `sol=Solution()\nnums1=[0]\nsol.merge(nums1,0,[1],1)\nprint(nums1)`, expected: "[1]", isPublic: false },
    { script: `sol=Solution()\nnums1=[4,5,6,0,0,0]\nsol.merge(nums1,3,[1,2,3],3)\nprint(nums1)`, expected: "[1, 2, 3, 4, 5, 6]", isPublic: false },
  ],
},
// ── Sort Colors ───────────────────────────────────────────────────────────────
"Sort Colors": {
  title: "Sort Colors", difficulty: "Medium",
  desc: "Given an array `nums` with `n` objects colored red (0), white (1), or blue (2), sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. You must solve this without using the library's sort function.",
  examples: [{ input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" }, { input: "nums = [2,0,1]", output: "[0,1,2]" }],
  constraints: ["n == nums.length", "1 ≤ n ≤ 300", "nums[i] is either 0, 1, or 2."],
  functionSignature: "def sortColors(self, nums: List[int]) -> None:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def sortColors(self, nums: List[int]) -> None:\n        pass\n`, JavaScript: `var sortColors = function(nums) {\n    \n};\n`, TypeScript: `function sortColors(nums: number[]): void {\n    \n};\n`, Java: `class Solution {\n    public void sortColors(int[] nums) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    void sortColors(vector<int>& nums) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nnums=[2,0,2,1,1,0]\nsol.sortColors(nums)\nprint(nums)`, expected: "[0, 0, 1, 1, 2, 2]", isPublic: true },
    { script: `sol=Solution()\nnums=[2,0,1]\nsol.sortColors(nums)\nprint(nums)`, expected: "[0, 1, 2]", isPublic: true },
    { script: `sol=Solution()\nnums=[0]\nsol.sortColors(nums)\nprint(nums)`, expected: "[0]", isPublic: false },
    { script: `sol=Solution()\nnums=[1,0]\nsol.sortColors(nums)\nprint(nums)`, expected: "[0, 1]", isPublic: false },
  ],
},
// ── Remove Duplicates from Sorted Array ───────────────────────────────────────
"Remove Duplicates from Sorted Array": {
  title: "Remove Duplicates from Sorted Array", difficulty: "Easy",
  desc: "Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Return `k` after placing the final result in the first `k` slots of `nums`.",
  examples: [{ input: "nums = [1,1,2]", output: "2, nums = [1,2,_]" }, { input: "nums = [0,0,1,1,1,2,2,3,3,4]", output: "5, nums = [0,1,2,3,4,_,_,_,_,_]" }],
  constraints: ["1 ≤ nums.length ≤ 3×10⁴", "-100 ≤ nums[i] ≤ 100", "nums is sorted in non-decreasing order."],
  functionSignature: "def removeDuplicates(self, nums: List[int]) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def removeDuplicates(self, nums: List[int]) -> int:\n        pass\n`, JavaScript: `var removeDuplicates = function(nums) {\n    \n};\n`, TypeScript: `function removeDuplicates(nums: number[]): number {\n    \n};\n`, Java: `class Solution {\n    public int removeDuplicates(int[] nums) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int removeDuplicates(vector<int>& nums) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nnums=[1,1,2]\nk=sol.removeDuplicates(nums)\nprint(k, nums[:k])`, expected: "2 [1, 2]", isPublic: true },
    { script: `sol=Solution()\nnums=[0,0,1,1,1,2,2,3,3,4]\nk=sol.removeDuplicates(nums)\nprint(k, nums[:k])`, expected: "5 [0, 1, 2, 3, 4]", isPublic: true },
    { script: `sol=Solution()\nnums=[1]\nk=sol.removeDuplicates(nums)\nprint(k)`, expected: "1", isPublic: false },
    { script: `sol=Solution()\nnums=[1,2,3]\nk=sol.removeDuplicates(nums)\nprint(k)`, expected: "3", isPublic: false },
  ],
},
// ── Flood Fill ────────────────────────────────────────────────────────────────
"Flood Fill": {
  title: "Flood Fill", difficulty: "Easy",
  desc: "An image is represented by an `m x n` integer grid `image` where `image[i][j]` represents the pixel value. You are given three integers `sr`, `sc`, and `color`. Perform a flood fill starting from `image[sr][sc]`. To perform a flood fill, consider the starting pixel, plus any pixels connected 4-directionally to the starting pixel with the same color, and change all their color to `color`. Return the modified image.",
  examples: [{ input: "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2", output: "[[2,2,2],[2,2,0],[2,0,1]]" }, { input: "image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0", output: "[[0,0,0],[0,0,0]]" }],
  constraints: ["m == image.length", "n == image[i].length", "1 ≤ m, n ≤ 50", "0 ≤ image[i][j], color < 2¹⁶"],
  functionSignature: "def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:\n        pass\n`, JavaScript: `var floodFill = function(image, sr, sc, color) {\n    \n};\n`, TypeScript: `function floodFill(image: number[][], sr: number, sc: number, color: number): number[][] {\n    \n};\n`, Java: `class Solution {\n    public int[][] floodFill(int[][] image, int sr, int sc, int color) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.floodFill([[1,1,1],[1,1,0],[1,0,1]],1,1,2))`, expected: "[[2, 2, 2], [2, 2, 0], [2, 0, 1]]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.floodFill([[0,0,0],[0,0,0]],0,0,0))`, expected: "[[0, 0, 0], [0, 0, 0]]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.floodFill([[1,1,1],[1,1,1],[1,1,1]],1,1,3))`, expected: "[[3, 3, 3], [3, 3, 3], [3, 3, 3]]", isPublic: false },
    { script: `sol=Solution()\nprint(sol.floodFill([[1]],0,0,5))`, expected: "[[5]]", isPublic: false },
  ],
},
// ── Rotting Oranges ───────────────────────────────────────────────────────────
"Rotting Oranges": {
  title: "Rotting Oranges", difficulty: "Medium",
  desc: "You are given an `m x n` grid where cells can contain: `0` (empty), `1` (fresh orange), or `2` (rotten orange). Every minute, any fresh orange 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return `-1`.",
  examples: [{ input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4" }, { input: "grid = [[2,1,1],[0,1,1],[1,0,1]]", output: "-1" }, { input: "grid = [[0,2]]", output: "0" }],
  constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 10", "grid[i][j] is 0, 1, or 2."],
  functionSignature: "def orangesRotting(self, grid: List[List[int]]) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def orangesRotting(self, grid: List[List[int]]) -> int:\n        pass\n`, JavaScript: `var orangesRotting = function(grid) {\n    \n};\n`, TypeScript: `function orangesRotting(grid: number[][]): number {\n    \n};\n`, Java: `class Solution {\n    public int orangesRotting(int[][] grid) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int orangesRotting(vector<vector<int>>& grid) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.orangesRotting([[2,1,1],[1,1,0],[0,1,1]]))`, expected: "4", isPublic: true },
    { script: `sol=Solution()\nprint(sol.orangesRotting([[2,1,1],[0,1,1],[1,0,1]]))`, expected: "-1", isPublic: true },
    { script: `sol=Solution()\nprint(sol.orangesRotting([[0,2]]))`, expected: "0", isPublic: false },
    { script: `sol=Solution()\nprint(sol.orangesRotting([[1,2]]))`, expected: "1", isPublic: false },
  ],
},
// ── Pacific Atlantic Water Flow ───────────────────────────────────────────────
"Pacific Atlantic Water Flow": {
  title: "Pacific Atlantic Water Flow", difficulty: "Medium",
  desc: "There is an `m x n` rectangular island that borders both the Pacific Ocean and Atlantic Ocean. Rain water can flow to neighboring cells horizontally or vertically if the height of the neighboring cell is less than or equal to the current cell. Return a 2D list of grid coordinates where water can flow to both the Pacific and Atlantic Ocean.",
  examples: [{ input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]" }, { input: "heights = [[1]]", output: "[[0,0]]" }],
  constraints: ["m == heights.length", "n == heights[i].length", "1 ≤ m, n ≤ 200", "0 ≤ heights[i][j] ≤ 10⁵"],
  functionSignature: "def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:\n        pass\n`, JavaScript: `var pacificAtlantic = function(heights) {\n    \n};\n`, TypeScript: `function pacificAtlantic(heights: number[][]): number[][] {\n    \n};\n`, Java: `class Solution {\n    public List<List<Integer>> pacificAtlantic(int[][] heights) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nresult=sol.pacificAtlantic([[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]])\nprint(sorted([tuple(r) for r in result]))`, expected: "[(0, 4), (1, 3), (1, 4), (2, 2), (3, 0), (3, 1), (4, 0)]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.pacificAtlantic([[1]]))`, expected: "[[0, 0]]", isPublic: true },
    { script: `sol=Solution()\nresult=sol.pacificAtlantic([[1,1],[1,1]])\nprint(len(result))`, expected: "4", isPublic: false },
    { script: `sol=Solution()\nresult=sol.pacificAtlantic([[3,3,3],[3,1,3],[0,2,4]])\nprint(len(result)>0)`, expected: "True", isPublic: false },
  ],
},
// ── Clone Graph ───────────────────────────────────────────────────────────────
"Clone Graph": {
  title: "Clone Graph", difficulty: "Medium",
  desc: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node in the graph contains a value (int) and a list (List[Node]) of its neighbors.",
  examples: [{ input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]", explanation: "Each node is cloned with the same neighbors." }, { input: "adjList = [[]]", output: "[[]]" }],
  constraints: ["The number of nodes is in the range [0, 100].", "1 ≤ Node.val ≤ 100", "Node.val is unique for each node.", "There are no repeated edges and no self-loops."],
  functionSignature: "def cloneGraph(self, node: Optional[Node]) -> Optional[Node]:",
  starters: { Python: `from typing import Optional, List\n\nclass Node:\n    def __init__(self, val=0, neighbors=None):\n        self.val = val\n        self.neighbors = neighbors if neighbors is not None else []\n\nclass Solution:\n    def cloneGraph(self, node: Optional[Node]) -> Optional[Node]:\n        pass\n`, JavaScript: `var cloneGraph = function(node) {\n    \n};\n`, TypeScript: `function cloneGraph(node: Node | null): Node | null {\n    \n};\n`, Java: `class Solution {\n    public Node cloneGraph(Node node) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    Node* cloneGraph(Node* node) {\n        \n    }\n};\n` },
  testCases: [
    { script: `class Node:\n    def __init__(self,v=0,n=None): self.val=v; self.neighbors=n or []\nsol=Solution()\nn1=Node(1); n2=Node(2); n3=Node(3); n4=Node(4)\nn1.neighbors=[n2,n4]; n2.neighbors=[n1,n3]; n3.neighbors=[n2,n4]; n4.neighbors=[n1,n3]\nclone=sol.cloneGraph(n1)\nprint(clone.val, len(clone.neighbors))`, expected: "1 2", isPublic: true },
    { script: `class Node:\n    def __init__(self,v=0,n=None): self.val=v; self.neighbors=n or []\nsol=Solution()\nresult=sol.cloneGraph(None)\nprint(result)`, expected: "None", isPublic: true },
    { script: `class Node:\n    def __init__(self,v=0,n=None): self.val=v; self.neighbors=n or []\nsol=Solution()\nn=Node(1)\nclone=sol.cloneGraph(n)\nprint(clone is not n, clone.val)`, expected: "True 1", isPublic: false },
    { script: `class Node:\n    def __init__(self,v=0,n=None): self.val=v; self.neighbors=n or []\nsol=Solution()\nn1=Node(1); n2=Node(2); n1.neighbors=[n2]; n2.neighbors=[n1]\nclone=sol.cloneGraph(n1)\nprint(clone.val, clone.neighbors[0].val)`, expected: "1 2", isPublic: false },
  ],
},
// ── Min Stack ─────────────────────────────────────────────────────────────────
"Min Stack": {
  title: "Min Stack", difficulty: "Medium",
  desc: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement the `MinStack` class with `push`, `pop`, `top`, and `getMin` operations, each running in O(1) time.",
  examples: [{ input: 'MinStack minStack = new MinStack(); minStack.push(-2); minStack.push(0); minStack.push(-3); minStack.getMin(); minStack.pop(); minStack.top(); minStack.getMin();', output: "[-3, 0, -2]" }],
  constraints: ["-2³¹ ≤ val ≤ 2³¹-1", "Methods pop, top and getMin will be called on non-empty stacks.", "At most 3×10⁴ calls will be made to push, pop, top, and getMin."],
  functionSignature: "class MinStack:",
  starters: { Python: `class MinStack:\n    def __init__(self):\n        pass\n\n    def push(self, val: int) -> None:\n        pass\n\n    def pop(self) -> None:\n        pass\n\n    def top(self) -> int:\n        pass\n\n    def getMin(self) -> int:\n        pass\n`, JavaScript: `var MinStack = function() {\n    \n};\nMinStack.prototype.push = function(val) {\n};\nMinStack.prototype.pop = function() {\n};\nMinStack.prototype.top = function() {\n};\nMinStack.prototype.getMin = function() {\n};\n`, TypeScript: `class MinStack {\n    constructor() {}\n    push(val: number): void {}\n    pop(): void {}\n    top(): number { return 0; }\n    getMin(): number { return 0; }\n}\n`, Java: `class MinStack {\n    public MinStack() {}\n    public void push(int val) {}\n    public void pop() {}\n    public int top() { return 0; }\n    public int getMin() { return 0; }\n}\n`, "C++": `class MinStack {\npublic:\n    MinStack() {}\n    void push(int val) {}\n    void pop() {}\n    int top() { return 0; }\n    int getMin() { return 0; }\n};\n` },
  testCases: [
    { script: `ms=MinStack()\nms.push(-2)\nms.push(0)\nms.push(-3)\nprint(ms.getMin())`, expected: "-3", isPublic: true },
    { script: `ms=MinStack()\nms.push(-2)\nms.push(0)\nms.push(-3)\nms.pop()\nprint(ms.top())`, expected: "0", isPublic: true },
    { script: `ms=MinStack()\nms.push(5)\nprint(ms.getMin())`, expected: "5", isPublic: false },
    { script: `ms=MinStack()\nms.push(1)\nms.push(2)\nms.pop()\nprint(ms.getMin())`, expected: "1", isPublic: false },
  ],
},
// ── Evaluate Reverse Polish Notation ─────────────────────────────────────────
"Evaluate Reverse Polish Notation": {
  title: "Evaluate Reverse Polish Notation", difficulty: "Medium",
  desc: "You are given an array of strings `tokens` that represents an arithmetic expression in Reverse Polish Notation. Evaluate the expression and return the result as an integer. Valid operators are `+`, `-`, `*`, and `/`. Each operand may be an integer or another expression. Division truncates toward zero.",
  examples: [{ input: 'tokens = ["2","1","+","3","*"]', output: "9", explanation: "((2+1)*3) = 9" }, { input: 'tokens = ["4","13","5","/","+"]', output: "6" }],
  constraints: ["1 ≤ tokens.length ≤ 10⁴", "tokens[i] is either an operator (+, -, *, /) or an integer in the range [-200, 200]."],
  functionSignature: "def evalRPN(self, tokens: List[str]) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def evalRPN(self, tokens: List[str]) -> int:\n        pass\n`, JavaScript: `var evalRPN = function(tokens) {\n    \n};\n`, TypeScript: `function evalRPN(tokens: string[]): number {\n    \n};\n`, Java: `class Solution {\n    public int evalRPN(String[] tokens) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int evalRPN(vector<string>& tokens) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.evalRPN(["2","1","+","3","*"]))`, expected: "9", isPublic: true },
    { script: `sol=Solution()\nprint(sol.evalRPN(["4","13","5","/","+"]))`, expected: "6", isPublic: true },
    { script: `sol=Solution()\nprint(sol.evalRPN(["10","6","9","3","+","-11","*","/","*","17","+","5","+"]))`, expected: "22", isPublic: false },
    { script: `sol=Solution()\nprint(sol.evalRPN(["1"]))`, expected: "1", isPublic: false },
  ],
},
// ── Daily Temperatures ────────────────────────────────────────────────────────
"Daily Temperatures": {
  title: "Daily Temperatures", difficulty: "Medium",
  desc: "Given an array of integers `temperatures` representing the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`th day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.",
  examples: [{ input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]" }, { input: "temperatures = [30,40,50,60]", output: "[1,1,1,0]" }],
  constraints: ["1 ≤ temperatures.length ≤ 10⁵", "30 ≤ temperatures[i] ≤ 100"],
  functionSignature: "def dailyTemperatures(self, temperatures: List[int]) -> List[int]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:\n        pass\n`, JavaScript: `var dailyTemperatures = function(temperatures) {\n    \n};\n`, TypeScript: `function dailyTemperatures(temperatures: number[]): number[] {\n    \n};\n`, Java: `class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<int> dailyTemperatures(vector<int>& temperatures) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.dailyTemperatures([73,74,75,71,69,72,76,73]))`, expected: "[1, 1, 4, 2, 1, 1, 0, 0]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.dailyTemperatures([30,40,50,60]))`, expected: "[1, 1, 1, 0]", isPublic: true },
    { script: `sol=Solution()\nprint(sol.dailyTemperatures([30,60,90]))`, expected: "[1, 1, 0]", isPublic: false },
    { script: `sol=Solution()\nprint(sol.dailyTemperatures([70,70,70]))`, expected: "[0, 0, 0]", isPublic: false },
  ],
},
// ── Binary Tree Level Order Traversal ─────────────────────────────────────────
"Binary Tree Level Order Traversal": {
  title: "Binary Tree Level Order Traversal", difficulty: "Medium",
  desc: "Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
  examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" }, { input: "root = [1]", output: "[[1]]" }, { input: "root = []", output: "[]" }],
  constraints: ["The number of nodes in the tree is in the range [0, 2000].", "-1000 ≤ Node.val ≤ 1000"],
  functionSignature: "def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:",
  starters: { Python: `from typing import Optional, List\nfrom collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Solution:\n    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:\n        pass\n`, JavaScript: `var levelOrder = function(root) {\n    \n};\n`, TypeScript: `function levelOrder(root: TreeNode | null): number[][] {\n    \n};\n`, Java: `class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        \n    }\n};\n` },
  testCases: [
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.levelOrder(mk([3,9,20,None,None,15,7])))`, expected: "[[3], [9, 20], [15, 7]]", isPublic: true },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.levelOrder(mk([1])))`, expected: "[[1]]", isPublic: true },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\nsol=Solution()\nprint(sol.levelOrder(None))`, expected: "[]", isPublic: false },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.levelOrder(mk([1,2,3,4,5])))`, expected: "[[1], [2, 3], [4, 5]]", isPublic: false },
  ],
},
// ── Balanced Binary Tree ──────────────────────────────────────────────────────
"Balanced Binary Tree": {
  title: "Balanced Binary Tree", difficulty: "Easy",
  desc: "Given a binary tree, determine if it is height-balanced. A binary tree is height-balanced if for every node, the height difference between left and right subtrees is at most 1.",
  examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "true" }, { input: "root = [1,2,2,3,3,null,null,4,4]", output: "false" }, { input: "root = []", output: "true" }],
  constraints: ["The number of nodes is in the range [0, 5000].", "-10⁴ ≤ Node.val ≤ 10⁴"],
  functionSignature: "def isBalanced(self, root: Optional[TreeNode]) -> bool:",
  starters: { Python: `from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Solution:\n    def isBalanced(self, root: Optional[TreeNode]) -> bool:\n        pass\n`, JavaScript: `var isBalanced = function(root) {\n    \n};\n`, TypeScript: `function isBalanced(root: TreeNode | null): boolean {\n    \n};\n`, Java: `class Solution {\n    public boolean isBalanced(TreeNode root) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    bool isBalanced(TreeNode* root) {\n        \n    }\n};\n` },
  testCases: [
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.isBalanced(mk([3,9,20,None,None,15,7])))`, expected: "True", isPublic: true },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.isBalanced(mk([1,2,2,3,3,None,None,4,4])))`, expected: "False", isPublic: true },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\nsol=Solution()\nprint(sol.isBalanced(None))`, expected: "True", isPublic: false },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.isBalanced(mk([1,2,3])))`, expected: "True", isPublic: false },
  ],
},
// ── Same Tree ─────────────────────────────────────────────────────────────────
"Same Tree": {
  title: "Same Tree", difficulty: "Easy",
  desc: "Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.",
  examples: [{ input: "p = [1,2,3], q = [1,2,3]", output: "true" }, { input: "p = [1,2], q = [1,null,2]", output: "false" }, { input: "p = [1,2,1], q = [1,1,2]", output: "false" }],
  constraints: ["The number of nodes in both trees is in the range [0, 100].", "-10⁴ ≤ Node.val ≤ 10⁴"],
  functionSignature: "def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:",
  starters: { Python: `from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Solution:\n    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:\n        pass\n`, JavaScript: `var isSameTree = function(p, q) {\n    \n};\n`, TypeScript: `function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {\n    \n};\n`, Java: `class Solution {\n    public boolean isSameTree(TreeNode p, TreeNode q) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    bool isSameTree(TreeNode* p, TreeNode* q) {\n        \n    }\n};\n` },
  testCases: [
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.isSameTree(mk([1,2,3]),mk([1,2,3])))`, expected: "True", isPublic: true },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\nsol=Solution()\nprint(sol.isSameTree(None,None))`, expected: "True", isPublic: true },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.isSameTree(mk([1,2,1]),mk([1,1,2])))`, expected: "False", isPublic: false },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.isSameTree(mk([1,2]),mk([1,None,2])))`, expected: "False", isPublic: false },
  ],
},
// ── Diameter of Binary Tree ───────────────────────────────────────────────────
"Diameter of Binary Tree": {
  title: "Diameter of Binary Tree", difficulty: "Easy",
  desc: "Given the `root` of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes. This path may or may not pass through the root.",
  examples: [{ input: "root = [1,2,3,4,5]", output: "3", explanation: "The path [4,2,1,3] or [5,2,1,3] has length 3." }, { input: "root = [1,2]", output: "1" }],
  constraints: ["The number of nodes in the tree is in the range [1, 10⁴].", "-100 ≤ Node.val ≤ 100"],
  functionSignature: "def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:",
  starters: { Python: `from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Solution:\n    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:\n        pass\n`, JavaScript: `var diameterOfBinaryTree = function(root) {\n    \n};\n`, TypeScript: `function diameterOfBinaryTree(root: TreeNode | null): number {\n    \n};\n`, Java: `class Solution {\n    public int diameterOfBinaryTree(TreeNode root) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int diameterOfBinaryTree(TreeNode* root) {\n        \n    }\n};\n` },
  testCases: [
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.diameterOfBinaryTree(mk([1,2,3,4,5])))`, expected: "3", isPublic: true },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.diameterOfBinaryTree(mk([1,2])))`, expected: "1", isPublic: true },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.diameterOfBinaryTree(mk([1])))`, expected: "0", isPublic: false },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.diameterOfBinaryTree(mk([1,2,3,4,5,None,None,None,None,6])))`, expected: "4", isPublic: false },
  ],
},
// ── Permutations ──────────────────────────────────────────────────────────────
"Permutations": {
  title: "Permutations", difficulty: "Medium",
  desc: "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.",
  examples: [{ input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" }, { input: "nums = [0,1]", output: "[[0,1],[1,0]]" }, { input: "nums = [1]", output: "[[1]]" }],
  constraints: ["1 ≤ nums.length ≤ 6", "-10 ≤ nums[i] ≤ 10", "All the integers in nums are unique."],
  functionSignature: "def permute(self, nums: List[int]) -> List[List[int]]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def permute(self, nums: List[int]) -> List[List[int]]:\n        pass\n`, JavaScript: `var permute = function(nums) {\n    \n};\n`, TypeScript: `function permute(nums: number[]): number[][] {\n    \n};\n`, Java: `class Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<vector<int>> permute(vector<int>& nums) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nresult=sol.permute([1,2,3])\nprint(len(result), sorted([sorted(p) for p in result])[0])`, expected: "6 [1, 2, 3]", isPublic: true },
    { script: `sol=Solution()\nresult=sol.permute([0,1])\nprint(len(result))`, expected: "2", isPublic: true },
    { script: `sol=Solution()\nprint(sol.permute([1]))`, expected: "[[1]]", isPublic: false },
    { script: `sol=Solution()\nresult=sol.permute([1,2,3,4])\nprint(len(result))`, expected: "24", isPublic: false },
  ],
},
// ── Subsets ───────────────────────────────────────────────────────────────────
"Subsets": {
  title: "Subsets", difficulty: "Medium",
  desc: "Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.",
  examples: [{ input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" }, { input: "nums = [0]", output: "[[],[0]]" }],
  constraints: ["1 ≤ nums.length ≤ 10", "-10 ≤ nums[i] ≤ 10", "All the numbers of nums are unique."],
  functionSignature: "def subsets(self, nums: List[int]) -> List[List[int]]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def subsets(self, nums: List[int]) -> List[List[int]]:\n        pass\n`, JavaScript: `var subsets = function(nums) {\n    \n};\n`, TypeScript: `function subsets(nums: number[]): number[][] {\n    \n};\n`, Java: `class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nresult=sol.subsets([1,2,3])\nprint(len(result))`, expected: "8", isPublic: true },
    { script: `sol=Solution()\nresult=sol.subsets([0])\nprint(len(result))`, expected: "2", isPublic: true },
    { script: `sol=Solution()\nresult=sol.subsets([1,2])\nprint(sorted([sorted(s) for s in result]))`, expected: "[[], [1], [1, 2], [2]]", isPublic: false },
    { script: `sol=Solution()\nresult=sol.subsets([])\nprint(result)`, expected: "[[]]", isPublic: false },
  ],
},
// ── Combination Sum ───────────────────────────────────────────────────────────
"Combination Sum": {
  title: "Combination Sum", difficulty: "Medium",
  desc: "Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of candidates where the chosen numbers sum to target. The same number may be chosen from candidates an unlimited number of times.",
  examples: [{ input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]" }, { input: "candidates = [2,3,5], target = 8", output: "[[2,2,2,2],[2,3,3],[3,5]]" }],
  constraints: ["1 ≤ candidates.length ≤ 30", "2 ≤ candidates[i] ≤ 40", "All candidates are distinct.", "1 ≤ target ≤ 40"],
  functionSignature: "def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:\n        pass\n`, JavaScript: `var combinationSum = function(candidates, target) {\n    \n};\n`, TypeScript: `function combinationSum(candidates: number[], target: number): number[][] {\n    \n};\n`, Java: `class Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nresult=sol.combinationSum([2,3,6,7],7)\nprint(sorted([sorted(c) for c in result]))`, expected: "[[2, 2, 3], [7]]", isPublic: true },
    { script: `sol=Solution()\nresult=sol.combinationSum([2,3,5],8)\nprint(len(result))`, expected: "3", isPublic: true },
    { script: `sol=Solution()\nprint(sol.combinationSum([2],1))`, expected: "[]", isPublic: false },
    { script: `sol=Solution()\nresult=sol.combinationSum([1],4)\nprint(result)`, expected: "[[1, 1, 1, 1]]", isPublic: false },
  ],
},
// ── Generate Parentheses ──────────────────────────────────────────────────────
"Generate Parentheses": {
  title: "Generate Parentheses", difficulty: "Medium",
  desc: "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
  examples: [{ input: "n = 3", output: '["((()))","(()())","(())()","()(())","()()()"]' }, { input: "n = 1", output: '["()"]' }],
  constraints: ["1 ≤ n ≤ 8"],
  functionSignature: "def generateParenthesis(self, n: int) -> List[str]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def generateParenthesis(self, n: int) -> List[str]:\n        pass\n`, JavaScript: `var generateParenthesis = function(n) {\n    \n};\n`, TypeScript: `function generateParenthesis(n: number): string[] {\n    \n};\n`, Java: `class Solution {\n    public List<String> generateParenthesis(int n) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<string> generateParenthesis(int n) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sorted(sol.generateParenthesis(3)))`, expected: "['((()))', '(()())', '(())()', '()(())', '()()()']", isPublic: true },
    { script: `sol=Solution()\nprint(sol.generateParenthesis(1))`, expected: "['()']", isPublic: true },
    { script: `sol=Solution()\nprint(len(sol.generateParenthesis(4)))`, expected: "14", isPublic: false },
    { script: `sol=Solution()\nprint(sorted(sol.generateParenthesis(2)))`, expected: "['(())', '()()']", isPublic: false },
  ],
},
// ── Word Search ───────────────────────────────────────────────────────────────
"Word Search": {
  title: "Word Search", difficulty: "Medium",
  desc: "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same cell may not be used more than once.",
  examples: [{ input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: "true" }, { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', output: "true" }, { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"', output: "false" }],
  constraints: ["m == board.length", "n == board[i].length", "1 ≤ m, n ≤ 6", "1 ≤ word.length ≤ 15", "board and word consist of only uppercase English letters."],
  functionSignature: "def exist(self, board: List[List[str]], word: str) -> bool:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def exist(self, board: List[List[str]], word: str) -> bool:\n        pass\n`, JavaScript: `var exist = function(board, word) {\n    \n};\n`, TypeScript: `function exist(board: string[][], word: string): boolean {\n    \n};\n`, Java: `class Solution {\n    public boolean exist(char[][] board, String word) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    bool exist(vector<vector<char>>& board, string word) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"ABCCED"))`, expected: "True", isPublic: true },
    { script: `sol=Solution()\nprint(sol.exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"SEE"))`, expected: "True", isPublic: true },
    { script: `sol=Solution()\nprint(sol.exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"ABCB"))`, expected: "False", isPublic: false },
    { script: `sol=Solution()\nprint(sol.exist([["a"]],"a"))`, expected: "True", isPublic: false },
  ],
},
// ── Linked List Cycle ─────────────────────────────────────────────────────────
"Linked List Cycle": {
  title: "Linked List Cycle", difficulty: "Easy",
  desc: "Given `head`, the head of a linked list, determine if the linked list has a cycle in it. Return `true` if there is a cycle in the linked list, otherwise return `false`. There is a cycle if there is some node in the list that can be reached again by continuously following the `next` pointer.",
  examples: [{ input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "Tail connects to node at index 1." }, { input: "head = [1,2], pos = 0", output: "true" }, { input: "head = [1], pos = -1", output: "false" }],
  constraints: ["The number of nodes is in the range [0, 10⁴].", "-10⁵ ≤ Node.val ≤ 10⁵"],
  functionSignature: "def hasCycle(self, head: Optional[ListNode]) -> bool:",
  starters: { Python: `from typing import Optional\n\nclass ListNode:\n    def __init__(self, x):\n        self.val = x\n        self.next = None\n\nclass Solution:\n    def hasCycle(self, head: Optional[ListNode]) -> bool:\n        pass\n`, JavaScript: `var hasCycle = function(head) {\n    \n};\n`, TypeScript: `function hasCycle(head: ListNode | null): boolean {\n    \n};\n`, Java: `public class Solution {\n    public boolean hasCycle(ListNode head) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        \n    }\n};\n` },
  testCases: [
    { script: `class ListNode:\n    def __init__(self,x): self.val=x; self.next=None\nnode1=ListNode(3); node2=ListNode(2); node3=ListNode(0); node4=ListNode(-4)\nnode1.next=node2; node2.next=node3; node3.next=node4; node4.next=node2\nsol=Solution()\nprint(sol.hasCycle(node1))`, expected: "True", isPublic: true },
    { script: `class ListNode:\n    def __init__(self,x): self.val=x; self.next=None\nnode=ListNode(1)\nsol=Solution()\nprint(sol.hasCycle(node))`, expected: "False", isPublic: true },
    { script: `class ListNode:\n    def __init__(self,x): self.val=x; self.next=None\nsol=Solution()\nprint(sol.hasCycle(None))`, expected: "False", isPublic: false },
    { script: `class ListNode:\n    def __init__(self,x): self.val=x; self.next=None\nn1=ListNode(1); n2=ListNode(2); n1.next=n2; n2.next=n1\nsol=Solution()\nprint(sol.hasCycle(n1))`, expected: "True", isPublic: false },
  ],
},
// ── Middle of Linked List ─────────────────────────────────────────────────────
"Middle of Linked List": {
  title: "Middle of Linked List", difficulty: "Easy",
  desc: "Given the `head` of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.",
  examples: [{ input: "head = [1,2,3,4,5]", output: "[3,4,5]", explanation: "The middle node is 3." }, { input: "head = [1,2,3,4,5,6]", output: "[4,5,6]", explanation: "The second middle node is 4." }],
  constraints: ["The number of nodes in the list is in the range [1, 100].", "1 ≤ Node.val ≤ 100"],
  functionSignature: "def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:",
  starters: { Python: `from typing import Optional\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\nclass Solution:\n    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        pass\n`, JavaScript: `var middleNode = function(head) {\n    \n};\n`, TypeScript: `function middleNode(head: ListNode | null): ListNode | null {\n    \n};\n`, Java: `class Solution {\n    public ListNode middleNode(ListNode head) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    ListNode* middleNode(ListNode* head) {\n        \n    }\n};\n` },
  testCases: [
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.middleNode(mk([1,2,3,4,5]))))`, expected: "[3, 4, 5]", isPublic: true },
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.middleNode(mk([1,2,3,4,5,6]))))`, expected: "[4, 5, 6]", isPublic: true },
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\nsol=Solution()\nnode=ListNode(1)\nprint(sol.middleNode(node).val)`, expected: "1", isPublic: false },
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\nsol=Solution()\nprint(sol.middleNode(mk([1,2])).val)`, expected: "2", isPublic: false },
  ],
},
// ── Remove Nth Node From End ──────────────────────────────────────────────────
"Remove Nth Node From End": {
  title: "Remove Nth Node From End", difficulty: "Medium",
  desc: "Given the `head` of a linked list, remove the `n`th node from the end of the list and return its head.",
  examples: [{ input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" }, { input: "head = [1], n = 1", output: "[]" }, { input: "head = [1,2], n = 1", output: "[1]" }],
  constraints: ["The number of nodes is sz.", "1 ≤ sz ≤ 30", "0 ≤ Node.val ≤ 100", "1 ≤ n ≤ sz"],
  functionSignature: "def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:",
  starters: { Python: `from typing import Optional\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\nclass Solution:\n    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:\n        pass\n`, JavaScript: `var removeNthFromEnd = function(head, n) {\n    \n};\n`, TypeScript: `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {\n    \n};\n`, Java: `class Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    ListNode* removeNthFromEnd(ListNode* head, int n) {\n        \n    }\n};\n` },
  testCases: [
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.removeNthFromEnd(mk([1,2,3,4,5]),2)))`, expected: "[1, 2, 3, 5]", isPublic: true },
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.removeNthFromEnd(mk([1,2]),1)))`, expected: "[1]", isPublic: true },
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.removeNthFromEnd(ListNode(1),1)))`, expected: "[]", isPublic: false },
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.removeNthFromEnd(mk([1,2,3]),3)))`, expected: "[2, 3]", isPublic: false },
  ],
},
// ── K Closest Points to Origin ────────────────────────────────────────────────
"K Closest Points to Origin": {
  title: "K Closest Points to Origin", difficulty: "Medium",
  desc: "Given an array of `points` where `points[i] = [xi, yi]` represents a point on the X-Y plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`. The distance is the Euclidean distance. You may return the answer in any order.",
  examples: [{ input: "points = [[1,3],[-2,2]], k = 1", output: "[[-2,2]]", explanation: "Distance of [1,3] is sqrt(10), distance of [-2,2] is sqrt(8). Closer is [-2,2]." }, { input: "points = [[3,3],[5,-1],[-2,4]], k = 2", output: "[[3,3],[-2,4]]" }],
  constraints: ["1 ≤ k ≤ points.length ≤ 10⁴", "-10⁴ < xi, yi < 10⁴"],
  functionSignature: "def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:\n        pass\n`, JavaScript: `var kClosest = function(points, k) {\n    \n};\n`, TypeScript: `function kClosest(points: number[][], k: number): number[][] {\n    \n};\n`, Java: `class Solution {\n    public int[][] kClosest(int[][] points, int k) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nresult=sol.kClosest([[1,3],[-2,2]],1)\nprint(result)`, expected: "[[-2, 2]]", isPublic: true },
    { script: `sol=Solution()\nresult=sorted(sol.kClosest([[3,3],[5,-1],[-2,4]],2))\nprint(result)`, expected: "[[-2, 4], [3, 3]]", isPublic: true },
    { script: `sol=Solution()\nresult=sol.kClosest([[1,1]],1)\nprint(result)`, expected: "[[1, 1]]", isPublic: false },
    { script: `sol=Solution()\nresult=sol.kClosest([[0,1],[1,0]],2)\nprint(len(result))`, expected: "2", isPublic: false },
  ],
},
// ── Task Scheduler ────────────────────────────────────────────────────────────
"Task Scheduler": {
  title: "Task Scheduler", difficulty: "Medium",
  desc: "Given a characters array `tasks` representing the tasks a CPU needs to do, where each task is uniquely represented by a letter, and a non-negative integer `n` representing the cooldown interval between two same tasks. The CPU can be idle or do a task. Return the minimum number of intervals the CPU will take to finish all the tasks.",
  examples: [{ input: 'tasks = ["A","A","A","B","B","B"], n = 2', output: "8", explanation: "A -> B -> idle -> A -> B -> idle -> A -> B." }, { input: 'tasks = ["A","A","A","B","B","B"], n = 0', output: "6" }],
  constraints: ["1 ≤ task.length ≤ 10⁴", "tasks[i] is upper-case English letters.", "0 ≤ n ≤ 100"],
  functionSignature: "def leastInterval(self, tasks: List[str], n: int) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def leastInterval(self, tasks: List[str], n: int) -> int:\n        pass\n`, JavaScript: `var leastInterval = function(tasks, n) {\n    \n};\n`, TypeScript: `function leastInterval(tasks: string[], n: number): number {\n    \n};\n`, Java: `class Solution {\n    public int leastInterval(char[] tasks, int n) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int leastInterval(vector<char>& tasks, int n) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.leastInterval(["A","A","A","B","B","B"],2))`, expected: "8", isPublic: true },
    { script: `sol=Solution()\nprint(sol.leastInterval(["A","A","A","B","B","B"],0))`, expected: "6", isPublic: true },
    { script: `sol=Solution()\nprint(sol.leastInterval(["A"],0))`, expected: "1", isPublic: false },
    { script: `sol=Solution()\nprint(sol.leastInterval(["A","A","A","A","A","A","B","C","D","E","F","G"],2))`, expected: "16", isPublic: false },
  ],
},
// ── Number of Provinces ───────────────────────────────────────────────────────
"Number of Provinces": {
  title: "Number of Provinces", difficulty: "Medium",
  desc: "There are `n` cities. Some of them are connected. If city `a` is directly connected to city `b`, and city `b` is directly connected to city `c`, then city `a` is indirectly connected to city `c`. A province is a group of directly or indirectly connected cities. You are given an `n x n` matrix `isConnected` where `isConnected[i][j] = 1` if cities `i` and `j` are directly connected. Return the total number of provinces.",
  examples: [{ input: "isConnected = [[1,1,0],[1,1,0],[0,0,1]]", output: "2" }, { input: "isConnected = [[1,0,0],[0,1,0],[0,0,1]]", output: "3" }],
  constraints: ["1 ≤ n ≤ 200", "n == isConnected.length", "n == isConnected[i].length", "isConnected[i][j] is 1 or 0.", "isConnected[i][i] == 1", "isConnected[i][j] == isConnected[j][i]"],
  functionSignature: "def findCircleNum(self, isConnected: List[List[int]]) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def findCircleNum(self, isConnected: List[List[int]]) -> int:\n        pass\n`, JavaScript: `var findCircleNum = function(isConnected) {\n    \n};\n`, TypeScript: `function findCircleNum(isConnected: number[][]): number {\n    \n};\n`, Java: `class Solution {\n    public int findCircleNum(int[][] isConnected) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int findCircleNum(vector<vector<int>>& isConnected) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.findCircleNum([[1,1,0],[1,1,0],[0,0,1]]))`, expected: "2", isPublic: true },
    { script: `sol=Solution()\nprint(sol.findCircleNum([[1,0,0],[0,1,0],[0,0,1]]))`, expected: "3", isPublic: true },
    { script: `sol=Solution()\nprint(sol.findCircleNum([[1,1,1],[1,1,1],[1,1,1]]))`, expected: "1", isPublic: false },
    { script: `sol=Solution()\nprint(sol.findCircleNum([[1]]))`, expected: "1", isPublic: false },
  ],
},
// ── Max Area of Island ─────────────────────────────────────────────────────────
"Max Area of Island": {
  title: "Max Area of Island", difficulty: "Medium",
  desc: "You are given an `m x n` binary matrix `grid`. An island is a group of `1`s (land) connected 4-directionally. The area of an island is the number of cells with value `1` in the island. Return the maximum area of an island in `grid`. If there is no island, return `0`.",
  examples: [{ input: "grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]", output: "6" }, { input: "grid = [[0,0,0,0,0,0,0,0]]", output: "0" }],
  constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 50", "grid[i][j] is either 0 or 1."],
  functionSignature: "def maxAreaOfIsland(self, grid: List[List[int]]) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:\n        pass\n`, JavaScript: `var maxAreaOfIsland = function(grid) {\n    \n};\n`, TypeScript: `function maxAreaOfIsland(grid: number[][]): number {\n    \n};\n`, Java: `class Solution {\n    public int maxAreaOfIsland(int[][] grid) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int maxAreaOfIsland(vector<vector<int>>& grid) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.maxAreaOfIsland([[0,0,1,0],[0,0,1,0],[0,1,1,0],[0,0,0,0]]))`, expected: "4", isPublic: true },
    { script: `sol=Solution()\nprint(sol.maxAreaOfIsland([[0,0,0,0,0,0,0,0]]))`, expected: "0", isPublic: true },
    { script: `sol=Solution()\nprint(sol.maxAreaOfIsland([[1]]))`, expected: "1", isPublic: false },
    { script: `sol=Solution()\nprint(sol.maxAreaOfIsland([[1,1],[1,0]]))`, expected: "3", isPublic: false },
  ],
},
// ── Course Schedule II ─────────────────────────────────────────────────────────
"Course Schedule II": {
  title: "Course Schedule II", difficulty: "Medium",
  desc: "There are `numCourses` courses to take, labeled `0` to `numCourses-1`. You are given `prerequisites` where `prerequisites[i] = [ai, bi]` means you must take `bi` before `ai`. Return the ordering of courses you should take to finish all courses. If it is impossible, return an empty array.",
  examples: [{ input: "numCourses = 2, prerequisites = [[1,0]]", output: "[0,1]" }, { input: "numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]", output: "[0,2,1,3]" }, { input: "numCourses = 1, prerequisites = []", output: "[0]" }],
  constraints: ["1 ≤ numCourses ≤ 2000", "0 ≤ prerequisites.length ≤ numCourses × (numCourses - 1)"],
  functionSignature: "def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:\n        pass\n`, JavaScript: `var findOrder = function(numCourses, prerequisites) {\n    \n};\n`, TypeScript: `function findOrder(numCourses: number, prerequisites: number[][]): number[] {\n    \n};\n`, Java: `class Solution {\n    public int[] findOrder(int numCourses, int[][] prerequisites) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nresult=sol.findOrder(2,[[1,0]])\nprint(result==[0,1] or result==[1,0] and False)`, expected: "True", isPublic: true },
    { script: `sol=Solution()\nresult=sol.findOrder(2,[[1,0],[0,1]])\nprint(result)`, expected: "[]", isPublic: true },
    { script: `sol=Solution()\nresult=sol.findOrder(1,[])\nprint(result)`, expected: "[0]", isPublic: false },
    { script: `sol=Solution()\nresult=sol.findOrder(2,[[1,0]])\nprint(len(result)==2)`, expected: "True", isPublic: false },
  ],
},
// ── Validate Binary Search Tree ───────────────────────────────────────────────
"Validate Binary Search Tree": {
  title: "Validate Binary Search Tree", difficulty: "Medium",
  desc: "Given the `root` of a binary tree, determine if it is a valid binary search tree (BST). A valid BST has: every node's value greater than all values in its left subtree, every node's value less than all values in its right subtree, and both subtrees are also BSTs.",
  examples: [{ input: "root = [2,1,3]", output: "true" }, { input: "root = [5,1,4,null,null,3,6]", output: "false", explanation: "Root is 5, but right child is 4 which is < 5." }],
  constraints: ["The number of nodes is in the range [1, 10⁴].", "-2³¹ ≤ Node.val ≤ 2³¹-1"],
  functionSignature: "def isValidBST(self, root: Optional[TreeNode]) -> bool:",
  starters: { Python: `from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Solution:\n    def isValidBST(self, root: Optional[TreeNode]) -> bool:\n        pass\n`, JavaScript: `var isValidBST = function(root) {\n    \n};\n`, TypeScript: `function isValidBST(root: TreeNode | null): boolean {\n    \n};\n`, Java: `class Solution {\n    public boolean isValidBST(TreeNode root) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    bool isValidBST(TreeNode* root) {\n        \n    }\n};\n` },
  testCases: [
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.isValidBST(mk([2,1,3])))`, expected: "True", isPublic: true },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.isValidBST(mk([5,1,4,None,None,3,6])))`, expected: "False", isPublic: true },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\nsol=Solution()\nprint(sol.isValidBST(TreeNode(1)))`, expected: "True", isPublic: false },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.isValidBST(mk([5,4,6,None,None,3,7])))`, expected: "False", isPublic: false },
  ],
},
// ── Kth Largest Element in Array ──────────────────────────────────────────────
"Kth Largest Element in Array": {
  title: "Kth Largest Element in Array", difficulty: "Medium",
  desc: "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array. Note that it is the `k`th largest element in the sorted order, not the `k`th distinct element.",
  examples: [{ input: "nums = [3,2,1,5,6,4], k = 2", output: "5" }, { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4" }],
  constraints: ["1 ≤ k ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
  functionSignature: "def findKthLargest(self, nums: List[int], k: int) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def findKthLargest(self, nums: List[int], k: int) -> int:\n        pass\n`, JavaScript: `var findKthLargest = function(nums, k) {\n    \n};\n`, TypeScript: `function findKthLargest(nums: number[], k: number): number {\n    \n};\n`, Java: `class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.findKthLargest([3,2,1,5,6,4],2))`, expected: "5", isPublic: true },
    { script: `sol=Solution()\nprint(sol.findKthLargest([3,2,3,1,2,4,5,5,6],4))`, expected: "4", isPublic: true },
    { script: `sol=Solution()\nprint(sol.findKthLargest([1],1))`, expected: "1", isPublic: false },
    { script: `sol=Solution()\nprint(sol.findKthLargest([7,6,5,4,3,2,1],2))`, expected: "6", isPublic: false },
  ],
},
// ── Longest Palindromic Substring ─────────────────────────────────────────────
"Longest Palindromic Substring": {
  title: "Longest Palindromic Substring", difficulty: "Medium",
  desc: "Given a string `s`, return the longest palindromic substring in `s`.",
  examples: [{ input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' }, { input: 's = "cbbd"', output: '"bb"' }],
  constraints: ["1 ≤ s.length ≤ 1000", "s consist of only digits and English letters."],
  functionSignature: "def longestPalindrome(self, s: str) -> str:",
  starters: { Python: `class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        pass\n`, JavaScript: `var longestPalindrome = function(s) {\n    \n};\n`, TypeScript: `function longestPalindrome(s: string): string {\n    \n};\n`, Java: `class Solution {\n    public String longestPalindrome(String s) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    string longestPalindrome(string s) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nresult=sol.longestPalindrome("babad")\nprint(result in ["bab","aba"])`, expected: "True", isPublic: true },
    { script: `sol=Solution()\nprint(sol.longestPalindrome("cbbd"))`, expected: "bb", isPublic: true },
    { script: `sol=Solution()\nprint(sol.longestPalindrome("a"))`, expected: "a", isPublic: false },
    { script: `sol=Solution()\nresult=sol.longestPalindrome("racecar")\nprint(result)`, expected: "racecar", isPublic: false },
  ],
},
// ── Longest Repeating Character Replacement ───────────────────────────────────
"Longest Repeating Character Replacement": {
  title: "Longest Repeating Character Replacement", difficulty: "Medium",
  desc: "You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character, and you can perform this operation at most `k` times. Return the length of the longest substring containing the same letter you can get after performing the above operations.",
  examples: [{ input: 's = "ABAB", k = 2', output: "4", explanation: 'Replace two "A"s with "B"s or vice versa.' }, { input: 's = "AABABBA", k = 1', output: "4" }],
  constraints: ["1 ≤ s.length ≤ 10⁵", "s consists of only uppercase English letters.", "0 ≤ k ≤ s.length"],
  functionSignature: "def characterReplacement(self, s: str, k: int) -> int:",
  starters: { Python: `class Solution:\n    def characterReplacement(self, s: str, k: int) -> int:\n        pass\n`, JavaScript: `var characterReplacement = function(s, k) {\n    \n};\n`, TypeScript: `function characterReplacement(s: string, k: number): number {\n    \n};\n`, Java: `class Solution {\n    public int characterReplacement(String s, int k) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int characterReplacement(string s, int k) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.characterReplacement("ABAB",2))`, expected: "4", isPublic: true },
    { script: `sol=Solution()\nprint(sol.characterReplacement("AABABBA",1))`, expected: "4", isPublic: true },
    { script: `sol=Solution()\nprint(sol.characterReplacement("AAAA",2))`, expected: "4", isPublic: false },
    { script: `sol=Solution()\nprint(sol.characterReplacement("ABCDE",1))`, expected: "2", isPublic: false },
  ],
},
// ── Find Pivot Index ──────────────────────────────────────────────────────────
"Find Pivot Index": {
  title: "Find Pivot Index", difficulty: "Easy",
  desc: "Given an array of integers `nums`, calculate the pivot index of this array. The pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right. Return the leftmost pivot index, or `-1` if no such index exists.",
  examples: [{ input: "nums = [1,7,3,6,5,6]", output: "3", explanation: "Left sum = 1+7+3 = 11, right sum = 5+6 = 11." }, { input: "nums = [1,2,3]", output: "-1" }, { input: "nums = [2,1,-1]", output: "0" }],
  constraints: ["1 ≤ nums.length ≤ 10⁴", "-1000 ≤ nums[i] ≤ 1000"],
  functionSignature: "def pivotIndex(self, nums: List[int]) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def pivotIndex(self, nums: List[int]) -> int:\n        pass\n`, JavaScript: `var pivotIndex = function(nums) {\n    \n};\n`, TypeScript: `function pivotIndex(nums: number[]): number {\n    \n};\n`, Java: `class Solution {\n    public int pivotIndex(int[] nums) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int pivotIndex(vector<int>& nums) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.pivotIndex([1,7,3,6,5,6]))`, expected: "3", isPublic: true },
    { script: `sol=Solution()\nprint(sol.pivotIndex([1,2,3]))`, expected: "-1", isPublic: true },
    { script: `sol=Solution()\nprint(sol.pivotIndex([2,1,-1]))`, expected: "0", isPublic: false },
    { script: `sol=Solution()\nprint(sol.pivotIndex([-1,-1,-1,-1,-1,0]))`, expected: "2", isPublic: false },
  ],
},
// ── Maximum Average Subarray I ────────────────────────────────────────────────
"Maximum Average Subarray I": {
  title: "Maximum Average Subarray I", difficulty: "Easy",
  desc: "You are given an integer array `nums` consisting of `n` elements, and an integer `k`. Find a contiguous subarray of length `k` that has the maximum average value and return this value. Any answer with a calculation error less than 10⁻⁵ will be accepted.",
  examples: [{ input: "nums = [1,12,-5,-6,50,3], k = 4", output: "12.75000", explanation: "Maximum average is (12-5-6+50)/4 = 51/4 = 12.75." }, { input: "nums = [5], k = 1", output: "5.00000" }],
  constraints: ["n == nums.length", "1 ≤ k ≤ n ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
  functionSignature: "def findMaxAverage(self, nums: List[int], k: int) -> float:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def findMaxAverage(self, nums: List[int], k: int) -> float:\n        pass\n`, JavaScript: `var findMaxAverage = function(nums, k) {\n    \n};\n`, TypeScript: `function findMaxAverage(nums: number[], k: number): number {\n    \n};\n`, Java: `class Solution {\n    public double findMaxAverage(int[] nums, int k) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    double findMaxAverage(vector<int>& nums, int k) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(round(sol.findMaxAverage([1,12,-5,-6,50,3],4),5))`, expected: "12.75", isPublic: true },
    { script: `sol=Solution()\nprint(sol.findMaxAverage([5],1))`, expected: "5.0", isPublic: true },
    { script: `sol=Solution()\nprint(sol.findMaxAverage([0,4,0,3,2],1))`, expected: "4.0", isPublic: false },
    { script: `sol=Solution()\nprint(sol.findMaxAverage([3,3],2))`, expected: "3.0", isPublic: false },
  ],
},
// ── Max Consecutive Ones III ──────────────────────────────────────────────────
"Max Consecutive Ones III": {
  title: "Max Consecutive Ones III", difficulty: "Medium",
  desc: "Given a binary array `nums` and an integer `k`, return the maximum number of consecutive `1`s in the array if you can flip at most `k` `0`s.",
  examples: [{ input: "nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2", output: "6" }, { input: "nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3", output: "10" }],
  constraints: ["1 ≤ nums.length ≤ 10⁵", "nums[i] is either 0 or 1.", "0 ≤ k ≤ nums.length"],
  functionSignature: "def longestOnes(self, nums: List[int], k: int) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def longestOnes(self, nums: List[int], k: int) -> int:\n        pass\n`, JavaScript: `var longestOnes = function(nums, k) {\n    \n};\n`, TypeScript: `function longestOnes(nums: number[], k: number): number {\n    \n};\n`, Java: `class Solution {\n    public int longestOnes(int[] nums, int k) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int longestOnes(vector<int>& nums, int k) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.longestOnes([1,1,1,0,0,0,1,1,1,1,0],2))`, expected: "6", isPublic: true },
    { script: `sol=Solution()\nprint(sol.longestOnes([0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1],3))`, expected: "10", isPublic: true },
    { script: `sol=Solution()\nprint(sol.longestOnes([1,1,1],0))`, expected: "3", isPublic: false },
    { script: `sol=Solution()\nprint(sol.longestOnes([0,0,0],2))`, expected: "2", isPublic: false },
  ],
},
// ── Subarray Sums Divisible by K ──────────────────────────────────────────────
"Subarray Sums Divisible by K": {
  title: "Subarray Sums Divisible by K", difficulty: "Medium",
  desc: "Given an integer array `nums` and an integer `k`, return the number of non-empty subarrays that have a sum divisible by `k`.",
  examples: [{ input: "nums = [4,5,0,-2,-3,1], k = 5", output: "7" }, { input: "nums = [5], k = 9", output: "0" }],
  constraints: ["1 ≤ nums.length ≤ 3×10⁴", "-10⁴ ≤ nums[i] ≤ 10⁴", "2 ≤ k ≤ 10⁴"],
  functionSignature: "def subarraysDivByK(self, nums: List[int], k: int) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def subarraysDivByK(self, nums: List[int], k: int) -> int:\n        pass\n`, JavaScript: `var subarraysDivByK = function(nums, k) {\n    \n};\n`, TypeScript: `function subarraysDivByK(nums: number[], k: number): number {\n    \n};\n`, Java: `class Solution {\n    public int subarraysDivByK(int[] nums, int k) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int subarraysDivByK(vector<int>& nums, int k) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.subarraysDivByK([4,5,0,-2,-3,1],5))`, expected: "7", isPublic: true },
    { script: `sol=Solution()\nprint(sol.subarraysDivByK([5],9))`, expected: "0", isPublic: true },
    { script: `sol=Solution()\nprint(sol.subarraysDivByK([1,2,3],3))`, expected: "3", isPublic: false },
    { script: `sol=Solution()\nprint(sol.subarraysDivByK([0],1))`, expected: "1", isPublic: false },
  ],
},
// ── Boats to Save People ──────────────────────────────────────────────────────
"Boats to Save People": {
  title: "Boats to Save People", difficulty: "Medium",
  desc: "You are given an array `people` where `people[i]` is the weight of the `i`th person, and an infinite number of boats where each boat can carry a maximum weight of `limit`. Each boat carries at most two people at the same time. Return the minimum number of boats to carry every given person.",
  examples: [{ input: "people = [1,2], limit = 3", output: "1", explanation: "1 boat: [1, 2]." }, { input: "people = [3,2,2,1], limit = 3", output: "3" }, { input: "people = [3,5,3,4], limit = 5", output: "4" }],
  constraints: ["1 ≤ people.length ≤ 5×10⁴", "1 ≤ people[i] ≤ limit ≤ 3×10⁴"],
  functionSignature: "def numRescueBoats(self, people: List[int], limit: int) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def numRescueBoats(self, people: List[int], limit: int) -> int:\n        pass\n`, JavaScript: `var numRescueBoats = function(people, limit) {\n    \n};\n`, TypeScript: `function numRescueBoats(people: number[], limit: number): number {\n    \n};\n`, Java: `class Solution {\n    public int numRescueBoats(int[] people, int limit) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int numRescueBoats(vector<int>& people, int limit) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.numRescueBoats([1,2],3))`, expected: "1", isPublic: true },
    { script: `sol=Solution()\nprint(sol.numRescueBoats([3,2,2,1],3))`, expected: "3", isPublic: true },
    { script: `sol=Solution()\nprint(sol.numRescueBoats([3,5,3,4],5))`, expected: "4", isPublic: false },
    { script: `sol=Solution()\nprint(sol.numRescueBoats([2,2,2,2,2],6))`, expected: "3", isPublic: false },
  ],
},
// ── 3Sum Closest ──────────────────────────────────────────────────────────────
"3Sum Closest": {
  title: "3Sum Closest", difficulty: "Medium",
  desc: "Given an integer array `nums` of length `n` and an integer `target`, find three integers in `nums` such that the sum is closest to `target`. Return the sum of the three integers.",
  examples: [{ input: "nums = [-1,2,1,-4], target = 1", output: "2", explanation: "The sum that is closest to 1 is 2 (-1 + 2 + 1 = 2)." }, { input: "nums = [0,0,0], target = 1", output: "0" }],
  constraints: ["3 ≤ nums.length ≤ 500", "-1000 ≤ nums[i] ≤ 1000", "-10⁴ ≤ target ≤ 10⁴"],
  functionSignature: "def threeSumClosest(self, nums: List[int], target: int) -> int:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def threeSumClosest(self, nums: List[int], target: int) -> int:\n        pass\n`, JavaScript: `var threeSumClosest = function(nums, target) {\n    \n};\n`, TypeScript: `function threeSumClosest(nums: number[], target: number): number {\n    \n};\n`, Java: `class Solution {\n    public int threeSumClosest(int[] nums, int target) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    int threeSumClosest(vector<int>& nums, int target) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.threeSumClosest([-1,2,1,-4],1))`, expected: "2", isPublic: true },
    { script: `sol=Solution()\nprint(sol.threeSumClosest([0,0,0],1))`, expected: "0", isPublic: true },
    { script: `sol=Solution()\nprint(sol.threeSumClosest([1,1,1,0],-100))`, expected: "2", isPublic: false },
    { script: `sol=Solution()\nprint(sol.threeSumClosest([1,2,5,10,11],12))`, expected: "12", isPublic: false },
  ],
},
// ── Ransom Note ───────────────────────────────────────────────────────────────
"Ransom Note": {
  title: "Ransom Note", difficulty: "Easy",
  desc: "Given two strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be constructed by using the letters from `magazine` and `false` otherwise. Each letter in `magazine` can only be used once.",
  examples: [{ input: 'ransomNote = "a", magazine = "b"', output: "false" }, { input: 'ransomNote = "aa", magazine = "ab"', output: "false" }, { input: 'ransomNote = "aa", magazine = "aab"', output: "true" }],
  constraints: ["1 ≤ ransomNote.length, magazine.length ≤ 10⁵", "ransomNote and magazine consist of lowercase English letters."],
  functionSignature: "def canConstruct(self, ransomNote: str, magazine: str) -> bool:",
  starters: { Python: `class Solution:\n    def canConstruct(self, ransomNote: str, magazine: str) -> bool:\n        pass\n`, JavaScript: `var canConstruct = function(ransomNote, magazine) {\n    \n};\n`, TypeScript: `function canConstruct(ransomNote: string, magazine: string): boolean {\n    \n};\n`, Java: `class Solution {\n    public boolean canConstruct(String ransomNote, String magazine) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    bool canConstruct(string ransomNote, string magazine) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.canConstruct("a","b"))`, expected: "False", isPublic: true },
    { script: `sol=Solution()\nprint(sol.canConstruct("aa","aab"))`, expected: "True", isPublic: true },
    { script: `sol=Solution()\nprint(sol.canConstruct("aa","ab"))`, expected: "False", isPublic: false },
    { script: `sol=Solution()\nprint(sol.canConstruct("bg","efjbdfbdgfjhhaiigfhbaejahgfbbgbjagghbjagbhfe"))`, expected: "True", isPublic: false },
  ],
},
// ── Palindrome Linked List ────────────────────────────────────────────────────
"Palindrome Linked List": {
  title: "Palindrome Linked List", difficulty: "Easy",
  desc: "Given the `head` of a singly linked list, return `true` if it is a palindrome or `false` otherwise.",
  examples: [{ input: "head = [1,2,2,1]", output: "true" }, { input: "head = [1,2]", output: "false" }],
  constraints: ["The number of nodes in the list is in the range [1, 10⁵].", "0 ≤ Node.val ≤ 9"],
  functionSignature: "def isPalindrome(self, head: Optional[ListNode]) -> bool:",
  starters: { Python: `from typing import Optional\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\nclass Solution:\n    def isPalindrome(self, head: Optional[ListNode]) -> bool:\n        pass\n`, JavaScript: `var isPalindrome = function(head) {\n    \n};\n`, TypeScript: `function isPalindrome(head: ListNode | null): boolean {\n    \n};\n`, Java: `class Solution {\n    public boolean isPalindrome(ListNode head) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    bool isPalindrome(ListNode* head) {\n        \n    }\n};\n` },
  testCases: [
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\nsol=Solution()\nprint(sol.isPalindrome(mk([1,2,2,1])))`, expected: "True", isPublic: true },
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\nsol=Solution()\nprint(sol.isPalindrome(mk([1,2])))`, expected: "False", isPublic: true },
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\nsol=Solution()\nprint(sol.isPalindrome(ListNode(1)))`, expected: "True", isPublic: false },
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\nsol=Solution()\nprint(sol.isPalindrome(mk([1,2,3,2,1])))`, expected: "True", isPublic: false },
  ],
},
// ── Add Two Numbers ───────────────────────────────────────────────────────────
"Add Two Numbers": {
  title: "Add Two Numbers", difficulty: "Medium",
  desc: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each node contains a single digit. Add the two numbers and return the sum as a linked list.",
  examples: [{ input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]", explanation: "342 + 465 = 807." }, { input: "l1 = [0], l2 = [0]", output: "[0]" }, { input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]", output: "[8,9,9,9,0,0,0,1]" }],
  constraints: ["The number of nodes in each linked list is in the range [1, 100].", "0 ≤ Node.val ≤ 9", "It is guaranteed that the list represents a number that does not have leading zeros."],
  functionSignature: "def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:",
  starters: { Python: `from typing import Optional\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\nclass Solution:\n    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:\n        pass\n`, JavaScript: `var addTwoNumbers = function(l1, l2) {\n    \n};\n`, TypeScript: `function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {\n    \n};\n`, Java: `class Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n        \n    }\n};\n` },
  testCases: [
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.addTwoNumbers(mk([2,4,3]),mk([5,6,4]))))`, expected: "[7, 0, 8]", isPublic: true },
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.addTwoNumbers(mk([0]),mk([0]))))`, expected: "[0]", isPublic: true },
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.addTwoNumbers(mk([9,9,9,9,9,9,9]),mk([9,9,9,9]))))`, expected: "[8, 9, 9, 9, 0, 0, 0, 1]", isPublic: false },
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.addTwoNumbers(mk([5]),mk([5]))))`, expected: "[0, 1]", isPublic: false },
  ],
},
// ── Sort List ─────────────────────────────────────────────────────────────────
"Sort List": {
  title: "Sort List", difficulty: "Medium",
  desc: "Given the `head` of a linked list, return the list after sorting it in ascending order. You must sort in O(n log n) time and O(1) memory (iterative).",
  examples: [{ input: "head = [4,2,1,3]", output: "[1,2,3,4]" }, { input: "head = [-1,5,3,4,0]", output: "[-1,0,3,4,5]" }, { input: "head = []", output: "[]" }],
  constraints: ["The number of nodes in the list is in the range [0, 5×10⁴].", "-10⁵ ≤ Node.val ≤ 10⁵"],
  functionSignature: "def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:",
  starters: { Python: `from typing import Optional\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\nclass Solution:\n    def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        pass\n`, JavaScript: `var sortList = function(head) {\n    \n};\n`, TypeScript: `function sortList(head: ListNode | null): ListNode | null {\n    \n};\n`, Java: `class Solution {\n    public ListNode sortList(ListNode head) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    ListNode* sortList(ListNode* head) {\n        \n    }\n};\n` },
  testCases: [
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.sortList(mk([4,2,1,3]))))`, expected: "[1, 2, 3, 4]", isPublic: true },
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.sortList(mk([-1,5,3,4,0]))))`, expected: "[-1, 0, 3, 4, 5]", isPublic: true },
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.sortList(None)))`, expected: "[]", isPublic: false },
    { script: `class ListNode:\n    def __init__(self,v=0,n=None): self.val=v; self.next=n\ndef mk(l):\n    d=ListNode(); c=d\n    for v in l: c.next=ListNode(v); c=c.next\n    return d.next\ndef toList(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nsol=Solution()\nprint(toList(sol.sortList(mk([1]))))`, expected: "[1]", isPublic: false },
  ],
},
// ── Binary Tree Right Side View ───────────────────────────────────────────────
"Binary Tree Right Side View": {
  title: "Binary Tree Right Side View", difficulty: "Medium",
  desc: "Given the `root` of a binary tree, imagine yourself standing on the right side of it. Return the values of the nodes you can see ordered from top to bottom.",
  examples: [{ input: "root = [1,2,3,null,5,null,4]", output: "[1,3,4]" }, { input: "root = [1,null,3]", output: "[1,3]" }, { input: "root = []", output: "[]" }],
  constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 ≤ Node.val ≤ 100"],
  functionSignature: "def rightSideView(self, root: Optional[TreeNode]) -> List[int]:",
  starters: { Python: `from typing import Optional, List\nfrom collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Solution:\n    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:\n        pass\n`, JavaScript: `var rightSideView = function(root) {\n    \n};\n`, TypeScript: `function rightSideView(root: TreeNode | null): number[] {\n    \n};\n`, Java: `class Solution {\n    public List<Integer> rightSideView(TreeNode root) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    vector<int> rightSideView(TreeNode* root) {\n        \n    }\n};\n` },
  testCases: [
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.rightSideView(mk([1,2,3,None,5,None,4])))`, expected: "[1, 3, 4]", isPublic: true },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\nsol=Solution()\nprint(sol.rightSideView(None))`, expected: "[]", isPublic: true },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.rightSideView(mk([1])))`, expected: "[1]", isPublic: false },
    { script: `class TreeNode:\n    def __init__(self,v=0,l=None,r=None): self.val=v;self.left=l;self.right=r\ndef mk(a,i=0):\n    if i>=len(a) or a[i] is None: return None\n    n=TreeNode(a[i]); n.left=mk(a,2*i+1); n.right=mk(a,2*i+2); return n\nsol=Solution()\nprint(sol.rightSideView(mk([1,2,3,4])))`, expected: "[1, 3, 4]", isPublic: false },
  ],
},
// ── Is Subsequence ────────────────────────────────────────────────────────────
"Is Subsequence": {
  title: "Is Subsequence", difficulty: "Easy",
  desc: 'Given two strings `s` and `t`, return `true` if `s` is a subsequence of `t`, or `false` otherwise. A subsequence is a string formed by deleting some (or none) characters from `t` without disturbing the remaining characters\' relative order.',
  examples: [{ input: 's = "ace", t = "abcde"', output: "true" }, { input: 's = "aec", t = "abcde"', output: "false" }],
  constraints: ["0 ≤ s.length ≤ 100", "0 ≤ t.length ≤ 10⁴", "s and t consist only of lowercase English letters."],
  functionSignature: "def isSubsequence(self, s: str, t: str) -> bool:",
  starters: { Python: `class Solution:\n    def isSubsequence(self, s: str, t: str) -> bool:\n        pass\n`, JavaScript: `var isSubsequence = function(s, t) {\n    \n};\n`, TypeScript: `function isSubsequence(s: string, t: string): boolean {\n    \n};\n`, Java: `class Solution {\n    public boolean isSubsequence(String s, String t) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    bool isSubsequence(string s, string t) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.isSubsequence("ace","abcde"))`, expected: "True", isPublic: true },
    { script: `sol=Solution()\nprint(sol.isSubsequence("aec","abcde"))`, expected: "False", isPublic: true },
    { script: `sol=Solution()\nprint(sol.isSubsequence("","abcde"))`, expected: "True", isPublic: false },
    { script: `sol=Solution()\nprint(sol.isSubsequence("axc","ahbgdc"))`, expected: "False", isPublic: false },
  ],
},
// ── Detect Capital ────────────────────────────────────────────────────────────
"Detect Capital": {
  title: "Detect Capital", difficulty: "Easy",
  desc: 'We define the usage of capitals in a word to be right when one of the following cases holds: all letters are capitals (e.g. "USA"), all letters are not capitals (e.g. "leetcode"), only the first letter is capital (e.g. "Google"). Given a string `word`, return `true` if the usage of capitals is right.',
  examples: [{ input: 'word = "USA"', output: "true" }, { input: 'word = "FlaG"', output: "false" }],
  constraints: ["1 ≤ word.length ≤ 100", "word consists of uppercase and lowercase English letters."],
  functionSignature: "def detectCapitalUse(self, word: str) -> bool:",
  starters: { Python: `class Solution:\n    def detectCapitalUse(self, word: str) -> bool:\n        pass\n`, JavaScript: `var detectCapitalUse = function(word) {\n    \n};\n`, TypeScript: `function detectCapitalUse(word: string): boolean {\n    \n};\n`, Java: `class Solution {\n    public boolean detectCapitalUse(String word) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    bool detectCapitalUse(string word) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.detectCapitalUse("USA"))`, expected: "True", isPublic: true },
    { script: `sol=Solution()\nprint(sol.detectCapitalUse("FlaG"))`, expected: "False", isPublic: true },
    { script: `sol=Solution()\nprint(sol.detectCapitalUse("leetcode"))`, expected: "True", isPublic: false },
    { script: `sol=Solution()\nprint(sol.detectCapitalUse("Google"))`, expected: "True", isPublic: false },
  ],
},
// ── Longest Common Prefix ─────────────────────────────────────────────────────
"Longest Common Prefix": {
  title: "Longest Common Prefix", difficulty: "Easy",
  desc: 'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string `""`.',
  examples: [{ input: 'strs = ["flower","flow","flight"]', output: '"fl"' }, { input: 'strs = ["dog","racecar","car"]', output: '""' }],
  constraints: ["1 ≤ strs.length ≤ 200", "0 ≤ strs[i].length ≤ 200", "strs[i] consists of only lowercase English letters."],
  functionSignature: "def longestCommonPrefix(self, strs: List[str]) -> str:",
  starters: { Python: `from typing import List\n\nclass Solution:\n    def longestCommonPrefix(self, strs: List[str]) -> str:\n        pass\n`, JavaScript: `var longestCommonPrefix = function(strs) {\n    \n};\n`, TypeScript: `function longestCommonPrefix(strs: string[]): string {\n    \n};\n`, Java: `class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.longestCommonPrefix(["flower","flow","flight"]))`, expected: "fl", isPublic: true },
    { script: `sol=Solution()\nprint(sol.longestCommonPrefix(["dog","racecar","car"]))`, expected: "", isPublic: true },
    { script: `sol=Solution()\nprint(sol.longestCommonPrefix(["a"]))`, expected: "a", isPublic: false },
    { script: `sol=Solution()\nprint(sol.longestCommonPrefix(["ab","a"]))`, expected: "a", isPublic: false },
  ],
},
// ── Backspace String Compare ───────────────────────────────────────────────────
"Backspace String Compare": {
  title: "Backspace String Compare", difficulty: "Easy",
  desc: 'Given two strings `s` and `t`, return `true` if they are equal when both are typed into empty text editors. `"#"` means a backspace character. Note that after backspacing an empty text, the text will continue empty.',
  examples: [{ input: 's = "ab#c", t = "ad#c"', output: "true", explanation: 'Both "s" and "t" become "ac".' }, { input: 's = "ab##", t = "c#d#"', output: "true" }, { input: 's = "a#c", t = "b"', output: "false" }],
  constraints: ["1 ≤ s.length, t.length ≤ 200", "s and t only contain lowercase letters and '#' characters."],
  functionSignature: "def backspaceCompare(self, s: str, t: str) -> bool:",
  starters: { Python: `class Solution:\n    def backspaceCompare(self, s: str, t: str) -> bool:\n        pass\n`, JavaScript: `var backspaceCompare = function(s, t) {\n    \n};\n`, TypeScript: `function backspaceCompare(s: string, t: string): boolean {\n    \n};\n`, Java: `class Solution {\n    public boolean backspaceCompare(String s, String t) {\n        \n    }\n}\n`, "C++": `class Solution {\npublic:\n    bool backspaceCompare(string s, string t) {\n        \n    }\n};\n` },
  testCases: [
    { script: `sol=Solution()\nprint(sol.backspaceCompare("ab#c","ad#c"))`, expected: "True", isPublic: true },
    { script: `sol=Solution()\nprint(sol.backspaceCompare("ab##","c#d#"))`, expected: "True", isPublic: true },
    { script: `sol=Solution()\nprint(sol.backspaceCompare("a#c","b"))`, expected: "False", isPublic: false },
    { script: `sol=Solution()\nprint(sol.backspaceCompare("",""))`, expected: "True", isPublic: false },
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
