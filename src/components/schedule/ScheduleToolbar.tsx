"use client"

import { useState } from "react"

interface ScheduleToolbarProps {
  currentView: "today" | "week" | "month"
  onViewChange: (view: "today" | "week" | "month") => void
  currentDate: Date
  onDateChange: (date: Date) => void
  isEditMode: boolean
  onEditModeToggle: () => void
  onAddSchedule: () => void
}

export function ScheduleToolbar({
  currentView,
  onViewChange,
  currentDate,
  onDateChange,
  isEditMode,
  onEditModeToggle,
  onAddSchedule
}: ScheduleToolbarProps) {
  const formatDate = (date: Date, view: "today" | "week" | "month") => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    if (view === "today") {
      return `${year}년 ${month}월 ${day}일`
    } else if (view === "week") {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      
      return `${weekStart.getMonth() + 1}월 ${weekStart.getDate()}일 - ${weekEnd.getMonth() + 1}월 ${weekEnd.getDate()}일`
    } else {
      return `${year}년 ${month}월`
    }
  }

  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (currentView === "today") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    onDateChange(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (currentView === "today") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (currentView === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    onDateChange(newDate)
  }

  const handleToday = () => {
    onDateChange(new Date())
  }

  return (
    <div className="bg-background-secondary border-b border-border sticky top-0 z-10">
      <div className="px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* View Switcher & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Switcher */}
            <div className="flex bg-background rounded-notion-sm border border-border p-1">
              <button
                onClick={() => onViewChange("today")}
                className={`px-4 py-2 text-sm font-medium rounded-notion-xs transition-all duration-200 ${
                  currentView === "today"
                    ? "bg-primary text-text-inverse"
                    : "text-text-secondary hover:text-text-primary hover:bg-background-hover"
                }`}
              >
                오늘
              </button>
              <button
                onClick={() => onViewChange("week")}
                className={`px-4 py-2 text-sm font-medium rounded-notion-xs transition-all duration-200 ${
                  currentView === "week"
                    ? "bg-primary text-text-inverse"
                    : "text-text-secondary hover:text-text-primary hover:bg-background-hover"
                }`}
              >
                주간
              </button>
              <button
                onClick={() => onViewChange("month")}
                className={`px-4 py-2 text-sm font-medium rounded-notion-xs transition-all duration-200 ${
                  currentView === "month"
                    ? "bg-primary text-text-inverse"
                    : "text-text-secondary hover:text-text-primary hover:bg-background-hover"
                }`}
              >
                월간
              </button>
            </div>

            {/* Primary Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onAddSchedule}
                className="px-4 py-2 bg-primary text-text-inverse rounded-notion-sm hover:bg-primary-hover transition-all duration-200 font-medium flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                <span>새 일정</span>
              </button>

              <button
                onClick={onEditModeToggle}
                className={`px-4 py-2 rounded-notion-sm border transition-all duration-200 font-medium flex items-center gap-2 ${
                  isEditMode
                    ? "bg-primary text-text-inverse border-primary"
                    : "bg-background border-border hover:bg-background-hover"
                }`}
              >
                <span>✏️</span>
                <span>편집</span>
              </button>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center gap-3">
            {/* Today Button */}
            <button
              onClick={handleToday}
              className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-background rounded-notion-sm border border-border hover:bg-background-hover transition-all duration-200"
            >
              오늘
            </button>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevious}
                className="w-8 h-8 flex items-center justify-center rounded-notion-sm hover:bg-background-hover transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="w-8 h-8 flex items-center justify-center rounded-notion-sm hover:bg-background-hover transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Current Date Display */}
            <div className="px-4 py-2 bg-background rounded-notion-sm border border-border">
              <h2 className="text-base font-semibold text-text-primary">
                {formatDate(currentDate, currentView)}
              </h2>
            </div>
          </div>
        </div>

        {/* Mobile Date Display */}
        <div className="md:hidden mt-3 text-center">
          <h2 className="text-lg font-semibold text-text-primary">
            {formatDate(currentDate, currentView)}
          </h2>
        </div>
      </div>
    </div>
  )
}