import { User, Question, Answer, Tag } from '../types';

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    created_at: '2024-01-10T08:30:00Z'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    created_at: '2024-01-05T14:20:00Z'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    created_at: '2024-01-01T09:15:00Z'
  }
];

export const mockTags: Tag[] = [
  { id: 1, name: 'javascript' },
  { id: 2, name: 'react' },
  { id: 3, name: 'python' },
  { id: 4, name: 'django' },
  { id: 5, name: 'html' },
  { id: 6, name: 'css' },
  { id: 7, name: 'nodejs' },
  { id: 8, name: 'typescript' },
  { id: 9, name: 'database' },
  { id: 10, name: 'api' }
];

export const mockQuestions: Question[] = [
  {
    id: 1,
    title: 'How to implement JWT authentication in React?',
    description: 'I\'m building a React application and need to implement JWT authentication. What\'s the best approach to store and manage JWT tokens securely?',
    user_id: 1,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
    tags: [mockTags[0], mockTags[1]],
    answer_count: 3,
    votes: 15,
    user_vote: null
  },
  {
    id: 2,
    title: 'Django REST Framework serializer validation',
    description: 'How can I add custom validation to Django REST Framework serializers? I need to validate that a date field is not in the past.',
    user_id: 2,
    created_at: '2024-01-19T14:30:00Z',
    updated_at: '2024-01-19T14:30:00Z',
    tags: [mockTags[2], mockTags[3]],
    answer_count: 2,
    votes: 8,
    user_vote: null
  },
  {
    id: 3,
    title: 'CSS Grid vs Flexbox: When to use which?',
    description: 'I\'m confused about when to use CSS Grid versus Flexbox. Can someone explain the differences and provide some practical examples?',
    user_id: 3,
    created_at: '2024-01-18T09:15:00Z',
    updated_at: '2024-01-18T09:15:00Z',
    tags: [mockTags[4], mockTags[5]],
    answer_count: 1,
    votes: 12,
    user_vote: null
  },
  {
    id: 4,
    title: 'Best practices for Node.js error handling',
    description: 'What are the best practices for handling errors in Node.js applications? Should I use try-catch blocks or error-first callbacks?',
    user_id: 4,
    created_at: '2024-01-17T16:45:00Z',
    updated_at: '2024-01-17T16:45:00Z',
    tags: [mockTags[6], mockTags[0]],
    answer_count: 0,
    votes: 3,
    user_vote: null
  },
  {
    id: 5,
    title: 'TypeScript generic constraints explained',
    description: 'I\'m learning TypeScript and struggling with generic constraints. Can someone provide clear examples of when and how to use them?',
    user_id: 1,
    created_at: '2024-01-16T11:20:00Z',
    updated_at: '2024-01-16T11:20:00Z',
    tags: [mockTags[7], mockTags[0]],
    answer_count: 4,
    votes: 22,
    user_vote: null
  },
  {
    id: 6,
    title: 'Database indexing strategies for large datasets',
    description: 'Working with a MySQL database that has millions of records. What are the best indexing strategies to improve query performance?',
    user_id: 2,
    created_at: '2024-01-15T13:10:00Z',
    updated_at: '2024-01-15T13:10:00Z',
    tags: [mockTags[8], mockTags[9]],
    answer_count: 2,
    votes: 7,
    user_vote: null
  }
];

export const mockAnswers: Answer[] = [
  {
    id: 1,
    question_id: 1,
    user_id: 2,
    content: 'For JWT authentication in React, I recommend storing the token in localStorage and using axios interceptors to automatically add it to requests. Here\'s a basic implementation:\n\n```javascript\n// Store token\nlocalStorage.setItem(\'token\', token);\n\n// Axios interceptor\naxios.interceptors.request.use(config => {\n  const token = localStorage.getItem(\'token\');\n  if (token) {\n    config.headers.Authorization = `Bearer ${token}`;\n  }\n  return config;\n});\n```',
    created_at: '2024-01-20T11:30:00Z',
    votes: 8,
    user_vote: null
  },
  {
    id: 2,
    question_id: 1,
    user_id: 3,
    content: 'Another approach is to use React Context for state management. Create an AuthContext that handles login/logout and provides the current user state throughout your app.',
    created_at: '2024-01-20T12:15:00Z',
    votes: 5,
    user_vote: null
  },
  {
    id: 3,
    question_id: 1,
    user_id: 4,
    content: 'Consider using a library like `react-query` or `swr` for API state management. They have built-in support for authentication and can automatically retry failed requests.',
    created_at: '2024-01-20T13:45:00Z',
    votes: 3,
    user_vote: null
  },
  {
    id: 4,
    question_id: 2,
    user_id: 1,
    content: 'You can add custom validation by overriding the validate method in your serializer:\n\n```python\nfrom rest_framework import serializers\nfrom datetime import date\n\nclass MySerializer(serializers.ModelSerializer):\n    def validate_date_field(self, value):\n        if value < date.today():\n            raise serializers.ValidationError("Date cannot be in the past")\n        return value\n```',
    created_at: '2024-01-19T15:00:00Z',
    votes: 12,
    user_vote: null
  },
  {
    id: 5,
    question_id: 2,
    user_id: 3,
    content: 'You can also use the validate() method for cross-field validation that involves multiple fields from the serializer.',
    created_at: '2024-01-19T15:30:00Z',
    votes: 4,
    user_vote: null
  },
  {
    id: 6,
    question_id: 3,
    user_id: 1,
    content: 'Use Flexbox for one-dimensional layouts (rows or columns) and CSS Grid for two-dimensional layouts. Flexbox is great for navigation bars, while Grid excels at page layouts.',
    created_at: '2024-01-18T10:00:00Z',
    votes: 9,
    user_vote: null
  },
  {
    id: 7,
    question_id: 5,
    user_id: 2,
    content: 'Generic constraints in TypeScript allow you to restrict the types that can be used with generics. Use the `extends` keyword:\n\n```typescript\ninterface Lengthwise {\n  length: number;\n}\n\nfunction loggingIdentity<T extends Lengthwise>(arg: T): T {\n  console.log(arg.length);\n  return arg;\n}\n```',
    created_at: '2024-01-16T12:00:00Z',
    votes: 15,
    user_vote: null
  },
  {
    id: 8,
    question_id: 5,
    user_id: 3,
    content: 'Another example is constraining to object keys:\n\n```typescript\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n```',
    created_at: '2024-01-16T12:30:00Z',
    votes: 7,
    user_vote: null
  },
  {
    id: 9,
    question_id: 5,
    user_id: 4,
    content: 'You can also use conditional types with constraints for more advanced type manipulation.',
    created_at: '2024-01-16T13:00:00Z',
    votes: 2,
    user_vote: null
  },
  {
    id: 10,
    question_id: 5,
    user_id: 1,
    content: 'For beginners, start with simple extends constraints and gradually work your way up to more complex scenarios.',
    created_at: '2024-01-16T13:30:00Z',
    votes: 6,
    user_vote: null
  },
  {
    id: 11,
    question_id: 6,
    user_id: 4,
    content: 'For large datasets, consider compound indexes for queries that filter on multiple columns. Also, use EXPLAIN to analyze your query execution plans.',
    created_at: '2024-01-15T14:00:00Z',
    votes: 11,
    user_vote: null
  },
  {
    id: 12,
    question_id: 6,
    user_id: 1,
    content: 'Don\'t forget about covering indexes - they can significantly speed up SELECT queries by including all needed columns in the index itself.',
    created_at: '2024-01-15T14:30:00Z',
    votes: 8,
    user_vote: null
  }
];

// Add user objects to questions and answers
mockQuestions.forEach(question => {
  question.user = mockUsers.find(user => user.id === question.user_id);
});

mockAnswers.forEach(answer => {
  answer.user = mockUsers.find(user => user.id === answer.user_id);
});