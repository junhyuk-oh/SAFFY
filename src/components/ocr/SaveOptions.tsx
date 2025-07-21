"use client";

import { useState } from "react";
import { ExtractedData } from "@/types/ocr";

interface SaveOptionsProps {
  extractedData: ExtractedData;
  onSave: (saveData: SaveData) => void;
  onCancel: () => void;
}

export interface SaveData {
  title: string;
  documentType: string;
  tags: string[];
  description: string;
  content: ExtractedData;
}

const DOCUMENT_TYPES = [
  { value: "contract", label: "계약서" },
  { value: "report", label: "보고서" },
  { value: "manual", label: "매뉴얼" },
  { value: "specification", label: "사양서" },
  { value: "policy", label: "정책문서" },
  { value: "other", label: "기타" },
];

export default function SaveOptions({ extractedData, onSave, onCancel }: SaveOptionsProps) {
  const [title, setTitle] = useState(extractedData.documentInfo?.title || "");
  const [documentType, setDocumentType] = useState("other");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "문서 제목을 입력해주세요.";
    }

    if (!documentType) {
      newErrors.documentType = "문서 유형을 선택해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        title,
        documentType,
        tags,
        description,
        content: extractedData,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">문서 저장 옵션</h3>

      <div className="space-y-6">
        {/* 문서 제목 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            문서 제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="문서 제목을 입력하세요"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* 문서 유형 */}
        <div>
          <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-2">
            문서 유형 <span className="text-red-500">*</span>
          </label>
          <select
            id="documentType"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.documentType ? "border-red-300" : "border-gray-300"
            }`}
          >
            <option value="">선택하세요</option>
            {DOCUMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.documentType && (
            <p className="mt-1 text-sm text-red-600">{errors.documentType}</p>
          )}
        </div>

        {/* 태그 */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            태그
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="태그를 입력하고 Enter를 누르세요"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              추가
            </button>
          </div>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 설명 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            설명
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="문서에 대한 설명을 입력하세요"
          />
        </div>

        {/* 추출된 정보 미리보기 */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">추출된 정보</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>텍스트: {extractedData.text?.slice(0, 100)}...</p>
            {extractedData.tables.length > 0 && (
              <p>테이블: {extractedData.tables.length}개</p>
            )}
            {extractedData.forms.length > 0 && (
              <p>양식 필드: {extractedData.forms.length}개</p>
            )}
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          문서관리에 저장
        </button>
      </div>
    </div>
  );
}