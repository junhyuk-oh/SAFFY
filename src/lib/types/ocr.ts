/**
 * OCR 관련 타입 정의
 */

export interface OcrProgress {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
}

export interface OcrResult {
  text: string;
  confidence: number;
  language: string;
  blocks?: OcrTextBlock[];
}

export interface OcrTextBlock {
  text: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface OcrUploadOptions {
  file: File;
  language?: string;
  enhance?: boolean;
}

export interface OcrSaveOptions {
  format: 'text' | 'json' | 'pdf';
  includeMetadata?: boolean;
  filename?: string;
}

export interface OcrHistoryItem {
  id: string;
  filename: string;
  uploadedAt: string;
  processedAt?: string;
  status: OcrProgress['status'];
  result?: OcrResult;
  error?: string;
}