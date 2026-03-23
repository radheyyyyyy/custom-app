

import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
// Loader: runs on the server before rendering the page
export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `
    query ListBundles($first: Int!, $after: String) {
      products(first: $first, after: $after, query: "bundles:true", sortKey: ID) {
        edges {
          cursor
          node {
            id
            title
            status
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
    `,
    {
      variables: {
        first: 20,
        after: null,
      },
    }
  );

  const { data } = await response.json();

  const edges = data?.products?.edges ?? [];

  const bundles = edges.map((edge) => edge.node);

  return {
    bundles,
    pageInfo: data?.products?.pageInfo ?? { hasNextPage: false },
  };
}
export default function BundlesPage() {
  const { bundles } = useLoaderData();

  return (
    <s-page heading="Bundles">
      <s-section heading="All Bundles">
        {bundles.length === 0 ? (
          <s-text>No bundles found.</s-text>
        ) : (
          <s-stack direction="vertical" gap="base">
            {bundles.map((bundle) => (
              <s-box key={bundle.id} padding="base" border="base">
                <s-stack direction="horizontal" align="center" gap="base">
                  <s-text emphasis="bold">{bundle.title}</s-text>
                  <s-badge>{bundle.status}</s-badge>
                </s-stack>
                <s-text size="small">{bundle.id}</s-text>
              </s-box>
            ))}
          </s-stack>
        )}
      </s-section>
    </s-page>
  );
}