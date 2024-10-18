import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/auditLogger'; 

enum Grade {
  GradeOne = 'GradeOne',
  GradeTwo = 'GradeTwo',
  GradeThree = 'GradeThree',
}

enum Subject {
  Math = 'Math',
  Reading = 'Reading',
}

interface UpdateModuleRequestBody {
  id: string;
  moduleTitle: string;
  moduleDescription: string;
  learnOutcome1: string;
  videoModule?: string;
  imageModule?: string;
  grade: Grade;
  subjects: Subject;
}

interface DeleteModuleRequestBody {
  id: string;
}

export async function PUT(req: Request) {
  try {
    const body: UpdateModuleRequestBody = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Module ID is required' }, { status: 400 });
    }

    
    const updatedModule = await prisma.module.update({
      where: { id: body.id },
      data: {
        moduleTitle: body.moduleTitle,
        moduleDescription: body.moduleDescription,
        learnOutcome1: body.learnOutcome1,
        videoModule: body.videoModule,
        imageModule: body.imageModule,
        grade: body.grade,
        subjects: body.subjects,
      },
    });


    await logAudit(null, 'Update Module', 'Module', `Updated module : ${body.moduleTitle}`);

    return NextResponse.json(updatedModule);
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body: DeleteModuleRequestBody = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Module ID is required' }, { status: 400 });
    }

    
    const deletedModule = await prisma.module.delete({
      where: { id: body.id },
    });

    await logAudit(null, 'Delete Module', 'Module', `Deleted module with ID: ${body.id}`);

    return NextResponse.json(deletedModule);
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
  }
}