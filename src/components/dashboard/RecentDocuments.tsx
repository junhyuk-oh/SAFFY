"use client"

interface Document {
  id: string
  name: string
  type: string
  createdDate: string
  status: "completed" | "pending" | "overdue"
  author: string
  isAiGenerated?: boolean
}

interface RecentDocumentsProps {
  documents: Document[]
}

const statusLabels = {
  completed: "완료",
  pending: "검토중",
  overdue: "기한초과"
}

export function RecentDocuments({ documents }: RecentDocumentsProps) {
  return (
    <div className="bg-background-secondary rounded-notion-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-text-primary">최근 문서 현황</h2>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-background-hover rounded-notion-sm">
            <span className="text-base">🔍</span>
            <input
              type="text"
              className="bg-transparent outline-none text-sm text-text-primary placeholder-text-secondary"
              placeholder="문서 검색..."
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-background-hover rounded-notion-sm text-sm text-text-primary font-medium transition-colors duration-200 hover:bg-background-selected">
            <span>필터</span>
            <span className="text-xs">▼</span>
          </button>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-text-secondary">
            <th className="text-left py-3 px-4 font-medium">문서명</th>
            <th className="text-left py-3 px-4 font-medium">유형</th>
            <th className="text-left py-3 px-4 font-medium">생성일</th>
            <th className="text-left py-3 px-4 font-medium">상태</th>
            <th className="text-left py-3 px-4 font-medium">담당자</th>
            <th className="text-left py-3 px-4 font-medium">작업</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b border-border hover:bg-background-hover transition-colors duration-200">
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">📄</span>
                  <div>
                    <div className="font-medium text-text-primary">{doc.name}</div>
                    {doc.isAiGenerated && (
                      <div className="text-xs text-text-secondary">
                        AI 자동 생성
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-text-secondary">{doc.type}</td>
              <td className="py-4 px-4 text-text-secondary">{doc.createdDate}</td>
              <td className="py-4 px-4">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  doc.status === "completed" ? "bg-success-bg text-success-text" :
                  doc.status === "pending" ? "bg-warning-bg text-warning-text" :
                  "bg-error-bg text-error-text"
                }`}>
                  {statusLabels[doc.status]}
                </span>
              </td>
              <td className="py-4 px-4 text-text-secondary">{doc.author}</td>
              <td className="py-4 px-4">
                <button
                  className="px-3 py-1.5 bg-background-hover rounded-notion-sm text-xs font-medium text-text-primary transition-all duration-200 hover:bg-primary hover:text-text-inverse"
                >
                  보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}