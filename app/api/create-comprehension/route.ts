import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const comprehensionArray = await req.json(); 

    if (!Array.isArray(comprehensionArray) || comprehensionArray.length === 0) {
      return NextResponse.json({
        status: 'error',
        message: 'Please provide a valid array of comprehension test',
      }, { status: 400 }); 
    }

    
    for (const ComprehensionTest of comprehensionArray) {
      const { voiceId, question: qText, Option1, Option2, Option3, CorrectAnswers, grade, userId } =  ComprehensionTest;

      if (!voiceId || !qText || !Option1 || !Option2 || !Option3 || !CorrectAnswers || !grade || !userId) {
        console.error("Missing fields in comprehension:",  ComprehensionTest); 
        return NextResponse.json({
          status: 'error',
          message: 'Please provide all required fields for each comprehension',
        }, { status: 400 });
      }
    }

    // Create all comprehension
    const createdComprehension = await prisma.comprehensionTest.createMany({
      data: comprehensionArray,
    });

    return NextResponse.json({
      status: 'success',
      count: createdComprehension.count, 
    });
  } catch (error) {
    console.error("Error during creation", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while processing your request',
    }, { status: 500 });
  }
}