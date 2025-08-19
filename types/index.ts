export interface Profile {
  id: string
  display_name: string
  role: 'viewer' | 'creator' | 'moderator' | 'admin'
  district?: string
  created_at: string
}

export interface Org {
  id: string
  owner_name?: string
  name: string
  category: string
  district?: string
  website?: string
  phone?: string
  verified: boolean
  created_at: string
}

export interface Link {
  id: string
  category: string
  title: string
  description?: string
  url: string
  type: 'gov' | 'app' | 'event'
  icon?: string
  order_index: number
  is_active: boolean
  created_at: string
}

export interface Quiz {
  id: string
  author_name?: string
  org_id?: string
  title: string
  description?: string
  tags: string[]
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  locale: string
  district?: string
  source_url?: string
  status: 'published' | 'draft' | 'suspended'
  trust_score: number
  version: number
  created_at: string
  updated_at: string
  org?: Org
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  order_index: number
  type: 'single' | 'multi' | 'boolean' | 'order' | 'shorttext'
  prompt: string
  choices?: string[]
  answer: any
  explanation?: string
  media?: any
  created_at: string
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  user_name?: string
  score: number
  max_score: number
  started_at: string
  finished_at?: string
  detail?: any
}

export interface Report {
  id: string
  quiz_id: string
  reporter_name?: string
  reason: string
  status: 'open' | 'resolved' | 'rejected'
  created_at: string
}

export interface Coupon {
  id: string
  org_id: string
  name: string
  description?: string
  reward_type: 'coupon' | 'stamp' | 'badge'
  starts_at?: string
  ends_at?: string
  conditions: {
    min_score?: number
    quiz_ids?: string[]
  }
  stock?: number
  created_at: string
  org?: Org
}

export interface CouponGrant {
  id: string
  coupon_id: string
  user_name?: string
  granted_at: string
  code?: string
  used: boolean
  used_at?: string
}