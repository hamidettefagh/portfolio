// An empty response for measuring a visitor's round trip to this site's edge.
// The voice latency budget calls it a few times and shows the median.
export const runtime = "edge";

export function GET() {
  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}
