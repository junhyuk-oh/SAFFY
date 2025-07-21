"use client"

import { DocumentCard } from "./DocumentCard"
import { BaseDocument } from "@/lib/types"

interface DocumentListProps {
  documents: BaseDocument[]
  viewMode?: "grid" | "list"
  emptyMessage?: string
}

export function DocumentList({ 
  documents, 
  viewMode = "grid",
  emptyMessage = "문서가 없습니다."
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="bg-background-secondary rounded-notion-md p-12 text-center border border-border">
        <div className="text-4xl mb-3">📁</div>
        <p className="text-text-secondary">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={viewMode === "grid" 
      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" 
      : "flex flex-col gap-4"
    }>
      {documents.map((doc) => (
        <DocumentCard key={doc.id} {...doc} />
      ))}
    </div>
  )
}