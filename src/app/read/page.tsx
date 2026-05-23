import { redirect } from 'next/navigation';

// BUG-002: /read route was returning 404; redirect to canonical /chapters route
export default function ReadPage() {
  redirect('/chapters');
}
