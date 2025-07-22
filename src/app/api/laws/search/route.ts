import { NextRequest, NextResponse } from 'next/server'
import { searchLaws, getLawInfo } from '@/lib/laws/lawDatabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    
    console.log('법률 검색 API 호출:', query)
    
    if (!query || query.trim().length === 0) {
      return NextResponse.json({ 
        results: [], 
        message: '검색어를 입력해주세요.' 
      }, { status: 400 })
    }

    // 검색 실행
    const articles = searchLaws(query)
    
    // 결과 포맷팅
    const results = articles.map(article => {
      const lawInfo = getLawInfo(article.lawId)
      
      return {
        id: article.id,
        lawId: article.lawId,
        lawName: lawInfo?.lawName || '알 수 없는 법률',
        lawCategory: lawInfo?.category || '기타',
        articleNumber: `제${article.articleNumber}조`,
        articleTitle: article.articleTitle,
        articleContent: article.articleContent,
        // 검색어 하이라이팅을 위한 요약본 (첫 100자)
        summary: article.articleContent.length > 100 
          ? article.articleContent.substring(0, 100) + '...'
          : article.articleContent
      }
    })

    return NextResponse.json({
      results,
      total: results.length,
      query: query.trim()
    })
    
  } catch (error) {
    console.error('법률 검색 API 오류:', error)
    return NextResponse.json({ 
      error: '검색 중 오류가 발생했습니다.',
      results: [] 
    }, { status: 500 })
  }
}