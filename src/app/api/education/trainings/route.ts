import { NextResponse } from "next/server"
import { supabase } from "@/lib/db/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    
    let query = supabase
      .from("trainings")
      .select(`
        *,
        education_categories (
          id,
          name
        )
      `)
      .order("name", { ascending: true })
    
    // 카테고리 필터
    if (category && category !== "전체") {
      const { data: categoryData } = await supabase
        .from("education_categories")
        .select("id")
        .eq("name", category)
        .single()
      
      if (categoryData) {
        query = query.eq("category_id", categoryData.id)
      }
    }
    
    // 검색 필터
    if (search) {
      query = query.ilike("name", `%${search}%`)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return NextResponse.json({ trainings: data || [] })
  } catch (error) {
    console.error("Trainings fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch trainings" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from("trainings")
      .insert([{
        name: body.name,
        category_id: body.categoryId,
        duration: body.duration,
        type: body.type,
        is_mandatory: body.isMandatory,
        frequency: body.frequency,
        description: body.description,
        legal_basis: body.legalBasis,
        target_roles: body.targetRoles || []
      }])
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ training: data })
  } catch (error) {
    console.error("Training creation error:", error)
    return NextResponse.json(
      { error: "Failed to create training" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from("trainings")
      .update({
        name: body.name,
        category_id: body.categoryId,
        duration: body.duration,
        type: body.type,
        is_mandatory: body.isMandatory,
        frequency: body.frequency,
        description: body.description,
        legal_basis: body.legalBasis,
        target_roles: body.targetRoles
      })
      .eq("id", body.id)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ training: data })
  } catch (error) {
    console.error("Training update error:", error)
    return NextResponse.json(
      { error: "Failed to update training" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json(
        { error: "Training ID is required" },
        { status: 400 }
      )
    }
    
    const { error } = await supabase
      .from("trainings")
      .delete()
      .eq("id", id)
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Training deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete training" },
      { status: 500 }
    )
  }
}