export interface Project {
  id: string
  name: string
  description: string
  budget: number
  category: string
  services?: Service[]
  completed?: boolean
  createdAt?: string
  updatedAt?: string
  userId?: string // Adicionar userId para associar projetos ao usuário
}

export interface Service {
  id: string
  name: string
  cost: number
  description: string
  projectId?: string
  createdAt?: string
}

export interface ProjectFormData {
  name: string
  description: string
  budget: number
  category: string
  services?: Service[]
  completed?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
  updatedAt: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}
