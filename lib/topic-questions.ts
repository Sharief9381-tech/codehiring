/**
 * Topic Questions - 6 modules per topic (2 Easy, 2 Medium, 2 Hard)
 * Each module has 5 problems. Total: 30 problems per topic.
 */

export interface TopicQuestion {
  id: string
  title: string
  url: string
  difficulty: "Easy" | "Medium" | "Hard"
  xp: number
}

export interface TopicModule {
  moduleId: string
  moduleNum: number
  difficulty: "Easy" | "Medium" | "Hard"
  label: string
  questions: TopicQuestion[]
}

export interface TopicData {
  track: string
  label: string
  color: string
  modules: TopicModule[]
  questions: TopicQuestion[]  // flat list of all questions (backward compat)
}

function buildTopic(
  track: string, label: string, color: string,
  m1: [string,string][], m2: [string,string][],
  m3: [string,string][], m4: [string,string][],
  m5: [string,string][], m6: [string,string][]
): TopicData {
  const mk = (prefix: string, num: number, diff: "Easy"|"Medium"|"Hard", pairs: [string,string][]): TopicModule => ({
    moduleId: `${track}-m${num}`,
    moduleNum: num,
    difficulty: diff,
    label: `${diff} Module ${num <= 2 ? num : num <= 4 ? num - 2 : num - 4}`,
    questions: pairs.map(([title, slug], i) => ({
      id: `${prefix}-m${num}-q${i+1}`,
      title,
      url: `https://leetcode.com/problems/${slug}/`,
      difficulty: diff,
      xp: diff === "Easy" ? 20 : diff === "Medium" ? 30 : 40,
    })),
  })
  const modules = [
    mk(track,1,"Easy",m1), mk(track,2,"Easy",m2),
    mk(track,3,"Medium",m3), mk(track,4,"Medium",m4),
    mk(track,5,"Hard",m5), mk(track,6,"Hard",m6),
  ]
  return { track, label, color, modules, questions: modules.flatMap(m => m.questions) }
}

export const TOPIC_QUESTIONS: TopicData[] = [

// ── ARRAYS ────────────────────────────────────────────────────────────────────
buildTopic("arrays","Arrays","#10b981",
  [["Two Sum","two-sum"],["Contains Duplicate","contains-duplicate"],["Missing Number","missing-number"],["Single Number","single-number"],["Best Time to Buy and Sell Stock","best-time-to-buy-and-sell-stock"]],
  [["Move Zeroes","move-zeroes"],["Find All Numbers Disappeared","find-all-numbers-disappeared-in-an-array"],["Shuffle Array","shuffle-the-array"],["Squares of Sorted Array","squares-of-a-sorted-array"],["Running Sum of 1D Array","running-sum-of-1d-array"]],
  [["Product of Array Except Self","product-of-array-except-self"],["Maximum Subarray","maximum-subarray"],["3Sum","3sum"],["Container With Most Water","container-with-most-water"],["Find Minimum in Rotated Sorted Array","find-minimum-in-rotated-sorted-array"]],
  [["Search in Rotated Sorted Array","search-in-rotated-sorted-array"],["Subarray Sum Equals K","subarray-sum-equals-k"],["Maximum Product Subarray","maximum-product-subarray"],["Spiral Matrix","spiral-matrix"],["Merge Intervals","merge-intervals"]],
  [["Trapping Rain Water","trapping-rain-water"],["First Missing Positive","first-missing-positive"],["Median of Two Sorted Arrays","median-of-two-sorted-arrays"],["Minimum Size Subarray Sum","minimum-size-subarray-sum"],["Sliding Window Maximum","sliding-window-maximum"]],
  [["Largest Rectangle in Histogram","largest-rectangle-in-histogram"],["Maximum Sum Circular Subarray","maximum-sum-circular-subarray"],["Count of Smaller Numbers After Self","count-of-smaller-numbers-after-self"],["Jump Game II","jump-game-ii"],["Minimum Window Substring","minimum-window-substring"]]
),

// ── STRINGS ───────────────────────────────────────────────────────────────────
buildTopic("strings","Strings","#10b981",
  [["Valid Anagram","valid-anagram"],["Valid Palindrome","valid-palindrome"],["Reverse String","reverse-string"],["First Unique Character","first-unique-character-in-a-string"],["Is Subsequence","is-subsequence"]],
  [["Ransom Note","ransom-note"],["Longest Common Prefix","longest-common-prefix"],["String to Integer","string-to-integer-atoi"],["Count and Say","count-and-say"],["Detect Capital","detect-capital"]],
  [["Longest Substring Without Repeating Characters","longest-substring-without-repeating-characters"],["Group Anagrams","group-anagrams"],["Longest Palindromic Substring","longest-palindromic-substring"],["Palindromic Substrings","palindromic-substrings"],["Encode and Decode Strings","encode-and-decode-strings"]],
  [["Find All Anagrams in a String","find-all-anagrams-in-a-string"],["Permutation in String","permutation-in-string"],["Repeated DNA Sequences","repeated-dna-sequences"],["Decode String","decode-string"],["Reorganize String","reorganize-string"]],
  [["Minimum Window Substring","minimum-window-substring"],["Regular Expression Matching","regular-expression-matching"],["Wildcard Matching","wildcard-matching"],["Edit Distance","edit-distance"],["Word Break II","word-break-ii"]],
  [["Concatenated Words","concatenated-words"],["Palindrome Pairs","palindrome-pairs"],["Substring with Concatenation of All Words","substring-with-concatenation-of-all-words"],["Largest Number","largest-number"],["Short Encoding of Words","short-encoding-of-words"]]
),

// ── MATRIX ───────────────────────────────────────────────────────────────────
buildTopic("matrix","Matrix","#10b981",
  [["Flood Fill","flood-fill"],["Count Negative Numbers in Sorted Matrix","count-negative-numbers-in-a-sorted-matrix"],["Richest Customer Wealth","richest-customer-wealth"],["Matrix Diagonal Sum","matrix-diagonal-sum"],["Lucky Numbers in Matrix","lucky-numbers-in-a-matrix"]],
  [["Transpose Matrix","transpose-matrix"],["Reshape Matrix","reshape-the-matrix"],["Toeplitz Matrix","toeplitz-matrix"],["Flipping an Image","flipping-an-image"],["Image Smoother","image-smoother"]],
  [["Set Matrix Zeroes","set-matrix-zeroes"],["Spiral Matrix","spiral-matrix"],["Rotate Image","rotate-image"],["Number of Islands","number-of-islands"],["Search a 2D Matrix","search-a-2d-matrix"]],
  [["Word Search","word-search"],["Game of Life","game-of-life"],["Pacific Atlantic Water Flow","pacific-atlantic-water-flow"],["Search a 2D Matrix II","search-a-2d-matrix-ii"],["Minimum Path Sum","minimum-path-sum"]],
  [["Maximal Square","maximal-square"],["Surrounded Regions","surrounded-regions"],["Range Sum Query 2D","range-sum-query-2d-immutable"],["Dungeon Game","dungeon-game"],["Unique Paths II","unique-paths-ii"]],
  [["Maximal Rectangle","maximal-rectangle"],["Longest Increasing Path in a Matrix","longest-increasing-path-in-a-matrix"],["Count Servers That Communicate","count-servers-that-communicate"],["Strange Printer II","strange-printer-ii"],["Number of Ways to Stay in the Same Place","number-of-ways-to-stay-in-the-same-place-after-some-steps"]]
),

// ── HASHING ──────────────────────────────────────────────────────────────────
buildTopic("hashing","Hashing","#3b82f6",
  [["Two Sum","two-sum"],["Ransom Note","ransom-note"],["Isomorphic Strings","isomorphic-strings"],["Word Pattern","word-pattern"],["Happy Number","happy-number"]],
  [["Contains Duplicate","contains-duplicate"],["Contains Duplicate II","contains-duplicate-ii"],["Intersection of Two Arrays","intersection-of-two-arrays"],["Find Common Characters","find-common-characters"],["Unique Number of Occurrences","unique-number-of-occurrences"]],
  [["Group Anagrams","group-anagrams"],["Top K Frequent Elements","top-k-frequent-elements"],["Subarray Sum Equals K","subarray-sum-equals-k"],["4Sum II","4sum-ii"],["Continuous Subarray Sum","continuous-subarray-sum"]],
  [["LRU Cache","lru-cache"],["Insert Delete GetRandom O(1)","insert-delete-getrandom-o1"],["Longest Consecutive Sequence","longest-consecutive-sequence"],["Minimum Window Substring","minimum-window-substring"],["Find All Duplicates","find-all-duplicates-in-an-array"]],
  [["Subarrays with K Different Integers","subarrays-with-k-different-integers"],["Max Points on a Line","max-points-on-a-line"],["All O One Data Structure","all-oone-data-structure"],["Random Pick with Blacklist","random-pick-with-blacklist"],["Count Pairs With XOR in a Range","count-pairs-with-xor-in-a-range"]],
  [["Palindrome Pairs","palindrome-pairs"],["Substring with Concatenation of All Words","substring-with-concatenation-of-all-words"],["Minimum Size Subarray Sum","minimum-size-subarray-sum"],["Design In-Memory File System","design-in-memory-file-system"],["Distinct Echo Substrings","distinct-echo-substrings"]]
),

// ── LINKED LIST ───────────────────────────────────────────────────────────────
buildTopic("linked-list","Linked List","#3b82f6",
  [["Reverse Linked List","reverse-linked-list"],["Merge Two Sorted Lists","merge-two-sorted-lists"],["Linked List Cycle","linked-list-cycle"],["Middle of Linked List","middle-of-the-linked-list"],["Palindrome Linked List","palindrome-linked-list"]],
  [["Remove Duplicates from Sorted List","remove-duplicates-from-sorted-list"],["Intersection of Two Linked Lists","intersection-of-two-linked-lists"],["Delete Node in Linked List","delete-node-in-a-linked-list"],["Convert Binary to Decimal","convert-binary-number-in-a-linked-list-to-integer"],["Remove Linked List Elements","remove-linked-list-elements"]],
  [["Remove Nth Node From End","remove-nth-node-from-end-of-list"],["Reorder List","reorder-list"],["Add Two Numbers","add-two-numbers"],["Odd Even Linked List","odd-even-linked-list"],["Rotate List","rotate-list"]],
  [["Linked List Cycle II","linked-list-cycle-ii"],["Swap Nodes in Pairs","swap-nodes-in-pairs"],["Partition List","partition-list"],["Sort List","sort-list"],["Copy List with Random Pointer","copy-list-with-random-pointer"]],
  [["Merge K Sorted Lists","merge-k-sorted-lists"],["Reverse Nodes in k-Group","reverse-nodes-in-k-group"],["Find the Duplicate Number","find-the-duplicate-number"],["LRU Cache","lru-cache"],["Flatten a Multilevel Doubly Linked List","flatten-a-multilevel-doubly-linked-list"]],
  [["Design Linked List","design-linked-list"],["Insert into a Cyclic Sorted List","insert-into-a-sorted-circular-linked-list"],["Reverse Linked List II","reverse-linked-list-ii"],["Remove Zero Sum Sublists","remove-zero-sum-consecutive-nodes-from-linked-list"],["Linked List Random Node","linked-list-random-node"]]
),

// ── STACK ─────────────────────────────────────────────────────────────────────
buildTopic("stack","Stack","#3b82f6",
  [["Valid Parentheses","valid-parentheses"],["Remove Outermost Parentheses","remove-outermost-parentheses"],["Backspace String Compare","backspace-string-compare"],["Make the String Great","make-the-string-great"],["Remove All Adjacent Duplicates","remove-all-adjacent-duplicates-in-string"]],
  [["Implement Queue Using Stacks","implement-queue-using-stacks"],["Baseball Game","baseball-game"],["Next Greater Element I","next-greater-element-i"],["Build an Array With Stack Operations","build-an-array-with-stack-operations"],["Crawler Log Folder","crawler-log-folder"]],
  [["Min Stack","min-stack"],["Evaluate Reverse Polish Notation","evaluate-reverse-polish-notation"],["Generate Parentheses","generate-parentheses"],["Daily Temperatures","daily-temperatures"],["Car Fleet","car-fleet"]],
  [["Decode String","decode-string"],["Asteroid Collision","asteroid-collision"],["Remove K Digits","remove-k-digits"],["Next Greater Element II","next-greater-element-ii"],["Online Stock Span","online-stock-span"]],
  [["Largest Rectangle in Histogram","largest-rectangle-in-histogram"],["Maximal Rectangle","maximal-rectangle"],["Basic Calculator","basic-calculator"],["Trapping Rain Water","trapping-rain-water"],["Sum of Subarray Minimums","sum-of-subarray-minimums"]],
  [["Basic Calculator II","basic-calculator-ii"],["Maximum Frequency Stack","maximum-frequency-stack"],["Number of Visible People in a Queue","number-of-visible-people-in-a-queue"],["Minimum Cost Tree From Leaf Values","minimum-cost-tree-from-leaf-values"],["Score of Parentheses","score-of-parentheses"]]
),

// ── QUEUE ─────────────────────────────────────────────────────────────────────
buildTopic("queue","Queue","#3b82f6",
  [["Number of Recent Calls","number-of-recent-calls"],["Implement Stack Using Queues","implement-stack-using-queues"],["First Unique Character","first-unique-character-in-a-string"],["Design Circular Queue","design-circular-queue"],["Moving Average from Data Stream","moving-average-from-data-stream"]],
  [["Time Needed to Buy Tickets","time-needed-to-buy-tickets"],["Reveal Cards in Increasing Order","reveal-cards-in-increasing-order"],["Number of Students Unable to Eat Lunch","number-of-students-unable-to-eat-lunch"],["Average of Levels in Binary Tree","average-of-levels-in-binary-tree"],["Maximum Width of Binary Tree","maximum-width-of-binary-tree"]],
  [["Task Scheduler","task-scheduler"],["Rotting Oranges","rotting-oranges"],["Walls and Gates","walls-and-gates"],["Snakes and Ladders","snakes-and-ladders"],["Jump Game IV","jump-game-iv"]],
  [["Open the Lock","open-the-lock"],["Shortest Path in Binary Matrix","shortest-path-in-binary-matrix"],["Word Ladder","word-ladder"],["Perfect Squares","perfect-squares"],["Minimum Steps in Infinite Grid","jump-game-vi"]],
  [["Sliding Window Maximum","sliding-window-maximum"],["Jump Game VI","jump-game-vi"],["Shortest Subarray with Sum at Least K","shortest-subarray-with-sum-at-least-k"],["Constrained Subsequence Sum","constrained-subsequence-sum"],["Minimum Number of Flips to Convert Binary Matrix","minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix"]],
  [["Word Ladder II","word-ladder-ii"],["Cut Off Trees for Golf Event","cut-off-trees-for-golf-event"],["Bus Routes","bus-routes"],["Minimum Jumps to Reach Home","minimum-jumps-to-reach-home"],["Shortest Path Visiting All Nodes","shortest-path-visiting-all-nodes"]]
),

// ── DEQUE ─────────────────────────────────────────────────────────────────────
buildTopic("deque","Deque","#f59e0b",
  [["Design Circular Deque","design-circular-deque"],["First Unique Character","first-unique-character-in-a-string"],["Moving Average from Data Stream","moving-average-from-data-stream"],["Design Front Middle Back Queue","design-front-middle-back-queue"],["K Radius Subarray Averages","k-radius-subarray-averages"]],
  [["Maximum Value at a Given Index in a Bounded Array","maximum-value-at-a-given-index-in-a-bounded-array"],["Find the Most Competitive Subsequence","find-the-most-competitive-subsequence"],["Longest Subarray of 1s After Deleting One Element","longest-subarray-of-1s-after-deleting-one-element"],["Maximum of All Subarrays of Size K","sliding-window-maximum"],["Stock Price Fluctuation","stock-price-fluctuation"]],
  [["Jump Game VI","jump-game-vi"],["Shortest Subarray with Sum at Least K","shortest-subarray-with-sum-at-least-k"],["Maximum Sum of Two Non-Overlapping Subarrays","maximum-sum-of-two-non-overlapping-subarrays"],["Longest Continuous Subarray with Absolute Diff","longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit"],["Sum of Subarray Ranges","sum-of-subarray-ranges"]],
  [["Constrained Subsequence Sum","constrained-subsequence-sum"],["Minimum Number of Coins for Fruits","minimum-number-of-coins-for-fruits"],["Maximal Score After Applying K Operations","maximal-score-after-applying-k-operations"],["Max Chunks To Make Sorted II","max-chunks-to-make-sorted-ii"],["Sum of Total Strength of Wizards","sum-of-total-strength-of-wizards"]],
  [["Sliding Window Maximum","sliding-window-maximum"],["Max Sum of Rectangle No Larger Than K","max-sum-of-rectangle-no-larger-than-k"],["Minimum Cost to Make Array Equal","minimum-cost-to-make-array-equal"],["Minimum Number of Operations to Satisfy Conditions","minimum-number-of-operations-to-satisfy-conditions"],["Find the Minimum and Maximum Number of Nodes","find-the-minimum-and-maximum-number-of-nodes-between-critical-points"]],
  [["Shortest Subarray with Sum at Least K","shortest-subarray-with-sum-at-least-k"],["Maximum Number of Books You Can Take","maximum-number-of-books-you-can-take"],["Count Subarrays Where Max Element Appears at Least K Times","count-subarrays-where-max-element-appears-at-least-k-times"],["Minimum Adjacent Swaps for K Consecutive Ones","minimum-adjacent-swaps-for-k-consecutive-ones"],["Minimum Operations to Reduce X to Zero","minimum-operations-to-reduce-x-to-zero"]]
),

// ── HEAP ──────────────────────────────────────────────────────────────────────
buildTopic("heap","Heap (Priority Queue)","#f59e0b",
  [["Kth Largest Element in a Stream","kth-largest-element-in-a-stream"],["Last Stone Weight","last-stone-weight"],["Relative Ranks","relative-ranks"],["Maximum Product of Two Elements","maximum-product-of-two-elements-in-an-array"],["Minimum Cost to Connect Sticks","minimum-cost-to-connect-sticks"]],
  [["Sort Array by Increasing Frequency","sort-array-by-increasing-frequency"],["Find Subsequence of Length K With the Largest Sum","find-subsequence-of-length-k-with-the-largest-sum"],["Remove Stones to Minimize the Total","remove-stones-to-minimize-the-total"],["Smallest Number in Infinite Set","smallest-number-in-infinite-set"],["Minimum Operations to Halve Array Sum","minimum-operations-to-halve-array-sum"]],
  [["Kth Largest Element in Array","kth-largest-element-in-an-array"],["Top K Frequent Elements","top-k-frequent-elements"],["K Closest Points to Origin","k-closest-points-to-origin"],["Task Scheduler","task-scheduler"],["Reorganize String","reorganize-string"]],
  [["Merge K Sorted Lists","merge-k-sorted-lists"],["Find Median from Data Stream","find-median-from-data-stream"],["Meeting Rooms II","meeting-rooms-ii"],["Design Twitter","design-twitter"],["IPO","ipo"]],
  [["Trapping Rain Water II","trapping-rain-water-ii"],["The Skyline Problem","the-skyline-problem"],["Maximum Performance of a Team","maximum-performance-of-a-team"],["Minimum Cost to Hire K Workers","minimum-cost-to-hire-k-workers"],["Swim in Rising Water","swim-in-rising-water"]],
  [["Minimum Number of Refueling Stops","minimum-number-of-refueling-stops"],["Single-Threaded CPU","single-threaded-cpu"],["Parallel Courses II","parallel-courses-ii"],["Maximum Subsequence Score","maximum-subsequence-score"],["Minimum Space Wasted With K Resizing Operations","minimum-space-wasted-with-k-resizing-operations"]]
),

// ── TREE ──────────────────────────────────────────────────────────────────────
buildTopic("tree","Tree","#f59e0b",
  [["Invert Binary Tree","invert-binary-tree"],["Maximum Depth of Binary Tree","maximum-depth-of-binary-tree"],["Diameter of Binary Tree","diameter-of-binary-tree"],["Balanced Binary Tree","balanced-binary-tree"],["Same Tree","same-tree"]],
  [["Subtree of Another Tree","subtree-of-another-tree"],["Path Sum","path-sum"],["Symmetric Tree","symmetric-tree"],["Merge Two Binary Trees","merge-two-binary-trees"],["Search in a Binary Search Tree","search-in-a-binary-search-tree"]],
  [["Binary Tree Level Order Traversal","binary-tree-level-order-traversal"],["Binary Tree Right Side View","binary-tree-right-side-view"],["Count Good Nodes in Binary Tree","count-good-nodes-in-binary-tree"],["Lowest Common Ancestor of BST","lowest-common-ancestor-of-a-binary-search-tree"],["Kth Smallest Element in BST","kth-smallest-element-in-a-bst"]],
  [["Validate Binary Search Tree","validate-binary-search-tree"],["Construct Binary Tree from Preorder and Inorder","construct-binary-tree-from-preorder-and-inorder-traversal"],["Lowest Common Ancestor of Binary Tree","lowest-common-ancestor-of-a-binary-tree"],["Path Sum II","path-sum-ii"],["Flatten Binary Tree to Linked List","flatten-binary-tree-to-linked-list"]],
  [["Binary Tree Maximum Path Sum","binary-tree-maximum-path-sum"],["Serialize and Deserialize Binary Tree","serialize-and-deserialize-binary-tree"],["Binary Tree Cameras","binary-tree-cameras"],["Sum Root to Leaf Numbers","sum-root-to-leaf-numbers"],["Recover Binary Search Tree","recover-binary-search-tree"]],
  [["Binary Tree Postorder Traversal","binary-tree-postorder-traversal"],["Distribute Coins in Binary Tree","distribute-coins-in-binary-tree"],["Delete Nodes and Return Forest","delete-nodes-and-return-forest"],["Maximum Sum BST in Binary Tree","maximum-sum-bst-in-binary-tree"],["Number of Good Leaf Nodes Pairs","number-of-good-leaf-nodes-pairs"]]
),

// ── BINARY TREE ───────────────────────────────────────────────────────────────
buildTopic("binary-tree","Binary Tree","#f59e0b",
  [["Binary Tree Inorder Traversal","binary-tree-inorder-traversal"],["Binary Tree Preorder Traversal","binary-tree-preorder-traversal"],["Binary Tree Postorder Traversal","binary-tree-postorder-traversal"],["N-ary Tree Preorder Traversal","n-ary-tree-preorder-traversal"],["Find Mode in Binary Search Tree","find-mode-in-binary-search-tree"]],
  [["Range Sum of BST","range-sum-of-bst"],["Increasing Order Search Tree","increasing-order-search-tree"],["Average of Levels in Binary Tree","average-of-levels-in-binary-tree"],["Minimum Depth of Binary Tree","minimum-depth-of-binary-tree"],["Sum of Left Leaves","sum-of-left-leaves"]],
  [["Binary Tree Level Order Traversal","binary-tree-level-order-traversal"],["Binary Tree Zigzag Level Order Traversal","binary-tree-zigzag-level-order-traversal"],["Populating Next Right Pointers","populating-next-right-pointers-in-each-node"],["Binary Tree Level Order Traversal II","binary-tree-level-order-traversal-ii"],["Find Largest Value in Each Tree Row","find-largest-value-in-each-tree-row"]],
  [["Construct Binary Tree from Inorder and Postorder","construct-binary-tree-from-inorder-and-postorder-traversal"],["Path Sum III","path-sum-iii"],["Boundary of Binary Tree","boundary-of-binary-tree"],["Binary Tree Vertical Order Traversal","binary-tree-vertical-order-traversal"],["All Nodes Distance K in Binary Tree","all-nodes-distance-k-in-binary-tree"]],
  [["Binary Tree Maximum Path Sum","binary-tree-maximum-path-sum"],["Serialize and Deserialize Binary Tree","serialize-and-deserialize-binary-tree"],["Binary Tree Cameras","binary-tree-cameras"],["House Robber III","house-robber-iii"],["Vertical Order Traversal of Binary Tree","vertical-order-traversal-of-a-binary-tree"]],
  [["Maximum Width of Binary Tree","maximum-width-of-binary-tree"],["Count Complete Tree Nodes","count-complete-tree-nodes"],["Find Duplicate Subtrees","find-duplicate-subtrees"],["Largest BST Subtree","largest-bst-subtree"],["Flip Binary Tree to Match Preorder Traversal","flip-binary-tree-to-match-preorder-traversal"]]
),

// ── BST ───────────────────────────────────────────────────────────────────────
buildTopic("bst","Binary Search Tree (BST)","#f59e0b",
  [["Search in a Binary Search Tree","search-in-a-binary-search-tree"],["Find Mode in BST","find-mode-in-binary-search-tree"],["Range Sum of BST","range-sum-of-bst"],["Minimum Absolute Difference in BST","minimum-absolute-difference-in-bst"],["Increasing Order Search Tree","increasing-order-search-tree"]],
  [["Two Sum IV - BST","two-sum-iv-input-is-a-bst"],["Minimum Distance Between BST Nodes","minimum-distance-between-bst-nodes"],["Trim a BST","trim-a-binary-search-tree"],["Convert Sorted Array to BST","convert-sorted-array-to-binary-search-tree"],["Univalued Binary Tree","univalued-binary-tree"]],
  [["Validate Binary Search Tree","validate-binary-search-tree"],["Kth Smallest Element in BST","kth-smallest-element-in-a-bst"],["LCA of BST","lowest-common-ancestor-of-a-binary-search-tree"],["Insert into a BST","insert-into-a-binary-search-tree"],["Delete Node in BST","delete-node-in-a-bst"]],
  [["BST Iterator","binary-search-tree-iterator"],["Inorder Successor in BST","inorder-successor-in-bst"],["Recover Binary Search Tree","recover-binary-search-tree"],["Balance a Binary Search Tree","balance-a-binary-search-tree"],["Serialize and Deserialize BST","serialize-and-deserialize-bst"]],
  [["Count of Smaller Numbers After Self","count-of-smaller-numbers-after-self"],["Closest Binary Search Tree Value II","closest-binary-search-tree-value-ii"],["Maximum Sum BST in Binary Tree","maximum-sum-bst-in-binary-tree"],["All Elements in Two Binary Search Trees","all-elements-in-two-binary-search-trees"],["Construct BST from Preorder Traversal","construct-binary-search-tree-from-preorder-traversal"]],
  [["Count Nodes Equal to Average of Subtree","count-nodes-equal-to-average-of-subtree"],["Kth Largest Element in a BST","kth-largest-element-in-a-bst"],["Two Sum BST","two-sum-bsts"],["Minimum Swaps to Make Sequences Increasing","minimum-swaps-to-make-sequences-increasing"],["Number of Ways to Reorder Array to Get Same BST","number-of-ways-to-reorder-array-to-get-same-bst"]]
),
// ── TRIE ──────────────────────────────────────────────────────────────────────
buildTopic("trie","Trie","#ef4444",
  [["Implement Trie (Prefix Tree)","implement-trie-prefix-tree"],["Search Suggestions System","search-suggestions-system"],["Replace Words","replace-words"],["Longest Word in Dictionary","longest-word-in-dictionary"],["Implement Magic Dictionary","implement-magic-dictionary"]],
  [["Design Add and Search Words Data Structure","design-add-and-search-words-data-structure"],["Map Sum Pairs","map-sum-pairs"],["Add and Search Word","design-add-and-search-words-data-structure"],["Count Words Obtained After Adding a Letter","count-words-obtained-after-adding-a-letter"],["Longest Common Prefix","longest-common-prefix"]],
  [["Design Search Autocomplete System","design-search-autocomplete-system"],["Stream of Characters","stream-of-characters"],["Index Pairs of a String","index-pairs-of-a-string"],["Maximum XOR of Two Numbers in Array","maximum-xor-of-two-numbers-in-an-array"],["Camelcase Matching","camelcase-matching"]],
  [["Word Break II","word-break-ii"],["Concatenated Words","concatenated-words"],["Palindrome Pairs","palindrome-pairs"],["Short Encoding of Words","short-encoding-of-words"],["Number of Distinct Substrings in a String","number-of-distinct-substrings-in-a-string"]],
  [["Word Search II","word-search-ii"],["Maximum XOR With an Element From Array","maximum-xor-with-an-element-from-array"],["Count Pairs With XOR in a Range","count-pairs-with-xor-in-a-range"],["Design File System","design-file-system"],["Prefix and Suffix Search","prefix-and-suffix-search"]],
  [["Sum of Prefix Scores of Strings","sum-of-prefix-scores-of-strings"],["Minimum Cost to Replace Characters","minimum-cost-to-replace-characters-in-string-1-with-string-2"],["Longest Word With All Prefixes","longest-word-with-all-prefixes"],["Number of Valid Words for Each Puzzle","number-of-valid-words-for-each-puzzle"],["Maximum Score After Splitting a String","maximum-score-after-splitting-a-string"]]
),
// ── GRAPH ─────────────────────────────────────────────────────────────────────
buildTopic("graph","Graph","#f59e0b",
  [["Find Center of Star Graph","find-center-of-star-graph"],["Find the Town Judge","find-the-town-judge"],["Number of Provinces","number-of-provinces"],["Find if Path Exists in Graph","find-if-path-exists-in-graph"],["Minimum Number of Vertices to Reach All Nodes","minimum-number-of-vertices-to-reach-all-nodes"]],
  [["Clone Graph","clone-graph"],["Number of Islands","number-of-islands"],["Max Area of Island","max-area-of-island"],["Flood Fill","flood-fill"],["Connected Components in Undirected Graph","number-of-connected-components-in-an-undirected-graph"]],
  [["Course Schedule","course-schedule"],["Pacific Atlantic Water Flow","pacific-atlantic-water-flow"],["Surrounded Regions","surrounded-regions"],["Rotting Oranges","rotting-oranges"],["01 Matrix","01-matrix"]],
  [["Course Schedule II","course-schedule-ii"],["Network Delay Time","network-delay-time"],["Cheapest Flights Within K Stops","cheapest-flights-within-k-stops"],["Minimum Effort Path","path-with-minimum-effort"],["Keys and Rooms","keys-and-rooms"]],
  [["Critical Connections in a Network","critical-connections-in-a-network"],["Minimum Cost to Connect All Points","min-cost-to-connect-all-points"],["Shortest Path in a Grid with Obstacles","shortest-path-in-a-grid-with-obstacles-elimination"],["Find the Safest Path in a Grid","find-the-safest-path-in-a-grid"],["Largest Component Size by Common Factor","largest-component-size-by-common-factor"]],
  [["Alien Dictionary","alien-dictionary"],["Word Ladder II","word-ladder-ii"],["Reconstruct Itinerary","reconstruct-itinerary"],["Minimum Number of Days to Disconnect Island","minimum-number-of-days-to-disconnect-island"],["Count Subtrees With Max Distance Between Cities","count-subtrees-with-max-distance-between-cities"]]
),

// ── GREEDY ────────────────────────────────────────────────────────────────────
buildTopic("greedy","Greedy Algorithms","#f59e0b",
  [["Lemonade Change","lemonade-change"],["Assign Cookies","assign-cookies"],["Can Place Flowers","can-place-flowers"],["Buy Two Chocolates","buy-two-chocolates"],["Minimum Operations to Make the Array Increasing","minimum-operations-to-make-the-array-increasing"]],
  [["Best Time to Buy and Sell Stock","best-time-to-buy-and-sell-stock"],["Walking Robot Simulation","walking-robot-simulation"],["Maximum Units on a Truck","maximum-units-on-a-truck"],["Minimum Number of Moves to Seat Everyone","minimum-number-of-moves-to-seat-everyone"],["Divide a String Into Groups of Size k","divide-a-string-into-groups-of-size-k"]],
  [["Jump Game","jump-game"],["Gas Station","gas-station"],["Hand of Straights","hand-of-straights"],["Partition Labels","partition-labels"],["Valid Parenthesis String","valid-parenthesis-string"]],
  [["Jump Game II","jump-game-ii"],["Merge Triplets to Form Target Triplet","merge-triplets-to-form-target-triplet"],["Minimum Add to Make Parentheses Valid","minimum-add-to-make-parentheses-valid"],["Task Scheduler","task-scheduler"],["Reorganize String","reorganize-string"]],
  [["IPO","ipo"],["Minimum Number of Arrows to Burst Balloons","minimum-number-of-arrows-to-burst-balloons"],["Non-overlapping Intervals","non-overlapping-intervals"],["Largest Number","largest-number"],["Candy","candy"]],
  [["Minimum Cost to Hire K Workers","minimum-cost-to-hire-k-workers"],["Split Array Into Consecutive Subsequences","split-array-into-consecutive-subsequences"],["Maximize Score After N Operations","maximize-score-after-n-operations"],["Maximum Profit in Job Scheduling","maximum-profit-in-job-scheduling"],["Minimum Number of Taps to Open to Water a Garden","minimum-number-of-taps-to-open-to-water-a-garden"]]
),
// ── DYNAMIC PROGRAMMING ───────────────────────────────────────────────────────
buildTopic("dp","Dynamic Programming (DP)","#ef4444",
  [["Climbing Stairs","climbing-stairs"],["Fibonacci Number","fibonacci-number"],["N-th Tribonacci Number","n-th-tribonacci-number"],["Min Cost Climbing Stairs","min-cost-climbing-stairs"],["Pascal's Triangle","pascals-triangle"]],
  [["Best Time to Buy and Sell Stock","best-time-to-buy-and-sell-stock"],["Maximum Subarray","maximum-subarray"],["Range Sum Query - Immutable","range-sum-query-immutable"],["Counting Bits","counting-bits"],["Is Subsequence","is-subsequence"]],
  [["House Robber","house-robber"],["Longest Common Subsequence","longest-common-subsequence"],["Word Break","word-break"],["Coin Change","coin-change"],["Unique Paths","unique-paths"]],
  [["Combination Sum IV","combination-sum-iv"],["Partition Equal Subset Sum","partition-equal-subset-sum"],["Longest Increasing Subsequence","longest-increasing-subsequence"],["Target Sum","target-sum"],["Decode Ways","decode-ways"]],
  [["Burst Balloons","burst-balloons"],["Regular Expression Matching","regular-expression-matching"],["Edit Distance","edit-distance"],["Distinct Subsequences","distinct-subsequences"],["Cherry Pickup","cherry-pickup"]],
  [["Minimum Cost to Cut a Stick","minimum-cost-to-cut-a-stick"],["Strange Printer","strange-printer"],["Zuma Game","zuma-game"],["Minimum Window Substring","minimum-window-substring"],["Count Different Palindromic Subsequences","count-different-palindromic-subsequences"]]
),
// ── RECURSION ─────────────────────────────────────────────────────────────────
buildTopic("recursion","Recursion","#f59e0b",
  [["Fibonacci Number","fibonacci-number"],["Power of Two","power-of-two"],["Reverse String","reverse-string"],["Merge Two Sorted Lists","merge-two-sorted-lists"],["Sum of Digits of a Number","sum-of-digits-of-a-number"]],
  [["Factorial Trailing Zeroes","factorial-trailing-zeroes"],["Pow(x, n)","powx-n"],["Count Good Numbers","count-good-numbers"],["Number of Digit One","number-of-digit-one"],["Count Digit One","number-of-digit-one"]],
  [["Flatten Nested List Iterator","flatten-nested-list-iterator"],["Letter Combinations of Phone Number","letter-combinations-of-a-phone-number"],["Generate Parentheses","generate-parentheses"],["Permutations","permutations"],["Combination Sum","combination-sum"]],
  [["Subsets","subsets"],["Word Search","word-search"],["N-Queens","n-queens"],["Palindrome Partitioning","palindrome-partitioning"],["Restore IP Addresses","restore-ip-addresses"]],
  [["Regular Expression Matching","regular-expression-matching"],["Wildcard Matching","wildcard-matching"],["Different Ways to Add Parentheses","different-ways-to-add-parentheses"],["Predict the Winner","predict-the-winner"],["Zuma Game","zuma-game"]],
  [["Remove Boxes","remove-boxes"],["Strange Printer","strange-printer"],["Guess Number Higher or Lower II","guess-number-higher-or-lower-ii"],["Burst Balloons","burst-balloons"],["Count Vowels Permutation","count-vowels-permutation"]]
),

// ── BACKTRACKING ──────────────────────────────────────────────────────────────
buildTopic("backtrack","Backtracking","#ef4444",
  [["Letter Combinations of Phone Number","letter-combinations-of-a-phone-number"],["Binary Watch","binary-watch"],["Find K-Length Substrings With No Repeated Characters","find-k-length-substrings-with-no-repeated-characters"],["Maximum Length of a Concatenated String","maximum-length-of-a-concatenated-string-with-unique-characters"],["Generate Parentheses","generate-parentheses"]],
  [["Permutations","permutations"],["Subsets","subsets"],["Combination Sum","combination-sum"],["Combinations","combinations"],["Path Sum II","path-sum-ii"]],
  [["Subsets II","subsets-ii"],["Combination Sum II","combination-sum-ii"],["Permutations II","permutations-ii"],["Word Search","word-search"],["Restore IP Addresses","restore-ip-addresses"]],
  [["Palindrome Partitioning","palindrome-partitioning"],["Partition to K Equal Sum Subsets","partition-to-k-equal-sum-subsets"],["Beautiful Arrangement","beautiful-arrangement"],["Factor Combinations","factor-combinations"],["Remove Invalid Parentheses","remove-invalid-parentheses"]],
  [["N-Queens","n-queens"],["Sudoku Solver","sudoku-solver"],["Word Ladder II","word-ladder-ii"],["Expression Add Operators","expression-add-operators"],["Generalized Abbreviation","generalized-abbreviation"]],
  [["N-Queens II","n-queens-ii"],["24 Game","24-game"],["Find Minimum Time to Finish All Jobs","find-minimum-time-to-finish-all-jobs"],["Verbal Arithmetic Puzzle","verbal-arithmetic-puzzle"],["Maximum Students Taking Exam","maximum-students-taking-exam"]]
),
// ── SEARCHING ─────────────────────────────────────────────────────────────────
buildTopic("searching","Searching","#3b82f6",
  [["Binary Search","binary-search"],["Search Insert Position","search-insert-position"],["First Bad Version","first-bad-version"],["Count Negative Numbers in Sorted Matrix","count-negative-numbers-in-a-sorted-matrix"],["Valid Perfect Square","valid-perfect-square"]],
  [["Guess Number Higher or Lower","guess-number-higher-or-lower"],["Sqrt(x)","sqrtx"],["Peak Index in a Mountain Array","peak-index-in-a-mountain-array"],["Two Sum Less Than K","two-sum-less-than-k"],["Check if N and Its Double Exist","check-if-n-and-its-double-exist"]],
  [["Search a 2D Matrix","search-a-2d-matrix"],["Find Minimum in Rotated Sorted Array","find-minimum-in-rotated-sorted-array"],["Search in Rotated Sorted Array","search-in-rotated-sorted-array"],["Koko Eating Bananas","koko-eating-bananas"],["Time Based Key-Value Store","time-based-key-value-store"]],
  [["Find Minimum in Rotated Sorted Array II","find-minimum-in-rotated-sorted-array-ii"],["Search in Rotated Sorted Array II","search-in-rotated-sorted-array-ii"],["Find Peak Element","find-peak-element"],["Capacity To Ship Packages","capacity-to-ship-packages-within-d-days"],["Minimum Time to Complete Trips","minimum-time-to-complete-trips"]],
  [["Median of Two Sorted Arrays","median-of-two-sorted-arrays"],["Split Array Largest Sum","split-array-largest-sum"],["Count of Range Sum","count-of-range-sum"],["Russian Doll Envelopes","russian-doll-envelopes"],["Max Sum of Rectangle No Larger Than K","max-sum-of-rectangle-no-larger-than-k"]],
  [["Count of Smaller Numbers After Self","count-of-smaller-numbers-after-self"],["Smallest Rectangle Enclosing Black Pixels","smallest-rectangle-enclosing-black-pixels"],["Find K-th Smallest Pair Distance","find-k-th-smallest-pair-distance"],["Minimize Max Distance to Gas Station","minimize-max-distance-to-gas-station"],["Swim in Rising Water","swim-in-rising-water"]]
),
// ── SORTING ───────────────────────────────────────────────────────────────────
buildTopic("sorting","Sorting","#f59e0b",
  [["Sort Array By Parity","sort-array-by-parity"],["Sort Array by Parity II","sort-array-by-parity-ii"],["Squares of a Sorted Array","squares-of-a-sorted-array"],["Merge Sorted Array","merge-sorted-array"],["Sort Colors","sort-colors"]],
  [["Sort Array","sort-an-array"],["Relative Sort Array","relative-sort-array"],["Height Checker","height-checker"],["Find the Distance Value Between Two Arrays","find-the-distance-value-between-two-arrays"],["Sort the People","sort-the-people"]],
  [["Largest Number","largest-number"],["Meeting Rooms","meeting-rooms"],["Meeting Rooms II","meeting-rooms-ii"],["K Closest Points to Origin","k-closest-points-to-origin"],["Merge Intervals","merge-intervals"]],
  [["Non-overlapping Intervals","non-overlapping-intervals"],["Insert Interval","insert-interval"],["Sort List","sort-list"],["Wiggle Sort","wiggle-sort"],["Find K Pairs with Smallest Sums","find-k-pairs-with-smallest-sums"]],
  [["Count of Smaller Numbers After Self","count-of-smaller-numbers-after-self"],["Reverse Pairs","reverse-pairs"],["Russian Doll Envelopes","russian-doll-envelopes"],["Maximum Gap","maximum-gap"],["Sort Transformed Array","sort-transformed-array"]],
  [["Maximum Number of Tasks You Can Assign","maximum-number-of-tasks-you-can-assign"],["Count Good Triplets in an Array","count-good-triplets-in-an-array"],["Number of Pairs of Interchangeable Rectangles","number-of-pairs-of-interchangeable-rectangles"],["Find Median from Data Stream","find-median-from-data-stream"],["Minimum Operations to Make Array Equal II","minimum-operations-to-make-array-equal-ii"]]
),

// ── BINARY SEARCH ─────────────────────────────────────────────────────────────
buildTopic("binary-search","Binary Search","#f59e0b",
  [["Binary Search","binary-search"],["Search Insert Position","search-insert-position"],["Sqrt(x)","sqrtx"],["Guess Number Higher or Lower","guess-number-higher-or-lower"],["Valid Perfect Square","valid-perfect-square"]],
  [["First Bad Version","first-bad-version"],["Peak Index in a Mountain Array","peak-index-in-a-mountain-array"],["Two Sum II - Input Array Is Sorted","two-sum-ii-input-array-is-sorted"],["Find Smallest Letter Greater Than Target","find-smallest-letter-greater-than-target"],["Count Negative Numbers in Sorted Matrix","count-negative-numbers-in-a-sorted-matrix"]],
  [["Find Minimum in Rotated Sorted Array","find-minimum-in-rotated-sorted-array"],["Search in Rotated Sorted Array","search-in-rotated-sorted-array"],["Koko Eating Bananas","koko-eating-bananas"],["Time Based Key-Value Store","time-based-key-value-store"],["Find Peak Element","find-peak-element"]],
  [["Search a 2D Matrix","search-a-2d-matrix"],["Search a 2D Matrix II","search-a-2d-matrix-ii"],["H-Index II","h-index-ii"],["Find First and Last Position of Element","find-first-and-last-position-of-element-in-sorted-array"],["Capacity to Ship Packages","capacity-to-ship-packages-within-d-days"]],
  [["Median of Two Sorted Arrays","median-of-two-sorted-arrays"],["Split Array Largest Sum","split-array-largest-sum"],["Find K-th Smallest Pair Distance","find-k-th-smallest-pair-distance"],["Minimize Max Distance to Gas Station","minimize-max-distance-to-gas-station"],["Swim in Rising Water","swim-in-rising-water"]],
  [["Minimum Number of Days to Make m Bouquets","minimum-number-of-days-to-make-m-bouquets"],["Magnetic Force Between Two Balls","magnetic-force-between-two-balls"],["Maximum Number of Tasks You Can Assign","maximum-number-of-tasks-you-can-assign"],["Kth Smallest Number in Multiplication Table","kth-smallest-number-in-multiplication-table"],["Find Minimum Time to Finish All Jobs","find-minimum-time-to-finish-all-jobs"]]
),
// ── TWO POINTERS ──────────────────────────────────────────────────────────────
buildTopic("two-pointers","Two Pointers","#f59e0b",
  [["Valid Palindrome","valid-palindrome"],["Merge Sorted Array","merge-sorted-array"],["Remove Duplicates from Sorted Array","remove-duplicates-from-sorted-array"],["Move Zeroes","move-zeroes"],["Reverse String","reverse-string"]],
  [["Squares of a Sorted Array","squares-of-a-sorted-array"],["Reverse Vowels of a String","reverse-vowels-of-a-string"],["Is Subsequence","is-subsequence"],["Backspace String Compare","backspace-string-compare"],["Intersection of Two Arrays II","intersection-of-two-arrays-ii"]],
  [["Two Sum II - Input Array Is Sorted","two-sum-ii-input-array-is-sorted"],["3Sum","3sum"],["3Sum Closest","3sum-closest"],["Container With Most Water","container-with-most-water"],["Remove Duplicates from Sorted Array II","remove-duplicates-from-sorted-array-ii"]],
  [["4Sum","4sum"],["Sort Colors","sort-colors"],["Subarray Product Less Than K","subarray-product-less-than-k"],["Number of Subsequences That Satisfy the Given Sum","number-of-subsequences-that-satisfy-the-given-sum-condition"],["Boats to Save People","boats-to-save-people"]],
  [["Trapping Rain Water","trapping-rain-water"],["Minimum Window Substring","minimum-window-substring"],["Longest Mountain in Array","longest-mountain-in-array"],["Subarrays with K Different Integers","subarrays-with-k-different-integers"],["Max Consecutive Ones III","max-consecutive-ones-iii"]],
  [["Minimum Operations to Reduce X to Zero","minimum-operations-to-reduce-x-to-zero"],["Count Pairs Whose Sum is Less than Target","count-pairs-whose-sum-is-less-than-target"],["Find K-Diff Pairs in an Array","find-k-diff-pairs-in-an-array"],["Make Sum Divisible by P","make-sum-divisible-by-p"],["Minimum Size Subarray in Infinite Array","minimum-size-subarray-in-infinite-array"]]
),
// ── SLIDING WINDOW ────────────────────────────────────────────────────────────
buildTopic("sliding-win","Sliding Window","#f59e0b",
  [["Maximum Average Subarray I","maximum-average-subarray-i"],["Maximum Number of Vowels in a Substring","maximum-number-of-vowels-in-a-substring-of-given-length"],["Find the K-Beauty of a Number","find-the-k-beauty-of-a-number"],["Defuse the Bomb","defuse-the-bomb"],["Diet Plan Performance","diet-plan-performance"]],
  [["Best Time to Buy and Sell Stock","best-time-to-buy-and-sell-stock"],["Contains Duplicate II","contains-duplicate-ii"],["Find Pivot Index","find-pivot-index"],["Number of Sub-arrays of Size K and Average Greater than Threshold","number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold"],["Minimum Difference Between Highest and Lowest of K Scores","minimum-difference-between-highest-and-lowest-of-k-scores"]],
  [["Longest Substring Without Repeating Characters","longest-substring-without-repeating-characters"],["Longest Repeating Character Replacement","longest-repeating-character-replacement"],["Permutation in String","permutation-in-string"],["Find All Anagrams in a String","find-all-anagrams-in-a-string"],["Max Consecutive Ones III","max-consecutive-ones-iii"]],
  [["Minimum Size Subarray Sum","minimum-size-subarray-sum"],["Fruit Into Baskets","fruit-into-baskets"],["Binary Subarrays With Sum","binary-subarrays-with-sum"],["Count Number of Nice Subarrays","count-number-of-nice-subarrays"],["Replace the Substring for Balanced String","replace-the-substring-for-balanced-string"]],
  [["Minimum Window Substring","minimum-window-substring"],["Sliding Window Maximum","sliding-window-maximum"],["Substrings of Size Three with Distinct Characters","substrings-of-size-three-with-distinct-characters"],["Subarrays with K Different Integers","subarrays-with-k-different-integers"],["Minimum Operations to Reduce X to Zero","minimum-operations-to-reduce-x-to-zero"]],
  [["Longest Continuous Subarray With Absolute Diff","longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit"],["Frequency of the Most Frequent Element","frequency-of-the-most-frequent-element"],["Maximum Erasure Value","maximum-erasure-value"],["K Radius Subarray Averages","k-radius-subarray-averages"],["Number of Equal Count Substrings","number-of-equal-count-substrings"]]
),
// ── PREFIX SUM ────────────────────────────────────────────────────────────────
buildTopic("prefix-sum","Prefix Sum","#f59e0b",
  [["Running Sum of 1d Array","running-sum-of-1d-array"],["Find Pivot Index","find-pivot-index"],["Kids With the Greatest Number of Candies","kids-with-the-greatest-number-of-candies"],["Sum of All Odd Length Subarrays","sum-of-all-odd-length-subarrays"],["Left and Right Sum Differences","left-and-right-sum-differences"]],
  [["Range Sum Query - Immutable","range-sum-query-immutable"],["Count Vowels in a String","count-vowels-in-string"],["Minimum Value to Get Positive Step by Step Sum","minimum-value-to-get-positive-step-by-step-sum"],["Find the Highest Altitude","find-the-highest-altitude"],["Maximum Population Year","maximum-population-year"]],
  [["Subarray Sum Equals K","subarray-sum-equals-k"],["Product of Array Except Self","product-of-array-except-self"],["Continuous Subarray Sum","continuous-subarray-sum"],["Subarray Sums Divisible by K","subarray-sums-divisible-by-k"],["Find Longest Subarray by Sum","find-longest-subarray-by-sum"]],
  [["Range Sum Query 2D","range-sum-query-2d-immutable"],["Maximum Sum of Two Non-Overlapping Subarrays","maximum-sum-of-two-non-overlapping-subarrays"],["Count of Interesting Subarrays","count-of-interesting-subarrays"],["Sum of Absolute Differences in a Sorted Array","sum-of-absolute-differences-in-a-sorted-array"],["XOR Queries of a Subarray","xor-queries-of-a-subarray"]],
  [["Maximum Sum Circular Subarray","maximum-sum-circular-subarray"],["Count Subarrays With More Ones Than Zeros","count-subarrays-with-more-ones-than-zeros"],["Minimum Average Difference","minimum-average-difference"],["Ways to Split Array Into Three Subarrays","ways-to-split-array-into-three-subarrays"],["Count Subarrays Where Max Element Appears at Least K Times","count-subarrays-where-max-element-appears-at-least-k-times"]],
  [["Sum of All Subset XOR Totals","sum-of-all-subset-xor-totals"],["Minimum Cost to Separate Sentence Into Rows","minimum-cost-to-separate-sentence-into-rows"],["Corporate Flight Bookings","corporate-flight-bookings"],["Count of Range Sum","count-of-range-sum"],["Minimum Number of Operations to Make Array Continuous","minimum-number-of-operations-to-make-array-continuous"]]
),

]
