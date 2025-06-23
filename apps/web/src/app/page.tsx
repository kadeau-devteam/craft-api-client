
import {ping} from "@/api/ping";

export default async function Home() {

  // Use a direct GraphQL query to test the connection to the Craft CMS API
  const pingResult = ping();

  return (
    <main>
      <h1>Example of using GraphQL queries in Next.js</h1>

      <h2>Ping Result:</h2>
      <pre>{JSON.stringify(pingResult, null, 2)}</pre>
    </main>
  );
}
