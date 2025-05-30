import type { Project, Service, ProjectFormData } from "@/lib/types"
import { authService } from "./auth-service"

// Simulated database using localStorage
class ProjectService {
  private storageKey = "costs_projects"

  private getProjects(): Project[] {
    if (typeof window === "undefined") return []

    try {
      const data = localStorage.getItem(this.storageKey)
      const projects = data ? JSON.parse(data) : []
      return projects
    } catch (error) {
      console.error("Error reading projects from localStorage:", error)
      return []
    }
  }

  private saveProjects(projects: Project[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(projects))
      // Forçar sincronização
      localStorage.getItem(this.storageKey)
    } catch (error) {
      console.error("Error saving projects to localStorage:", error)
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  private getCurrentUserId(): string | null {
    const user = authService.getCurrentUser()
    return user ? user.id : null
  }

  getAll(): Project[] {
    const userId = this.getCurrentUserId()
    if (!userId) return []

    const allProjects = this.getProjects()
    return allProjects.filter((project) => project.userId === userId)
  }

  get(id: string): Project | null {
    const userId = this.getCurrentUserId()
    if (!userId) return null

    const projects = this.getProjects()
    const project = projects.find((p) => p.id === id && p.userId === userId)
    return project || null
  }

  create(projectData: Partial<ProjectFormData>): Project {
    const userId = this.getCurrentUserId()
    if (!userId) {
      throw new Error("User not authenticated")
    }

    const projects = this.getProjects()
    const newProject: Project = {
      id: this.generateId(),
      name: projectData.name || "",
      description: projectData.description || "",
      budget: projectData.budget || 0,
      category: projectData.category || "",
      services: projectData.services || [],
      completed: projectData.completed || false,
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    projects.push(newProject)
    this.saveProjects(projects)

    // Verificar se foi salvo corretamente
    const savedProject = this.get(newProject.id)
    if (!savedProject) {
      throw new Error("Failed to save project")
    }

    return newProject
  }

  update(project: Project): Project {
    const userId = this.getCurrentUserId()
    if (!userId) {
      throw new Error("User not authenticated")
    }

    const projects = this.getProjects()
    const index = projects.findIndex((p) => p.id === project.id && p.userId === userId)

    if (index !== -1) {
      const updatedProject = {
        ...project,
        userId: userId, // Garantir que o userId seja mantido
        updatedAt: new Date().toISOString(),
      }
      projects[index] = updatedProject
      this.saveProjects(projects)
      return updatedProject
    } else {
      throw new Error("Project not found")
    }
  }

  remove(id: string): void {
    const userId = this.getCurrentUserId()
    if (!userId) {
      throw new Error("User not authenticated")
    }

    const projects = this.getProjects()
    const index = projects.findIndex((p) => p.id === id && p.userId === userId)

    if (index !== -1) {
      projects.splice(index, 1)
      this.saveProjects(projects)
    } else {
      throw new Error("Project not found")
    }
  }

  addService(projectId: string, service: Service): Service {
    const userId = this.getCurrentUserId()
    if (!userId) {
      throw new Error("User not authenticated")
    }

    const projects = this.getProjects()
    const project = projects.find((p) => p.id === projectId && p.userId === userId)

    if (project) {
      const newService = {
        ...service,
        projectId,
        createdAt: new Date().toISOString(),
      }

      if (!project.services) {
        project.services = []
      }

      project.services.push(newService)
      project.updatedAt = new Date().toISOString()

      this.saveProjects(projects)
      return newService
    } else {
      throw new Error("Project not found")
    }
  }

  removeService(serviceId: string): void {
    const userId = this.getCurrentUserId()
    if (!userId) {
      throw new Error("User not authenticated")
    }

    const projects = this.getProjects()
    let serviceFound = false

    for (const project of projects) {
      if (project.userId === userId && project.services) {
        const serviceIndex = project.services.findIndex((s) => s.id === serviceId)
        if (serviceIndex !== -1) {
          project.services.splice(serviceIndex, 1)
          project.updatedAt = new Date().toISOString()
          serviceFound = true
          break
        }
      }
    }

    if (serviceFound) {
      this.saveProjects(projects)
    } else {
      throw new Error("Service not found")
    }
  }
}

export const projectService = new ProjectService()
