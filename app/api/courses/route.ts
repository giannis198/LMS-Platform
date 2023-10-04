import { db } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { title } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const course = await db.course.create({
      data: {
        title,
        userId,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
