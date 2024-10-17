import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { VoiceExercises } from '@/components/forms/voiceExercises';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Request Body:', body);

    const {
      question,
      Option1,
      Option2,
      Option3,
      CorrectAnswer,
      chooseAnswer,
      studentUsername,
      score,
      feedback,
      correctAnswersCount,
      wrongAnswersCount,
      comprehensionId,
    } = body;

    // Validate required fields
    if (!question || !Option1 || !Option2 || !Option3 || !CorrectAnswer || !studentUsername || !comprehensionId) {
      return NextResponse.json({
        status: 'error',
        message: 'Please provide all required fields',
      }, { status: 400 });
    }

    // Find the student by username
    const studentFind = await prisma.student.findUnique({
      where: { studentUsername },
    });

    // Check if the student was found
    if (!studentFind) {
      return NextResponse.json({
        status: 'error',
        message: 'Student not found',
      }, { status: 404 });
    }


    await prisma.comprehensionHistory.create({
      data: {
        question,
        Option1,
        Option2,
        Option3,
        CorrectAnswer,
        chooseAnswer,
        score,
        feedback,
        correctAnswersCount,
        wrongAnswersCount,
        completed: true,
        ComprehensionTest: {
          connect: { id: comprehensionId }, 
        },
        Student: {
          connect: { id: studentFind.id }, 
        },
      } as any, // Temporarily bypass type checking
    });

    return NextResponse.json({
      status: 'success',
      message: 'Comprehension Test submitted successfully',
    });
  } catch (error) {
    console.error('Error during submission:', error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while processing your request',
    }, { status: 500 });
  }
}