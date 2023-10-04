import { db } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.courseId) {
      return new NextResponse("CourseID is required", { status: 400 });
    }

    if (!params.attachmentId) {
      return new NextResponse("AttachmentID is required", { status: 400 });
    }

    const courseByUserId = await db.course.findFirst({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseByUserId) {
      return new NextResponse("Unauthorized Action", { status: 401 });
    }

    const attachment = await db.attachment.deleteMany({
      where: {
        courseId: params.courseId,
        id: params.attachmentId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("[ATTACHMENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
