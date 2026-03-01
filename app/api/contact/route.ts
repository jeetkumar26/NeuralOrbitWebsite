import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const { name, email, subject, message } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Valid email required" }, { status: 400 });
        }

        if (!message || message.trim().length < 10) {
            return NextResponse.json({ error: "Message too short" }, { status: 400 });
        }

        const { error } = await supabase.from("website_contact").insert({
            name: name?.trim() || null,
            email: email.trim().toLowerCase(),
            subject: subject || "General Inquiry",
            message: message.trim(),
            status: "unread",
        });

        if (error) {
            console.error("Contact insert error:", error);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Contact route error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
