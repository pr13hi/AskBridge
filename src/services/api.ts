import { 
  Question, 
  Answer, 
  User, 
  Tag, 
  AuthUser, 
  ApiResponse, 
  FilterOptions,
  PaginationInfo 
} from '../types';
import { 
  mockQuestions, 
  mockAnswers, 
  mockUsers, 
  mockTags 
} from '../data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  private baseUrl = '/api';
  private questionsPerPage = 5;

  // Auth methods
  async login(email: string, password: string): Promise<AuthUser> {
    await delay(800);
    
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password123') {
      throw new Error('Invalid credentials');
    }

    const authUser: AuthUser = {
      ...user,
      token: 'mock-jwt-token-' + user.id
    };

    localStorage.setItem('authUser', JSON.stringify(authUser));
    return authUser;
  }

  async register(name: string, email: string, password: string): Promise<AuthUser> {
    await delay(800);
    
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: mockUsers.length + 1,
      name,
      email,
      created_at: new Date().toISOString()
    };

    mockUsers.push(newUser);

    const authUser: AuthUser = {
      ...newUser,
      token: 'mock-jwt-token-' + newUser.id
    };

    localStorage.setItem('authUser', JSON.stringify(authUser));
    return authUser;
  }

  logout(): void {
    localStorage.removeItem('authUser');
  }

  getCurrentUser(): AuthUser | null {
    const stored = localStorage.getItem('authUser');
    return stored ? JSON.parse(stored) : null;
  }

  // Questions methods
  async getQuestions(
    page: number = 1,
    filters: FilterOptions = {}
  ): Promise<ApiResponse<Question[]>> {
    await delay(500);

    let filteredQuestions = [...mockQuestions];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredQuestions = filteredQuestions.filter(q =>
        q.title.toLowerCase().includes(searchLower) ||
        q.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply tag filter
    if (filters.tag) {
      filteredQuestions = filteredQuestions.filter(q =>
        q.tags.some(tag => tag.name === filters.tag)
      );
    }

    // Apply sort
    switch (filters.sort) {
      case 'oldest':
        filteredQuestions.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case 'unanswered':
        filteredQuestions = filteredQuestions.filter(q => q.answer_count === 0);
        break;
      case 'newest':
      default:
        filteredQuestions.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    // Pagination
    const totalItems = filteredQuestions.length;
    const totalPages = Math.ceil(totalItems / this.questionsPerPage);
    const startIndex = (page - 1) * this.questionsPerPage;
    const endIndex = startIndex + this.questionsPerPage;
    const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

    const pagination: PaginationInfo = {
      page,
      total_pages: totalPages,
      total_items: totalItems,
      per_page: this.questionsPerPage
    };

    return { data: paginatedQuestions, pagination };
  }

  async getQuestion(id: number): Promise<Question> {
    await delay(300);
    
    const question = mockQuestions.find(q => q.id === id);
    if (!question) {
      throw new Error('Question not found');
    }
    
    return question;
  }

  async createQuestion(title: string, description: string, tags: string[]): Promise<Question> {
    await delay(600);
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Authentication required');
    }

    const questionTags = tags.map(tagName => {
      let tag = mockTags.find(t => t.name === tagName);
      if (!tag) {
        tag = { id: mockTags.length + 1, name: tagName };
        mockTags.push(tag);
      }
      return tag;
    });

    const newQuestion: Question = {
      id: mockQuestions.length + 1,
      title,
      description,
      user_id: currentUser.id,
      user: mockUsers.find(u => u.id === currentUser.id),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: questionTags,
      answer_count: 0
    };

    mockQuestions.unshift(newQuestion);
    return newQuestion;
  }

  // Answers methods
  async getAnswers(questionId: number): Promise<Answer[]> {
    await delay(300);
    
    return mockAnswers
      .filter(a => a.question_id === questionId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  async createAnswer(questionId: number, content: string): Promise<Answer> {
    await delay(500);
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Authentication required');
    }

    const newAnswer: Answer = {
      id: mockAnswers.length + 1,
      question_id: questionId,
      user_id: currentUser.id,
      user: mockUsers.find(u => u.id === currentUser.id),
      content,
      created_at: new Date().toISOString()
    };

    mockAnswers.push(newAnswer);

    // Update answer count
    const question = mockQuestions.find(q => q.id === questionId);
    if (question) {
      question.answer_count++;
    }

    return newAnswer;
  }

  // Voting methods
  async voteQuestion(questionId: number, voteType: 'up' | 'down'): Promise<Question> {
    await delay(300);
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Authentication required');
    }

    const question = mockQuestions.find(q => q.id === questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    // Simple voting logic - in real app, this would be stored per user
    const currentVote = question.user_vote;
    
    if (currentVote === voteType) {
      // Remove vote
      question.user_vote = null;
      question.votes += voteType === 'up' ? -1 : 1;
    } else {
      // Add or change vote
      if (currentVote) {
        // Changing vote
        question.votes += voteType === 'up' ? 2 : -2;
      } else {
        // New vote
        question.votes += voteType === 'up' ? 1 : -1;
      }
      question.user_vote = voteType;
    }

    return question;
  }

  async voteAnswer(answerId: number, voteType: 'up' | 'down'): Promise<Answer> {
    await delay(300);
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Authentication required');
    }

    const answer = mockAnswers.find(a => a.id === answerId);
    if (!answer) {
      throw new Error('Answer not found');
    }

    // Simple voting logic - in real app, this would be stored per user
    const currentVote = answer.user_vote;
    
    if (currentVote === voteType) {
      // Remove vote
      answer.user_vote = null;
      answer.votes += voteType === 'up' ? -1 : 1;
    } else {
      // Add or change vote
      if (currentVote) {
        // Changing vote
        answer.votes += voteType === 'up' ? 2 : -2;
      } else {
        // New vote
        answer.votes += voteType === 'up' ? 1 : -1;
      }
      answer.user_vote = voteType;
    }

    return answer;
  }

  // Tags methods
  async getTags(): Promise<Tag[]> {
    await delay(200);
    return mockTags;
  }
}

export const apiService = new ApiService();