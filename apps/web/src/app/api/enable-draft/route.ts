import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug') || '/preview-example';

  // Check the secret and validate it
  if (secret !== process.env.DRAFT_SECRET_TOKEN) {
    return new Response('Invalid token', { status: 401 });
  }

  // Enable Draft Mode
  draftMode().enable();

  // Redirect to the preview page
  redirect(slug);
}