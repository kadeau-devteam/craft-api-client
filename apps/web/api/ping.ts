export async function ping(client: CraftClient): Promise<{ ping: boolean }> {
  const query = gql`
      {
          ping
      }
  `;

  return client.query<{ ping: boolean }>(query);
}