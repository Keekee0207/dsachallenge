import { Problem } from "@/types";

export const WEEK_OBJECTIVES: Record<number, { title: string; objective: string; concepts: string[] }> = {
  1: {
    title: "Basic Concepts, Sorting & Recursion",
    objective: "Build programming logic, understand loops, conditions, basic sorting and recursion.",
    concepts: [
      "Variables, loops, conditions and functions",
      "Time and space complexity basics",
      "Selection Sort, Bubble Sort and Insertion Sort",
      "Recursion: base case, recursive call and stack",
      "Print 1 to N and N to 1 using recursion",
      "Sum of N numbers and factorial using recursion"
    ]
  },
  2: {
    title: "Arrays & Strings",
    objective: "Learn array traversal, searching, updating, two pointers and basic string manipulation.",
    concepts: [
      "Linear scan and prefix sums",
      "In-place modifications and two-pointer technique",
      "String immutability and character manipulation",
      "Edge case handling in array bounds"
    ]
  },
  3: {
    title: "Linked Lists",
    objective: "Understand nodes, pointers, traversal, insertion, deletion and reversing linked lists.",
    concepts: [
      "Singly and doubly linked list structure",
      "Pointer manipulation and sentinel nodes",
      "Fast & Slow pointer pattern (Floyd's cycle detection)",
      "Recursion vs iterative list reversal"
    ]
  },
  4: {
    title: "Stacks & Queues",
    objective: "Understand LIFO, FIFO, stack operations, queue operations and their applications.",
    concepts: [
      "LIFO and FIFO mechanics",
      "Using stacks for matching/bracket validation",
      "Monotonic stack intuition",
      "Simulating queues with stacks and vice-versa"
    ]
  },
  5: {
    title: "Binary Trees & Binary Search Trees",
    objective: "Understand tree structure, root, parent, child, leaf nodes, DFS, BFS and basic BST operations.",
    concepts: [
      "Tree node anatomy and height/depth",
      "Preorder, Inorder, Postorder traversals (DFS)",
      "Level-order traversal (BFS with queue)",
      "Binary Search Tree properties: Left < Root < Right"
    ]
  },
  6: {
    title: "Heaps",
    objective: "Understand Min Heap, Max Heap, Priority Queue, insertion, deletion and extracting minimum/maximum elements.",
    concepts: [
      "Complete binary tree representation in arrays",
      "Heapify, push, pop complexities (O(log N))",
      "Top-K elements pattern",
      "Two-heap pattern for running medians"
    ]
  },
  7: {
    title: "Graphs",
    objective: "Understand vertices, edges, adjacency lists, adjacency matrices, BFS and DFS.",
    concepts: [
      "Adjacency list vs adjacency matrix",
      "Depth-First Search (DFS) for connectivity",
      "Breadth-First Search (BFS) for shortest unweighted path",
      "Detecting cycles and counting connected components"
    ]
  },
  8: {
    title: "Final Revision & Capstone",
    objective: "Consolidate 50 days of mastery through comprehensive multi-domain problem solving and reflection.",
    concepts: [
      "Holistic problem analysis and pattern recognition",
      "Trade-off evaluation: time vs space complexity",
      "Long-term retention and continuous learning habits"
    ]
  }
};

export const DSA_PROBLEMS: Problem[] = [
  // WEEK 1
  {
    id: "p-01",
    day_number: 1,
    week_number: 1,
    title: "Fizz Buzz",
    leetcode_url: "https://leetcode.com/problems/fizz-buzz/",
    topic: "Basic Concepts & Logic",
    difficulty: "Easy",
    description: "Given an integer n, return a string array answer (1-indexed) where answer[i] is 'FizzBuzz', 'Fizz', 'Buzz', or i depending on divisibility."
  },
  {
    id: "p-02",
    day_number: 2,
    week_number: 1,
    title: "Number of Steps to Reduce a Number to Zero",
    leetcode_url: "https://leetcode.com/problems/number-of-steps-to-reduce-a-number-to-zero/",
    topic: "Loops & Bitwise Basics",
    difficulty: "Easy",
    description: "Given an integer num, return the number of steps to reduce it to zero. If the current number is even, divide it by 2; otherwise, subtract 1."
  },
  {
    id: "p-03",
    day_number: 3,
    week_number: 1,
    title: "Palindrome Number",
    leetcode_url: "https://leetcode.com/problems/palindrome-number/",
    topic: "Math & Conditionals",
    difficulty: "Easy",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise. Try doing it without converting the integer to a string."
  },
  {
    id: "p-04",
    day_number: 4,
    week_number: 1,
    title: "Fibonacci Number (Recursion)",
    leetcode_url: "https://leetcode.com/problems/fibonacci-number/",
    topic: "Recursion",
    difficulty: "Easy",
    description: "The Fibonacci numbers form a sequence such that each number is the sum of the two preceding ones. Implement and explore recursion call stacks."
  },
  {
    id: "p-05",
    day_number: 5,
    week_number: 1,
    title: "Reverse String (Recursion Practice)",
    leetcode_url: "https://leetcode.com/problems/reverse-string/",
    topic: "Recursion & Two Pointers",
    difficulty: "Easy",
    description: "Write a function that reverses a string in-place with O(1) extra memory. Practice both recursive helper and two-pointer iterative solutions."
  },
  {
    id: "p-06",
    day_number: 6,
    week_number: 1,
    title: "Squares of a Sorted Array (Sorting)",
    leetcode_url: "https://leetcode.com/problems/squares-of-a-sorted-array/",
    topic: "Sorting & Two Pointers",
    difficulty: "Easy",
    description: "Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order."
  },
  {
    id: "p-07",
    day_number: 7,
    week_number: 1,
    title: "Merge Sorted Array (Sorting)",
    leetcode_url: "https://leetcode.com/problems/merge-sorted-array/",
    topic: "Sorting & Two Pointers",
    difficulty: "Easy",
    description: "Merge two sorted arrays nums1 and nums2 into nums1 as one sorted array from the back to achieve O(m+n) time and O(1) auxiliary space."
  },

  // WEEK 2
  {
    id: "p-08",
    day_number: 8,
    week_number: 2,
    title: "Running Sum of 1D Array",
    leetcode_url: "https://leetcode.com/problems/running-sum-of-1d-array/",
    topic: "Arrays & Prefix Sum",
    difficulty: "Easy",
    description: "Given an array nums, we define a running sum where runningSum[i] = sum(nums[0]…nums[i]). Learn prefix sum accumulation."
  },
  {
    id: "p-09",
    day_number: 9,
    week_number: 2,
    title: "Richest Customer Wealth",
    leetcode_url: "https://leetcode.com/problems/richest-customer-wealth/",
    topic: "2D Arrays",
    difficulty: "Easy",
    description: "You are given an m x n integer grid accounts where accounts[i][j] is the amount of money customer i has in bank j. Return the maximum wealth."
  },
  {
    id: "p-10",
    day_number: 10,
    week_number: 2,
    title: "Remove Duplicates from Sorted Array",
    leetcode_url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
    topic: "Arrays & Two Pointers",
    difficulty: "Easy",
    description: "Remove duplicates in-place such that each unique element appears only once. Master the slow and fast read-write pointer pattern."
  },
  {
    id: "p-11",
    day_number: 11,
    week_number: 2,
    title: "Move Zeroes",
    leetcode_url: "https://leetcode.com/problems/move-zeroes/",
    topic: "Arrays & Two Pointers",
    difficulty: "Easy",
    description: "Given an integer array nums, move all 0's to the end while maintaining the relative order of the non-zero elements in-place."
  },
  {
    id: "p-12",
    day_number: 12,
    week_number: 2,
    title: "Best Time to Buy and Sell Stock",
    leetcode_url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    topic: "Arrays & Dynamic Programming",
    difficulty: "Easy",
    description: "You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock."
  },
  {
    id: "p-13",
    day_number: 13,
    week_number: 2,
    title: "Valid Palindrome",
    leetcode_url: "https://leetcode.com/problems/valid-palindrome/",
    topic: "Strings & Two Pointers",
    difficulty: "Easy",
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward."
  },
  {
    id: "p-14",
    day_number: 14,
    week_number: 2,
    title: "Longest Common Prefix",
    leetcode_url: "https://leetcode.com/problems/longest-common-prefix/",
    topic: "Strings",
    difficulty: "Easy",
    description: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string."
  },

  // WEEK 3
  {
    id: "p-15",
    day_number: 15,
    week_number: 3,
    title: "Design Linked List",
    leetcode_url: "https://leetcode.com/problems/design-linked-list/",
    topic: "Linked Lists",
    difficulty: "Medium",
    description: "Design your implementation of the linked list. Implement get, addAtHead, addAtTail, addAtIndex, and deleteAtIndex methods."
  },
  {
    id: "p-16",
    day_number: 16,
    week_number: 3,
    title: "Reverse Linked List",
    leetcode_url: "https://leetcode.com/problems/reverse-linked-list/",
    topic: "Linked Lists",
    difficulty: "Easy",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list. A foundational pointer manipulation interview problem."
  },
  {
    id: "p-17",
    day_number: 17,
    week_number: 3,
    title: "Middle of the Linked List",
    leetcode_url: "https://leetcode.com/problems/middle-of-the-linked-list/",
    topic: "Linked Lists & Two Pointers",
    difficulty: "Easy",
    description: "Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second middle node using the Tortoise and Hare algorithm."
  },
  {
    id: "p-18",
    day_number: 18,
    week_number: 3,
    title: "Merge Two Sorted Lists",
    leetcode_url: "https://leetcode.com/problems/merge-two-sorted-lists/",
    topic: "Linked Lists",
    difficulty: "Easy",
    description: "Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists."
  },
  {
    id: "p-19",
    day_number: 19,
    week_number: 3,
    title: "Linked List Cycle",
    leetcode_url: "https://leetcode.com/problems/linked-list-cycle/",
    topic: "Linked Lists & Fast-Slow Pointers",
    difficulty: "Easy",
    description: "Determine if the linked list has a cycle in it using Floyd's Cycle-Finding Algorithm with O(1) memory."
  },
  {
    id: "p-20",
    day_number: 20,
    week_number: 3,
    title: "Remove Linked List Elements",
    leetcode_url: "https://leetcode.com/problems/remove-linked-list-elements/",
    topic: "Linked Lists",
    difficulty: "Easy",
    description: "Given the head of a linked list and an integer val, remove all the nodes of the linked list that has Node.val == val, and return the new head."
  },
  {
    id: "p-21",
    day_number: 21,
    week_number: 3,
    title: "Delete Node in a Linked List",
    leetcode_url: "https://leetcode.com/problems/delete-node-in-a-linked-list/",
    topic: "Linked Lists",
    difficulty: "Medium",
    description: "There is a singly-linked list and you are given only access to the node to be deleted. Learn node value copying and pointer bypass."
  },

  // WEEK 4
  {
    id: "p-22",
    day_number: 22,
    week_number: 4,
    title: "Implement Stack using Queues",
    leetcode_url: "https://leetcode.com/problems/implement-stack-using-queues/",
    topic: "Stacks & Queues",
    difficulty: "Easy",
    description: "Implement a last-in-first-out (LIFO) stack using only two standard FIFO queues. Understand the trade-offs between push and pop costs."
  },
  {
    id: "p-23",
    day_number: 23,
    week_number: 4,
    title: "Implement Queue using Stacks",
    leetcode_url: "https://leetcode.com/problems/implement-queue-using-stacks/",
    topic: "Stacks & Queues",
    difficulty: "Easy",
    description: "Implement a first-in-first-out (FIFO) queue using only two stacks. Understand amortized O(1) transfer between input and output stacks."
  },
  {
    id: "p-24",
    day_number: 24,
    week_number: 4,
    title: "Valid Parentheses",
    leetcode_url: "https://leetcode.com/problems/valid-parentheses/",
    topic: "Stacks",
    difficulty: "Easy",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid."
  },
  {
    id: "p-25",
    day_number: 25,
    week_number: 4,
    title: "Baseball Game",
    leetcode_url: "https://leetcode.com/problems/baseball-game/",
    topic: "Stacks",
    difficulty: "Easy",
    description: "You are keeping score for a baseball game with strange rules. Use a stack to track, add, double, and invalidate previous scores."
  },
  {
    id: "p-26",
    day_number: 26,
    week_number: 4,
    title: "Backspace String Compare",
    leetcode_url: "https://leetcode.com/problems/backspace-string-compare/",
    topic: "Stacks & Two Pointers",
    difficulty: "Easy",
    description: "Given two strings s and t, return true if they are equal when both are typed into empty text editors where '#' means a backspace character."
  },
  {
    id: "p-27",
    day_number: 27,
    week_number: 4,
    title: "Make The String Great",
    leetcode_url: "https://leetcode.com/problems/make-the-string-great/",
    topic: "Stacks & Strings",
    difficulty: "Easy",
    description: "A good string does not contain two adjacent characters where they are the same letter in uppercase and lowercase. Clean using a stack."
  },
  {
    id: "p-28",
    day_number: 28,
    week_number: 4,
    title: "Removing Stars From a String",
    leetcode_url: "https://leetcode.com/problems/removing-stars-from-a-string/",
    topic: "Stacks & Strings",
    difficulty: "Medium",
    description: "In one operation, you can choose a star '*' and remove the closest non-star character to its left, as well as the star itself. Return the final string."
  },

  // WEEK 5
  {
    id: "p-29",
    day_number: 29,
    week_number: 5,
    title: "Maximum Depth of Binary Tree",
    leetcode_url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    topic: "Binary Trees (DFS/BFS)",
    difficulty: "Easy",
    description: "Given the root of a binary tree, return its maximum depth. Practice both recursive post-order DFS and iterative level-order BFS."
  },
  {
    id: "p-30",
    day_number: 30,
    week_number: 5,
    title: "Same Tree",
    leetcode_url: "https://leetcode.com/problems/same-tree/",
    topic: "Binary Trees",
    difficulty: "Easy",
    description: "Given the roots of two binary trees p and q, write a function to check if they are structurally identical and have the same node values."
  },
  {
    id: "p-31",
    day_number: 31,
    week_number: 5,
    title: "Invert Binary Tree",
    leetcode_url: "https://leetcode.com/problems/invert-binary-tree/",
    topic: "Binary Trees",
    difficulty: "Easy",
    description: "Given the root of a binary tree, invert the tree, and return its root. Swap left and right subtrees recursively."
  },
  {
    id: "p-32",
    day_number: 32,
    week_number: 5,
    title: "Symmetric Tree",
    leetcode_url: "https://leetcode.com/problems/symmetric-tree/",
    topic: "Binary Trees",
    difficulty: "Easy",
    description: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center)."
  },
  {
    id: "p-33",
    day_number: 33,
    week_number: 5,
    title: "Path Sum",
    leetcode_url: "https://leetcode.com/problems/path-sum/",
    topic: "Binary Trees (DFS)",
    difficulty: "Easy",
    description: "Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding all values along the path equals targetSum."
  },
  {
    id: "p-34",
    day_number: 34,
    week_number: 5,
    title: "Search in a Binary Search Tree",
    leetcode_url: "https://leetcode.com/problems/search-in-a-binary-search-tree/",
    topic: "Binary Search Trees",
    difficulty: "Easy",
    description: "Find the node in the BST whose value equals val and return the subtree rooted with that node. Leverage the left < root < right property."
  },
  {
    id: "p-35",
    day_number: 35,
    week_number: 5,
    title: "Range Sum of BST",
    leetcode_url: "https://leetcode.com/problems/range-sum-of-bst/",
    topic: "Binary Search Trees",
    difficulty: "Easy",
    description: "Given the root node of a binary search tree and two integers low and high, return the sum of values of all nodes with a value in the inclusive range [low, high]."
  },

  // WEEK 6
  {
    id: "p-36",
    day_number: 36,
    week_number: 6,
    title: "Last Stone Weight",
    leetcode_url: "https://leetcode.com/problems/last-stone-weight/",
    topic: "Heaps (Max Heap)",
    difficulty: "Easy",
    description: "Smash the two heaviest stones together until at most one stone is left. An ideal introduction to Max-Priority Queues."
  },
  {
    id: "p-37",
    day_number: 37,
    week_number: 6,
    title: "The K Weakest Rows in a Matrix",
    leetcode_url: "https://leetcode.com/problems/the-k-weakest-rows-in-a-matrix/",
    topic: "Heaps & Matrix",
    difficulty: "Easy",
    description: "Find the k weakest rows in a binary matrix based on the count of soldiers (1s) and row indices. Combine binary search with a heap."
  },
  {
    id: "p-38",
    day_number: 38,
    week_number: 6,
    title: "Kth Largest Element in a Stream",
    leetcode_url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
    topic: "Heaps (Min Heap)",
    difficulty: "Easy",
    description: "Design a class to find the kth largest element in a stream. Maintain a min-heap of fixed size k where the root holds the kth largest element."
  },
  {
    id: "p-39",
    day_number: 39,
    week_number: 6,
    title: "Take Gifts From the Richest Pile",
    leetcode_url: "https://leetcode.com/problems/take-gifts-from-the-richest-pile/",
    topic: "Heaps",
    difficulty: "Easy",
    description: "Pick the pile with the maximum gifts, leave behind the floor of the square root, and repeat for k seconds. Use a max-heap."
  },
  {
    id: "p-40",
    day_number: 40,
    week_number: 6,
    title: "Kth Largest Element in an Array",
    leetcode_url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    topic: "Heaps & Quickselect",
    difficulty: "Medium",
    description: "Given an integer array nums and an integer k, return the kth largest element in the array. Compare Min-Heap O(N log k) with Quickselect average O(N)."
  },
  {
    id: "p-41",
    day_number: 41,
    week_number: 6,
    title: "Top K Frequent Elements",
    leetcode_url: "https://leetcode.com/problems/top-k-frequent-elements/",
    topic: "Heaps & Hash Map",
    difficulty: "Medium",
    description: "Given an integer array nums and an integer k, return the k most frequent elements. Learn the frequency hash map + min-heap pattern."
  },
  {
    id: "p-42",
    day_number: 42,
    week_number: 6,
    title: "Find Median from Data Stream",
    leetcode_url: "https://leetcode.com/problems/find-median-from-data-stream/",
    topic: "Two Heaps",
    difficulty: "Hard",
    description: "The median is the middle value in an ordered list. Design a data structure that supports adding numbers and finding the current median using a max-heap and min-heap."
  },

  // WEEK 7
  {
    id: "p-43",
    day_number: 43,
    week_number: 7,
    title: "Find Center of Star Graph",
    leetcode_url: "https://leetcode.com/problems/find-center-of-star-graph/",
    topic: "Graphs",
    difficulty: "Easy",
    description: "There is an undirected star graph with n nodes labeled from 1 to n. Return the center node that is connected to all other nodes."
  },
  {
    id: "p-44",
    day_number: 44,
    week_number: 7,
    title: "Flood Fill",
    leetcode_url: "https://leetcode.com/problems/flood-fill/",
    topic: "Graphs & DFS/BFS",
    difficulty: "Easy",
    description: "Perform a flood fill on an image represented by an m x n 2D array of integers starting from the pixel (sr, sc). Learn grid-based graph traversal."
  },
  {
    id: "p-45",
    day_number: 45,
    week_number: 7,
    title: "Island Perimeter",
    leetcode_url: "https://leetcode.com/problems/island-perimeter/",
    topic: "Graphs & Grid Traversal",
    difficulty: "Easy",
    description: "You are given row x col grid representing a map where 1 represents land and 0 represents water. Determine the perimeter of the island."
  },
  {
    id: "p-46",
    day_number: 46,
    week_number: 7,
    title: "Find the Town Judge",
    leetcode_url: "https://leetcode.com/problems/find-the-town-judge/",
    topic: "Graphs & Indegree/Outdegree",
    difficulty: "Easy",
    description: "In a town of n people, find the judge who trusts nobody (outdegree = 0) and is trusted by everyone else (indegree = n-1)."
  },
  {
    id: "p-47",
    day_number: 47,
    week_number: 7,
    title: "Find if Path Exists in Graph",
    leetcode_url: "https://leetcode.com/problems/find-if-path-exists-in-graph/",
    topic: "Graphs (BFS/DFS/Union-Find)",
    difficulty: "Easy",
    description: "Determine if there is a valid path that exists from vertex source to vertex destination in a bi-directional graph."
  },
  {
    id: "p-48",
    day_number: 48,
    week_number: 7,
    title: "Number of Provinces",
    leetcode_url: "https://leetcode.com/problems/number-of-provinces/",
    topic: "Graphs (DFS/BFS/Connected Components)",
    difficulty: "Medium",
    description: "There are n cities. A province is a group of directly or indirectly connected cities. Return the total number of provinces."
  },
  {
    id: "p-49",
    day_number: 49,
    week_number: 7,
    title: "Keys and Rooms",
    leetcode_url: "https://leetcode.com/problems/keys-and-rooms/",
    topic: "Graphs (DFS/BFS)",
    difficulty: "Medium",
    description: "There are n rooms labeled from 0 to n-1. Each room contains a set of distinct keys to other rooms. Return true if you can visit all rooms."
  },

  // DAY 50
  {
    id: "p-50",
    day_number: 50,
    week_number: 8,
    title: "Day 50 — Final Revision & Capstone Assessment",
    leetcode_url: "https://leetcode.com/explore/",
    topic: "Comprehensive Review & Reflection",
    difficulty: "Hard",
    description: "Final Capstone Challenge! Select and solve 3 previous problems (1 Array, 1 Linked List/Stack, 1 Tree/Graph), document your time/space complexity approaches, and share your 50-day learning reflection."
  }
];
