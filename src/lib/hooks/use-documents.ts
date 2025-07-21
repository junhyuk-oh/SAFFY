import { useState, useEffect } from 'react';
import { BaseDocument, ApiResponse } from '@/lib/types';

interface UseDocumentsOptions {
  limit?: number;
  department?: string;
  refresh?: boolean;
}

interface UseDocumentsReturn {
  documents: BaseDocument[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDocuments(options: UseDocumentsOptions = {}): UseDocumentsReturn {
  const [documents, setDocuments] = useState<BaseDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { limit = 50, department } = options;

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = '/api/documents';
      const params = new URLSearchParams();
      
      if (limit) {
        params.append('limit', limit.toString());
      }
      
      if (department) {
        url = `/api/documents/departments/${encodeURIComponent(department)}`;
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<BaseDocument[]> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || '문서를 가져오는데 실패했습니다.');
      }

      setDocuments(data.data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [limit, department, options.refresh]);

  return {
    documents,
    loading,
    error,
    refresh: fetchDocuments
  };
}

// 개별 문서 조회 훅
export function useDocument(id: string) {
  const [document, setDocument] = useState<BaseDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/documents/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse<BaseDocument> = await response.json();
        
        if (!data.success) {
          throw new Error(data.error?.message || '문서를 가져오는데 실패했습니다.');
        }

        setDocument(data.data || null);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  return {
    document,
    loading,
    error
  };
}

// 문서 검색 훅
export function useDocumentSearch(query: string, filters?: {
  type?: string;
  status?: string;
  dateRange?: string;
}) {
  const [results, setResults] = useState<BaseDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append('q', query);
        
        if (filters?.type && filters.type !== 'all') {
          params.append('type', filters.type);
        }
        if (filters?.status && filters.status !== 'all') {
          params.append('status', filters.status);
        }
        if (filters?.dateRange && filters.dateRange !== 'all') {
          params.append('dateRange', filters.dateRange);
        }

        const response = await fetch(`/api/documents/search?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse<BaseDocument[]> = await response.json();
        
        if (!data.success) {
          throw new Error(data.error?.message || '검색에 실패했습니다.');
        }

        setResults(data.data || []);
      } catch (err) {
        console.error('Error searching documents:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchDocuments, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, filters?.type, filters?.status, filters?.dateRange]);

  return {
    results,
    loading,
    error
  };
}