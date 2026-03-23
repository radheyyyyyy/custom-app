// @ts-check

/**
 * @typedef {import("../generated/api").CartTransformRunInput} CartTransformRunInput
 * @typedef {import("../generated/api").CartTransformRunResult} CartTransformRunResult
 */

/**
 * @type {CartTransformRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {CartTransformRunInput} input
 * @returns {CartTransformRunResult}
 */

export function cartTransformRun(input) {
  const operations = [];

  for (const line of input.cart.lines) {
    const merchandise = line.merchandise;

    // Skip non-product lines (e.g. custom items)
    if (!merchandise?.id) continue;

    const isFinalSale = merchandise.product?.hasAnyTag ?? false;

    // Skip if attribute already stamped
    const alreadyTagged = line.attribute?.value === "yes";

    if (!isFinalSale || alreadyTagged) continue;

    operations.push({
      lineExpand: {
        cartLineId: line.id,
        expandedCartItems: [
          {
            merchandiseId: merchandise.id,  
            quantity: line.quantity,         
            attributes: [
              { key: "_final _sale", value: "yes" }
            ]
          }
        ]
      }
    });
  }

  return { operations };
}