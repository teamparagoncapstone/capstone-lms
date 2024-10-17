import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

enum Grade {
  GradeOne = 'GradeOne',
  GradeTwo = 'GradeTwo',
  GradeThree = 'GradeThree',
}


interface UpdateVoiceRequestBody {
  id: string;
  voice: string;
  voiceImage  : string;
  grade: Grade;
}

interface DeleteVoiceRequestBody {
  id: string;
}

export async function PUT(req: Request) {
  try {
    const body: UpdateVoiceRequestBody = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Voice ID is required' }, { status: 400 });
    }

    const updatedVoiceExcercises = await prisma.voiceExcercises.update({
      where: { id: body.id },
      data: {
        voice: body. voice,
        voiceImage  : body. voiceImage  ,
        grade: body. grade,
        
      },
    });

    return NextResponse.json(updatedVoiceExcercises);
  } catch (error) {
    console.error('Error updating voice exercises:', error);
    return NextResponse.json({ error: 'Failed to update voice exercises' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body: DeleteVoiceRequestBody = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Voice Exercises ID is required' }, { status: 400 });
    }

    const deletedVoiceExercises = await prisma.voiceExcercises.delete({
      where: { id: body.id },
    });

    return NextResponse.json(deletedVoiceExercises);
  } catch (error) {
    console.error('Error deleting voice exercises:', error);
    return NextResponse.json({ error: 'Failed to delete voice exercises' }, { status: 500 });
  }
}