export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  acceptance: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  questionIds: number[];
  color: string;
}

export const QUESTIONS: Question[] = [
  // Arrays
  { id: 1, title: 'Two Sum', slug: 'two-sum', difficulty: 'Easy', category: 'Arrays', tags: ['Array', 'Hash Table'], acceptance: '49.1%' },
  { id: 121, title: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock', difficulty: 'Easy', category: 'Arrays', tags: ['Array', 'Dynamic Programming'], acceptance: '54.2%' },
  { id: 53, title: 'Maximum Subarray', slug: 'maximum-subarray', difficulty: 'Medium', category: 'Arrays', tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'], acceptance: '50.4%' },
  { id: 88, title: 'Merge Sorted Array', slug: 'merge-sorted-array', difficulty: 'Easy', category: 'Arrays', tags: ['Array', 'Two Pointers', 'Sorting'], acceptance: '46.4%' },
  { id: 169, title: 'Majority Element', slug: 'majority-element', difficulty: 'Easy', category: 'Arrays', tags: ['Array', 'Hash Table', 'Divide and Conquer'], acceptance: '63.5%' },
  // Two Pointer
  { id: 125, title: 'Valid Palindrome', slug: 'valid-palindrome', difficulty: 'Easy', category: 'Two Pointer', tags: ['Two Pointers', 'String'], acceptance: '43.5%' },
  { id: 167, title: 'Two Sum II', slug: 'two-sum-ii-input-array-is-sorted', difficulty: 'Medium', category: 'Two Pointer', tags: ['Array', 'Two Pointers', 'Binary Search'], acceptance: '59.7%' },
  { id: 283, title: 'Move Zeroes', slug: 'move-zeroes', difficulty: 'Easy', category: 'Two Pointer', tags: ['Array', 'Two Pointers'], acceptance: '61.2%' },
  { id: 11, title: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'Medium', category: 'Two Pointer', tags: ['Array', 'Two Pointers', 'Greedy'], acceptance: '53.9%' },
  { id: 15, title: '3Sum', slug: '3sum', difficulty: 'Medium', category: 'Two Pointer', tags: ['Array', 'Two Pointers', 'Sorting'], acceptance: '31.9%' },
  // Sliding Window
  { id: 3, title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters', difficulty: 'Medium', category: 'Sliding Window', tags: ['Hash Table', 'String', 'Sliding Window'], acceptance: '33.8%' },
  { id: 209, title: 'Minimum Size Subarray Sum', slug: 'minimum-size-subarray-sum', difficulty: 'Medium', category: 'Sliding Window', tags: ['Array', 'Binary Search', 'Sliding Window', 'Prefix Sum'], acceptance: '44.7%' },
  { id: 424, title: 'Longest Repeating Character Replacement', slug: 'longest-repeating-character-replacement', difficulty: 'Medium', category: 'Sliding Window', tags: ['Hash Table', 'String', 'Sliding Window'], acceptance: '51.4%' },
  { id: 567, title: 'Permutation in String', slug: 'permutation-in-string', difficulty: 'Medium', category: 'Sliding Window', tags: ['Hash Table', 'Two Pointers', 'String', 'Sliding Window'], acceptance: '44.3%' },
  { id: 76, title: 'Minimum Window Substring', slug: 'minimum-window-substring', difficulty: 'Hard', category: 'Sliding Window', tags: ['Hash Table', 'String', 'Sliding Window'], acceptance: '40.9%' },
  // String
  { id: 344, title: 'Reverse String', slug: 'reverse-string', difficulty: 'Easy', category: 'String', tags: ['Two Pointers', 'String'], acceptance: '75.6%' },
  { id: 242, title: 'Valid Anagram', slug: 'valid-anagram', difficulty: 'Easy', category: 'String', tags: ['Hash Table', 'String', 'Sorting'], acceptance: '62.8%' },
  { id: 14, title: 'Longest Common Prefix', slug: 'longest-common-prefix', difficulty: 'Easy', category: 'String', tags: ['String', 'Trie'], acceptance: '40.8%' },
  { id: 49, title: 'Group Anagrams', slug: 'group-anagrams', difficulty: 'Medium', category: 'String', tags: ['Array', 'Hash Table', 'String', 'Sorting'], acceptance: '66.5%' },
  { id: 5, title: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring', difficulty: 'Medium', category: 'String', tags: ['Two Pointers', 'String', 'Dynamic Programming'], acceptance: '32.9%' },
  // Hashing
  { id: 217, title: 'Contains Duplicate', slug: 'contains-duplicate', difficulty: 'Easy', category: 'Hashing', tags: ['Array', 'Hash Table', 'Sorting'], acceptance: '61.4%' },
  { id: 347, title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements', difficulty: 'Medium', category: 'Hashing', tags: ['Array', 'Hash Table', 'Divide and Conquer', 'Sorting', 'Heap'], acceptance: '65.1%' },
  { id: 128, title: 'Longest Consecutive Sequence', slug: 'longest-consecutive-sequence', difficulty: 'Medium', category: 'Hashing', tags: ['Array', 'Hash Table', 'Union Find'], acceptance: '45.1%' },
  // Recursion & Backtracking
  { id: 46, title: 'Permutations', slug: 'permutations', difficulty: 'Medium', category: 'Recursion & Backtracking', tags: ['Array', 'Backtracking'], acceptance: '73.3%' },
  { id: 78, title: 'Subsets', slug: 'subsets', difficulty: 'Medium', category: 'Recursion & Backtracking', tags: ['Array', 'Backtracking', 'Bit Manipulation'], acceptance: '73.9%' },
  { id: 39, title: 'Combination Sum', slug: 'combination-sum', difficulty: 'Medium', category: 'Recursion & Backtracking', tags: ['Array', 'Backtracking'], acceptance: '68.2%' },
  { id: 131, title: 'Palindrome Partitioning', slug: 'palindrome-partitioning', difficulty: 'Medium', category: 'Recursion & Backtracking', tags: ['String', 'Dynamic Programming', 'Backtracking'], acceptance: '63.9%' },
  { id: 51, title: 'N-Queens', slug: 'n-queens', difficulty: 'Hard', category: 'Recursion & Backtracking', tags: ['Array', 'Backtracking'], acceptance: '64.6%' },
  // Sorting
  { id: 912, title: 'Sort an Array', slug: 'sort-an-array', difficulty: 'Medium', category: 'Sorting', tags: ['Array', 'Divide and Conquer', 'Sorting', 'Heap', 'Merge Sort'], acceptance: '54.8%' },
  { id: 56, title: 'Merge Intervals', slug: 'merge-intervals', difficulty: 'Medium', category: 'Sorting', tags: ['Array', 'Sorting'], acceptance: '46.5%' },
  { id: 179, title: 'Largest Number', slug: 'largest-number', difficulty: 'Medium', category: 'Sorting', tags: ['Array', 'String', 'Greedy', 'Sorting'], acceptance: '32.5%' },
  { id: 215, title: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array', difficulty: 'Medium', category: 'Sorting', tags: ['Array', 'Divide and Conquer', 'Sorting', 'Heap'], acceptance: '64.4%' },
  { id: 75, title: 'Sort Colors', slug: 'sort-colors', difficulty: 'Medium', category: 'Sorting', tags: ['Array', 'Two Pointers', 'Sorting'], acceptance: '60.2%' },
  // Binary Search
  { id: 704, title: 'Binary Search', slug: 'binary-search', difficulty: 'Easy', category: 'Binary Search', tags: ['Array', 'Binary Search'], acceptance: '55.2%' },
  { id: 35, title: 'Search Insert Position', slug: 'search-insert-position', difficulty: 'Easy', category: 'Binary Search', tags: ['Array', 'Binary Search'], acceptance: '42.5%' },
  { id: 33, title: 'Search in Rotated Sorted Array', slug: 'search-in-rotated-sorted-array', difficulty: 'Medium', category: 'Binary Search', tags: ['Array', 'Binary Search'], acceptance: '38.8%' },
  { id: 153, title: 'Find Minimum in Rotated Sorted Array', slug: 'find-minimum-in-rotated-sorted-array', difficulty: 'Medium', category: 'Binary Search', tags: ['Array', 'Binary Search'], acceptance: '47.9%' },
  { id: 875, title: 'Koko Eating Bananas', slug: 'koko-eating-bananas', difficulty: 'Medium', category: 'Binary Search', tags: ['Array', 'Binary Search'], acceptance: '46.5%' },
  // Linked List
  { id: 206, title: 'Reverse Linked List', slug: 'reverse-linked-list', difficulty: 'Easy', category: 'Linked List', tags: ['Linked List', 'Recursion'], acceptance: '73.5%' },
  { id: 141, title: 'Linked List Cycle', slug: 'linked-list-cycle', difficulty: 'Easy', category: 'Linked List', tags: ['Hash Table', 'Linked List', 'Two Pointers'], acceptance: '47.1%' },
  { id: 21, title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', difficulty: 'Easy', category: 'Linked List', tags: ['Linked List', 'Recursion'], acceptance: '61.4%' },
  { id: 19, title: 'Remove Nth Node From End of List', slug: 'remove-nth-node-from-end-of-list', difficulty: 'Medium', category: 'Linked List', tags: ['Linked List', 'Two Pointers'], acceptance: '41.7%' },
  { id: 143, title: 'Reorder List', slug: 'reorder-list', difficulty: 'Medium', category: 'Linked List', tags: ['Linked List', 'Two Pointers', 'Stack', 'Recursion'], acceptance: '57.3%' },
  // Stack
  { id: 20, title: 'Valid Parentheses', slug: 'valid-parentheses', difficulty: 'Easy', category: 'Stack', tags: ['String', 'Stack'], acceptance: '40.8%' },
  { id: 155, title: 'Min Stack', slug: 'min-stack', difficulty: 'Medium', category: 'Stack', tags: ['Stack', 'Design'], acceptance: '52.5%' },
  { id: 739, title: 'Daily Temperatures', slug: 'daily-temperatures', difficulty: 'Medium', category: 'Stack', tags: ['Array', 'Stack', 'Monotonic Stack'], acceptance: '65.7%' },
  { id: 84, title: 'Largest Rectangle in Histogram', slug: 'largest-rectangle-in-histogram', difficulty: 'Hard', category: 'Stack', tags: ['Array', 'Stack', 'Monotonic Stack'], acceptance: '42.6%' },
  { id: 496, title: 'Next Greater Element I', slug: 'next-greater-element-i', difficulty: 'Easy', category: 'Stack', tags: ['Array', 'Hash Table', 'Stack', 'Monotonic Stack'], acceptance: '70.8%' },
  // Queue / Deque
  { id: 933, title: 'Number of Recent Calls', slug: 'number-of-recent-calls', difficulty: 'Easy', category: 'Queue / Deque', tags: ['Queue', 'Data Stream'], acceptance: '74.3%' },
  { id: 239, title: 'Sliding Window Maximum', slug: 'sliding-window-maximum', difficulty: 'Hard', category: 'Queue / Deque', tags: ['Array', 'Queue', 'Sliding Window', 'Heap', 'Monotonic Queue'], acceptance: '46.3%' },
  { id: 622, title: 'Design Circular Queue', slug: 'design-circular-queue', difficulty: 'Medium', category: 'Queue / Deque', tags: ['Array', 'Linked List', 'Design', 'Queue'], acceptance: '49.7%' },
  { id: 641, title: 'Design Circular Deque', slug: 'design-circular-deque', difficulty: 'Medium', category: 'Queue / Deque', tags: ['Array', 'Linked List', 'Design', 'Queue'], acceptance: '57.5%' },
  { id: 862, title: 'Shortest Subarray with Sum at Least K', slug: 'shortest-subarray-with-sum-at-least-k', difficulty: 'Hard', category: 'Queue / Deque', tags: ['Array', 'Binary Search', 'Queue', 'Sliding Window', 'Heap', 'Prefix Sum', 'Monotonic Queue'], acceptance: '26.9%' },
  // Trees
  { id: 104, title: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree', difficulty: 'Easy', category: 'Trees', tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'], acceptance: '73.6%' },
  { id: 100, title: 'Same Tree', slug: 'same-tree', difficulty: 'Easy', category: 'Trees', tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'], acceptance: '57.5%' },
  { id: 226, title: 'Invert Binary Tree', slug: 'invert-binary-tree', difficulty: 'Easy', category: 'Trees', tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'], acceptance: '75.8%' },
  { id: 102, title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal', difficulty: 'Medium', category: 'Trees', tags: ['Tree', 'BFS', 'Binary Tree'], acceptance: '64.9%' },
  { id: 543, title: 'Diameter of Binary Tree', slug: 'diameter-of-binary-tree', difficulty: 'Easy', category: 'Trees', tags: ['Tree', 'DFS', 'Binary Tree'], acceptance: '58.3%' },
  // BST
  { id: 98, title: 'Validate Binary Search Tree', slug: 'validate-binary-search-tree', difficulty: 'Medium', category: 'BST', tags: ['Tree', 'DFS', 'Binary Search Tree', 'Binary Tree'], acceptance: '31.7%' },
  { id: 230, title: 'Kth Smallest Element in a BST', slug: 'kth-smallest-element-in-a-bst', difficulty: 'Medium', category: 'BST', tags: ['Tree', 'DFS', 'Binary Search Tree', 'Binary Tree'], acceptance: '70.1%' },
  { id: 235, title: 'Lowest Common Ancestor of a BST', slug: 'lowest-common-ancestor-of-a-binary-search-tree', difficulty: 'Medium', category: 'BST', tags: ['Tree', 'DFS', 'Binary Search Tree', 'Binary Tree'], acceptance: '61.7%' },
  { id: 700, title: 'Search in a Binary Search Tree', slug: 'search-in-a-binary-search-tree', difficulty: 'Easy', category: 'BST', tags: ['Tree', 'Binary Search Tree', 'Binary Tree'], acceptance: '78.3%' },
  { id: 701, title: 'Insert into a Binary Search Tree', slug: 'insert-into-a-binary-search-tree', difficulty: 'Medium', category: 'BST', tags: ['Tree', 'Binary Search Tree', 'Binary Tree'], acceptance: '74.6%' },
  // Heap / Priority Queue
  { id: 295, title: 'Find Median from Data Stream', slug: 'find-median-from-data-stream', difficulty: 'Hard', category: 'Heap / Priority Queue', tags: ['Two Pointers', 'Design', 'Sorting', 'Heap', 'Data Stream'], acceptance: '50.7%' },
  { id: 973, title: 'K Closest Points to Origin', slug: 'k-closest-points-to-origin', difficulty: 'Medium', category: 'Heap / Priority Queue', tags: ['Array', 'Math', 'Divide and Conquer', 'Geometry', 'Sorting', 'Heap'], acceptance: '65.9%' },
  { id: 1046, title: 'Last Stone Weight', slug: 'last-stone-weight', difficulty: 'Easy', category: 'Heap / Priority Queue', tags: ['Array', 'Greedy', 'Heap'], acceptance: '64.8%' },
  // Greedy
  { id: 55, title: 'Jump Game', slug: 'jump-game', difficulty: 'Medium', category: 'Greedy', tags: ['Array', 'Dynamic Programming', 'Greedy'], acceptance: '38.4%' },
  { id: 45, title: 'Jump Game II', slug: 'jump-game-ii', difficulty: 'Medium', category: 'Greedy', tags: ['Array', 'Dynamic Programming', 'Greedy'], acceptance: '39.7%' },
  { id: 134, title: 'Gas Station', slug: 'gas-station', difficulty: 'Medium', category: 'Greedy', tags: ['Array', 'Greedy'], acceptance: '44.6%' },
  { id: 435, title: 'Non-overlapping Intervals', slug: 'non-overlapping-intervals', difficulty: 'Medium', category: 'Greedy', tags: ['Array', 'Dynamic Programming', 'Greedy', 'Sorting'], acceptance: '49.9%' },
  { id: 763, title: 'Partition Labels', slug: 'partition-labels', difficulty: 'Medium', category: 'Greedy', tags: ['Hash Table', 'Two Pointers', 'String', 'Greedy'], acceptance: '79.6%' },
  // Graph
  { id: 200, title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'Medium', category: 'Graph', tags: ['Array', 'DFS', 'BFS', 'Union Find', 'Matrix'], acceptance: '57.0%' },
  { id: 133, title: 'Clone Graph', slug: 'clone-graph', difficulty: 'Medium', category: 'Graph', tags: ['Hash Table', 'DFS', 'BFS', 'Graph'], acceptance: '53.1%' },
  { id: 695, title: 'Max Area of Island', slug: 'max-area-of-island', difficulty: 'Medium', category: 'Graph', tags: ['Array', 'DFS', 'BFS', 'Union Find', 'Matrix'], acceptance: '70.3%' },
  { id: 994, title: 'Rotting Oranges', slug: 'rotting-oranges', difficulty: 'Medium', category: 'Graph', tags: ['Array', 'BFS', 'Matrix'], acceptance: '53.0%' },
  { id: 207, title: 'Course Schedule', slug: 'course-schedule', difficulty: 'Medium', category: 'Graph', tags: ['DFS', 'BFS', 'Graph', 'Topological Sort'], acceptance: '45.5%' },
  // DP
  { id: 70, title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'Easy', category: 'DP', tags: ['Math', 'Dynamic Programming', 'Memoization'], acceptance: '51.5%' },
  { id: 198, title: 'House Robber', slug: 'house-robber', difficulty: 'Medium', category: 'DP', tags: ['Array', 'Dynamic Programming'], acceptance: '49.8%' },
  { id: 322, title: 'Coin Change', slug: 'coin-change', difficulty: 'Medium', category: 'DP', tags: ['Array', 'Dynamic Programming', 'BFS'], acceptance: '42.4%' },
  { id: 300, title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', difficulty: 'Medium', category: 'DP', tags: ['Array', 'Binary Search', 'Dynamic Programming'], acceptance: '51.4%' },
  { id: 1143, title: 'Longest Common Subsequence', slug: 'longest-common-subsequence', difficulty: 'Medium', category: 'DP', tags: ['String', 'Dynamic Programming'], acceptance: '56.8%' },
  // Advanced DP
  { id: 62, title: 'Unique Paths', slug: 'unique-paths', difficulty: 'Medium', category: 'Advanced DP', tags: ['Math', 'Dynamic Programming', 'Combinatorics'], acceptance: '63.3%' },
  { id: 64, title: 'Minimum Path Sum', slug: 'minimum-path-sum', difficulty: 'Medium', category: 'Advanced DP', tags: ['Array', 'Dynamic Programming', 'Matrix'], acceptance: '61.5%' },
  { id: 494, title: 'Target Sum', slug: 'target-sum', difficulty: 'Medium', category: 'Advanced DP', tags: ['Array', 'Dynamic Programming', 'Backtracking'], acceptance: '45.4%' },
  { id: 416, title: 'Partition Equal Subset Sum', slug: 'partition-equal-subset-sum', difficulty: 'Medium', category: 'Advanced DP', tags: ['Array', 'Dynamic Programming'], acceptance: '46.6%' },
  { id: 72, title: 'Edit Distance', slug: 'edit-distance', difficulty: 'Medium', category: 'Advanced DP', tags: ['String', 'Dynamic Programming'], acceptance: '54.4%' },
];

export const CATEGORIES: Category[] = [
  { id: 'arrays', name: 'Arrays', icon: 'Layers', questionIds: [1, 121, 53, 88, 169], color: '#3b82f6' },
  { id: 'two-pointer', name: 'Two Pointer', icon: 'ArrowLeftRight', questionIds: [125, 167, 283, 11, 15], color: '#10b981' },
  { id: 'sliding-window', name: 'Sliding Window', icon: 'SlidersHorizontal', questionIds: [3, 209, 424, 567, 76], color: '#f59e0b' },
  { id: 'string', name: 'String', icon: 'Type', questionIds: [344, 242, 14, 49, 5], color: '#ef4444' },
  { id: 'hashing', name: 'Hashing', icon: 'Hash', questionIds: [217, 1, 49, 347, 128], color: '#8b5cf6' },
  { id: 'recursion-backtracking', name: 'Recursion & Backtracking', icon: 'GitBranch', questionIds: [46, 78, 39, 131, 51], color: '#ec4899' },
  { id: 'sorting', name: 'Sorting', icon: 'ArrowUpDown', questionIds: [912, 56, 179, 215, 75], color: '#06b6d4' },
  { id: 'binary-search', name: 'Binary Search', icon: 'Search', questionIds: [704, 35, 33, 153, 875], color: '#84cc16' },
  { id: 'linked-list', name: 'Linked List', icon: 'Link', questionIds: [206, 141, 21, 19, 143], color: '#f97316' },
  { id: 'stack', name: 'Stack', icon: 'Database', questionIds: [20, 155, 739, 84, 496], color: '#14b8a6' },
  { id: 'queue-deque', name: 'Queue / Deque', icon: 'AlignJustify', questionIds: [933, 239, 622, 641, 862], color: '#a855f7' },
  { id: 'trees', name: 'Trees', icon: 'TreePine', questionIds: [104, 100, 226, 102, 543], color: '#22c55e' },
  { id: 'bst', name: 'BST', icon: 'Network', questionIds: [98, 230, 235, 700, 701], color: '#eab308' },
  { id: 'heap', name: 'Heap / Priority Queue', icon: 'Triangle', questionIds: [215, 347, 295, 973, 1046], color: '#f43f5e' },
  { id: 'greedy', name: 'Greedy', icon: 'Zap', questionIds: [55, 45, 134, 435, 763], color: '#3b82f6' },
  { id: 'graph', name: 'Graph', icon: 'Share2', questionIds: [200, 133, 695, 994, 207], color: '#10b981' },
  { id: 'dp', name: 'DP', icon: 'BrainCircuit', questionIds: [70, 198, 322, 300, 1143], color: '#f59e0b' },
  { id: 'advanced-dp', name: 'Advanced DP', icon: 'Cpu', questionIds: [62, 64, 494, 416, 72], color: '#ef4444' },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

export function getLeetCodeUrl(slug: string): string {
  return `https://leetcode.com/problems/${slug}/`;
}

export function getQuestionById(id: number): Question | undefined {
  return QUESTIONS.find(q => q.id === id);
}

export function getQuestionsByCategory(categoryId: string): Question[] {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return [];
  return cat.questionIds.map(id => getQuestionById(id)).filter(Boolean) as Question[];
}

export const MOTIVATIONAL_QUOTES = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Every master was once a disaster.", author: "T. Harv Eker" },
  { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { quote: "The best time to start was yesterday. The next best time is now.", author: "Unknown" },
  { quote: "Consistency is the key to mastery.", author: "Unknown" },
  { quote: "One problem a day keeps the brain in play.", author: "Unknown" },
  { quote: "Each solved problem is a step closer to your dream job.", author: "Unknown" },
  { quote: "The harder the problem, the sweeter the solve.", author: "Unknown" },
  { quote: "Data structures are your tools. Algorithms are your craft.", author: "Unknown" },
];

export const ACHIEVEMENTS = [
  { id: 'first_solve', title: 'First Blood', description: 'Solve your first problem', icon: '🎯', xpReward: 50 },
  { id: 'streak_3', title: '3-Day Warrior', description: 'Maintain a 3-day streak', icon: '🔥', xpReward: 75 },
  { id: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚡', xpReward: 150 },
  { id: 'streak_30', title: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '👑', xpReward: 500 },
  { id: 'solved_10', title: 'Getting Started', description: 'Solve 10 problems', icon: '🚀', xpReward: 100 },
  { id: 'solved_25', title: 'Quarter Century', description: 'Solve 25 problems', icon: '⭐', xpReward: 200 },
  { id: 'solved_50', title: 'Halfway Hero', description: 'Solve 50 problems', icon: '💎', xpReward: 400 },
  { id: 'solved_90', title: 'The Completionist', description: 'Solve all 90 problems', icon: '🏆', xpReward: 1000 },
  { id: 'dp_master', title: 'DP Master', description: 'Complete all DP problems', icon: '🧠', xpReward: 300 },
  { id: 'graph_explorer', title: 'Graph Explorer', description: 'Complete all Graph problems', icon: '🗺️', xpReward: 300 },
  { id: 'hard_solver', title: 'Hard Mode', description: 'Solve 5 Hard problems', icon: '💪', xpReward: 350 },
  { id: 'speed_demon', title: 'Speed Demon', description: 'Solve a problem in under 10 minutes', icon: '⚡', xpReward: 100 },
];
