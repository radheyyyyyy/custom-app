
import { authenticate } from "../shopify.server";
import { useActionData, useSubmit } from "react-router";

// ✅ action handles POST — correct for mutations
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const res = await admin.graphql(`
    #graphql
    mutation {
      cartTransformCreate(functionHandle: "cart-attribute-function") {
        cartTransform {
          id
          functionId
        }
        userErrors {
          field
          message
        }
      }
    }
  `);

  const { data } = await res.json();
  console.log(data)
  return {data};
};

export default function Activate() {
  const actionData = useActionData();
    const submit=useSubmit();
  return (
    <s-page>
     
        <s-button variant="primary" onClick={()=>{submit({method:'post'})}}>Activate Cart Transform</s-button>
      {/* Shows response after submit */}
      {actionData && <pre>{JSON.stringify(actionData, null, 2)}</pre>}
    </s-page>
  );
}