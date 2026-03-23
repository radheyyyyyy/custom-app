
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  // Check if Cart Transform is already activated
  const res = await admin.graphql(`
    #graphql
    query {
      cartTransforms(first: 1) {
        nodes { id }
      }
    }
  `);
  const { data } = await res.json();
  const isActivated = data.cartTransforms.nodes.length > 0;

  return { isActivated };
};

export default function AppHome() {
  const { isActivated } = useLoaderData();

  return (
    <s-page heading="Welcome to Cart Attribute App ">
      {isActivated ? (
        <s-banner tone="success">
          App is active — cart attributes are being applied automatically.
        </s-banner>
      ) : (
        <s-banner tone="warning">
          App is not yet activated. Please reinstall or contact support.
        </s-banner>
      )}
      <s-section heading="What does this app do?">
        <s-text>
          This app automatically stamps custom attributes on cart line items
          based on your product tags.
        </s-text>
      </s-section>
      <s-section heading="How it works">
        <s-box>
          <s-text>
            1. Tag any product with <strong>final sale</strong> in Shopify Admin
          </s-text>
        </s-box>
        <s-box>
          <s-text>
            2.  Customer adds the product to cart and proceeds to checkout
          </s-text>
        </s-box>
        <s-box>
          <s-text>
            3. App automatically stamps <strong>_final_sale: yes</strong> on the line item
          </s-text>
        </s-box>
        <s-box>
          <s-text>
            4.  Attribute appears in your order data — hidden from customer view
          </s-text>
        </s-box>
      </s-section>
      <s-section heading="Supported Tags">
        <s-box>
          <s-text><strong>final sale</strong> → stamps final sale: yes</s-text>
        </s-box>
      </s-section>

    </s-page>
  );
}
