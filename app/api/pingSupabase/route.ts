/*eslint-disable @typescript-eslint/no-unused-vars*/
export async function GET() {
  try {
    const ping = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/pingSupabse`,
      {
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
      },
    );

    if (!ping.ok) {
      throw new Error("Ping failed");
    }

    return new Response(
      JSON.stringify({ message: "Supabase pinged successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error pinging Supabase:", error);
    return new Response(JSON.stringify({ error: "Failed to ping Supabase" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
