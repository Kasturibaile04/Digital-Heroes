import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => req.cookies.getAll(),
                setAll: (cookies) => {
                    cookies.forEach(({ name, value, options }) => {
                        req.cookies.set({ name, value, ...options });
                        res.cookies.set({ name, value, ...options });
                    });
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = req.nextUrl;

    // Protect dashboard routes — must be logged in
    if (pathname.startsWith("/dashboard")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Sub check temporarily removed for testing / UI viewing
    }

    // Protect admin routes — must be logged in + is_admin
    if (pathname.startsWith("/admin")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", user.id)
            .single();

        if (!profile?.is_admin) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    return res;
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
