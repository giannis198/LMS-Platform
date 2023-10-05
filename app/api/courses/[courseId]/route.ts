import { db } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!values) {
      return new NextResponse("Values are required", { status: 400 });
    }

    if (!params.courseId) {
      return new NextResponse("CourseID is required", { status: 400 });
    }

    const course = await db.course.updateMany({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.courseId) {
      return new NextResponse("CourseID is required", { status: 400 });
    }

    const course = await db.course.findFirst({
      where: {
        id: params.courseId,
        userId: userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Course Not found", { status: 404 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }

    const courseToDelete = await db.course.delete({
      where: {
        userId,
        id: params.courseId,
      },
    });

    return NextResponse.json(courseToDelete);
  } catch (error) {
    console.log("[COURSE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
