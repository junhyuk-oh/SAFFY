export interface EducationCategory {
  id: string
  name: string
  description: string
  isLegalRequirement: boolean
}

export interface Training {
  id: string
  name: string
  categoryId: string
  duration: number // 시간 단위
  type: "online" | "offline" | "blended"
  isMandatory: boolean
  frequency: string // "연 1회", "분기 1회" 등
  description: string
  legalBasis?: string // 관련 법령
  targetRoles: string[] // 대상 직무
  createdAt: Date
  updatedAt: Date
}

export interface UserTraining {
  id: string
  userId: string
  trainingId: string
  status: "not-started" | "in-progress" | "completed" | "overdue"
  enrolledDate: Date
  dueDate: Date
  completionDate?: Date
  certificateNumber?: string
  certificateUrl?: string
  score?: number
  attempts: number
  lastAttemptDate?: Date
}

export interface TrainingRequirement {
  id: string
  userId: string
  trainingId: string
  requiredByDate: Date
  reason: string // "신규입사", "직무변경", "법정교육" 등
  assignedBy: string
  assignedDate: Date
  isActive: boolean
}

export interface TrainingSchedule {
  id: string
  trainingId: string
  scheduledDate: Date
  location?: string
  instructor?: string
  maxParticipants: number
  currentParticipants: number
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  notes?: string
}

export interface Certificate {
  id: string
  userTrainingId: string
  certificateNumber: string
  issueDate: Date
  expiryDate?: Date
  fileUrl: string
  verificationUrl?: string
  issuedBy: string
}

// 대시보드용 통계 타입
export interface TrainingStats {
  totalUsers: number
  completedCount: number
  inProgressCount: number
  overdueCount: number
  completionRate: number
  averageTrainingHours: number
  upcomingDeadlines: {
    userId: string
    userName: string
    trainingName: string
    dueDate: Date
  }[]
}

// 알림 관련 타입
export interface TrainingNotification {
  id: string
  userId: string
  type: "deadline_reminder" | "new_assignment" | "completion_congratulation" | "overdue_alert"
  trainingId: string
  message: string
  sentDate: Date
  isRead: boolean
  priority: "low" | "medium" | "high"
}