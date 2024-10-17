
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const voiceArray = await req.json();

    if (!Array.isArray(voiceArray) || voiceArray.length === 0){
        return NextResponse.json({
            status: 'error',
            message: 'Please provide a valid array of question',
        }, {status: 400});
  
    }
    
    for (const voice of voiceArray) {
        const {moduleId, voice: qText, grade, userId} = voice;

        if (!moduleId || !qText || !grade || !userId) {
            console.error("Missing fields in question:", voice); // Debug log
            return NextResponse.json({
              status: 'error',
              message: 'Please provide all required fields for each question',
            }, { status: 400 });
          }
        }

        const createdvoice = await prisma.voiceExcercises.createMany({
            data: voiceArray,
          });
      
        return NextResponse.json({
            status: 'success',
            count: createdvoice.count, // You can return the number of created questions
          });
        
        } catch (error) {
          console.error("Error during creation", error);
          return NextResponse.json({
            status: 'error',
            message: 'An error occurred while processing your request',
          }, { status: 500 });
        }
      }
    