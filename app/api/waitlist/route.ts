import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const { email, company, role } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Valid email required" }, { status: 400 });
        }

        const { error } = await supabase.from("website_waitlist").insert({
            email: email.trim().toLowerCase(),
            company: company?.trim() || null,
            role: role?.trim() || null,
            source: "waitlist_modal",
        });

        if (error) {
            // Unique constraint = already signed up
            if (error.code === "23505") {
                return NextResponse.json({ error: "Already on waitlist" }, { status: 409 });
            }
            console.error("Waitlist insert error:", error);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Waitlist route error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
