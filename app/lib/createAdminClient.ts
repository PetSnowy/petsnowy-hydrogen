type AdminResponse = any | null;

type AdminAPIResponse = {
  errors: Error[] | null;
  data: object | null;
};

export type AdminClient = (
  query: string | null,
  options: {variables: object | null},
) => Promise<AdminResponse>;

export function createAdminClient({
  adminApiVersion,
  privateAdminToken,
  storeDomain,
}: {
  adminApiVersion: string;
  privateAdminToken: string;
  storeDomain: string;
}) {
  console.log(storeDomain, adminApiVersion, privateAdminToken);

  const admin: AdminClient = async function (
    query: string | null,
    {
      variables = {},
    }: {
      variables: object | null;
    },
  ): Promise<AdminResponse> {
    if (!query) {
      throw new Error('Must provide a `query` to the admin client');
    }

    const endpoint = `${storeDomain}/admin/api/${adminApiVersion}/graphql.json`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': privateAdminToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    };

    const request = await fetch(endpoint, options);

    if (!request.ok) {
      throw new Error(
        `graphql api request not ok ${request.status} ${request.statusText}`,
      );
    }

    const response = (await request.json()) as AdminAPIResponse;
    if (response?.errors?.length) {
      throw new Error(response.errors[0].message);
    }
    return response.data;
  };

  return {admin};
}
