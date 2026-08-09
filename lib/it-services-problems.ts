/**
 * IT Services Extended Problem Bank
 * Companies: Capgemini, Mphasis, Hexaware, LTIMindtree, Zensar, Persistent Systems,
 *   Cyient, Birlasoft, Sonata Software, Tata Elxsi, Nisum, Xoriant,
 *   Mastech Digital, 3i Infotech, Info Edge, NIIT Technologies
 * 16 problems per company = 256 total
 */

import type { StaticProblem } from "./problem-bank"

export const IT_SERVICES_PROBLEM_BANK: Record<string, StaticProblem & { company: string; pattern: string }> = {

// =============================================================================
// CAPGEMINI (16 problems)
// =============================================================================

"Capgemini: Two Sum": {
  company: "capgemini", pattern: "Hash Map",
  title: "Two Sum",
  difficulty: "Easy",
  desc: "Given array `nums` and `target`, return indices of two numbers that add up to target.",
  examples: [
    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
    { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
  ],
  constraints: ["2 <= nums.length <= 10^4", "Exactly one solution exists"],
  functionSignature: "def twoSum(self, nums: List[int], target: int) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass",
    JavaScript: "var twoSum = function(nums, target) {\n    \n};",
    TypeScript: "function twoSum(nums: number[], target: number): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.twoSum([2,7,11,15],9))", expected: "[0, 1]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.twoSum([3,2,4],6))", expected: "[1, 2]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.twoSum([3,3],6))", expected: "[0, 1]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.twoSum([1,2,3,4,5],9))", expected: "[3, 4]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.twoSum([1,5,3,2],8))", expected: "[1, 3]", isPublic: false },
  ],
},

"Capgemini: Valid Parentheses": {
  company: "capgemini", pattern: "Stack",
  title: "Valid Parentheses",
  difficulty: "Easy",
  desc: "Given string `s` with brackets, determine if it is valid. Open brackets must be closed by same type in correct order.",
  examples: [
    { input: 's = "()"', output: "true" },
    { input: 's = "(]"', output: "false" }
  ],
  constraints: ["1 <= s.length <= 10^4"],
  functionSignature: "def isValid(self, s: str) -> bool:",
  starters: {
    Python: "class Solution:\n    def isValid(self, s: str) -> bool:\n        pass",
    JavaScript: "var isValid = function(s) {\n    \n};",
    TypeScript: "function isValid(s: string): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.isValid('()'))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isValid('(]'))", expected: "False", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isValid('()[{}]'))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isValid('([)]'))", expected: "False", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isValid('{[]}'))", expected: "True", isPublic: false },
  ],
},

"Capgemini: Reverse Linked List": {
  company: "capgemini", pattern: "Linked List",
  title: "Reverse Linked List",
  difficulty: "Easy",
  desc: "Given the head of a singly linked list, reverse the list and return the new head.",
  examples: [
    { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
    { input: "head = [1,2]", output: "[2,1]" }
  ],
  constraints: ["0 to 5000 nodes"],
  functionSignature: "def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:",
  starters: {
    Python: "from typing import Optional\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val; self.next = next\n\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        pass",
    JavaScript: "var reverseList = function(head) {\n    \n};",
    TypeScript: "function reverseList(head: ListNode | null): ListNode | null {\n    \n};",
    Java: "class Solution {\n    public ListNode reverseList(ListNode head) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        \n    }\n};",
  },
  testCases: [
    { script: "def mk(v):\n    h=None\n    for x in reversed(v): n=ListNode(x); n.next=h; h=n\n    return h\ndef tl(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nprint(tl(Solution().reverseList(mk([1,2,3,4,5]))))", expected: "[5, 4, 3, 2, 1]", isPublic: true },
    { script: "def mk(v):\n    h=None\n    for x in reversed(v): n=ListNode(x); n.next=h; h=n\n    return h\ndef tl(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nprint(tl(Solution().reverseList(mk([1,2]))))", expected: "[2, 1]", isPublic: true },
    { script: "print(Solution().reverseList(None))", expected: "None", isPublic: false },
    { script: "def mk(v):\n    h=None\n    for x in reversed(v): n=ListNode(x); n.next=h; h=n\n    return h\ndef tl(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nprint(tl(Solution().reverseList(mk([1]))))", expected: "[1]", isPublic: false },
    { script: "def mk(v):\n    h=None\n    for x in reversed(v): n=ListNode(x); n.next=h; h=n\n    return h\ndef tl(h):\n    r=[]\n    while h: r.append(h.val); h=h.next\n    return r\nprint(tl(Solution().reverseList(mk([1,2,3]))))", expected: "[3, 2, 1]", isPublic: false },
  ],
},

"Capgemini: Maximum Subarray": {
  company: "capgemini", pattern: "Kadane's Algorithm",
  title: "Maximum Subarray Sum",
  difficulty: "Medium",
  desc: "Find the contiguous subarray with the largest sum.",
  examples: [
    { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
    { input: "nums = [1]", output: "1" }
  ],
  constraints: ["1 <= nums.length <= 10^5"],
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

"Capgemini: Climbing Stairs": {
  company: "capgemini", pattern: "Dynamic Programming",
  title: "Climbing Stairs",
  difficulty: "Easy",
  desc: "You can climb 1 or 2 steps at a time. How many distinct ways to climb n steps?",
  examples: [
    { input: "n = 2", output: "2" },
    { input: "n = 3", output: "3" }
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

"Capgemini: Binary Search": {
  company: "capgemini", pattern: "Binary Search",
  title: "Binary Search",
  difficulty: "Easy",
  desc: "Given sorted array `nums` and target, return index using binary search. Return -1 if not found.",
  examples: [
    { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
    { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" }
  ],
  constraints: ["1 <= nums.length <= 10^4", "All values unique, sorted ascending"],
  functionSignature: "def search(self, nums: List[int], target: int) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        pass",
    JavaScript: "var search = function(nums, target) {\n    \n};",
    TypeScript: "function search(nums: number[], target: number): number {\n    \n};",
    Java: "class Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.search([-1,0,3,5,9,12],9))", expected: "4", isPublic: true },
    { script: "sol = Solution()\nprint(sol.search([-1,0,3,5,9,12],2))", expected: "-1", isPublic: true },
    { script: "sol = Solution()\nprint(sol.search([1],1))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.search([1,3,5,7,9],5))", expected: "2", isPublic: false },
    { script: "sol = Solution()\nprint(sol.search([2,4,6,8],10))", expected: "-1", isPublic: false },
  ],
},

"Capgemini: Best Time to Buy Stock": {
  company: "capgemini", pattern: "Greedy",
  title: "Best Time to Buy and Sell Stock",
  difficulty: "Easy",
  desc: "Find maximum profit from one buy and one sell. Return 0 if no profit.",
  examples: [
    { input: "prices = [7,1,5,3,6,4]", output: "5" },
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

"Capgemini: Contains Duplicate": {
  company: "capgemini", pattern: "Hash Set",
  title: "Contains Duplicate",
  difficulty: "Easy",
  desc: "Return true if any value appears at least twice in `nums`.",
  examples: [{ input: "nums = [1,2,3,1]", output: "true" }, { input: "nums = [1,2,3,4]", output: "false" }],
  constraints: ["1 <= nums.length <= 10^5"],
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
    { script: "sol = Solution()\nprint(sol.containsDuplicate([1]))", expected: "False", isPublic: false },
    { script: "sol = Solution()\nprint(sol.containsDuplicate([1,1]))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.containsDuplicate([1,2,3,4,5,1]))", expected: "True", isPublic: false },
  ],
},

"Capgemini: Single Number": {
  company: "capgemini", pattern: "Bit Manipulation XOR",
  title: "Single Number",
  difficulty: "Easy",
  desc: "Every element appears twice except one. Find that element using O(1) space.",
  examples: [{ input: "nums = [2,2,1]", output: "1" }, { input: "nums = [4,1,2,1,2]", output: "4" }],
  constraints: ["1 <= nums.length <= 3*10^4"],
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

"Capgemini: Palindrome Number": {
  company: "capgemini", pattern: "Math",
  title: "Palindrome Number",
  difficulty: "Easy",
  desc: "Return true if integer `x` reads same forward and backward. Negatives are not palindromes.",
  examples: [{ input: "x = 121", output: "true" }, { input: "x = -121", output: "false" }],
  constraints: ["-2^31 <= x <= 2^31 - 1"],
  functionSignature: "def isPalindrome(self, x: int) -> bool:",
  starters: {
    Python: "class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        pass",
    JavaScript: "var isPalindrome = function(x) {\n    \n};",
    TypeScript: "function isPalindrome(x: number): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isPalindrome(int x) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isPalindrome(int x) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.isPalindrome(121))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isPalindrome(-121))", expected: "False", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isPalindrome(10))", expected: "False", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isPalindrome(0))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isPalindrome(1221))", expected: "True", isPublic: false },
  ],
},

"Capgemini: Power of Two": {
  company: "capgemini", pattern: "Bit Manipulation",
  title: "Power of Two",
  difficulty: "Easy",
  desc: "Return true if integer n is a power of two.",
  examples: [{ input: "n = 1", output: "true" }, { input: "n = 3", output: "false" }],
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
    { script: "sol = Solution()\nprint(sol.isPowerOfTwo(3))", expected: "False", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isPowerOfTwo(16))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isPowerOfTwo(0))", expected: "False", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isPowerOfTwo(-16))", expected: "False", isPublic: false },
  ],
},

"Capgemini: Missing Number": {
  company: "capgemini", pattern: "Math / XOR",
  title: "Missing Number",
  difficulty: "Easy",
  desc: "Array of n distinct numbers in [0,n]. Return the missing number.",
  examples: [{ input: "nums = [3,0,1]", output: "2" }, { input: "nums = [0,1]", output: "2" }],
  constraints: ["n == nums.length", "1 <= n <= 10^4"],
  functionSignature: "def missingNumber(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def missingNumber(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var missingNumber = function(nums) {\n    \n};",
    TypeScript: "function missingNumber(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int missingNumber(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.missingNumber([3,0,1]))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.missingNumber([0,1]))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.missingNumber([0]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.missingNumber([1]))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.missingNumber([9,6,4,2,3,5,7,0,1]))", expected: "8", isPublic: false },
  ],
},

"Capgemini: Number of 1 Bits": {
  company: "capgemini", pattern: "Bit Manipulation",
  title: "Number of 1 Bits",
  difficulty: "Easy",
  desc: "Return number of '1' bits in binary representation of unsigned integer n.",
  examples: [{ input: "n = 11", output: "3" }, { input: "n = 128", output: "1" }],
  constraints: ["1 <= n <= 2^31 - 1"],
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
    { script: "sol = Solution()\nprint(sol.hammingWeight(7))", expected: "3", isPublic: false },
    { script: "sol = Solution()\nprint(sol.hammingWeight(15))", expected: "4", isPublic: false },
  ],
},

"Capgemini: Intersection of Two Arrays": {
  company: "capgemini", pattern: "Hash Set",
  title: "Intersection of Two Arrays",
  difficulty: "Easy",
  desc: "Return array of intersection of nums1 and nums2. Each element unique.",
  examples: [{ input: "nums1=[1,2,2,1], nums2=[2,2]", output: "[2]" }, { input: "nums1=[4,9,5], nums2=[9,4,9,8,4]", output: "[9,4]" }],
  constraints: ["1 <= nums1.length, nums2.length <= 1000"],
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
    { script: "sol = Solution()\nprint(sol.intersection([1,2,3],[4,5,6]))", expected: "[]", isPublic: false },
    { script: "sol = Solution()\nprint(sorted(sol.intersection([1,2,3],[2,3,4])))", expected: "[2, 3]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.intersection([1],[1]))", expected: "[1]", isPublic: false },
  ],
},


"Capgemini: Remove Duplicates": {
  company: "capgemini", pattern: "Two Pointers",
  title: "Remove Duplicates from Sorted Array",
  difficulty: "Easy",
  desc: "Given sorted array, remove duplicates in-place. Return count of unique elements.",
  examples: [
    { input: "nums = [1,1,2]", output: "2" },
    { input: "nums = [0,0,1,1,2]", output: "3" }
  ],
  constraints: ["1 <= nums.length <= 3*10^4"],
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
    { script: "sol = Solution()\nprint(sol.removeDuplicates([0,0,1,1,2]))", expected: "3", isPublic: true },
    { script: "sol = Solution()\nprint(sol.removeDuplicates([1]))", expected: "1", isPublic: false },
    { script: "sol = Solution()\nprint(sol.removeDuplicates([1,2,3]))", expected: "3", isPublic: false },
    { script: "sol = Solution()\nprint(sol.removeDuplicates([1,1,1,1]))", expected: "1", isPublic: false },
  ],
},


// =============================================================================
// MPHASIS (16 problems)
// =============================================================================

"Mphasis: Two Sum II": {
  company: "mphasis", pattern: "Two Pointers",
  title: "Two Sum II",
  difficulty: "Medium",
  desc: "Given 1-indexed sorted array, find two numbers summing to target. Return 1-indexed indices.",
  examples: [
    { input: "numbers=[2,7,11,15], target=9", output: "[1,2]" },
    { input: "numbers=[2,3,4], target=6", output: "[1,3]" },
  ],
  constraints: ["2 <= numbers.length <= 3*10^4", "Exactly one solution"],
  functionSignature: "def twoSum(self, numbers: List[int], target: int) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def twoSum(self, numbers: List[int], target: int) -> List[int]:\n        pass",
    JavaScript: "var twoSum = function(numbers, target) {\n    \n};",
    TypeScript: "function twoSum(numbers: number[], target: number): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& numbers, int target) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.twoSum([2,7,11,15],9))", expected: "[1, 2]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.twoSum([2,3,4],6))", expected: "[1, 3]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.twoSum([1,2,3,4,5],9))", expected: "[4, 5]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.twoSum([2,11,15,16],13))", expected: "[1, 2]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.twoSum([5,25,75],100))", expected: "[2, 3]", isPublic: false },
  ],
},

"Mphasis: Valid Anagram": {
  company: "mphasis", pattern: "Hash Map / Sorting",
  title: "Valid Anagram",
  difficulty: "Easy",
  desc: "Return true if t is an anagram of s (same characters, same frequency).",
  examples: [
    { input: "s = \"anagram\", t = \"nagaram\"", output: "true" },
    { input: "s = \"rat\", t = \"car\"", output: "false" },
  ],
  constraints: ["1 <= s.length, t.length <= 5*10^4", "s and t consist of lowercase letters"],
  functionSignature: "def isAnagram(self, s: str, t: str) -> bool:",
  starters: {
    Python: "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass",
    JavaScript: "var isAnagram = function(s, t) {\n    \n};",
    TypeScript: "function isAnagram(s: string, t: string): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isAnagram(String s, String t) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.isAnagram(\"anagram\",\"nagaram\"))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isAnagram(\"rat\",\"car\"))", expected: "False", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isAnagram(\"a\",\"a\"))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isAnagram(\"ab\",\"a\"))", expected: "False", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isAnagram(\"listen\",\"silent\"))", expected: "True", isPublic: false },
  ],
},

"Mphasis: Move Zeroes": {
  company: "mphasis", pattern: "Two Pointers",
  title: "Move Zeroes",
  difficulty: "Easy",
  desc: "Move all zeroes to end maintaining relative order of non-zero elements. Modify in-place.",
  examples: [
    { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" },
    { input: "nums = [0]", output: "[0]" },
  ],
  constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^9"],
  functionSignature: "def moveZeroes(self, nums: List[int]) -> None:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def moveZeroes(self, nums: List[int]) -> None:\n        pass",
    JavaScript: "var moveZeroes = function(nums) {\n    \n};",
    TypeScript: "function moveZeroes(nums: number[]): void {\n    \n};",
    Java: "class Solution {\n    public void moveZeroes(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    void moveZeroes(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "nums=[0,1,0,3,12]\nSolution().moveZeroes(nums)\nprint(nums)", expected: "[1, 3, 12, 0, 0]", isPublic: true },
    { script: "nums=[0]\nSolution().moveZeroes(nums)\nprint(nums)", expected: "[0]", isPublic: true },
    { script: "nums=[1]\nSolution().moveZeroes(nums)\nprint(nums)", expected: "[1]", isPublic: false },
    { script: "nums=[0,0,1]\nSolution().moveZeroes(nums)\nprint(nums)", expected: "[1, 0, 0]", isPublic: false },
    { script: "nums=[1,0,0,0,1]\nSolution().moveZeroes(nums)\nprint(nums)", expected: "[1, 1, 0, 0, 0]", isPublic: false },
  ],
},

"Mphasis: Find All Duplicates": {
  company: "mphasis", pattern: "Array / Index Marking",
  title: "Find All Duplicates in an Array",
  difficulty: "Medium",
  desc: "Array of n integers in [1,n]. Each element appears once or twice. Return all appearing twice.",
  examples: [
    { input: "nums = [4,3,2,7,8,2,3,1]", output: "[2,3]" },
    { input: "nums = [1,1,2]", output: "[1]" },
  ],
  constraints: ["n == nums.length", "1 <= nums[i] <= n"],
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

"Mphasis: Min Stack": {
  company: "mphasis", pattern: "Stack / Design",
  title: "Min Stack",
  difficulty: "Medium",
  desc: "Design stack that supports push, pop, top, and retrieving minimum in O(1).",
  examples: [
    { input: "push(-2), push(0), push(-3), getMin()->-3, pop, top->0, getMin->-2", output: "-3, 0, -2" },
  ],
  constraints: ["pop/top/getMin called on non-empty stack", "At most 3*10^4 operations"],
  functionSignature: "def getMin(self) -> int:",
  starters: {
    Python: "class MinStack:\n    def __init__(self):\n        pass\n\n    def push(self, val: int) -> None:\n        pass\n\n    def pop(self) -> None:\n        pass\n\n    def top(self) -> int:\n        pass\n\n    def getMin(self) -> int:\n        pass",
    JavaScript: "class MinStack {\n    constructor() {}\n    push(val) {}\n    pop() {}\n    top() { return 0; }\n    getMin() { return 0; }\n}",
    TypeScript: "class MinStack {\n    constructor() {}\n    push(val: number): void {}\n    pop(): void {}\n    top(): number { return 0; }\n    getMin(): number { return 0; }\n}",
    Java: "class MinStack {\n    public MinStack() {}\n    public void push(int val) {}\n    public void pop() {}\n    public int top() { return 0; }\n    public int getMin() { return 0; }\n}",
    "C++": "class MinStack {\npublic:\n    MinStack() {}\n    void push(int val) {}\n    void pop() {}\n    int top() { return 0; }\n    int getMin() { return 0; }\n};",
  },
  testCases: [
    { script: "ms = MinStack()\nms.push(-2); ms.push(0); ms.push(-3)\nprint(ms.getMin())", expected: "-3", isPublic: true },
    { script: "ms = MinStack()\nms.push(-2); ms.push(0); ms.push(-3); ms.pop()\nprint(ms.top())", expected: "0", isPublic: true },
    { script: "ms = MinStack()\nms.push(-2); ms.push(0); ms.push(-3); ms.pop()\nprint(ms.getMin())", expected: "-2", isPublic: false },
    { script: "ms = MinStack()\nms.push(5)\nprint(ms.getMin())", expected: "5", isPublic: false },
    { script: "ms = MinStack()\nms.push(2); ms.push(0); ms.push(3); ms.push(0)\nprint(ms.getMin())", expected: "0", isPublic: false },
  ],
},

"Mphasis: Maximum Depth Binary Tree": {
  company: "mphasis", pattern: "Tree DFS",
  title: "Maximum Depth of Binary Tree",
  difficulty: "Easy",
  desc: "Return maximum depth of a binary tree (number of nodes along longest root-to-leaf path).",
  examples: [
    { input: "root = [3,9,20,null,null,15,7]", output: "3" },
    { input: "root = [1,null,2]", output: "2" },
  ],
  constraints: ["0 to 10^4 nodes", "-100 <= Node.val <= 100"],
  functionSignature: "def maxDepth(self, root: Optional[TreeNode]) -> int:",
  starters: {
    Python: "from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\nclass Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        pass",
    JavaScript: "var maxDepth = function(root) {\n    \n};",
    TypeScript: "function maxDepth(root: TreeNode | null): number {\n    \n};",
    Java: "class Solution {\n    public int maxDepth(TreeNode root) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        \n    }\n};",
  },
  testCases: [
    { script: "root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))\nprint(Solution().maxDepth(root))", expected: "3", isPublic: true },
    { script: "print(Solution().maxDepth(None))", expected: "0", isPublic: true },
    { script: "print(Solution().maxDepth(TreeNode(1)))", expected: "1", isPublic: false },
    { script: "root = TreeNode(1, TreeNode(2, TreeNode(3, TreeNode(4))))\nprint(Solution().maxDepth(root))", expected: "4", isPublic: false },
    { script: "root = TreeNode(1, None, TreeNode(2))\nprint(Solution().maxDepth(root))", expected: "2", isPublic: false },
  ],
},

"Mphasis: Sorted Array to BST": {
  company: "mphasis", pattern: "Tree / Divide and Conquer",
  title: "Convert Sorted Array to BST",
  difficulty: "Easy",
  desc: "Convert sorted array to height-balanced BST. Return root.",
  examples: [
    { input: "nums = [-10,-3,0,5,9]", output: "[0,-3,9,-10,null,5]" },
    { input: "nums = [1,3]", output: "[3,1]" },
  ],
  constraints: ["1 <= nums.length <= 10^4", "nums is sorted strictly increasing"],
  functionSignature: "def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:",
  starters: {
    Python: "from typing import List, Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\nclass Solution:\n    def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:\n        pass",
    JavaScript: "var sortedArrayToBST = function(nums) {\n    \n};",
    TypeScript: "function sortedArrayToBST(nums: number[]): TreeNode | null {\n    \n};",
    Java: "class Solution {\n    public TreeNode sortedArrayToBST(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    TreeNode* sortedArrayToBST(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "def inorder(n):\n    return inorder(n.left)+[n.val]+inorder(n.right) if n else []\nprint(inorder(Solution().sortedArrayToBST([-10,-3,0,5,9])))", expected: "[-10, -3, 0, 5, 9]", isPublic: true },
    { script: "def inorder(n):\n    return inorder(n.left)+[n.val]+inorder(n.right) if n else []\nprint(inorder(Solution().sortedArrayToBST([1,3])))", expected: "[1, 3]", isPublic: true },
    { script: "root = Solution().sortedArrayToBST([1])\nprint(root.val)", expected: "1", isPublic: false },
    { script: "root = Solution().sortedArrayToBST([1,2,3])\nprint(root.val)", expected: "2", isPublic: false },
    { script: "def h(n):\n    return 0 if not n else 1+max(h(n.left),h(n.right))\nroot = Solution().sortedArrayToBST(list(range(7)))\nprint(h(root) <= 3)", expected: "True", isPublic: false },
  ],
},

"Mphasis: Merge Sorted Array": {
  company: "mphasis", pattern: "Two Pointers",
  title: "Merge Sorted Array",
  difficulty: "Easy",
  desc: "Merge nums2 into nums1. nums1 has length m+n with m elements. Return sorted merged array.",
  examples: [
    { input: "nums1=[1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3", output: "[1,2,2,3,5,6]" },
    { input: "nums1=[1], m=1, nums2=[], n=0", output: "[1]" },
  ],
  constraints: ["0 <= m, n <= 200", "1 <= m + n <= 200"],
  functionSignature: "def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> List[int]:\n        pass",
    JavaScript: "var merge = function(nums1, m, nums2, n) {\n    \n};",
    TypeScript: "function merge(nums1: number[], m: number, nums2: number[], n: number): number[] {\n    \n};",
    Java: "class Solution {\n    public void merge(int[] nums1, int m, int[] nums2, int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nnums1=[1,2,3,0,0,0]\nprint(sol.merge(nums1,3,[2,5,6],3) or nums1)", expected: "[1, 2, 2, 3, 5, 6]", isPublic: true },
    { script: "sol = Solution()\nnums1=[1]\nprint(sol.merge(nums1,1,[],0) or nums1)", expected: "[1]", isPublic: true },
    { script: "sol = Solution()\nnums1=[0]\nprint(sol.merge(nums1,0,[1],1) or nums1)", expected: "[1]", isPublic: false },
    { script: "sol = Solution()\nnums1=[1,0]\nprint(sol.merge(nums1,1,[2],1) or nums1)", expected: "[1, 2]", isPublic: false },
    { script: "sol = Solution()\nnums1=[4,0,0,0]\nprint(sol.merge(nums1,1,[1,2,3],3) or nums1)", expected: "[1, 2, 3, 4]", isPublic: false },
  ],
},

"Mphasis: Remove Element": {
  company: "mphasis", pattern: "Two Pointers",
  title: "Remove Element",
  difficulty: "Easy",
  desc: "Remove all occurrences of val in nums in-place. Return count of elements not equal to val.",
  examples: [
    { input: "nums = [3,2,2,3], val = 3", output: "2" },
    { input: "nums = [0,1,2,2,3,0,4,2], val = 2", output: "5" },
  ],
  constraints: ["0 <= nums.length <= 100", "0 <= val <= 100"],
  functionSignature: "def removeElement(self, nums: List[int], val: int) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def removeElement(self, nums: List[int], val: int) -> int:\n        pass",
    JavaScript: "var removeElement = function(nums, val) {\n    \n};",
    TypeScript: "function removeElement(nums: number[], val: number): number {\n    \n};",
    Java: "class Solution {\n    public int removeElement(int[] nums, int val) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int removeElement(vector<int>& nums, int val) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.removeElement([3,2,2,3],3))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.removeElement([0,1,2,2,3,0,4,2],2))", expected: "5", isPublic: true },
    { script: "sol = Solution()\nprint(sol.removeElement([],0))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.removeElement([1],1))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.removeElement([4,5],3))", expected: "2", isPublic: false },
  ],
},

"Mphasis: Plus One": {
  company: "mphasis", pattern: "Array / Math",
  title: "Plus One",
  difficulty: "Easy",
  desc: "Given large integer as array digits, increment by one and return resulting array.",
  examples: [
    { input: "digits = [1,2,3]", output: "[1,2,4]" },
    { input: "digits = [9]", output: "[1,0]" },
  ],
  constraints: ["1 <= digits.length <= 100", "0 <= digits[i] <= 9"],
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

"Mphasis: Pascal's Triangle": {
  company: "mphasis", pattern: "Dynamic Programming / Math",
  title: "Pascal's Triangle",
  difficulty: "Easy",
  desc: "Given numRows, return first numRows of Pascal's triangle.",
  examples: [
    { input: "numRows = 5", output: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]" },
    { input: "numRows = 1", output: "[[1]]" },
  ],
  constraints: ["1 <= numRows <= 30"],
  functionSignature: "def generate(self, numRows: int) -> List[List[int]]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def generate(self, numRows: int) -> List[List[int]]:\n        pass",
    JavaScript: "var generate = function(numRows) {\n    \n};",
    TypeScript: "function generate(numRows: number): number[][] {\n    \n};",
    Java: "class Solution {\n    public List<List<Integer>> generate(int numRows) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<vector<int>> generate(int numRows) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.generate(5))", expected: "[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.generate(1))", expected: "[[1]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.generate(2))", expected: "[[1], [1, 1]]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.generate(3))", expected: "[[1], [1, 1], [1, 2, 1]]", isPublic: false },
    { script: "sol = Solution()\nprint(len(sol.generate(10)))", expected: "10", isPublic: false },
  ],
},

"Mphasis: Symmetric Tree": {
  company: "mphasis", pattern: "Tree BFS/DFS",
  title: "Symmetric Tree",
  difficulty: "Easy",
  desc: "Check whether binary tree is a mirror of itself (symmetric around center).",
  examples: [
    { input: "root = [1,2,2,3,4,4,3]", output: "true" },
    { input: "root = [1,2,2,null,3,null,3]", output: "false" },
  ],
  constraints: ["1 to 1000 nodes", "-100 <= Node.val <= 100"],
  functionSignature: "def isSymmetric(self, root: Optional[TreeNode]) -> bool:",
  starters: {
    Python: "from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\nclass Solution:\n    def isSymmetric(self, root: Optional[TreeNode]) -> bool:\n        pass",
    JavaScript: "var isSymmetric = function(root) {\n    \n};",
    TypeScript: "function isSymmetric(root: TreeNode | null): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isSymmetric(TreeNode root) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isSymmetric(TreeNode* root) {\n        \n    }\n};",
  },
  testCases: [
    { script: "root=TreeNode(1,TreeNode(2,TreeNode(3),TreeNode(4)),TreeNode(2,TreeNode(4),TreeNode(3)))\nprint(Solution().isSymmetric(root))", expected: "True", isPublic: true },
    { script: "root=TreeNode(1,TreeNode(2,None,TreeNode(3)),TreeNode(2,None,TreeNode(3)))\nprint(Solution().isSymmetric(root))", expected: "False", isPublic: true },
    { script: "print(Solution().isSymmetric(TreeNode(1)))", expected: "True", isPublic: false },
    { script: "root=TreeNode(1,TreeNode(2),TreeNode(2))\nprint(Solution().isSymmetric(root))", expected: "True", isPublic: false },
    { script: "root=TreeNode(1,TreeNode(2),TreeNode(3))\nprint(Solution().isSymmetric(root))", expected: "False", isPublic: false },
  ],
},

"Mphasis: Invert Binary Tree": {
  company: "mphasis", pattern: "Tree DFS",
  title: "Invert Binary Tree",
  difficulty: "Easy",
  desc: "Invert/mirror a binary tree. Return its root.",
  examples: [
    { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
    { input: "root = [2,1,3]", output: "[2,3,1]" },
  ],
  constraints: ["0 to 100 nodes", "-100 <= Node.val <= 100"],
  functionSignature: "def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:",
  starters: {
    Python: "from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\nclass Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        pass",
    JavaScript: "var invertTree = function(root) {\n    \n};",
    TypeScript: "function invertTree(root: TreeNode | null): TreeNode | null {\n    \n};",
    Java: "class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        \n    }\n};",
  },
  testCases: [
    { script: "def inorder(n):\n    return inorder(n.left)+[n.val]+inorder(n.right) if n else []\nroot=TreeNode(2,TreeNode(1),TreeNode(3))\nprint(inorder(Solution().invertTree(root)))", expected: "[3, 2, 1]", isPublic: true },
    { script: "print(Solution().invertTree(None))", expected: "None", isPublic: true },
    { script: "root=TreeNode(1)\nprint(Solution().invertTree(root).val)", expected: "1", isPublic: false },
    { script: "def preorder(n):\n    return [n.val]+preorder(n.left)+preorder(n.right) if n else []\nroot=TreeNode(4,TreeNode(2,TreeNode(1),TreeNode(3)),TreeNode(7,TreeNode(6),TreeNode(9)))\nprint(preorder(Solution().invertTree(root)))", expected: "[4, 7, 9, 6, 2, 3, 1]", isPublic: false },
    { script: "root=TreeNode(1,TreeNode(2),TreeNode(3))\nresult=Solution().invertTree(root)\nprint(result.left.val)", expected: "3", isPublic: false },
  ],
},

"Mphasis: Path Sum": {
  company: "mphasis", pattern: "Tree DFS",
  title: "Path Sum",
  difficulty: "Easy",
  desc: "Return true if tree has root-to-leaf path where node values sum equals targetSum.",
  examples: [
    { input: "root=[5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum=22", output: "true" },
    { input: "root=[1,2,3], targetSum=5", output: "false" },
  ],
  constraints: ["0 to 5000 nodes", "-1000 <= Node.val, targetSum <= 1000"],
  functionSignature: "def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:",
  starters: {
    Python: "from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\nclass Solution:\n    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:\n        pass",
    JavaScript: "var hasPathSum = function(root, targetSum) {\n    \n};",
    TypeScript: "function hasPathSum(root: TreeNode | null, targetSum: number): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean hasPathSum(TreeNode root, int targetSum) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool hasPathSum(TreeNode* root, int targetSum) {\n        \n    }\n};",
  },
  testCases: [
    { script: "root=TreeNode(1,TreeNode(2))\nprint(Solution().hasPathSum(root,3))", expected: "True", isPublic: true },
    { script: "print(Solution().hasPathSum(None,0))", expected: "False", isPublic: true },
    { script: "root=TreeNode(1,TreeNode(2),TreeNode(3))\nprint(Solution().hasPathSum(root,4))", expected: "True", isPublic: false },
    { script: "root=TreeNode(1,TreeNode(2),TreeNode(3))\nprint(Solution().hasPathSum(root,5))", expected: "False", isPublic: false },
    { script: "root=TreeNode(1,TreeNode(2))\nprint(Solution().hasPathSum(root,1))", expected: "False", isPublic: false },
  ],
},

"Mphasis: Count Primes": {
  company: "mphasis", pattern: "Sieve of Eratosthenes",
  title: "Count Primes",
  difficulty: "Medium",
  desc: "Return count of prime numbers strictly less than n.",
  examples: [
    { input: "n = 10", output: "4", explanation: "Primes: 2,3,5,7" },
    { input: "n = 0", output: "0" },
  ],
  constraints: ["0 <= n <= 5*10^6"],
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


// =============================================================================
// HEXAWARE (16 problems)
// =============================================================================

"Hexaware: Missing Number": {
  company: "hexaware", pattern: "Math / XOR",
  title: "Missing Number",
  difficulty: "Easy",
  desc: "Array of n distinct numbers in [0,n]. Return the missing number.",
  examples: [
    { input: "nums = [3,0,1]", output: "2" },
    { input: "nums = [0,1]", output: "2" },
  ],
  constraints: ["n == nums.length", "1 <= n <= 10^4"],
  functionSignature: "def missingNumber(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def missingNumber(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var missingNumber = function(nums) {\n    \n};",
    TypeScript: "function missingNumber(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int missingNumber(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.missingNumber([3,0,1]))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.missingNumber([0,1]))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.missingNumber([0]))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.missingNumber([1]))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.missingNumber([9,6,4,2,3,5,7,0,1]))", expected: "8", isPublic: false },
  ],
},

"Hexaware: Jump Game": {
  company: "hexaware", pattern: "Greedy",
  title: "Jump Game",
  difficulty: "Medium",
  desc: "Given array where nums[i] is max jump length at index i, return true if you can reach last index.",
  examples: [
    { input: "nums = [2,3,1,1,4]", output: "true" },
    { input: "nums = [3,2,1,0,4]", output: "false" },
  ],
  constraints: ["1 <= nums.length <= 3*10^4", "0 <= nums[i] <= 10^5"],
  functionSignature: "def canJump(self, nums: List[int]) -> bool:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def canJump(self, nums: List[int]) -> bool:\n        pass",
    JavaScript: "var canJump = function(nums) {\n    \n};",
    TypeScript: "function canJump(nums: number[]): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean canJump(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.canJump([2,3,1,1,4]))", expected: "True", isPublic: true },
    { script: "sol=Solution()\nprint(sol.canJump([3,2,1,0,4]))", expected: "False", isPublic: true },
    { script: "sol=Solution()\nprint(sol.canJump([0]))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.canJump([2,0,0]))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.canJump([1,0,1,0]))", expected: "False", isPublic: false },
  ],
},

"Hexaware: Gas Station": {
  company: "hexaware", pattern: "Greedy",
  title: "Gas Station",
  difficulty: "Medium",
  desc: "n gas stations in circle. Given gas[i] and cost[i], find starting station to complete circuit. Return -1 if impossible.",
  examples: [
    { input: "gas=[1,2,3,4,5], cost=[3,4,5,1,2]", output: "3" },
    { input: "gas=[2,3,4], cost=[3,4,3]", output: "-1" },
  ],
  constraints: ["n == gas.length == cost.length", "1 <= n <= 10^5"],
  functionSignature: "def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:\n        pass",
    JavaScript: "var canCompleteCircuit = function(gas, cost) {\n    \n};",
    TypeScript: "function canCompleteCircuit(gas: number[], cost: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.canCompleteCircuit([1,2,3,4,5],[3,4,5,1,2]))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.canCompleteCircuit([2,3,4],[3,4,3]))", expected: "-1", isPublic: true },
    { script: "sol=Solution()\nprint(sol.canCompleteCircuit([5],[4]))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.canCompleteCircuit([1,2],[2,1]))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.canCompleteCircuit([3,1,1],[1,2,2]))", expected: "0", isPublic: false },
  ],
},

"Hexaware: Rotate Array": {
  company: "hexaware", pattern: "Array Manipulation",
  title: "Rotate Array",
  difficulty: "Medium",
  desc: "Rotate array to the right by k steps in-place. Return modified array.",
  examples: [
    { input: "nums = [1,2,3,4,5,6,7], k = 3", output: "[5,6,7,1,2,3,4]" },
    { input: "nums = [-1,-100,3,99], k = 2", output: "[3,99,-1,-100]" },
  ],
  constraints: ["1 <= nums.length <= 10^5", "0 <= k <= 10^5"],
  functionSignature: "def rotate(self, nums: List[int], k: int) -> None:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def rotate(self, nums: List[int], k: int) -> None:\n        pass",
    JavaScript: "var rotate = function(nums, k) {\n    \n};",
    TypeScript: "function rotate(nums: number[], k: number): void {\n    \n};",
    Java: "class Solution {\n    public void rotate(int[] nums, int k) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    void rotate(vector<int>& nums, int k) {\n        \n    }\n};",
  },
  testCases: [
    { script: "nums=[1,2,3,4,5,6,7]\nSolution().rotate(nums,3)\nprint(nums)", expected: "[5, 6, 7, 1, 2, 3, 4]", isPublic: true },
    { script: "nums=[-1,-100,3,99]\nSolution().rotate(nums,2)\nprint(nums)", expected: "[3, 99, -1, -100]", isPublic: true },
    { script: "nums=[1,2]\nSolution().rotate(nums,3)\nprint(nums)", expected: "[2, 1]", isPublic: false },
    { script: "nums=[1]\nSolution().rotate(nums,0)\nprint(nums)", expected: "[1]", isPublic: false },
    { script: "nums=[1,2,3]\nSolution().rotate(nums,0)\nprint(nums)", expected: "[1, 2, 3]", isPublic: false },
  ],
},

"Hexaware: Find Minimum in Rotated Sorted Array": {
  company: "hexaware", pattern: "Binary Search",
  title: "Find Minimum in Rotated Sorted Array",
  difficulty: "Medium",
  desc: "Find minimum element in rotated sorted array of unique values. O(log n) required.",
  examples: [
    { input: "nums = [3,4,5,1,2]", output: "1" },
    { input: "nums = [4,5,6,7,0,1,2]", output: "0" },
  ],
  constraints: ["n == nums.length", "1 <= n <= 5000", "All integers unique"],
  functionSignature: "def findMin(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def findMin(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var findMin = function(nums) {\n    \n};",
    TypeScript: "function findMin(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int findMin(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.findMin([3,4,5,1,2]))", expected: "1", isPublic: true },
    { script: "sol=Solution()\nprint(sol.findMin([4,5,6,7,0,1,2]))", expected: "0", isPublic: true },
    { script: "sol=Solution()\nprint(sol.findMin([11,13,15,17]))", expected: "11", isPublic: false },
    { script: "sol=Solution()\nprint(sol.findMin([2,1]))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.findMin([1]))", expected: "1", isPublic: false },
  ],
},

"Hexaware: Search Insert Position": {
  company: "hexaware", pattern: "Binary Search",
  title: "Search Insert Position",
  difficulty: "Easy",
  desc: "Given sorted array and target, return index if found. Else return index where it would be inserted.",
  examples: [
    { input: "nums = [1,3,5,6], target = 5", output: "2" },
    { input: "nums = [1,3,5,6], target = 2", output: "1" },
  ],
  constraints: ["1 <= nums.length <= 10^4", "All values unique, sorted ascending"],
  functionSignature: "def searchInsert(self, nums: List[int], target: int) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def searchInsert(self, nums: List[int], target: int) -> int:\n        pass",
    JavaScript: "var searchInsert = function(nums, target) {\n    \n};",
    TypeScript: "function searchInsert(nums: number[], target: number): number {\n    \n};",
    Java: "class Solution {\n    public int searchInsert(int[] nums, int target) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.searchInsert([1,3,5,6],5))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.searchInsert([1,3,5,6],2))", expected: "1", isPublic: true },
    { script: "sol=Solution()\nprint(sol.searchInsert([1,3,5,6],7))", expected: "4", isPublic: false },
    { script: "sol=Solution()\nprint(sol.searchInsert([1,3,5,6],0))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.searchInsert([1],0))", expected: "0", isPublic: false },
  ],
},

"Hexaware: Majority Element": {
  company: "hexaware", pattern: "Boyer-Moore Voting",
  title: "Majority Element",
  difficulty: "Easy",
  desc: "Find element appearing more than n/2 times. Linear time, O(1) space.",
  examples: [
    { input: "nums = [3,2,3]", output: "3" },
    { input: "nums = [2,2,1,1,1,2,2]", output: "2" },
  ],
  constraints: ["n == nums.length", "1 <= n <= 5*10^4", "Majority element always exists"],
  functionSignature: "def majorityElement(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def majorityElement(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var majorityElement = function(nums) {\n    \n};",
    TypeScript: "function majorityElement(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int majorityElement(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int majorityElement(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.majorityElement([3,2,3]))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.majorityElement([2,2,1,1,1,2,2]))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.majorityElement([1]))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.majorityElement([1,1,2]))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.majorityElement([3,3,4,4,3]))", expected: "3", isPublic: false },
  ],
},

"Hexaware: Happy Number": {
  company: "hexaware", pattern: "Hash Set / Two Pointers",
  title: "Happy Number",
  difficulty: "Easy",
  desc: "A number is happy if replacing it repeatedly with sum of squares of digits eventually reaches 1. Return true if n is happy.",
  examples: [
    { input: "n = 19", output: "true", explanation: "1^2+9^2=82, 8^2+2^2=68, ...->1" },
    { input: "n = 2", output: "false" },
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
    { script: "sol=Solution()\nprint(sol.isHappy(19))", expected: "True", isPublic: true },
    { script: "sol=Solution()\nprint(sol.isHappy(2))", expected: "False", isPublic: true },
    { script: "sol=Solution()\nprint(sol.isHappy(1))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.isHappy(7))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.isHappy(4))", expected: "False", isPublic: false },
  ],
},

"Hexaware: Excel Column Number": {
  company: "hexaware", pattern: "Math / String",
  title: "Excel Sheet Column Number",
  difficulty: "Easy",
  desc: "Given column title like A->1, B->2, Z->26, AA->27, return its column number.",
  examples: [
    { input: "columnTitle = \"A\"", output: "1" },
    { input: "columnTitle = \"AB\"", output: "28" },
  ],
  constraints: ["1 <= columnTitle.length <= 7", "Uppercase English letters only"],
  functionSignature: "def titleToNumber(self, columnTitle: str) -> int:",
  starters: {
    Python: "class Solution:\n    def titleToNumber(self, columnTitle: str) -> int:\n        pass",
    JavaScript: "var titleToNumber = function(columnTitle) {\n    \n};",
    TypeScript: "function titleToNumber(columnTitle: string): number {\n    \n};",
    Java: "class Solution {\n    public int titleToNumber(String columnTitle) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int titleToNumber(string columnTitle) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.titleToNumber(\"A\"))", expected: "1", isPublic: true },
    { script: "sol=Solution()\nprint(sol.titleToNumber(\"AB\"))", expected: "28", isPublic: true },
    { script: "sol=Solution()\nprint(sol.titleToNumber(\"Z\"))", expected: "26", isPublic: false },
    { script: "sol=Solution()\nprint(sol.titleToNumber(\"AA\"))", expected: "27", isPublic: false },
    { script: "sol=Solution()\nprint(sol.titleToNumber(\"ZY\"))", expected: "701", isPublic: false },
  ],
},

"Hexaware: Ugly Number": {
  company: "hexaware", pattern: "Math",
  title: "Ugly Number",
  difficulty: "Easy",
  desc: "Return true if n is ugly: positive integer whose prime factors are limited to 2, 3, and 5.",
  examples: [
    { input: "n = 6", output: "true", explanation: "6 = 2*3" },
    { input: "n = 14", output: "false", explanation: "14=2*7" },
  ],
  constraints: ["n can be any signed 32-bit integer"],
  functionSignature: "def isUgly(self, n: int) -> bool:",
  starters: {
    Python: "class Solution:\n    def isUgly(self, n: int) -> bool:\n        pass",
    JavaScript: "var isUgly = function(n) {\n    \n};",
    TypeScript: "function isUgly(n: number): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isUgly(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isUgly(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.isUgly(6))", expected: "True", isPublic: true },
    { script: "sol=Solution()\nprint(sol.isUgly(14))", expected: "False", isPublic: true },
    { script: "sol=Solution()\nprint(sol.isUgly(1))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.isUgly(0))", expected: "False", isPublic: false },
    { script: "sol=Solution()\nprint(sol.isUgly(8))", expected: "True", isPublic: false },
  ],
},

"Hexaware: Is Subsequence": {
  company: "hexaware", pattern: "Two Pointers",
  title: "Is Subsequence",
  difficulty: "Easy",
  desc: "Return true if s is a subsequence of t (can delete chars from t without reordering).",
  examples: [
    { input: "s = \"abc\", t = \"ahbgdc\"", output: "true" },
    { input: "s = \"axc\", t = \"ahbgdc\"", output: "false" },
  ],
  constraints: ["0 <= s.length <= 100", "0 <= t.length <= 10^4"],
  functionSignature: "def isSubsequence(self, s: str, t: str) -> bool:",
  starters: {
    Python: "class Solution:\n    def isSubsequence(self, s: str, t: str) -> bool:\n        pass",
    JavaScript: "var isSubsequence = function(s, t) {\n    \n};",
    TypeScript: "function isSubsequence(s: string, t: string): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isSubsequence(String s, String t) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isSubsequence(string s, string t) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.isSubsequence(\"abc\",\"ahbgdc\"))", expected: "True", isPublic: true },
    { script: "sol=Solution()\nprint(sol.isSubsequence(\"axc\",\"ahbgdc\"))", expected: "False", isPublic: true },
    { script: "sol=Solution()\nprint(sol.isSubsequence(\"\",\"ahbgdc\"))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.isSubsequence(\"b\",\"c\"))", expected: "False", isPublic: false },
    { script: "sol=Solution()\nprint(sol.isSubsequence(\"ace\",\"abcde\"))", expected: "True", isPublic: false },
  ],
},

"Hexaware: Fibonacci Number": {
  company: "hexaware", pattern: "Dynamic Programming",
  title: "Fibonacci Number",
  difficulty: "Easy",
  desc: "Return nth Fibonacci number. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).",
  examples: [
    { input: "n = 4", output: "3" },
    { input: "n = 10", output: "55" },
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
    { script: "sol=Solution()\nprint(sol.fib(4))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.fib(10))", expected: "55", isPublic: true },
    { script: "sol=Solution()\nprint(sol.fib(0))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.fib(1))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.fib(20))", expected: "6765", isPublic: false },
  ],
},

"Hexaware: Add Digits": {
  company: "hexaware", pattern: "Math / Recursion",
  title: "Add Digits",
  difficulty: "Easy",
  desc: "Repeatedly add all digits of num until result has only one digit. Return it.",
  examples: [
    { input: "num = 38", output: "2", explanation: "3+8=11, 1+1=2" },
    { input: "num = 0", output: "0" },
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
    { script: "sol=Solution()\nprint(sol.addDigits(38))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.addDigits(0))", expected: "0", isPublic: true },
    { script: "sol=Solution()\nprint(sol.addDigits(9))", expected: "9", isPublic: false },
    { script: "sol=Solution()\nprint(sol.addDigits(999))", expected: "9", isPublic: false },
    { script: "sol=Solution()\nprint(sol.addDigits(100))", expected: "1", isPublic: false },
  ],
},

"Hexaware: Counting Bits": {
  company: "hexaware", pattern: "Dynamic Programming / Bit",
  title: "Counting Bits",
  difficulty: "Easy",
  desc: "Return array ans of length n+1 where ans[i] is number of 1s in binary representation of i.",
  examples: [
    { input: "n = 2", output: "[0,1,1]" },
    { input: "n = 5", output: "[0,1,1,2,1,2]" },
  ],
  constraints: ["0 <= n <= 10^5"],
  functionSignature: "def countBits(self, n: int) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def countBits(self, n: int) -> List[int]:\n        pass",
    JavaScript: "var countBits = function(n) {\n    \n};",
    TypeScript: "function countBits(n: number): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] countBits(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> countBits(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.countBits(2))", expected: "[0, 1, 1]", isPublic: true },
    { script: "sol=Solution()\nprint(sol.countBits(5))", expected: "[0, 1, 1, 2, 1, 2]", isPublic: true },
    { script: "sol=Solution()\nprint(sol.countBits(0))", expected: "[0]", isPublic: false },
    { script: "sol=Solution()\nprint(sol.countBits(1))", expected: "[0, 1]", isPublic: false },
    { script: "sol=Solution()\nprint(sol.countBits(8))", expected: "[0, 1, 1, 2, 1, 2, 2, 3, 1]", isPublic: false },
  ],
},

"Hexaware: Reverse Integer": {
  company: "hexaware", pattern: "Math / String",
  title: "Reverse Integer",
  difficulty: "Medium",
  desc: "Given signed 32-bit integer x, return x with digits reversed. Return 0 if out of range.",
  examples: [
    { input: "x = 123", output: "321" },
    { input: "x = -123", output: "-321" },
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
    { script: "sol=Solution()\nprint(sol.reverse(123))", expected: "321", isPublic: true },
    { script: "sol=Solution()\nprint(sol.reverse(-123))", expected: "-321", isPublic: true },
    { script: "sol=Solution()\nprint(sol.reverse(120))", expected: "21", isPublic: false },
    { script: "sol=Solution()\nprint(sol.reverse(0))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.reverse(1534236469))", expected: "0", isPublic: false },
  ],
},


// =============================================================================
// LTIMINDTREE (16 problems)
// =============================================================================

"LTIMindtree: Longest Increasing Subsequence": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Longest Increasing Subsequence",
  difficulty: "Medium",
  desc: "Return length of longest strictly increasing subsequence.",
  examples: [
    { input: "nums = [10,9,2,5,3,7,101,18]", output: "4" },
    { input: "nums = [0,1,0,3,2,3]", output: "4" },
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
    { script: "sol=Solution()\nprint(sol.lengthOfLIS([10,9,2,5,3,7,101,18]))", expected: "4", isPublic: true },
    { script: "sol=Solution()\nprint(sol.lengthOfLIS([0,1,0,3,2,3]))", expected: "4", isPublic: true },
    { script: "sol=Solution()\nprint(sol.lengthOfLIS([7,7,7,7,7]))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.lengthOfLIS([1,3,6,7,9,4,10,5,6]))", expected: "6", isPublic: false },
    { script: "sol=Solution()\nprint(sol.lengthOfLIS([1]))", expected: "1", isPublic: false },
  ],
},

"LTIMindtree: Word Break": {
  company: "ltimindtree", pattern: "Dynamic Programming / BFS",
  title: "Word Break",
  difficulty: "Medium",
  desc: "Given string s and dictionary wordDict, return true if s can be segmented into dictionary words.",
  examples: [
    { input: "s = \"leetcode\", wordDict = [\"leet\",\"code\"]", output: "true" },
    { input: "s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]", output: "true" },
  ],
  constraints: ["1 <= s.length <= 300", "1 <= wordDict.length <= 1000"],
  functionSignature: "def wordBreak(self, s: str, wordDict: List[str]) -> bool:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def wordBreak(self, s: str, wordDict: List[str]) -> bool:\n        pass",
    JavaScript: "var wordBreak = function(s, wordDict) {\n    \n};",
    TypeScript: "function wordBreak(s: string, wordDict: string[]): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool wordBreak(string s, vector<string>& wordDict) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.wordBreak(\"leetcode\",[\"leet\",\"code\"]))", expected: "True", isPublic: true },
    { script: "sol=Solution()\nprint(sol.wordBreak(\"catsandog\",[\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]))", expected: "False", isPublic: true },
    { script: "sol=Solution()\nprint(sol.wordBreak(\"a\",[\"a\"]))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.wordBreak(\"applepenapple\",[\"apple\",\"pen\"]))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.wordBreak(\"cars\",[\"car\",\"ca\",\"rs\"]))", expected: "True", isPublic: false },
  ],
},

"LTIMindtree: House Robber": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "House Robber",
  difficulty: "Medium",
  desc: "Cannot rob adjacent houses. Return maximum money you can rob.",
  examples: [
    { input: "nums = [1,2,3,1]", output: "4" },
    { input: "nums = [2,7,9,3,1]", output: "12" },
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
    { script: "sol=Solution()\nprint(sol.rob([1,2,3,1]))", expected: "4", isPublic: true },
    { script: "sol=Solution()\nprint(sol.rob([2,7,9,3,1]))", expected: "12", isPublic: true },
    { script: "sol=Solution()\nprint(sol.rob([0]))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.rob([1,2]))", expected: "2", isPublic: false },
    { script: "sol=Solution()\nprint(sol.rob([2,1,1,2]))", expected: "4", isPublic: false },
  ],
},

"LTIMindtree: Coin Change": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Coin Change",
  difficulty: "Medium",
  desc: "Return fewest coins needed to make up amount. Return -1 if impossible.",
  examples: [
    { input: "coins = [1,2,5], amount = 11", output: "3" },
    { input: "coins = [2], amount = 3", output: "-1" },
  ],
  constraints: ["1 <= coins.length <= 12", "0 <= amount <= 10^4"],
  functionSignature: "def coinChange(self, coins: List[int], amount: int) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def coinChange(self, coins: List[int], amount: int) -> int:\n        pass",
    JavaScript: "var coinChange = function(coins, amount) {\n    \n};",
    TypeScript: "function coinChange(coins: number[], amount: number): number {\n    \n};",
    Java: "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.coinChange([1,2,5],11))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.coinChange([2],3))", expected: "-1", isPublic: true },
    { script: "sol=Solution()\nprint(sol.coinChange([1],0))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.coinChange([1,5,11,25],41))", expected: "3", isPublic: false },
    { script: "sol=Solution()\nprint(sol.coinChange([1],2))", expected: "2", isPublic: false },
  ],
},

"LTIMindtree: Unique Paths": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Unique Paths",
  difficulty: "Medium",
  desc: "Robot on m x n grid can only move right or down. Count unique paths from top-left to bottom-right.",
  examples: [
    { input: "m = 3, n = 7", output: "28" },
    { input: "m = 3, n = 2", output: "3" },
  ],
  constraints: ["1 <= m, n <= 100"],
  functionSignature: "def uniquePaths(self, m: int, n: int) -> int:",
  starters: {
    Python: "class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        pass",
    JavaScript: "var uniquePaths = function(m, n) {\n    \n};",
    TypeScript: "function uniquePaths(m: number, n: number): number {\n    \n};",
    Java: "class Solution {\n    public int uniquePaths(int m, int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int uniquePaths(int m, int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.uniquePaths(3,7))", expected: "28", isPublic: true },
    { script: "sol=Solution()\nprint(sol.uniquePaths(3,2))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.uniquePaths(1,1))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.uniquePaths(2,2))", expected: "2", isPublic: false },
    { script: "sol=Solution()\nprint(sol.uniquePaths(5,5))", expected: "70", isPublic: false },
  ],
},

"LTIMindtree: Decode Ways": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Decode Ways",
  difficulty: "Medium",
  desc: "A->1...Z->26. Given string s of digits, return number of ways to decode it.",
  examples: [
    { input: "s = \"12\"", output: "2", explanation: "AB or L" },
    { input: "s = \"226\"", output: "3" },
  ],
  constraints: ["1 <= s.length <= 100", "s contains only digits"],
  functionSignature: "def numDecodings(self, s: str) -> int:",
  starters: {
    Python: "class Solution:\n    def numDecodings(self, s: str) -> int:\n        pass",
    JavaScript: "var numDecodings = function(s) {\n    \n};",
    TypeScript: "function numDecodings(s: string): number {\n    \n};",
    Java: "class Solution {\n    public int numDecodings(String s) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int numDecodings(string s) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.numDecodings(\"12\"))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.numDecodings(\"226\"))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.numDecodings(\"0\"))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.numDecodings(\"06\"))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.numDecodings(\"11106\"))", expected: "2", isPublic: false },
  ],
},

"LTIMindtree: Minimum Path Sum": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Minimum Path Sum",
  difficulty: "Medium",
  desc: "Find path from top-left to bottom-right minimizing sum. Only move right or down.",
  examples: [
    { input: "grid = [[1,3,1],[1,5,1],[4,2,1]]", output: "7" },
    { input: "grid = [[1,2,3],[4,5,6]]", output: "12" },
  ],
  constraints: ["m == grid.length", "n == grid[0].length", "1 <= m, n <= 200"],
  functionSignature: "def minPathSum(self, grid: List[List[int]]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def minPathSum(self, grid: List[List[int]]) -> int:\n        pass",
    JavaScript: "var minPathSum = function(grid) {\n    \n};",
    TypeScript: "function minPathSum(grid: number[][]): number {\n    \n};",
    Java: "class Solution {\n    public int minPathSum(int[][] grid) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int minPathSum(vector<vector<int>>& grid) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.minPathSum([[1,3,1],[1,5,1],[4,2,1]]))", expected: "7", isPublic: true },
    { script: "sol=Solution()\nprint(sol.minPathSum([[1,2,3],[4,5,6]]))", expected: "12", isPublic: true },
    { script: "sol=Solution()\nprint(sol.minPathSum([[1]]))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.minPathSum([[1,2],[1,1]]))", expected: "3", isPublic: false },
    { script: "sol=Solution()\nprint(sol.minPathSum([[1,4,8,6],[5,3,9,7],[2,2,2,2]]))", expected: "16", isPublic: false },
  ],
},

"LTIMindtree: Maximum Product Subarray": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Maximum Product Subarray",
  difficulty: "Medium",
  desc: "Find contiguous subarray with largest product.",
  examples: [
    { input: "nums = [2,3,-2,4]", output: "6" },
    { input: "nums = [-2,0,-1]", output: "0" },
  ],
  constraints: ["1 <= nums.length <= 2*10^4", "-10 <= nums[i] <= 10"],
  functionSignature: "def maxProduct(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def maxProduct(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var maxProduct = function(nums) {\n    \n};",
    TypeScript: "function maxProduct(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int maxProduct(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int maxProduct(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.maxProduct([2,3,-2,4]))", expected: "6", isPublic: true },
    { script: "sol=Solution()\nprint(sol.maxProduct([-2,0,-1]))", expected: "0", isPublic: true },
    { script: "sol=Solution()\nprint(sol.maxProduct([-2]))", expected: "-2", isPublic: false },
    { script: "sol=Solution()\nprint(sol.maxProduct([-2,3,-4]))", expected: "24", isPublic: false },
    { script: "sol=Solution()\nprint(sol.maxProduct([0,2]))", expected: "2", isPublic: false },
  ],
},

"LTIMindtree: Longest Common Subsequence": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Longest Common Subsequence",
  difficulty: "Medium",
  desc: "Return length of longest common subsequence of text1 and text2.",
  examples: [
    { input: "text1 = \"abcde\", text2 = \"ace\"", output: "3" },
    { input: "text1 = \"abc\", text2 = \"abc\"", output: "3" },
  ],
  constraints: ["1 <= text1.length, text2.length <= 1000", "Only lowercase English characters"],
  functionSignature: "def longestCommonSubsequence(self, text1: str, text2: str) -> int:",
  starters: {
    Python: "class Solution:\n    def longestCommonSubsequence(self, text1: str, text2: str) -> int:\n        pass",
    JavaScript: "var longestCommonSubsequence = function(text1, text2) {\n    \n};",
    TypeScript: "function longestCommonSubsequence(text1: string, text2: string): number {\n    \n};",
    Java: "class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int longestCommonSubsequence(string text1, string text2) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.longestCommonSubsequence(\"abcde\",\"ace\"))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.longestCommonSubsequence(\"abc\",\"abc\"))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.longestCommonSubsequence(\"abc\",\"def\"))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.longestCommonSubsequence(\"a\",\"b\"))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.longestCommonSubsequence(\"oxcpqrsvwf\",\"shmtulqrypy\"))", expected: "2", isPublic: false },
  ],
},

"LTIMindtree: Perfect Squares": {
  company: "ltimindtree", pattern: "Dynamic Programming / BFS",
  title: "Perfect Squares",
  difficulty: "Medium",
  desc: "Return minimum number of perfect square numbers that sum to n.",
  examples: [
    { input: "n = 12", output: "3", explanation: "4+4+4" },
    { input: "n = 13", output: "2", explanation: "4+9" },
  ],
  constraints: ["1 <= n <= 10^4"],
  functionSignature: "def numSquares(self, n: int) -> int:",
  starters: {
    Python: "class Solution:\n    def numSquares(self, n: int) -> int:\n        pass",
    JavaScript: "var numSquares = function(n) {\n    \n};",
    TypeScript: "function numSquares(n: number): number {\n    \n};",
    Java: "class Solution {\n    public int numSquares(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int numSquares(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.numSquares(12))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.numSquares(13))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.numSquares(1))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.numSquares(4))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.numSquares(7))", expected: "4", isPublic: false },
  ],
},

"LTIMindtree: Triangle Minimum Path": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Triangle Minimum Path",
  difficulty: "Medium",
  desc: "Given triangle array, find minimum path sum from top to bottom. Each step moves to adjacent numbers below.",
  examples: [
    { input: "triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]", output: "11" },
    { input: "triangle = [[-10]]", output: "-10" },
  ],
  constraints: ["1 <= triangle.length <= 200", "triangle[0].length == 1"],
  functionSignature: "def minimumTotal(self, triangle: List[List[int]]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def minimumTotal(self, triangle: List[List[int]]) -> int:\n        pass",
    JavaScript: "var minimumTotal = function(triangle) {\n    \n};",
    TypeScript: "function minimumTotal(triangle: number[][]): number {\n    \n};",
    Java: "class Solution {\n    public int minimumTotal(List<List<Integer>> triangle) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int minimumTotal(vector<vector<int>>& triangle) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.minimumTotal([[2],[3,4],[6,5,7],[4,1,8,3]]))", expected: "11", isPublic: true },
    { script: "sol=Solution()\nprint(sol.minimumTotal([[-10]]))", expected: "-10", isPublic: true },
    { script: "sol=Solution()\nprint(sol.minimumTotal([[1],[2,3]]))", expected: "3", isPublic: false },
    { script: "sol=Solution()\nprint(sol.minimumTotal([[1],[2,3],[4,5,6]]))", expected: "7", isPublic: false },
    { script: "sol=Solution()\nprint(sol.minimumTotal([[-1],[2,3],[1,-1,-3]]))", expected: "-1", isPublic: false },
  ],
},

"LTIMindtree: Arithmetic Slices": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Arithmetic Slices",
  difficulty: "Medium",
  desc: "Array is arithmetic if at least 3 elements with equal differences. Return number of arithmetic subarrays.",
  examples: [
    { input: "nums = [1,2,3,4]", output: "3" },
    { input: "nums = [1]", output: "0" },
  ],
  constraints: ["1 <= nums.length <= 5000", "-1000 <= nums[i] <= 1000"],
  functionSignature: "def numberOfArithmeticSlices(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def numberOfArithmeticSlices(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var numberOfArithmeticSlices = function(nums) {\n    \n};",
    TypeScript: "function numberOfArithmeticSlices(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int numberOfArithmeticSlices(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int numberOfArithmeticSlices(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.numberOfArithmeticSlices([1,2,3,4]))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.numberOfArithmeticSlices([1]))", expected: "0", isPublic: true },
    { script: "sol=Solution()\nprint(sol.numberOfArithmeticSlices([1,2,3]))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.numberOfArithmeticSlices([1,2,3,4,5]))", expected: "6", isPublic: false },
    { script: "sol=Solution()\nprint(sol.numberOfArithmeticSlices([1,3,5,7,9]))", expected: "6", isPublic: false },
  ],
},

"LTIMindtree: Partition Equal Subset Sum": {
  company: "ltimindtree", pattern: "Dynamic Programming / Knapsack",
  title: "Partition Equal Subset Sum",
  difficulty: "Medium",
  desc: "Return true if array can be partitioned into two subsets with equal sum.",
  examples: [
    { input: "nums = [1,5,11,5]", output: "true" },
    { input: "nums = [1,2,3,5]", output: "false" },
  ],
  constraints: ["1 <= nums.length <= 200", "1 <= nums[i] <= 100"],
  functionSignature: "def canPartition(self, nums: List[int]) -> bool:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def canPartition(self, nums: List[int]) -> bool:\n        pass",
    JavaScript: "var canPartition = function(nums) {\n    \n};",
    TypeScript: "function canPartition(nums: number[]): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean canPartition(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool canPartition(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.canPartition([1,5,11,5]))", expected: "True", isPublic: true },
    { script: "sol=Solution()\nprint(sol.canPartition([1,2,3,5]))", expected: "False", isPublic: true },
    { script: "sol=Solution()\nprint(sol.canPartition([1,1]))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.canPartition([1,2]))", expected: "False", isPublic: false },
    { script: "sol=Solution()\nprint(sol.canPartition([2,2,3,5]))", expected: "False", isPublic: false },
  ],
},

"LTIMindtree: Jump Game II": {
  company: "ltimindtree", pattern: "Greedy / BFS",
  title: "Jump Game II",
  difficulty: "Medium",
  desc: "Return minimum number of jumps to reach last index. You can always reach the last index.",
  examples: [
    { input: "nums = [2,3,1,1,4]", output: "2" },
    { input: "nums = [2,3,0,1,4]", output: "2" },
  ],
  constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 1000", "Can always reach last index"],
  functionSignature: "def jump(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def jump(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var jump = function(nums) {\n    \n};",
    TypeScript: "function jump(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int jump(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int jump(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.jump([2,3,1,1,4]))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.jump([2,3,0,1,4]))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.jump([1]))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.jump([1,2,3]))", expected: "2", isPublic: false },
    { script: "sol=Solution()\nprint(sol.jump([1,1,1,1]))", expected: "3", isPublic: false },
  ],
},


// =============================================================================
// ZENSAR (16 problems)
// =============================================================================

"Zensar: Inorder Traversal": {
  company: "zensar", pattern: "Tree DFS",
  title: "Binary Tree Inorder Traversal",
  difficulty: "Easy",
  desc: "Return inorder traversal of binary tree values.",
  examples: [
    { input: "root = [1,null,2,3]", output: "[1,3,2]" },
    { input: "root = []", output: "[]" },
  ],
  constraints: ["0 to 100 nodes", "-100 <= Node.val <= 100"],
  functionSignature: "def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:",
  starters: {
    Python: "from typing import Optional, List\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\nclass Solution:\n    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:\n        pass",
    JavaScript: "var inorderTraversal = function(root) {\n    \n};",
    TypeScript: "function inorderTraversal(root: TreeNode | null): number[] {\n    \n};",
    Java: "class Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> inorderTraversal(TreeNode* root) {\n        \n    }\n};",
  },
  testCases: [
    { script: "root=TreeNode(1,None,TreeNode(2,TreeNode(3)))\nprint(Solution().inorderTraversal(root))", expected: "[1, 3, 2]", isPublic: true },
    { script: "print(Solution().inorderTraversal(None))", expected: "[]", isPublic: true },
    { script: "print(Solution().inorderTraversal(TreeNode(1)))", expected: "[1]", isPublic: false },
    { script: "root=TreeNode(2,TreeNode(1),TreeNode(3))\nprint(Solution().inorderTraversal(root))", expected: "[1, 2, 3]", isPublic: false },
    { script: "root=TreeNode(1,TreeNode(2,TreeNode(3),TreeNode(4)),TreeNode(5))\nprint(Solution().inorderTraversal(root))", expected: "[3, 2, 4, 1, 5]", isPublic: false },
  ],
},

"Zensar: Same Tree": {
  company: "zensar", pattern: "Tree DFS",
  title: "Same Tree",
  difficulty: "Easy",
  desc: "Given roots of two binary trees, check if they are same (same structure and values).",
  examples: [
    { input: "p=[1,2,3], q=[1,2,3]", output: "true" },
    { input: "p=[1,2], q=[1,null,2]", output: "false" },
  ],
  constraints: ["0 to 100 nodes per tree", "-10^4 <= Node.val <= 10^4"],
  functionSignature: "def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:",
  starters: {
    Python: "from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\nclass Solution:\n    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:\n        pass",
    JavaScript: "var isSameTree = function(p, q) {\n    \n};",
    TypeScript: "function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isSameTree(TreeNode p, TreeNode q) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isSameTree(TreeNode* p, TreeNode* q) {\n        \n    }\n};",
  },
  testCases: [
    { script: "p=TreeNode(1,TreeNode(2),TreeNode(3))\nq=TreeNode(1,TreeNode(2),TreeNode(3))\nprint(Solution().isSameTree(p,q))", expected: "True", isPublic: true },
    { script: "p=TreeNode(1,TreeNode(2))\nq=TreeNode(1,None,TreeNode(2))\nprint(Solution().isSameTree(p,q))", expected: "False", isPublic: true },
    { script: "print(Solution().isSameTree(None,None))", expected: "True", isPublic: false },
    { script: "print(Solution().isSameTree(TreeNode(1),None))", expected: "False", isPublic: false },
    { script: "p=TreeNode(1,TreeNode(2),TreeNode(1))\nq=TreeNode(1,TreeNode(1),TreeNode(2))\nprint(Solution().isSameTree(p,q))", expected: "False", isPublic: false },
  ],
},

// =============================================================================
// MPHASIS (16 problems)
// =============================================================================

"Mphasis: Two Sum II": {
  company: "mphasis", pattern: "Two Pointers",
  title: "Two Sum II",
  difficulty: "Medium",
  desc: "Given 1-indexed sorted array, find two numbers summing to target. Return 1-indexed indices.",
  examples: [
    { input: "numbers=[2,7,11,15], target=9", output: "[1,2]" },
    { input: "numbers=[2,3,4], target=6", output: "[1,3]" },
  ],
  constraints: ["2 <= numbers.length <= 3*10^4", "Exactly one solution"],
  functionSignature: "def twoSum(self, numbers: List[int], target: int) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def twoSum(self, numbers: List[int], target: int) -> List[int]:\n        pass",
    JavaScript: "var twoSum = function(numbers, target) {\n    \n};",
    TypeScript: "function twoSum(numbers: number[], target: number): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& numbers, int target) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.twoSum([2,7,11,15],9))", expected: "[1, 2]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.twoSum([2,3,4],6))", expected: "[1, 3]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.twoSum([1,2,3,4,5],9))", expected: "[4, 5]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.twoSum([2,11,15,16],13))", expected: "[1, 2]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.twoSum([5,25,75],100))", expected: "[2, 3]", isPublic: false },
  ],
},

"Mphasis: Valid Anagram": {
  company: "mphasis", pattern: "Hash Map / Sorting",
  title: "Valid Anagram",
  difficulty: "Easy",
  desc: "Return true if t is an anagram of s (same characters, same frequency).",
  examples: [
    { input: "s = \"anagram\", t = \"nagaram\"", output: "true" },
    { input: "s = \"rat\", t = \"car\"", output: "false" },
  ],
  constraints: ["1 <= s.length, t.length <= 5*10^4", "s and t consist of lowercase letters"],
  functionSignature: "def isAnagram(self, s: str, t: str) -> bool:",
  starters: {
    Python: "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass",
    JavaScript: "var isAnagram = function(s, t) {\n    \n};",
    TypeScript: "function isAnagram(s: string, t: string): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isAnagram(String s, String t) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.isAnagram(\"anagram\",\"nagaram\"))", expected: "True", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isAnagram(\"rat\",\"car\"))", expected: "False", isPublic: true },
    { script: "sol = Solution()\nprint(sol.isAnagram(\"a\",\"a\"))", expected: "True", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isAnagram(\"ab\",\"a\"))", expected: "False", isPublic: false },
    { script: "sol = Solution()\nprint(sol.isAnagram(\"listen\",\"silent\"))", expected: "True", isPublic: false },
  ],
},

"Mphasis: Move Zeroes": {
  company: "mphasis", pattern: "Two Pointers",
  title: "Move Zeroes",
  difficulty: "Easy",
  desc: "Move all zeroes to end maintaining relative order of non-zero elements. Modify in-place.",
  examples: [
    { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" },
    { input: "nums = [0]", output: "[0]" },
  ],
  constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^9"],
  functionSignature: "def moveZeroes(self, nums: List[int]) -> None:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def moveZeroes(self, nums: List[int]) -> None:\n        pass",
    JavaScript: "var moveZeroes = function(nums) {\n    \n};",
    TypeScript: "function moveZeroes(nums: number[]): void {\n    \n};",
    Java: "class Solution {\n    public void moveZeroes(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    void moveZeroes(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "nums=[0,1,0,3,12]\nSolution().moveZeroes(nums)\nprint(nums)", expected: "[1, 3, 12, 0, 0]", isPublic: true },
    { script: "nums=[0]\nSolution().moveZeroes(nums)\nprint(nums)", expected: "[0]", isPublic: true },
    { script: "nums=[1]\nSolution().moveZeroes(nums)\nprint(nums)", expected: "[1]", isPublic: false },
    { script: "nums=[0,0,1]\nSolution().moveZeroes(nums)\nprint(nums)", expected: "[1, 0, 0]", isPublic: false },
    { script: "nums=[1,0,0,0,1]\nSolution().moveZeroes(nums)\nprint(nums)", expected: "[1, 1, 0, 0, 0]", isPublic: false },
  ],
},

"Mphasis: Find All Duplicates": {
  company: "mphasis", pattern: "Array / Index Marking",
  title: "Find All Duplicates in an Array",
  difficulty: "Medium",
  desc: "Array of n integers in [1,n]. Each element appears once or twice. Return all appearing twice.",
  examples: [
    { input: "nums = [4,3,2,7,8,2,3,1]", output: "[2,3]" },
    { input: "nums = [1,1,2]", output: "[1]" },
  ],
  constraints: ["n == nums.length", "1 <= nums[i] <= n"],
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

"Mphasis: Min Stack": {
  company: "mphasis", pattern: "Stack / Design",
  title: "Min Stack",
  difficulty: "Medium",
  desc: "Design stack that supports push, pop, top, and retrieving minimum in O(1).",
  examples: [
    { input: "push(-2), push(0), push(-3), getMin()->-3, pop, top->0, getMin->-2", output: "-3, 0, -2" },
  ],
  constraints: ["pop/top/getMin called on non-empty stack", "At most 3*10^4 operations"],
  functionSignature: "def getMin(self) -> int:",
  starters: {
    Python: "class MinStack:\n    def __init__(self):\n        pass\n\n    def push(self, val: int) -> None:\n        pass\n\n    def pop(self) -> None:\n        pass\n\n    def top(self) -> int:\n        pass\n\n    def getMin(self) -> int:\n        pass",
    JavaScript: "class MinStack {\n    constructor() {}\n    push(val) {}\n    pop() {}\n    top() { return 0; }\n    getMin() { return 0; }\n}",
    TypeScript: "class MinStack {\n    constructor() {}\n    push(val: number): void {}\n    pop(): void {}\n    top(): number { return 0; }\n    getMin(): number { return 0; }\n}",
    Java: "class MinStack {\n    public MinStack() {}\n    public void push(int val) {}\n    public void pop() {}\n    public int top() { return 0; }\n    public int getMin() { return 0; }\n}",
    "C++": "class MinStack {\npublic:\n    MinStack() {}\n    void push(int val) {}\n    void pop() {}\n    int top() { return 0; }\n    int getMin() { return 0; }\n};",
  },
  testCases: [
    { script: "ms = MinStack()\nms.push(-2); ms.push(0); ms.push(-3)\nprint(ms.getMin())", expected: "-3", isPublic: true },
    { script: "ms = MinStack()\nms.push(-2); ms.push(0); ms.push(-3); ms.pop()\nprint(ms.top())", expected: "0", isPublic: true },
    { script: "ms = MinStack()\nms.push(-2); ms.push(0); ms.push(-3); ms.pop()\nprint(ms.getMin())", expected: "-2", isPublic: false },
    { script: "ms = MinStack()\nms.push(5)\nprint(ms.getMin())", expected: "5", isPublic: false },
    { script: "ms = MinStack()\nms.push(2); ms.push(0); ms.push(3); ms.push(0)\nprint(ms.getMin())", expected: "0", isPublic: false },
  ],
},

"Mphasis: Maximum Depth Binary Tree": {
  company: "mphasis", pattern: "Tree DFS",
  title: "Maximum Depth of Binary Tree",
  difficulty: "Easy",
  desc: "Return maximum depth of a binary tree (number of nodes along longest root-to-leaf path).",
  examples: [
    { input: "root = [3,9,20,null,null,15,7]", output: "3" },
    { input: "root = [1,null,2]", output: "2" },
  ],
  constraints: ["0 to 10^4 nodes", "-100 <= Node.val <= 100"],
  functionSignature: "def maxDepth(self, root: Optional[TreeNode]) -> int:",
  starters: {
    Python: "from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\nclass Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        pass",
    JavaScript: "var maxDepth = function(root) {\n    \n};",
    TypeScript: "function maxDepth(root: TreeNode | null): number {\n    \n};",
    Java: "class Solution {\n    public int maxDepth(TreeNode root) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        \n    }\n};",
  },
  testCases: [
    { script: "root = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))\nprint(Solution().maxDepth(root))", expected: "3", isPublic: true },
    { script: "print(Solution().maxDepth(None))", expected: "0", isPublic: true },
    { script: "print(Solution().maxDepth(TreeNode(1)))", expected: "1", isPublic: false },
    { script: "root = TreeNode(1, TreeNode(2, TreeNode(3, TreeNode(4))))\nprint(Solution().maxDepth(root))", expected: "4", isPublic: false },
    { script: "root = TreeNode(1, None, TreeNode(2))\nprint(Solution().maxDepth(root))", expected: "2", isPublic: false },
  ],
},

"Mphasis: Sorted Array to BST": {
  company: "mphasis", pattern: "Tree / Divide and Conquer",
  title: "Convert Sorted Array to BST",
  difficulty: "Easy",
  desc: "Convert sorted array to height-balanced BST. Return root.",
  examples: [
    { input: "nums = [-10,-3,0,5,9]", output: "[0,-3,9,-10,null,5]" },
    { input: "nums = [1,3]", output: "[3,1]" },
  ],
  constraints: ["1 <= nums.length <= 10^4", "nums is sorted strictly increasing"],
  functionSignature: "def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:",
  starters: {
    Python: "from typing import List, Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\nclass Solution:\n    def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:\n        pass",
    JavaScript: "var sortedArrayToBST = function(nums) {\n    \n};",
    TypeScript: "function sortedArrayToBST(nums: number[]): TreeNode | null {\n    \n};",
    Java: "class Solution {\n    public TreeNode sortedArrayToBST(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    TreeNode* sortedArrayToBST(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "def inorder(n):\n    return inorder(n.left)+[n.val]+inorder(n.right) if n else []\nprint(inorder(Solution().sortedArrayToBST([-10,-3,0,5,9])))", expected: "[-10, -3, 0, 5, 9]", isPublic: true },
    { script: "def inorder(n):\n    return inorder(n.left)+[n.val]+inorder(n.right) if n else []\nprint(inorder(Solution().sortedArrayToBST([1,3])))", expected: "[1, 3]", isPublic: true },
    { script: "root = Solution().sortedArrayToBST([1])\nprint(root.val)", expected: "1", isPublic: false },
    { script: "root = Solution().sortedArrayToBST([1,2,3])\nprint(root.val)", expected: "2", isPublic: false },
    { script: "def h(n):\n    return 0 if not n else 1+max(h(n.left),h(n.right))\nroot = Solution().sortedArrayToBST(list(range(7)))\nprint(h(root) <= 3)", expected: "True", isPublic: false },
  ],
},

"Mphasis: Merge Sorted Array": {
  company: "mphasis", pattern: "Two Pointers",
  title: "Merge Sorted Array",
  difficulty: "Easy",
  desc: "Merge nums2 into nums1. nums1 has length m+n with m elements. Return sorted merged array.",
  examples: [
    { input: "nums1=[1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3", output: "[1,2,2,3,5,6]" },
    { input: "nums1=[1], m=1, nums2=[], n=0", output: "[1]" },
  ],
  constraints: ["0 <= m, n <= 200", "1 <= m + n <= 200"],
  functionSignature: "def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> List[int]:\n        pass",
    JavaScript: "var merge = function(nums1, m, nums2, n) {\n    \n};",
    TypeScript: "function merge(nums1: number[], m: number, nums2: number[], n: number): number[] {\n    \n};",
    Java: "class Solution {\n    public void merge(int[] nums1, int m, int[] nums2, int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nnums1=[1,2,3,0,0,0]\nprint(sol.merge(nums1,3,[2,5,6],3) or nums1)", expected: "[1, 2, 2, 3, 5, 6]", isPublic: true },
    { script: "sol = Solution()\nnums1=[1]\nprint(sol.merge(nums1,1,[],0) or nums1)", expected: "[1]", isPublic: true },
    { script: "sol = Solution()\nnums1=[0]\nprint(sol.merge(nums1,0,[1],1) or nums1)", expected: "[1]", isPublic: false },
    { script: "sol = Solution()\nnums1=[1,0]\nprint(sol.merge(nums1,1,[2],1) or nums1)", expected: "[1, 2]", isPublic: false },
    { script: "sol = Solution()\nnums1=[4,0,0,0]\nprint(sol.merge(nums1,1,[1,2,3],3) or nums1)", expected: "[1, 2, 3, 4]", isPublic: false },
  ],
},

"Mphasis: Remove Element": {
  company: "mphasis", pattern: "Two Pointers",
  title: "Remove Element",
  difficulty: "Easy",
  desc: "Remove all occurrences of val in nums in-place. Return count of elements not equal to val.",
  examples: [
    { input: "nums = [3,2,2,3], val = 3", output: "2" },
    { input: "nums = [0,1,2,2,3,0,4,2], val = 2", output: "5" },
  ],
  constraints: ["0 <= nums.length <= 100", "0 <= val <= 100"],
  functionSignature: "def removeElement(self, nums: List[int], val: int) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def removeElement(self, nums: List[int], val: int) -> int:\n        pass",
    JavaScript: "var removeElement = function(nums, val) {\n    \n};",
    TypeScript: "function removeElement(nums: number[], val: number): number {\n    \n};",
    Java: "class Solution {\n    public int removeElement(int[] nums, int val) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int removeElement(vector<int>& nums, int val) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.removeElement([3,2,2,3],3))", expected: "2", isPublic: true },
    { script: "sol = Solution()\nprint(sol.removeElement([0,1,2,2,3,0,4,2],2))", expected: "5", isPublic: true },
    { script: "sol = Solution()\nprint(sol.removeElement([],0))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.removeElement([1],1))", expected: "0", isPublic: false },
    { script: "sol = Solution()\nprint(sol.removeElement([4,5],3))", expected: "2", isPublic: false },
  ],
},

"Mphasis: Plus One": {
  company: "mphasis", pattern: "Array / Math",
  title: "Plus One",
  difficulty: "Easy",
  desc: "Given large integer as array digits, increment by one and return resulting array.",
  examples: [
    { input: "digits = [1,2,3]", output: "[1,2,4]" },
    { input: "digits = [9]", output: "[1,0]" },
  ],
  constraints: ["1 <= digits.length <= 100", "0 <= digits[i] <= 9"],
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

"Mphasis: Pascal's Triangle": {
  company: "mphasis", pattern: "Dynamic Programming / Math",
  title: "Pascal's Triangle",
  difficulty: "Easy",
  desc: "Given numRows, return first numRows of Pascal's triangle.",
  examples: [
    { input: "numRows = 5", output: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]" },
    { input: "numRows = 1", output: "[[1]]" },
  ],
  constraints: ["1 <= numRows <= 30"],
  functionSignature: "def generate(self, numRows: int) -> List[List[int]]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def generate(self, numRows: int) -> List[List[int]]:\n        pass",
    JavaScript: "var generate = function(numRows) {\n    \n};",
    TypeScript: "function generate(numRows: number): number[][] {\n    \n};",
    Java: "class Solution {\n    public List<List<Integer>> generate(int numRows) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<vector<int>> generate(int numRows) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol = Solution()\nprint(sol.generate(5))", expected: "[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.generate(1))", expected: "[[1]]", isPublic: true },
    { script: "sol = Solution()\nprint(sol.generate(2))", expected: "[[1], [1, 1]]", isPublic: false },
    { script: "sol = Solution()\nprint(sol.generate(3))", expected: "[[1], [1, 1], [1, 2, 1]]", isPublic: false },
    { script: "sol = Solution()\nprint(len(sol.generate(10)))", expected: "10", isPublic: false },
  ],
},

"Mphasis: Symmetric Tree": {
  company: "mphasis", pattern: "Tree BFS/DFS",
  title: "Symmetric Tree",
  difficulty: "Easy",
  desc: "Check whether binary tree is a mirror of itself (symmetric around center).",
  examples: [
    { input: "root = [1,2,2,3,4,4,3]", output: "true" },
    { input: "root = [1,2,2,null,3,null,3]", output: "false" },
  ],
  constraints: ["1 to 1000 nodes", "-100 <= Node.val <= 100"],
  functionSignature: "def isSymmetric(self, root: Optional[TreeNode]) -> bool:",
  starters: {
    Python: "from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\nclass Solution:\n    def isSymmetric(self, root: Optional[TreeNode]) -> bool:\n        pass",
    JavaScript: "var isSymmetric = function(root) {\n    \n};",
    TypeScript: "function isSymmetric(root: TreeNode | null): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isSymmetric(TreeNode root) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isSymmetric(TreeNode* root) {\n        \n    }\n};",
  },
  testCases: [
    { script: "root=TreeNode(1,TreeNode(2,TreeNode(3),TreeNode(4)),TreeNode(2,TreeNode(4),TreeNode(3)))\nprint(Solution().isSymmetric(root))", expected: "True", isPublic: true },
    { script: "root=TreeNode(1,TreeNode(2,None,TreeNode(3)),TreeNode(2,None,TreeNode(3)))\nprint(Solution().isSymmetric(root))", expected: "False", isPublic: true },
    { script: "print(Solution().isSymmetric(TreeNode(1)))", expected: "True", isPublic: false },
    { script: "root=TreeNode(1,TreeNode(2),TreeNode(2))\nprint(Solution().isSymmetric(root))", expected: "True", isPublic: false },
    { script: "root=TreeNode(1,TreeNode(2),TreeNode(3))\nprint(Solution().isSymmetric(root))", expected: "False", isPublic: false },
  ],
},

"Mphasis: Invert Binary Tree": {
  company: "mphasis", pattern: "Tree DFS",
  title: "Invert Binary Tree",
  difficulty: "Easy",
  desc: "Invert/mirror a binary tree. Return its root.",
  examples: [
    { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
    { input: "root = [2,1,3]", output: "[2,3,1]" },
  ],
  constraints: ["0 to 100 nodes", "-100 <= Node.val <= 100"],
  functionSignature: "def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:",
  starters: {
    Python: "from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\nclass Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        pass",
    JavaScript: "var invertTree = function(root) {\n    \n};",
    TypeScript: "function invertTree(root: TreeNode | null): TreeNode | null {\n    \n};",
    Java: "class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        \n    }\n};",
  },
  testCases: [
    { script: "def inorder(n):\n    return inorder(n.left)+[n.val]+inorder(n.right) if n else []\nroot=TreeNode(2,TreeNode(1),TreeNode(3))\nprint(inorder(Solution().invertTree(root)))", expected: "[3, 2, 1]", isPublic: true },
    { script: "print(Solution().invertTree(None))", expected: "None", isPublic: true },
    { script: "root=TreeNode(1)\nprint(Solution().invertTree(root).val)", expected: "1", isPublic: false },
    { script: "def preorder(n):\n    return [n.val]+preorder(n.left)+preorder(n.right) if n else []\nroot=TreeNode(4,TreeNode(2,TreeNode(1),TreeNode(3)),TreeNode(7,TreeNode(6),TreeNode(9)))\nprint(preorder(Solution().invertTree(root)))", expected: "[4, 7, 9, 6, 2, 3, 1]", isPublic: false },
    { script: "root=TreeNode(1,TreeNode(2),TreeNode(3))\nresult=Solution().invertTree(root)\nprint(result.left.val)", expected: "3", isPublic: false },
  ],
},

"Mphasis: Path Sum": {
  company: "mphasis", pattern: "Tree DFS",
  title: "Path Sum",
  difficulty: "Easy",
  desc: "Return true if tree has root-to-leaf path where node values sum equals targetSum.",
  examples: [
    { input: "root=[5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum=22", output: "true" },
    { input: "root=[1,2,3], targetSum=5", output: "false" },
  ],
  constraints: ["0 to 5000 nodes", "-1000 <= Node.val, targetSum <= 1000"],
  functionSignature: "def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:",
  starters: {
    Python: "from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\nclass Solution:\n    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:\n        pass",
    JavaScript: "var hasPathSum = function(root, targetSum) {\n    \n};",
    TypeScript: "function hasPathSum(root: TreeNode | null, targetSum: number): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean hasPathSum(TreeNode root, int targetSum) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool hasPathSum(TreeNode* root, int targetSum) {\n        \n    }\n};",
  },
  testCases: [
    { script: "root=TreeNode(1,TreeNode(2))\nprint(Solution().hasPathSum(root,3))", expected: "True", isPublic: true },
    { script: "print(Solution().hasPathSum(None,0))", expected: "False", isPublic: true },
    { script: "root=TreeNode(1,TreeNode(2),TreeNode(3))\nprint(Solution().hasPathSum(root,4))", expected: "True", isPublic: false },
    { script: "root=TreeNode(1,TreeNode(2),TreeNode(3))\nprint(Solution().hasPathSum(root,5))", expected: "False", isPublic: false },
    { script: "root=TreeNode(1,TreeNode(2))\nprint(Solution().hasPathSum(root,1))", expected: "False", isPublic: false },
  ],
},

"Mphasis: Count Primes": {
  company: "mphasis", pattern: "Sieve of Eratosthenes",
  title: "Count Primes",
  difficulty: "Medium",
  desc: "Return count of prime numbers strictly less than n.",
  examples: [
    { input: "n = 10", output: "4", explanation: "Primes: 2,3,5,7" },
    { input: "n = 0", output: "0" },
  ],
  constraints: ["0 <= n <= 5*10^6"],
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


// =============================================================================
// HEXAWARE (16 problems)
// =============================================================================

"Hexaware: Missing Number": {
  company: "hexaware", pattern: "Math / XOR",
  title: "Missing Number",
  difficulty: "Easy",
  desc: "Array of n distinct numbers in [0,n]. Return the missing number.",
  examples: [
    { input: "nums = [3,0,1]", output: "2" },
    { input: "nums = [0,1]", output: "2" },
  ],
  constraints: ["n == nums.length", "1 <= n <= 10^4"],
  functionSignature: "def missingNumber(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def missingNumber(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var missingNumber = function(nums) {\n    \n};",
    TypeScript: "function missingNumber(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int missingNumber(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.missingNumber([3,0,1]))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.missingNumber([0,1]))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.missingNumber([0]))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.missingNumber([1]))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.missingNumber([9,6,4,2,3,5,7,0,1]))", expected: "8", isPublic: false },
  ],
},

"Hexaware: Jump Game": {
  company: "hexaware", pattern: "Greedy",
  title: "Jump Game",
  difficulty: "Medium",
  desc: "Given array where nums[i] is max jump length at index i, return true if you can reach last index.",
  examples: [
    { input: "nums = [2,3,1,1,4]", output: "true" },
    { input: "nums = [3,2,1,0,4]", output: "false" },
  ],
  constraints: ["1 <= nums.length <= 3*10^4", "0 <= nums[i] <= 10^5"],
  functionSignature: "def canJump(self, nums: List[int]) -> bool:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def canJump(self, nums: List[int]) -> bool:\n        pass",
    JavaScript: "var canJump = function(nums) {\n    \n};",
    TypeScript: "function canJump(nums: number[]): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean canJump(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.canJump([2,3,1,1,4]))", expected: "True", isPublic: true },
    { script: "sol=Solution()\nprint(sol.canJump([3,2,1,0,4]))", expected: "False", isPublic: true },
    { script: "sol=Solution()\nprint(sol.canJump([0]))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.canJump([2,0,0]))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.canJump([1,0,1,0]))", expected: "False", isPublic: false },
  ],
},

"Hexaware: Gas Station": {
  company: "hexaware", pattern: "Greedy",
  title: "Gas Station",
  difficulty: "Medium",
  desc: "n gas stations in circle. Given gas[i] and cost[i], find starting station to complete circuit. Return -1 if impossible.",
  examples: [
    { input: "gas=[1,2,3,4,5], cost=[3,4,5,1,2]", output: "3" },
    { input: "gas=[2,3,4], cost=[3,4,3]", output: "-1" },
  ],
  constraints: ["n == gas.length == cost.length", "1 <= n <= 10^5"],
  functionSignature: "def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:\n        pass",
    JavaScript: "var canCompleteCircuit = function(gas, cost) {\n    \n};",
    TypeScript: "function canCompleteCircuit(gas: number[], cost: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.canCompleteCircuit([1,2,3,4,5],[3,4,5,1,2]))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.canCompleteCircuit([2,3,4],[3,4,3]))", expected: "-1", isPublic: true },
    { script: "sol=Solution()\nprint(sol.canCompleteCircuit([5],[4]))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.canCompleteCircuit([1,2],[2,1]))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.canCompleteCircuit([3,1,1],[1,2,2]))", expected: "0", isPublic: false },
  ],
},

"Hexaware: Rotate Array": {
  company: "hexaware", pattern: "Array Manipulation",
  title: "Rotate Array",
  difficulty: "Medium",
  desc: "Rotate array to the right by k steps in-place. Return modified array.",
  examples: [
    { input: "nums = [1,2,3,4,5,6,7], k = 3", output: "[5,6,7,1,2,3,4]" },
    { input: "nums = [-1,-100,3,99], k = 2", output: "[3,99,-1,-100]" },
  ],
  constraints: ["1 <= nums.length <= 10^5", "0 <= k <= 10^5"],
  functionSignature: "def rotate(self, nums: List[int], k: int) -> None:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def rotate(self, nums: List[int], k: int) -> None:\n        pass",
    JavaScript: "var rotate = function(nums, k) {\n    \n};",
    TypeScript: "function rotate(nums: number[], k: number): void {\n    \n};",
    Java: "class Solution {\n    public void rotate(int[] nums, int k) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    void rotate(vector<int>& nums, int k) {\n        \n    }\n};",
  },
  testCases: [
    { script: "nums=[1,2,3,4,5,6,7]\nSolution().rotate(nums,3)\nprint(nums)", expected: "[5, 6, 7, 1, 2, 3, 4]", isPublic: true },
    { script: "nums=[-1,-100,3,99]\nSolution().rotate(nums,2)\nprint(nums)", expected: "[3, 99, -1, -100]", isPublic: true },
    { script: "nums=[1,2]\nSolution().rotate(nums,3)\nprint(nums)", expected: "[2, 1]", isPublic: false },
    { script: "nums=[1]\nSolution().rotate(nums,0)\nprint(nums)", expected: "[1]", isPublic: false },
    { script: "nums=[1,2,3]\nSolution().rotate(nums,0)\nprint(nums)", expected: "[1, 2, 3]", isPublic: false },
  ],
},

"Hexaware: Find Minimum in Rotated Sorted Array": {
  company: "hexaware", pattern: "Binary Search",
  title: "Find Minimum in Rotated Sorted Array",
  difficulty: "Medium",
  desc: "Find minimum element in rotated sorted array of unique values. O(log n) required.",
  examples: [
    { input: "nums = [3,4,5,1,2]", output: "1" },
    { input: "nums = [4,5,6,7,0,1,2]", output: "0" },
  ],
  constraints: ["n == nums.length", "1 <= n <= 5000", "All integers unique"],
  functionSignature: "def findMin(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def findMin(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var findMin = function(nums) {\n    \n};",
    TypeScript: "function findMin(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int findMin(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.findMin([3,4,5,1,2]))", expected: "1", isPublic: true },
    { script: "sol=Solution()\nprint(sol.findMin([4,5,6,7,0,1,2]))", expected: "0", isPublic: true },
    { script: "sol=Solution()\nprint(sol.findMin([11,13,15,17]))", expected: "11", isPublic: false },
    { script: "sol=Solution()\nprint(sol.findMin([2,1]))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.findMin([1]))", expected: "1", isPublic: false },
  ],
},

"Hexaware: Search Insert Position": {
  company: "hexaware", pattern: "Binary Search",
  title: "Search Insert Position",
  difficulty: "Easy",
  desc: "Given sorted array and target, return index if found. Else return index where it would be inserted.",
  examples: [
    { input: "nums = [1,3,5,6], target = 5", output: "2" },
    { input: "nums = [1,3,5,6], target = 2", output: "1" },
  ],
  constraints: ["1 <= nums.length <= 10^4", "All values unique, sorted ascending"],
  functionSignature: "def searchInsert(self, nums: List[int], target: int) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def searchInsert(self, nums: List[int], target: int) -> int:\n        pass",
    JavaScript: "var searchInsert = function(nums, target) {\n    \n};",
    TypeScript: "function searchInsert(nums: number[], target: number): number {\n    \n};",
    Java: "class Solution {\n    public int searchInsert(int[] nums, int target) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.searchInsert([1,3,5,6],5))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.searchInsert([1,3,5,6],2))", expected: "1", isPublic: true },
    { script: "sol=Solution()\nprint(sol.searchInsert([1,3,5,6],7))", expected: "4", isPublic: false },
    { script: "sol=Solution()\nprint(sol.searchInsert([1,3,5,6],0))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.searchInsert([1],0))", expected: "0", isPublic: false },
  ],
},

"Hexaware: Majority Element": {
  company: "hexaware", pattern: "Boyer-Moore Voting",
  title: "Majority Element",
  difficulty: "Easy",
  desc: "Find element appearing more than n/2 times. Linear time, O(1) space.",
  examples: [
    { input: "nums = [3,2,3]", output: "3" },
    { input: "nums = [2,2,1,1,1,2,2]", output: "2" },
  ],
  constraints: ["n == nums.length", "1 <= n <= 5*10^4", "Majority element always exists"],
  functionSignature: "def majorityElement(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def majorityElement(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var majorityElement = function(nums) {\n    \n};",
    TypeScript: "function majorityElement(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int majorityElement(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int majorityElement(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.majorityElement([3,2,3]))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.majorityElement([2,2,1,1,1,2,2]))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.majorityElement([1]))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.majorityElement([1,1,2]))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.majorityElement([3,3,4,4,3]))", expected: "3", isPublic: false },
  ],
},

"Hexaware: Happy Number": {
  company: "hexaware", pattern: "Hash Set / Two Pointers",
  title: "Happy Number",
  difficulty: "Easy",
  desc: "A number is happy if replacing it repeatedly with sum of squares of digits eventually reaches 1. Return true if n is happy.",
  examples: [
    { input: "n = 19", output: "true", explanation: "1^2+9^2=82, 8^2+2^2=68, ...->1" },
    { input: "n = 2", output: "false" },
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
    { script: "sol=Solution()\nprint(sol.isHappy(19))", expected: "True", isPublic: true },
    { script: "sol=Solution()\nprint(sol.isHappy(2))", expected: "False", isPublic: true },
    { script: "sol=Solution()\nprint(sol.isHappy(1))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.isHappy(7))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.isHappy(4))", expected: "False", isPublic: false },
  ],
},

"Hexaware: Excel Column Number": {
  company: "hexaware", pattern: "Math / String",
  title: "Excel Sheet Column Number",
  difficulty: "Easy",
  desc: "Given column title like A->1, B->2, Z->26, AA->27, return its column number.",
  examples: [
    { input: "columnTitle = \"A\"", output: "1" },
    { input: "columnTitle = \"AB\"", output: "28" },
  ],
  constraints: ["1 <= columnTitle.length <= 7", "Uppercase English letters only"],
  functionSignature: "def titleToNumber(self, columnTitle: str) -> int:",
  starters: {
    Python: "class Solution:\n    def titleToNumber(self, columnTitle: str) -> int:\n        pass",
    JavaScript: "var titleToNumber = function(columnTitle) {\n    \n};",
    TypeScript: "function titleToNumber(columnTitle: string): number {\n    \n};",
    Java: "class Solution {\n    public int titleToNumber(String columnTitle) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int titleToNumber(string columnTitle) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.titleToNumber(\"A\"))", expected: "1", isPublic: true },
    { script: "sol=Solution()\nprint(sol.titleToNumber(\"AB\"))", expected: "28", isPublic: true },
    { script: "sol=Solution()\nprint(sol.titleToNumber(\"Z\"))", expected: "26", isPublic: false },
    { script: "sol=Solution()\nprint(sol.titleToNumber(\"AA\"))", expected: "27", isPublic: false },
    { script: "sol=Solution()\nprint(sol.titleToNumber(\"ZY\"))", expected: "701", isPublic: false },
  ],
},

"Hexaware: Ugly Number": {
  company: "hexaware", pattern: "Math",
  title: "Ugly Number",
  difficulty: "Easy",
  desc: "Return true if n is ugly: positive integer whose prime factors are limited to 2, 3, and 5.",
  examples: [
    { input: "n = 6", output: "true", explanation: "6 = 2*3" },
    { input: "n = 14", output: "false", explanation: "14=2*7" },
  ],
  constraints: ["n can be any signed 32-bit integer"],
  functionSignature: "def isUgly(self, n: int) -> bool:",
  starters: {
    Python: "class Solution:\n    def isUgly(self, n: int) -> bool:\n        pass",
    JavaScript: "var isUgly = function(n) {\n    \n};",
    TypeScript: "function isUgly(n: number): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isUgly(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isUgly(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.isUgly(6))", expected: "True", isPublic: true },
    { script: "sol=Solution()\nprint(sol.isUgly(14))", expected: "False", isPublic: true },
    { script: "sol=Solution()\nprint(sol.isUgly(1))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.isUgly(0))", expected: "False", isPublic: false },
    { script: "sol=Solution()\nprint(sol.isUgly(8))", expected: "True", isPublic: false },
  ],
},

"Hexaware: Is Subsequence": {
  company: "hexaware", pattern: "Two Pointers",
  title: "Is Subsequence",
  difficulty: "Easy",
  desc: "Return true if s is a subsequence of t (can delete chars from t without reordering).",
  examples: [
    { input: "s = \"abc\", t = \"ahbgdc\"", output: "true" },
    { input: "s = \"axc\", t = \"ahbgdc\"", output: "false" },
  ],
  constraints: ["0 <= s.length <= 100", "0 <= t.length <= 10^4"],
  functionSignature: "def isSubsequence(self, s: str, t: str) -> bool:",
  starters: {
    Python: "class Solution:\n    def isSubsequence(self, s: str, t: str) -> bool:\n        pass",
    JavaScript: "var isSubsequence = function(s, t) {\n    \n};",
    TypeScript: "function isSubsequence(s: string, t: string): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isSubsequence(String s, String t) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isSubsequence(string s, string t) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.isSubsequence(\"abc\",\"ahbgdc\"))", expected: "True", isPublic: true },
    { script: "sol=Solution()\nprint(sol.isSubsequence(\"axc\",\"ahbgdc\"))", expected: "False", isPublic: true },
    { script: "sol=Solution()\nprint(sol.isSubsequence(\"\",\"ahbgdc\"))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.isSubsequence(\"b\",\"c\"))", expected: "False", isPublic: false },
    { script: "sol=Solution()\nprint(sol.isSubsequence(\"ace\",\"abcde\"))", expected: "True", isPublic: false },
  ],
},

"Hexaware: Fibonacci Number": {
  company: "hexaware", pattern: "Dynamic Programming",
  title: "Fibonacci Number",
  difficulty: "Easy",
  desc: "Return nth Fibonacci number. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).",
  examples: [
    { input: "n = 4", output: "3" },
    { input: "n = 10", output: "55" },
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
    { script: "sol=Solution()\nprint(sol.fib(4))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.fib(10))", expected: "55", isPublic: true },
    { script: "sol=Solution()\nprint(sol.fib(0))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.fib(1))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.fib(20))", expected: "6765", isPublic: false },
  ],
},

"Hexaware: Add Digits": {
  company: "hexaware", pattern: "Math / Recursion",
  title: "Add Digits",
  difficulty: "Easy",
  desc: "Repeatedly add all digits of num until result has only one digit. Return it.",
  examples: [
    { input: "num = 38", output: "2", explanation: "3+8=11, 1+1=2" },
    { input: "num = 0", output: "0" },
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
    { script: "sol=Solution()\nprint(sol.addDigits(38))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.addDigits(0))", expected: "0", isPublic: true },
    { script: "sol=Solution()\nprint(sol.addDigits(9))", expected: "9", isPublic: false },
    { script: "sol=Solution()\nprint(sol.addDigits(999))", expected: "9", isPublic: false },
    { script: "sol=Solution()\nprint(sol.addDigits(100))", expected: "1", isPublic: false },
  ],
},

"Hexaware: Counting Bits": {
  company: "hexaware", pattern: "Dynamic Programming / Bit",
  title: "Counting Bits",
  difficulty: "Easy",
  desc: "Return array ans of length n+1 where ans[i] is number of 1s in binary representation of i.",
  examples: [
    { input: "n = 2", output: "[0,1,1]" },
    { input: "n = 5", output: "[0,1,1,2,1,2]" },
  ],
  constraints: ["0 <= n <= 10^5"],
  functionSignature: "def countBits(self, n: int) -> List[int]:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def countBits(self, n: int) -> List[int]:\n        pass",
    JavaScript: "var countBits = function(n) {\n    \n};",
    TypeScript: "function countBits(n: number): number[] {\n    \n};",
    Java: "class Solution {\n    public int[] countBits(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> countBits(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.countBits(2))", expected: "[0, 1, 1]", isPublic: true },
    { script: "sol=Solution()\nprint(sol.countBits(5))", expected: "[0, 1, 1, 2, 1, 2]", isPublic: true },
    { script: "sol=Solution()\nprint(sol.countBits(0))", expected: "[0]", isPublic: false },
    { script: "sol=Solution()\nprint(sol.countBits(1))", expected: "[0, 1]", isPublic: false },
    { script: "sol=Solution()\nprint(sol.countBits(8))", expected: "[0, 1, 1, 2, 1, 2, 2, 3, 1]", isPublic: false },
  ],
},

"Hexaware: Reverse Integer": {
  company: "hexaware", pattern: "Math / String",
  title: "Reverse Integer",
  difficulty: "Medium",
  desc: "Given signed 32-bit integer x, return x with digits reversed. Return 0 if out of range.",
  examples: [
    { input: "x = 123", output: "321" },
    { input: "x = -123", output: "-321" },
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
    { script: "sol=Solution()\nprint(sol.reverse(123))", expected: "321", isPublic: true },
    { script: "sol=Solution()\nprint(sol.reverse(-123))", expected: "-321", isPublic: true },
    { script: "sol=Solution()\nprint(sol.reverse(120))", expected: "21", isPublic: false },
    { script: "sol=Solution()\nprint(sol.reverse(0))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.reverse(1534236469))", expected: "0", isPublic: false },
  ],
},


// =============================================================================
// LTIMINDTREE (16 problems)
// =============================================================================

"LTIMindtree: Longest Increasing Subsequence": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Longest Increasing Subsequence",
  difficulty: "Medium",
  desc: "Return length of longest strictly increasing subsequence.",
  examples: [
    { input: "nums = [10,9,2,5,3,7,101,18]", output: "4" },
    { input: "nums = [0,1,0,3,2,3]", output: "4" },
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
    { script: "sol=Solution()\nprint(sol.lengthOfLIS([10,9,2,5,3,7,101,18]))", expected: "4", isPublic: true },
    { script: "sol=Solution()\nprint(sol.lengthOfLIS([0,1,0,3,2,3]))", expected: "4", isPublic: true },
    { script: "sol=Solution()\nprint(sol.lengthOfLIS([7,7,7,7,7]))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.lengthOfLIS([1,3,6,7,9,4,10,5,6]))", expected: "6", isPublic: false },
    { script: "sol=Solution()\nprint(sol.lengthOfLIS([1]))", expected: "1", isPublic: false },
  ],
},

"LTIMindtree: Word Break": {
  company: "ltimindtree", pattern: "Dynamic Programming / BFS",
  title: "Word Break",
  difficulty: "Medium",
  desc: "Given string s and dictionary wordDict, return true if s can be segmented into dictionary words.",
  examples: [
    { input: "s = \"leetcode\", wordDict = [\"leet\",\"code\"]", output: "true" },
    { input: "s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]", output: "true" },
  ],
  constraints: ["1 <= s.length <= 300", "1 <= wordDict.length <= 1000"],
  functionSignature: "def wordBreak(self, s: str, wordDict: List[str]) -> bool:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def wordBreak(self, s: str, wordDict: List[str]) -> bool:\n        pass",
    JavaScript: "var wordBreak = function(s, wordDict) {\n    \n};",
    TypeScript: "function wordBreak(s: string, wordDict: string[]): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool wordBreak(string s, vector<string>& wordDict) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.wordBreak(\"leetcode\",[\"leet\",\"code\"]))", expected: "True", isPublic: true },
    { script: "sol=Solution()\nprint(sol.wordBreak(\"catsandog\",[\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]))", expected: "False", isPublic: true },
    { script: "sol=Solution()\nprint(sol.wordBreak(\"a\",[\"a\"]))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.wordBreak(\"applepenapple\",[\"apple\",\"pen\"]))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.wordBreak(\"cars\",[\"car\",\"ca\",\"rs\"]))", expected: "True", isPublic: false },
  ],
},

"LTIMindtree: House Robber": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "House Robber",
  difficulty: "Medium",
  desc: "Cannot rob adjacent houses. Return maximum money you can rob.",
  examples: [
    { input: "nums = [1,2,3,1]", output: "4" },
    { input: "nums = [2,7,9,3,1]", output: "12" },
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
    { script: "sol=Solution()\nprint(sol.rob([1,2,3,1]))", expected: "4", isPublic: true },
    { script: "sol=Solution()\nprint(sol.rob([2,7,9,3,1]))", expected: "12", isPublic: true },
    { script: "sol=Solution()\nprint(sol.rob([0]))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.rob([1,2]))", expected: "2", isPublic: false },
    { script: "sol=Solution()\nprint(sol.rob([2,1,1,2]))", expected: "4", isPublic: false },
  ],
},

"LTIMindtree: Coin Change": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Coin Change",
  difficulty: "Medium",
  desc: "Return fewest coins needed to make up amount. Return -1 if impossible.",
  examples: [
    { input: "coins = [1,2,5], amount = 11", output: "3" },
    { input: "coins = [2], amount = 3", output: "-1" },
  ],
  constraints: ["1 <= coins.length <= 12", "0 <= amount <= 10^4"],
  functionSignature: "def coinChange(self, coins: List[int], amount: int) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def coinChange(self, coins: List[int], amount: int) -> int:\n        pass",
    JavaScript: "var coinChange = function(coins, amount) {\n    \n};",
    TypeScript: "function coinChange(coins: number[], amount: number): number {\n    \n};",
    Java: "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.coinChange([1,2,5],11))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.coinChange([2],3))", expected: "-1", isPublic: true },
    { script: "sol=Solution()\nprint(sol.coinChange([1],0))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.coinChange([1,5,11,25],41))", expected: "3", isPublic: false },
    { script: "sol=Solution()\nprint(sol.coinChange([1],2))", expected: "2", isPublic: false },
  ],
},

"LTIMindtree: Unique Paths": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Unique Paths",
  difficulty: "Medium",
  desc: "Robot on m x n grid can only move right or down. Count unique paths from top-left to bottom-right.",
  examples: [
    { input: "m = 3, n = 7", output: "28" },
    { input: "m = 3, n = 2", output: "3" },
  ],
  constraints: ["1 <= m, n <= 100"],
  functionSignature: "def uniquePaths(self, m: int, n: int) -> int:",
  starters: {
    Python: "class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        pass",
    JavaScript: "var uniquePaths = function(m, n) {\n    \n};",
    TypeScript: "function uniquePaths(m: number, n: number): number {\n    \n};",
    Java: "class Solution {\n    public int uniquePaths(int m, int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int uniquePaths(int m, int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.uniquePaths(3,7))", expected: "28", isPublic: true },
    { script: "sol=Solution()\nprint(sol.uniquePaths(3,2))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.uniquePaths(1,1))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.uniquePaths(2,2))", expected: "2", isPublic: false },
    { script: "sol=Solution()\nprint(sol.uniquePaths(5,5))", expected: "70", isPublic: false },
  ],
},

"LTIMindtree: Decode Ways": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Decode Ways",
  difficulty: "Medium",
  desc: "A->1...Z->26. Given string s of digits, return number of ways to decode it.",
  examples: [
    { input: "s = \"12\"", output: "2", explanation: "AB or L" },
    { input: "s = \"226\"", output: "3" },
  ],
  constraints: ["1 <= s.length <= 100", "s contains only digits"],
  functionSignature: "def numDecodings(self, s: str) -> int:",
  starters: {
    Python: "class Solution:\n    def numDecodings(self, s: str) -> int:\n        pass",
    JavaScript: "var numDecodings = function(s) {\n    \n};",
    TypeScript: "function numDecodings(s: string): number {\n    \n};",
    Java: "class Solution {\n    public int numDecodings(String s) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int numDecodings(string s) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.numDecodings(\"12\"))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.numDecodings(\"226\"))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.numDecodings(\"0\"))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.numDecodings(\"06\"))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.numDecodings(\"11106\"))", expected: "2", isPublic: false },
  ],
},

"LTIMindtree: Minimum Path Sum": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Minimum Path Sum",
  difficulty: "Medium",
  desc: "Find path from top-left to bottom-right minimizing sum. Only move right or down.",
  examples: [
    { input: "grid = [[1,3,1],[1,5,1],[4,2,1]]", output: "7" },
    { input: "grid = [[1,2,3],[4,5,6]]", output: "12" },
  ],
  constraints: ["m == grid.length", "n == grid[0].length", "1 <= m, n <= 200"],
  functionSignature: "def minPathSum(self, grid: List[List[int]]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def minPathSum(self, grid: List[List[int]]) -> int:\n        pass",
    JavaScript: "var minPathSum = function(grid) {\n    \n};",
    TypeScript: "function minPathSum(grid: number[][]): number {\n    \n};",
    Java: "class Solution {\n    public int minPathSum(int[][] grid) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int minPathSum(vector<vector<int>>& grid) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.minPathSum([[1,3,1],[1,5,1],[4,2,1]]))", expected: "7", isPublic: true },
    { script: "sol=Solution()\nprint(sol.minPathSum([[1,2,3],[4,5,6]]))", expected: "12", isPublic: true },
    { script: "sol=Solution()\nprint(sol.minPathSum([[1]]))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.minPathSum([[1,2],[1,1]]))", expected: "3", isPublic: false },
    { script: "sol=Solution()\nprint(sol.minPathSum([[1,4,8,6],[5,3,9,7],[2,2,2,2]]))", expected: "16", isPublic: false },
  ],
},

"LTIMindtree: Maximum Product Subarray": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Maximum Product Subarray",
  difficulty: "Medium",
  desc: "Find contiguous subarray with largest product.",
  examples: [
    { input: "nums = [2,3,-2,4]", output: "6" },
    { input: "nums = [-2,0,-1]", output: "0" },
  ],
  constraints: ["1 <= nums.length <= 2*10^4", "-10 <= nums[i] <= 10"],
  functionSignature: "def maxProduct(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def maxProduct(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var maxProduct = function(nums) {\n    \n};",
    TypeScript: "function maxProduct(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int maxProduct(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int maxProduct(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.maxProduct([2,3,-2,4]))", expected: "6", isPublic: true },
    { script: "sol=Solution()\nprint(sol.maxProduct([-2,0,-1]))", expected: "0", isPublic: true },
    { script: "sol=Solution()\nprint(sol.maxProduct([-2]))", expected: "-2", isPublic: false },
    { script: "sol=Solution()\nprint(sol.maxProduct([-2,3,-4]))", expected: "24", isPublic: false },
    { script: "sol=Solution()\nprint(sol.maxProduct([0,2]))", expected: "2", isPublic: false },
  ],
},

"LTIMindtree: Longest Common Subsequence": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Longest Common Subsequence",
  difficulty: "Medium",
  desc: "Return length of longest common subsequence of text1 and text2.",
  examples: [
    { input: "text1 = \"abcde\", text2 = \"ace\"", output: "3" },
    { input: "text1 = \"abc\", text2 = \"abc\"", output: "3" },
  ],
  constraints: ["1 <= text1.length, text2.length <= 1000", "Only lowercase English characters"],
  functionSignature: "def longestCommonSubsequence(self, text1: str, text2: str) -> int:",
  starters: {
    Python: "class Solution:\n    def longestCommonSubsequence(self, text1: str, text2: str) -> int:\n        pass",
    JavaScript: "var longestCommonSubsequence = function(text1, text2) {\n    \n};",
    TypeScript: "function longestCommonSubsequence(text1: string, text2: string): number {\n    \n};",
    Java: "class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int longestCommonSubsequence(string text1, string text2) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.longestCommonSubsequence(\"abcde\",\"ace\"))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.longestCommonSubsequence(\"abc\",\"abc\"))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.longestCommonSubsequence(\"abc\",\"def\"))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.longestCommonSubsequence(\"a\",\"b\"))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.longestCommonSubsequence(\"oxcpqrsvwf\",\"shmtulqrypy\"))", expected: "2", isPublic: false },
  ],
},

"LTIMindtree: Perfect Squares": {
  company: "ltimindtree", pattern: "Dynamic Programming / BFS",
  title: "Perfect Squares",
  difficulty: "Medium",
  desc: "Return minimum number of perfect square numbers that sum to n.",
  examples: [
    { input: "n = 12", output: "3", explanation: "4+4+4" },
    { input: "n = 13", output: "2", explanation: "4+9" },
  ],
  constraints: ["1 <= n <= 10^4"],
  functionSignature: "def numSquares(self, n: int) -> int:",
  starters: {
    Python: "class Solution:\n    def numSquares(self, n: int) -> int:\n        pass",
    JavaScript: "var numSquares = function(n) {\n    \n};",
    TypeScript: "function numSquares(n: number): number {\n    \n};",
    Java: "class Solution {\n    public int numSquares(int n) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int numSquares(int n) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.numSquares(12))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.numSquares(13))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.numSquares(1))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.numSquares(4))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.numSquares(7))", expected: "4", isPublic: false },
  ],
},

"LTIMindtree: Triangle Minimum Path": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Triangle Minimum Path",
  difficulty: "Medium",
  desc: "Given triangle array, find minimum path sum from top to bottom. Each step moves to adjacent numbers below.",
  examples: [
    { input: "triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]", output: "11" },
    { input: "triangle = [[-10]]", output: "-10" },
  ],
  constraints: ["1 <= triangle.length <= 200", "triangle[0].length == 1"],
  functionSignature: "def minimumTotal(self, triangle: List[List[int]]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def minimumTotal(self, triangle: List[List[int]]) -> int:\n        pass",
    JavaScript: "var minimumTotal = function(triangle) {\n    \n};",
    TypeScript: "function minimumTotal(triangle: number[][]): number {\n    \n};",
    Java: "class Solution {\n    public int minimumTotal(List<List<Integer>> triangle) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int minimumTotal(vector<vector<int>>& triangle) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.minimumTotal([[2],[3,4],[6,5,7],[4,1,8,3]]))", expected: "11", isPublic: true },
    { script: "sol=Solution()\nprint(sol.minimumTotal([[-10]]))", expected: "-10", isPublic: true },
    { script: "sol=Solution()\nprint(sol.minimumTotal([[1],[2,3]]))", expected: "3", isPublic: false },
    { script: "sol=Solution()\nprint(sol.minimumTotal([[1],[2,3],[4,5,6]]))", expected: "7", isPublic: false },
    { script: "sol=Solution()\nprint(sol.minimumTotal([[-1],[2,3],[1,-1,-3]]))", expected: "-1", isPublic: false },
  ],
},

"LTIMindtree: Arithmetic Slices": {
  company: "ltimindtree", pattern: "Dynamic Programming",
  title: "Arithmetic Slices",
  difficulty: "Medium",
  desc: "Array is arithmetic if at least 3 elements with equal differences. Return number of arithmetic subarrays.",
  examples: [
    { input: "nums = [1,2,3,4]", output: "3" },
    { input: "nums = [1]", output: "0" },
  ],
  constraints: ["1 <= nums.length <= 5000", "-1000 <= nums[i] <= 1000"],
  functionSignature: "def numberOfArithmeticSlices(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def numberOfArithmeticSlices(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var numberOfArithmeticSlices = function(nums) {\n    \n};",
    TypeScript: "function numberOfArithmeticSlices(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int numberOfArithmeticSlices(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int numberOfArithmeticSlices(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.numberOfArithmeticSlices([1,2,3,4]))", expected: "3", isPublic: true },
    { script: "sol=Solution()\nprint(sol.numberOfArithmeticSlices([1]))", expected: "0", isPublic: true },
    { script: "sol=Solution()\nprint(sol.numberOfArithmeticSlices([1,2,3]))", expected: "1", isPublic: false },
    { script: "sol=Solution()\nprint(sol.numberOfArithmeticSlices([1,2,3,4,5]))", expected: "6", isPublic: false },
    { script: "sol=Solution()\nprint(sol.numberOfArithmeticSlices([1,3,5,7,9]))", expected: "6", isPublic: false },
  ],
},

"LTIMindtree: Partition Equal Subset Sum": {
  company: "ltimindtree", pattern: "Dynamic Programming / Knapsack",
  title: "Partition Equal Subset Sum",
  difficulty: "Medium",
  desc: "Return true if array can be partitioned into two subsets with equal sum.",
  examples: [
    { input: "nums = [1,5,11,5]", output: "true" },
    { input: "nums = [1,2,3,5]", output: "false" },
  ],
  constraints: ["1 <= nums.length <= 200", "1 <= nums[i] <= 100"],
  functionSignature: "def canPartition(self, nums: List[int]) -> bool:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def canPartition(self, nums: List[int]) -> bool:\n        pass",
    JavaScript: "var canPartition = function(nums) {\n    \n};",
    TypeScript: "function canPartition(nums: number[]): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean canPartition(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool canPartition(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.canPartition([1,5,11,5]))", expected: "True", isPublic: true },
    { script: "sol=Solution()\nprint(sol.canPartition([1,2,3,5]))", expected: "False", isPublic: true },
    { script: "sol=Solution()\nprint(sol.canPartition([1,1]))", expected: "True", isPublic: false },
    { script: "sol=Solution()\nprint(sol.canPartition([1,2]))", expected: "False", isPublic: false },
    { script: "sol=Solution()\nprint(sol.canPartition([2,2,3,5]))", expected: "False", isPublic: false },
  ],
},

"LTIMindtree: Jump Game II": {
  company: "ltimindtree", pattern: "Greedy / BFS",
  title: "Jump Game II",
  difficulty: "Medium",
  desc: "Return minimum number of jumps to reach last index. You can always reach the last index.",
  examples: [
    { input: "nums = [2,3,1,1,4]", output: "2" },
    { input: "nums = [2,3,0,1,4]", output: "2" },
  ],
  constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 1000", "Can always reach last index"],
  functionSignature: "def jump(self, nums: List[int]) -> int:",
  starters: {
    Python: "from typing import List\n\nclass Solution:\n    def jump(self, nums: List[int]) -> int:\n        pass",
    JavaScript: "var jump = function(nums) {\n    \n};",
    TypeScript: "function jump(nums: number[]): number {\n    \n};",
    Java: "class Solution {\n    public int jump(int[] nums) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    int jump(vector<int>& nums) {\n        \n    }\n};",
  },
  testCases: [
    { script: "sol=Solution()\nprint(sol.jump([2,3,1,1,4]))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.jump([2,3,0,1,4]))", expected: "2", isPublic: true },
    { script: "sol=Solution()\nprint(sol.jump([1]))", expected: "0", isPublic: false },
    { script: "sol=Solution()\nprint(sol.jump([1,2,3]))", expected: "2", isPublic: false },
    { script: "sol=Solution()\nprint(sol.jump([1,1,1,1]))", expected: "3", isPublic: false },
  ],
},


// =============================================================================
// ZENSAR (16 problems)
// =============================================================================

"Zensar: Inorder Traversal": {
  company: "zensar", pattern: "Tree DFS",
  title: "Binary Tree Inorder Traversal",
  difficulty: "Easy",
  desc: "Return inorder traversal of binary tree values.",
  examples: [
    { input: "root = [1,null,2,3]", output: "[1,3,2]" },
    { input: "root = []", output: "[]" },
  ],
  constraints: ["0 to 100 nodes", "-100 <= Node.val <= 100"],
  functionSignature: "def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:",
  starters: {
    Python: "from typing import Optional, List\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\nclass Solution:\n    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:\n        pass",
    JavaScript: "var inorderTraversal = function(root) {\n    \n};",
    TypeScript: "function inorderTraversal(root: TreeNode | null): number[] {\n    \n};",
    Java: "class Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    vector<int> inorderTraversal(TreeNode* root) {\n        \n    }\n};",
  },
  testCases: [
    { script: "root=TreeNode(1,None,TreeNode(2,TreeNode(3)))\nprint(Solution().inorderTraversal(root))", expected: "[1, 3, 2]", isPublic: true },
    { script: "print(Solution().inorderTraversal(None))", expected: "[]", isPublic: true },
    { script: "print(Solution().inorderTraversal(TreeNode(1)))", expected: "[1]", isPublic: false },
    { script: "root=TreeNode(2,TreeNode(1),TreeNode(3))\nprint(Solution().inorderTraversal(root))", expected: "[1, 2, 3]", isPublic: false },
    { script: "root=TreeNode(1,TreeNode(2,TreeNode(3),TreeNode(4)),TreeNode(5))\nprint(Solution().inorderTraversal(root))", expected: "[3, 2, 4, 1, 5]", isPublic: false },
  ],
},

"Zensar: Same Tree": {
  company: "zensar", pattern: "Tree DFS",
  title: "Same Tree",
  difficulty: "Easy",
  desc: "Given roots of two binary trees, check if they are same (same structure and values).",
  examples: [
    { input: "p=[1,2,3], q=[1,2,3]", output: "true" },
    { input: "p=[1,2], q=[1,null,2]", output: "false" },
  ],
  constraints: ["0 to 100 nodes per tree", "-10^4 <= Node.val <= 10^4"],
  functionSignature: "def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:",
  starters: {
    Python: "from typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\nclass Solution:\n    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:\n        pass",
    JavaScript: "var isSameTree = function(p, q) {\n    \n};",
    TypeScript: "function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {\n    \n};",
    Java: "class Solution {\n    public boolean isSameTree(TreeNode p, TreeNode q) {\n        \n    }\n}",
    "C++": "class Solution {\npublic:\n    bool isSameTree(TreeNode* p, TreeNode* q) {\n        \n    }\n};",
  },
  testCases: [
    { script: "p=TreeNode(1,TreeNode(2),TreeNode(3))\nq=TreeNode(1,TreeNode(2),TreeNode(3))\nprint(Solution().isSameTree(p,q))", expected: "True", isPublic: true },
    { script: "p=TreeNode(1,TreeNode(2))\nq=TreeNode(1,None,TreeNode(2))\nprint(Solution().isSameTree(p,q))", expected: "False", isPublic: true },
    { script: "print(Solution().isSameTree(None,None))", expected: "True", isPublic: false },
    { script: "print(Solution().isSameTree(TreeNode(1),None))", expected: "False", isPublic: false },
    { script: "p=TreeNode(1,TreeNode(2),TreeNode(1))\nq=TreeNode(1,TreeNode(1),TreeNode(2))\nprint(Solution().isSameTree(p,q))", expected: "False", isPublic: false },
  ],
},