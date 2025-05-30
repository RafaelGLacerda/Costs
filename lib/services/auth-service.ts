import type { User, AuthUser, LoginData, RegisterData } from "@/lib/types"

class AuthService {
  private storageKey = "costs_users"
  private sessionKey = "costs_session"

  private getUsers(): User[] {
    if (typeof window === "undefined") return []

    try {
      const data = localStorage.getItem(this.storageKey)
      const users = data ? JSON.parse(data) : []
      return Array.isArray(users) ? users : []
    } catch (error) {
      console.error("Error reading users from localStorage:", error)
      return []
    }
  }

  private saveUsers(users: User[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(users))
      // Verificar se os dados foram salvos corretamente
      const savedData = localStorage.getItem(this.storageKey)
      console.log("Dados salvos:", savedData)
    } catch (error) {
      console.error("Error saving users to localStorage:", error)
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  private hashPassword(password: string): string {
    // Em um ambiente real, use uma biblioteca de hash adequada
    // Aqui é apenas uma simulação simples
    return btoa(password + "costs_salt")
  }

  private verifyPassword(password: string, hashedPassword: string): boolean {
    return this.hashPassword(password) === hashedPassword
  }

  // Verificar a função register para garantir que está salvando os usuários corretamente
  register(data: RegisterData): { success: boolean; message: string; user?: AuthUser } {
    const users = this.getUsers()
    console.log("Usuários existentes antes do registro:", users) // Log para debug

    // Verificar se email já existe
    const existingUser = users.find((user) => user.email === data.email)
    if (existingUser) {
      return { success: false, message: "Este email já está cadastrado." }
    }

    // Verificar se senhas coincidem
    if (data.password !== data.confirmPassword) {
      return { success: false, message: "As senhas não coincidem." }
    }

    // Criar novo usuário
    const newUser: User = {
      id: this.generateId(),
      name: data.name,
      email: data.email,
      password: this.hashPassword(data.password),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    users.push(newUser)
    this.saveUsers(users)

    console.log("Usuários após registro:", this.getUsers()) // Log para debug

    // Retornar dados do usuário sem a senha
    const authUser: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }

    return { success: true, message: "Usuário cadastrado com sucesso!", user: authUser }
  }

  // Verificar a função login para garantir que está encontrando os usuários corretamente
  login(data: LoginData): { success: boolean; message: string; user?: AuthUser } {
    const users = this.getUsers()
    console.log("Usuários encontrados:", users) // Log para debug

    const user = users.find((u) => u.email === data.email)
    if (!user) {
      console.log("Usuário não encontrado:", data.email) // Log para debug
      return { success: false, message: "Email ou senha incorretos." }
    }

    if (!this.verifyPassword(data.password, user.password)) {
      console.log("Senha incorreta para:", data.email) // Log para debug
      return { success: false, message: "Email ou senha incorretos." }
    }

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    }

    // Salvar sessão
    this.setSession(authUser)

    return { success: true, message: "Login realizado com sucesso!", user: authUser }
  }

  // Verificar a função logout para garantir que ela não está apagando os usuários
  logout(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.sessionKey)
    // Não deve remover this.storageKey, apenas a sessão
  }

  setSession(user: AuthUser): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.sessionKey, JSON.stringify(user))
  }

  getSession(): AuthUser | null {
    if (typeof window === "undefined") return null

    try {
      const data = localStorage.getItem(this.sessionKey)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("Error reading session from localStorage:", error)
      return null
    }
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null
  }

  getCurrentUser(): AuthUser | null {
    return this.getSession()
  }

  updateProfile(userData: Partial<AuthUser>): { success: boolean; message: string; user?: AuthUser } {
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      return { success: false, message: "Usuário não autenticado." }
    }

    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === currentUser.id)

    if (userIndex === -1) {
      return { success: false, message: "Usuário não encontrado." }
    }

    // Atualizar dados do usuário
    const updatedUser = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    }

    users[userIndex] = updatedUser
    this.saveUsers(users)

    // Atualizar sessão
    const updatedAuthUser: AuthUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    }

    this.setSession(updatedAuthUser)

    return { success: true, message: "Perfil atualizado com sucesso!", user: updatedAuthUser }
  }
}

export const authService = new AuthService()
