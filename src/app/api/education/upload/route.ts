import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 허용된 파일 확장자
const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// POST: 수료증 파일 업로드
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const recordId = formData.get('record_id') as string;
    const userId = formData.get('user_id') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: '파일이 선택되지 않았습니다.' },
        { status: 400 }
      );
    }
    
    if (!recordId || !userId) {
      return NextResponse.json(
        { error: '기록 ID와 사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 파일 확장자 검증
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json(
        { error: `허용된 파일 형식: ${ALLOWED_EXTENSIONS.join(', ')}` },
        { status: 400 }
      );
    }
    
    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '파일 크기는 10MB를 초과할 수 없습니다.' },
        { status: 400 }
      );
    }
    
    // 교육 기록 확인
    const { data: record, error: recordError } = await supabase
      .from('education_records')
      .select('id, user_id')
      .eq('id', recordId)
      .single();
    
    if (recordError || !record) {
      return NextResponse.json(
        { error: '유효하지 않은 교육 기록입니다.' },
        { status: 404 }
      );
    }
    
    // 사용자 확인
    if (record.user_id !== userId) {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 403 }
      );
    }
    
    // 파일 저장 경로 생성
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'certificates', userId);
    const filePath = join(uploadDir, fileName);
    const publicPath = `/uploads/certificates/${userId}/${fileName}`;
    
    try {
      // 디렉토리 생성
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      
      // 파일 저장
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);
      
      // 데이터베이스 업데이트
      const { error } = await supabase
        .from('education_records')
        .update({
          certificate_file_path: publicPath,
          certificate_url: publicPath // 로컬 경로를 URL로 사용
        })
        .eq('id', recordId)
        .select()
        .single();
      
      if (error) {
        // 파일 업로드는 성공했지만 DB 업데이트 실패 시
        // TODO: 파일 삭제 로직 추가
        return NextResponse.json(
          { error: '데이터베이스 업데이트 실패: ' + error.message },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        data: {
          record_id: recordId,
          file_path: publicPath,
          file_name: fileName,
          file_size: file.size,
          uploaded_at: new Date().toISOString()
        }
      }, { status: 201 });
      
    } catch (uploadError) {
      console.error('파일 업로드 오류:', uploadError);
      return NextResponse.json(
        { error: '파일 업로드 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('수료증 업로드 오류:', error);
    return NextResponse.json(
      { error: '수료증 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 수료증 파일 삭제
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get('record_id');
    
    if (!recordId) {
      return NextResponse.json(
        { error: '기록 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 교육 기록 조회
    const { data: record, error: recordError } = await supabase
      .from('education_records')
      .select('id, certificate_file_path')
      .eq('id', recordId)
      .single();
    
    if (recordError || !record) {
      return NextResponse.json(
        { error: '유효하지 않은 교육 기록입니다.' },
        { status: 404 }
      );
    }
    
    if (!record.certificate_file_path) {
      return NextResponse.json(
        { error: '삭제할 파일이 없습니다.' },
        { status: 404 }
      );
    }
    
    // TODO: 실제 파일 삭제 로직 구현
    // const filePath = join(process.cwd(), 'public', record.certificate_file_path);
    // await unlink(filePath);
    
    // 데이터베이스 업데이트
    const { error } = await supabase
      .from('education_records')
      .update({
        certificate_file_path: null,
        certificate_url: null
      })
      .eq('id', recordId);
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      data: { message: '수료증이 삭제되었습니다.' } 
    });
  } catch (error) {
    console.error('수료증 삭제 오류:', error);
    return NextResponse.json(
      { error: '수료증 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// GET: 수료증 다운로드 URL 생성
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get('record_id');
    
    if (!recordId) {
      return NextResponse.json(
        { error: '기록 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 교육 기록 조회
    const { data: record, error } = await supabase
      .from('education_records')
      .select('id, certificate_file_path, certificate_url')
      .eq('id', recordId)
      .single();
    
    if (error || !record) {
      return NextResponse.json(
        { error: '유효하지 않은 교육 기록입니다.' },
        { status: 404 }
      );
    }
    
    if (!record.certificate_file_path && !record.certificate_url) {
      return NextResponse.json(
        { error: '수료증 파일이 없습니다.' },
        { status: 404 }
      );
    }
    
    // 다운로드 URL 생성
    const downloadUrl = record.certificate_url || record.certificate_file_path;
    
    return NextResponse.json({
      data: {
        record_id: recordId,
        download_url: downloadUrl,
        file_path: record.certificate_file_path
      }
    });
  } catch (error) {
    console.error('수료증 다운로드 URL 생성 오류:', error);
    return NextResponse.json(
      { error: '수료증 다운로드 URL 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}