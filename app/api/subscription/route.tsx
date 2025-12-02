import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable, SubscriptionsTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user || !user.primaryEmailAddress?.emailAddress) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const email = user.primaryEmailAddress.emailAddress;

        // Get user subscription
        const userSubscription = await db
            .select()
            .from(SubscriptionsTable)
            .where(eq(SubscriptionsTable.userEmail, email));

        if (userSubscription.length === 0) {
            return NextResponse.json({
                plan: 'free',
                status: 'inactive',
                features: getFreeFeatures()
            });
        }

        return NextResponse.json(userSubscription[0]);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user || !user.primaryEmailAddress?.emailAddress) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { plan, clerkSubscriptionId } = await req.json();
        const email = user.primaryEmailAddress.emailAddress;

        // Check if subscription exists
        const existingSubscription = await db
            .select()
            .from(SubscriptionsTable)
            .where(eq(SubscriptionsTable.userEmail, email));

        if (existingSubscription.length > 0) {
            // Update existing subscription
            await db
                .update(SubscriptionsTable)
                .set({
                    plan,
                    status: 'active',
                    clerkSubscriptionId,
                    updatedAt: new Date().toString(),
                    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toString(),
                })
                .where(eq(SubscriptionsTable.userEmail, email));
        } else {
            // Create new subscription
            await db.insert(SubscriptionsTable).values({
                userEmail: email,
                plan,
                status: 'active',
                clerkSubscriptionId,
                currentPeriodStart: new Date().toString(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toString(),
            });
        }

        // Update user subscription status
        await db
            .update(usersTable)
            .set({
                subscriptionPlan: plan,
                subscriptionStatus: 'active',
                subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toString(),
            })
            .where(eq(usersTable.email, email));

        return NextResponse.json({ success: true, plan });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Server error" },
            { status: 500 }
        );
    }
}

function getFreeFeatures() {
    return {
        aiChats: 5,
        resumeAnalysis: 1,
        roadmapGenerations: 0,
    };
}

function getPremiumFeatures() {
    return {
        aiChats: 'unlimited',
        resumeAnalysis: 'unlimited',
        roadmapGenerations: 'unlimited',
        prioritySupport: true,
    };
}
