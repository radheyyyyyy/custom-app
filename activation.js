const SHOP = "sattv-store-2004.myshopify.com";
const TOKEN = "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";
const FUNCTION_ID = "71867a88-bec9-cf49-06f4-f725ec628f42cb9a6ed5";

const res = await fetch(`https://${SHOP}/admin/api/2025-01/graphql.json`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": TOKEN,
  },
  body: JSON.stringify({
    query: `mutation {
      cartTransformCreate(functionId: "${FUNCTION_ID}", blockOnFailure: false) {
        cartTransform { id functionId }
        userErrors { field message }
      }
    }`,
  }),
});

console.log(await res.json());
