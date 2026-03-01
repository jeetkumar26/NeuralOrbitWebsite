import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const { firstName, lastName, email, company, teamSize, bottleneck } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Valid email required" }, { status: 400 });
        }

        const { error } = await supabase.from("website_demo_requests").insert({
            first_name: firstName?.trim() || null,
            last_name: lastName?.trim() || null,
            email: email.trim().toLowerCase(),
            company: company?.trim() || null,
            team_size: teamSize || null,
            bottleneck: bottleneck?.trim() || null,
            status: "pending",
        });

        if (error) {
            console.error("Demo request insert error:", error);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Demo route error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
