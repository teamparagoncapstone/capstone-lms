import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');

  if (!studentId) {
    return NextResponse.json({
      status: 'error',
      message: 'Student ID is required',
    }, { status: 400 });
  }

  try {
    // Fetch all modules and their associated quiz status for the student
    const modules = await prisma.module.findMany({
      include: {
        Questions: {
          include: {
            StudentQuizHistory: {
              where: { studentId },
            },
          },
        },
      },
    });

    // Filter modules to find those that are assigned but not completed
    const assignedModules = modules.filter(module => {
      return module.Questions.some(question => {
        const quizHistory = question.StudentQuizHistory;
        return quizHistory.length === 0 || quizHistory.every(quiz => !quiz.completed);
      });
    });

    return NextResponse.json({
      status: 'success',
      assignedModules,
      count: assignedModules.length,
    });
  } catch (error) {
    console.error('Error fetching assigned modules:', error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching the assigned modules.',
    }, { status: 500 });
  }
}