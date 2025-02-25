import { Redirect } from 'expo-router';

export default function Home() {
  // Assuming user is authenticated
  // You can add a condition here to check auth status

  return <Redirect href="(tabs)" />;
}
