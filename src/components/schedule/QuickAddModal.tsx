"use client";

import { useState, useEffect, useRef } from "react";
import { X, Calendar, Clock, Repeat } from "lucide-react";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: ParsedSchedule) => void;
}

interface ParsedSchedule {
  title: string;
  priority: "high" | "medium" | "low";
  date: string;
  time?: string;
  recurrence: "none" | "daily" | "weekly" | "monthly";
  description?: string;
}

export function QuickAddModal({ isOpen, onClose, onSave }: QuickAddModalProps) {
  const [input, setInput] = useState("");
  const [parsedData, setParsedData] = useState<ParsedSchedule>({
    title: "",
    priority: "medium",
    date: new Date().toISOString().split("T")[0],
    recurrence: "none",
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    parseInput(input);
  }, [input]);

  const parseInput = (text: string) => {
    // 기본값 설정
    const parsed: ParsedSchedule = {
      title: text,
      priority: "medium",
      date: new Date().toISOString().split("T")[0],
      recurrence: "none",
    };

    // 우선순위 파싱
    if (text.includes("!!!") || text.includes("긴급") || text.includes("중요")) {
      parsed.priority = "high";
    } else if (text.includes("!") || text.includes("보통")) {
      parsed.priority = "medium";
    } else if (text.includes("나중에") || text.includes("언젠가")) {
      parsed.priority = "low";
    }

    // 날짜 파싱
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (text.includes("내일")) {
      parsed.date = tomorrow.toISOString().split("T")[0];
    } else if (text.includes("모레")) {
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);
      parsed.date = dayAfter.toISOString().split("T")[0];
    } else if (text.includes("다음주")) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      parsed.date = nextWeek.toISOString().split("T")[0];
    }

    // 시간 파싱
    const timeMatch = text.match(/(\d{1,2})시/);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1]);
      parsed.time = `${hour.toString().padStart(2, "0")}:00`;
    }

    // 반복 파싱
    if (text.includes("매일") || text.includes("daily")) {
      parsed.recurrence = "daily";
    } else if (text.includes("매주") || text.includes("weekly")) {
      parsed.recurrence = "weekly";
    } else if (text.includes("매달") || text.includes("monthly")) {
      parsed.recurrence = "monthly";
    }

    // 제목 정리 (파싱 키워드 제거)
    const cleanTitle = text
      .replace(/!!!|!!|!/g, "")
      .replace(/긴급|중요|보통|나중에|언젠가/g, "")
      .replace(/내일|모레|다음주/g, "")
      .replace(/\d{1,2}시/g, "")
      .replace(/매일|매주|매달|daily|weekly|monthly/g, "")
      .trim();

    parsed.title = cleanTitle || text;
    setParsedData(parsed);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedData.title.trim()) {
      onSave(parsedData);
      setInput("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 animate-scaleIn">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            빠른 일정 추가
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* 스마트 입력 필드 */}
          <div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="예: 내일 2시 팀 미팅 !!! 매주"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              자연스럽게 입력하세요. 시간, 날짜, 우선순위를 자동으로 인식합니다.
            </p>
          </div>

          {/* 파싱된 정보 표시 */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">
                {new Date(parsedData.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {parsedData.time && (
                <>
                  <Clock className="h-4 w-4 text-gray-400 ml-2" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {parsedData.time}
                  </span>
                </>
              )}
            </div>
            {parsedData.recurrence !== "none" && (
              <div className="flex items-center gap-2 text-sm">
                <Repeat className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  {parsedData.recurrence === "daily" && "매일"}
                  {parsedData.recurrence === "weekly" && "매주"}
                  {parsedData.recurrence === "monthly" && "매달"}
                </span>
              </div>
            )}
          </div>

          {/* 우선순위 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              우선순위
            </label>
            <div className="flex gap-3">
              {[
                { value: "high", label: "높음", color: "red" },
                { value: "medium", label: "보통", color: "yellow" },
                { value: "low", label: "낮음", color: "green" },
              ].map((priority) => (
                <label
                  key={priority.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={parsedData.priority === priority.value}
                    onChange={(e) =>
                      setParsedData({ ...parsedData, priority: e.target.value as 'high' | 'medium' | 'low' })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      parsedData.priority === priority.value
                        ? priority.color === "red"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-2 ring-red-500"
                          : priority.color === "yellow"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 ring-2 ring-yellow-500"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ring-2 ring-green-500"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {priority.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 반복 설정 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              반복
            </label>
            <select
              value={parsedData.recurrence}
              onChange={(e) =>
                setParsedData({ ...parsedData, recurrence: e.target.value as 'none' | 'daily' | 'weekly' | 'monthly' })
              }
              className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">반복 없음</option>
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="monthly">매달</option>
            </select>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!parsedData.title.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}