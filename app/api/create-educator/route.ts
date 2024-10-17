import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const { username, educatorLevel, password, email, name, image } = await req.json();

    // Check for missing fields
    if (!username || !educatorLevel || !password || !name || !email || !image) {
      return NextResponse.json({
        status: 'error',
        message: 'Please provide all required fields',
      }, { status: 400 });
    }

    // Check for existing user or educator
    const existingUser = await prisma.user.findUnique({ where: { username } });
    const existingEducator = await prisma.educator.findUnique({ where: { username } });

    if (existingUser || existingEducator) {
      return NextResponse.json({
        status: 'error',
        message: 'An educator with this username already exists',
      }, { status: 400 });
    }

    // Hash the password
    const hashed = await hash(password, 12);

    // Create user
    const createdUser = await prisma.user.create({
      data: {
        username,
        password: hashed,
        email,
        name,
        image,
        role: 'Teacher',
      },
    });

    // Create educator
    const educator = await prisma.educator.create({
      data: {
        email,
        username,
        name,
        educatorLevel,
        password: hashed,
        image,
        user: {
          connect: {
            id: createdUser.id,
          },
        },
      },
    });

    return NextResponse.json({
      status: 'success',
      educator: {
        email: educator.email,
        name: educator.name,
        username: educator.username,
        image: educator.image,
        educatorLevel: educator.educatorLevel,
      },
    });
  } catch (error) {
    console.error("Error during educator registration:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while processing your request',
    }, { status: 500 });
  }
}