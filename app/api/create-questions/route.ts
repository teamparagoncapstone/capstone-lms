import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const questionsArray = await req.json(); 

    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
      return NextResponse.json({
        status: 'error',
        message: 'Please provide a valid array of questions',
      }, { status: 400 }); 
    }

    // Validate each question object
    for (const question of questionsArray) {
      const { moduleId, question: qText, Option1, Option2, Option3, CorrectAnswers, grade, userId } = question;

      if (!moduleId || !qText || !Option1 || !Option2 || !Option3 || !CorrectAnswers || !grade || !userId) {
        console.error("Missing fields in question:", question); // Debug log
        return NextResponse.json({
          status: 'error',
          message: 'Please provide all required fields for each question',
        }, { status: 400 });
      }
    }

    // Create all questions
    const createdQuestions = await prisma.questions.createMany({
      data: questionsArray,
    });

    return NextResponse.json({
      status: 'success',
      count: createdQuestions.count, // You can return the number of created questions
    });
  } catch (error) {
    console.error("Error during creation", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while processing your request',
    }, { status: 500 });
  }
}