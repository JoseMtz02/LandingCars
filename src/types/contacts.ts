export interface Contact {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  status: 'No Atendido' | 'En Espera' | 'Atendido' | 'Enviado';
  priority: 'low' | 'medium' | 'high';
  source: string;
  assigned_to?: number;
  assigned_username?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactResponse {
  success: boolean;
  data: Contact[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ContactSingleResponse {
  success: boolean;
  data: Contact;
}

export interface ContactQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  assigned_to?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface DashboardStats {
  totalContacts: number;
  contactsByStatus: {
    'No Atendido': number;
    'En Espera': number;
    'Atendido': number;
    'Enviado': number;
  };
  contactsByPriority: {
    'low': number;
    'medium': number;
    'high': number;
  };
  recentContacts: Contact[];
  monthlyStats: Array<{
    month: string;
    count: number;
  }>;
}

export interface ContactCreateData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  recaptcha: string;
}

export interface ContactUpdateData {
  status?: string;
  priority?: string;
  notes?: string;
  assigned_to?: number;
}

export interface ContactAssignData {
  contactIds: number[];
  userId: number;
}

export interface ContactFollowUpData {
  contactId: number;
  message: string;
  scheduledDate?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface Message {
  id: number;
  contactId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateData {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface UserUpdateData {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}
