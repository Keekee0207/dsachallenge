-- 50 DAYS DSA CHALLENGE - SEED DATA SCRIPT
-- Run this script in Supabase SQL editor after running schema.sql

-- 1. Insert Challenge Settings
INSERT INTO public.challenge_settings (challenge_name, start_date, end_date, timezone, total_days)
VALUES ('50 Days DSA Challenge', '2026-11-21', '2027-01-09', 'Asia/Kolkata', 50)
ON CONFLICT DO NOTHING;

-- 2. Insert Initial Allowed Emails (1 Admin + 4 Participant Slots)
INSERT INTO public.allowed_emails (email, name, role, is_active)
VALUES 
  ('admin@challenge.com', 'Challenge Organizer', 'admin', true),
  ('keerthana@challenge.com', 'Keerthana S', 'participant', true),
  ('participant2@challenge.com', 'Aarav Sharma', 'participant', true),
  ('participant3@challenge.com', 'Rohan Iyer', 'participant', true),
  ('participant4@challenge.com', 'Ananya Patel', 'participant', true)
ON CONFLICT (email) DO NOTHING;

-- 3. Insert All 50 DSA Roadmap Problems
INSERT INTO public.problems (day_number, week_number, title, leetcode_url, topic, difficulty, description)
VALUES
  -- WEEK 1
  (1, 1, 'Fizz Buzz', 'https://leetcode.com/problems/fizz-buzz/', 'Basic Concepts & Logic', 'Easy', 'Return a string array where answer[i] is Fizz, Buzz, FizzBuzz, or i.'),
  (2, 1, 'Number of Steps to Reduce a Number to Zero', 'https://leetcode.com/problems/number-of-steps-to-reduce-a-number-to-zero/', 'Loops & Bitwise Basics', 'Easy', 'Return steps to reduce num to zero by dividing by 2 or subtracting 1.'),
  (3, 1, 'Palindrome Number', 'https://leetcode.com/problems/palindrome-number/', 'Math & Conditionals', 'Easy', 'Return true if integer x is a palindrome without string conversion.'),
  (4, 1, 'Fibonacci Number (Recursion)', 'https://leetcode.com/problems/fibonacci-number/', 'Recursion', 'Easy', 'Calculate F(n) = F(n-1) + F(n-2). Understand call stack and recurrence.'),
  (5, 1, 'Reverse String (Recursion Practice)', 'https://leetcode.com/problems/reverse-string/', 'Recursion & Two Pointers', 'Easy', 'Reverse array of characters in-place with O(1) auxiliary space.'),
  (6, 1, 'Squares of a Sorted Array (Sorting)', 'https://leetcode.com/problems/squares-of-a-sorted-array/', 'Sorting & Two Pointers', 'Easy', 'Return squares of a sorted array sorted in non-decreasing order in O(N).'),
  (7, 1, 'Merge Sorted Array (Sorting)', 'https://leetcode.com/problems/merge-sorted-array/', 'Sorting & Two Pointers', 'Easy', 'Merge nums2 into nums1 as one sorted array in O(m+n) time and O(1) extra space.'),

  -- WEEK 2
  (8, 2, 'Running Sum of 1D Array', 'https://leetcode.com/problems/running-sum-of-1d-array/', 'Arrays & Prefix Sum', 'Easy', 'Calculate runningSum[i] = sum(nums[0]…nums[i]).'),
  (9, 2, 'Richest Customer Wealth', 'https://leetcode.com/problems/richest-customer-wealth/', '2D Arrays', 'Easy', 'Calculate maximum sum across grid rows.'),
  (10, 2, 'Remove Duplicates from Sorted Array', 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', 'Arrays & Two Pointers', 'Easy', 'Remove duplicates in-place so each element appears once.'),
  (11, 2, 'Move Zeroes', 'https://leetcode.com/problems/move-zeroes/', 'Arrays & Two Pointers', 'Easy', 'Move all zeroes to end while maintaining relative order of non-zero elements.'),
  (12, 2, 'Best Time to Buy and Sell Stock', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', 'Arrays & Dynamic Programming', 'Easy', 'Maximize profit with single buy and sell transaction.'),
  (13, 2, 'Valid Palindrome', 'https://leetcode.com/problems/valid-palindrome/', 'Strings & Two Pointers', 'Easy', 'Verify if string is palindrome considering alphanumeric characters only.'),
  (14, 2, 'Longest Common Prefix', 'https://leetcode.com/problems/longest-common-prefix/', 'Strings', 'Easy', 'Find longest common prefix string amongst an array of strings.'),

  -- WEEK 3
  (15, 3, 'Design Linked List', 'https://leetcode.com/problems/design-linked-list/', 'Linked Lists', 'Medium', 'Implement singly/doubly linked list operations from scratch.'),
  (16, 3, 'Reverse Linked List', 'https://leetcode.com/problems/reverse-linked-list/', 'Linked Lists', 'Easy', 'Reverse a singly linked list iteratively and recursively.'),
  (17, 3, 'Middle of the Linked List', 'https://leetcode.com/problems/middle-of-the-linked-list/', 'Linked Lists & Two Pointers', 'Easy', 'Find the middle node using slow and fast pointers.'),
  (18, 3, 'Merge Two Sorted Lists', 'https://leetcode.com/problems/merge-two-sorted-lists/', 'Linked Lists', 'Easy', 'Merge two sorted linked lists by splicing nodes.'),
  (19, 3, 'Linked List Cycle', 'https://leetcode.com/problems/linked-list-cycle/', 'Linked Lists & Fast-Slow Pointers', 'Easy', 'Detect cycle in linked list using Floyd Tortoise & Hare.'),
  (20, 3, 'Remove Linked List Elements', 'https://leetcode.com/problems/remove-linked-list-elements/', 'Linked Lists', 'Easy', 'Remove all nodes matching val using sentinel dummy head.'),
  (21, 3, 'Delete Node in a Linked List', 'https://leetcode.com/problems/delete-node-in-a-linked-list/', 'Linked Lists', 'Medium', 'Delete node given access only to that node.'),

  -- WEEK 4
  (22, 4, 'Implement Stack using Queues', 'https://leetcode.com/problems/implement-stack-using-queues/', 'Stacks & Queues', 'Easy', 'Implement LIFO stack using FIFO queues.'),
  (23, 4, 'Implement Queue using Stacks', 'https://leetcode.com/problems/implement-queue-using-stacks/', 'Stacks & Queues', 'Easy', 'Implement FIFO queue using two LIFO stacks.'),
  (24, 4, 'Valid Parentheses', 'https://leetcode.com/problems/valid-parentheses/', 'Stacks', 'Easy', 'Determine if brackets (), {}, [] match in correct order.'),
  (25, 4, 'Baseball Game', 'https://leetcode.com/problems/baseball-game/', 'Stacks', 'Easy', 'Keep score with additions, doubles, and invalidations using stack.'),
  (26, 4, 'Backspace String Compare', 'https://leetcode.com/problems/backspace-string-compare/', 'Stacks & Two Pointers', 'Easy', 'Compare strings with backspaces #.'),
  (27, 4, 'Make The String Great', 'https://leetcode.com/problems/make-the-string-great/', 'Stacks & Strings', 'Easy', 'Remove adjacent letters of opposite case.'),
  (28, 4, 'Removing Stars From a String', 'https://leetcode.com/problems/removing-stars-from-a-string/', 'Stacks & Strings', 'Medium', 'Remove closest non-star character to the left using stack.'),

  -- WEEK 5
  (29, 5, 'Maximum Depth of Binary Tree', 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', 'Binary Trees (DFS/BFS)', 'Easy', 'Find maximum height of binary tree with DFS and BFS.'),
  (30, 5, 'Same Tree', 'https://leetcode.com/problems/same-tree/', 'Binary Trees', 'Easy', 'Check structural and value identity of two trees.'),
  (31, 5, 'Invert Binary Tree', 'https://leetcode.com/problems/invert-binary-tree/', 'Binary Trees', 'Easy', 'Invert tree recursively by swapping left and right children.'),
  (32, 5, 'Symmetric Tree', 'https://leetcode.com/problems/symmetric-tree/', 'Binary Trees', 'Easy', 'Check if tree is a mirror of itself around the center.'),
  (33, 5, 'Path Sum', 'https://leetcode.com/problems/path-sum/', 'Binary Trees (DFS)', 'Easy', 'Verify if root-to-leaf path sums to target.'),
  (34, 5, 'Search in a Binary Search Tree', 'https://leetcode.com/problems/search-in-a-binary-search-tree/', 'Binary Search Trees', 'Easy', 'Search node by value in BST in O(log N).'),
  (35, 5, 'Range Sum of BST', 'https://leetcode.com/problems/range-sum-of-bst/', 'Binary Search Trees', 'Easy', 'Sum values of all nodes in range [low, high].'),

  -- WEEK 6
  (36, 6, 'Last Stone Weight', 'https://leetcode.com/problems/last-stone-weight/', 'Heaps (Max Heap)', 'Easy', 'Simulate heavy stone collisions with a max-priority queue.'),
  (37, 6, 'The K Weakest Rows in a Matrix', 'https://leetcode.com/problems/the-k-weakest-rows-in-a-matrix/', 'Heaps & Matrix', 'Easy', 'Find k weakest rows combining binary search with heap.'),
  (38, 6, 'Kth Largest Element in a Stream', 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', 'Heaps (Min Heap)', 'Easy', 'Maintain min-heap of size k to track kth largest stream element.'),
  (39, 6, 'Take Gifts From the Richest Pile', 'https://leetcode.com/problems/take-gifts-from-the-richest-pile/', 'Heaps', 'Easy', 'Pick max pile and replace with square root for k seconds.'),
  (40, 6, 'Kth Largest Element in an Array', 'https://leetcode.com/problems/kth-largest-element-in-an-array/', 'Heaps & Quickselect', 'Medium', 'Find kth largest element using min-heap or Quickselect.'),
  (41, 6, 'Top K Frequent Elements', 'https://leetcode.com/problems/top-k-frequent-elements/', 'Heaps & Hash Map', 'Medium', 'Find k most frequent items using frequency map and min-heap.'),
  (42, 6, 'Find Median from Data Stream', 'https://leetcode.com/problems/find-median-from-data-stream/', 'Two Heaps', 'Hard', 'Track running median using balanced max-heap and min-heap.'),

  -- WEEK 7
  (43, 7, 'Find Center of Star Graph', 'https://leetcode.com/problems/find-center-of-star-graph/', 'Graphs', 'Easy', 'Find star hub node connected to all other nodes.'),
  (44, 7, 'Flood Fill', 'https://leetcode.com/problems/flood-fill/', 'Graphs & DFS/BFS', 'Easy', 'Recolor connected grid component from starting pixel.'),
  (45, 7, 'Island Perimeter', 'https://leetcode.com/problems/island-perimeter/', 'Graphs & Grid Traversal', 'Easy', 'Count exposed water edges around island cells.'),
  (46, 7, 'Find the Town Judge', 'https://leetcode.com/problems/find-the-town-judge/', 'Graphs & Indegree/Outdegree', 'Easy', 'Find node with indegree n-1 and outdegree 0.'),
  (47, 7, 'Find if Path Exists in Graph', 'https://leetcode.com/problems/find-if-path-exists-in-graph/', 'Graphs (BFS/DFS/Union-Find)', 'Easy', 'Determine path existence between source and destination.'),
  (48, 7, 'Number of Provinces', 'https://leetcode.com/problems/number-of-provinces/', 'Graphs (DFS/BFS/Connected Components)', 'Medium', 'Count connected components in undirected adjacency matrix.'),
  (49, 7, 'Keys and Rooms', 'https://leetcode.com/problems/keys-and-rooms/', 'Graphs (DFS/BFS)', 'Medium', 'Determine if all rooms can be unlocked with collected keys.'),

  -- DAY 50
  (50, 8, 'Day 50 — Final Revision & Capstone Assessment', 'https://leetcode.com/explore/', 'Comprehensive Review & Reflection', 'Hard', 'Solve 3 problems (1 Array, 1 Linked List/Stack, 1 Tree/Graph), explain complexity, and write 50-day reflection.')
ON CONFLICT (day_number) DO NOTHING;
