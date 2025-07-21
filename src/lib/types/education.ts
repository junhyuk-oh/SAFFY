export interface EducationCategory {
  id: string
  name: string
  description: string
  isLegalRequirement: boolean
  code?: string
  isMandatory?: boolean
  requiredHours?: number
  validityMonths?: number
  parentId?: string | null
  displayOrder?: number
  isActive?: boolean
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

// API 관련 타입들
export interface DailyEducationLog {
  id: string
  userId: string
  educationDate: string
  educationType: string
  topic: string
  durationMinutes: number
  instructorId: string
  location: string
  attendanceStatus: 'present' | 'absent' | 'partial'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateDailyEducationLogDTO {
  userId: string
  educationDate: string
  educationType: string
  topic: string
  durationMinutes: number
  instructorId: string
  location: string
  attendanceRecords: Array<{
    userId: string
    present: boolean
    notes?: string
  }>
  notes?: string
}

export enum EducationType {
  ONLINE = 'online',
  OFFLINE = 'offline',
  BLENDED = 'blended'
}

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface EducationRecord {
  id: string
  user_id: string
  category_id: string
  requirement_id?: string
  education_date: string
  education_hours: number
  provider?: string
  certificate_number?: string
  certificate_url?: string
  certificate_file_path?: string
  expiry_date?: string
  verification_status: VerificationStatus
  verification_date?: string
  verified_by?: string
  rejection_reason?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface CreateEducationRecordDTO {
  user_id: string
  category_id: string
  requirement_id?: string
  education_date: string
  education_hours: number
  provider?: string
  certificate_number?: string
  certificate_file?: File
  expiry_date?: string
  notes?: string
}

export interface EducationFilterOptions {
  category_id?: string
  user_id?: string
  date_from?: string
  date_to?: string
  verification_status?: VerificationStatus
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

export interface UserEducationRequirement {
  id: string
  userId: string
  trainingId: string
  requiredByDate: string
  status: string
  assignedBy: string
  assignedDate: string
  completedDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateEducationRequirementDTO {
  userId: string
  trainingId: string
  requiredByDate: string
  assignedBy: string
  reason?: string
}

export interface EducationStatistics {
  totalTrainings: number
  completedTrainings: number
  inProgressTrainings: number
  overdueTrainings: number
  completionRate: number
  totalHours: number
  averageScore?: number
  upcomingDeadlines: Array<{
    trainingId: string
    trainingName: string
    dueDate: string
  }>
}

export interface TargetRule {
  id: string
  target: string
  department?: string
  position?: string
  experience?: number
  trainingIds: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}