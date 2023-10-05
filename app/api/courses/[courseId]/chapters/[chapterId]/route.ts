import { db } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.courseId) {
      return new NextResponse("CourseID is required", { status: 400 });
    }

    if (!params.chapterId) {
      return new NextResponse("ChapterID is required", { status: 400 });
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

    const chapter = await db.chapter.findUnique({
      where: {
        courseId: params.courseId,
        id: params.chapterId,
      },
    });

    if (!chapter) {
      return new NextResponse("Chapter is required", { status: 400 });
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    const chapterToDelete = await db.chapter.delete({
      where: {
        id: chapter.id,
        courseId: chapter.courseId,
      },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: chapterToDelete.courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(chapterToDelete);
  } catch (error) {
    console.log("[CHAPTER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!values) {
      return new NextResponse("Values are required", { status: 400 });
    }

    if (!params.courseId) {
      return new NextResponse("CourseID is required", { status: 400 });
    }

    if (!params.chapterId) {
      return new NextResponse("ChapterID is required", { status: 400 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) return redirect("/");

    const chapter = await db.chapter.updateMany({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
