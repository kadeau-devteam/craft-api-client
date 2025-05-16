import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  // Disable Draft Mode
  draftMode().disable();

  // Get the redirect path from the query parameters or default to the preview example page
  const { searchParams } = new URL(request.url);
  const redirectPath = searchParams.get('redirect') || '/preview-example';

  // Redirect to the specified path or the preview example page
  redirect(redirectPath);
}