import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const onBoardUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        error: "no authenticated user found",
      };
    }
    const { id, firstName, lastName, imageUrl, emailAddresses } = user;
    const userEmail = emailAddresses[0]?.emailAddress || "";
    const fullName =
      firstName && lastName
        ? `${firstName} ${lastName}`
        : firstName || lastName || null;

    // Find existing user by clerkId or email
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ clerkId: id }, { email: userEmail }],
      },
    });

    const newUser = await db.user.upsert({
      where: {
        // Fall back to matching by ID, email, or a dummy string if neither exists
        id: existingUser?.id,
      },
      update: {
        clerkId: id,
        name: fullName,
        image: imageUrl || "",
        email: userEmail,
      },
      create: {
        clerkId: id,
        name: fullName,
        image: imageUrl || "",
        email: userEmail,
      },
    });

    return {
      success: true,
      user: newUser,
      message: "User onboarded successfully",
    };
  } catch (error) {
    console.error("Error onboarding user: ", error);

    return {
      success: false,
      message: "Failed to onboard user",
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }
    const dbUser = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        clerkId: true,
      },
    });
    return dbUser;
  } catch (error) {
    console.log("Error fetching current user", error);

    return null;
  }
};
