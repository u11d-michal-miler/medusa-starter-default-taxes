import { ITaxProvider } from "@medusajs/framework/types";
import type {
  ItemTaxCalculationLine,
  ShippingTaxCalculationLine,
  TaxCalculationContext,
  ItemTaxLineDTO,
  ShippingTaxLineDTO,
} from "@medusajs/framework/types";

export default class QuantityBasedTaxProvider implements ITaxProvider {
  static identifier = "quantity-based-tax";

  getIdentifier(): string {
    return QuantityBasedTaxProvider.identifier;
  }

  async getTaxLines(
    itemLines: ItemTaxCalculationLine[],
    shippingLines: ShippingTaxCalculationLine[],
    _context: TaxCalculationContext
  ): Promise<(ItemTaxLineDTO | ShippingTaxLineDTO)[]> {
    const taxLines: (ItemTaxLineDTO | ShippingTaxLineDTO)[] = [];

    // Calculate tax for item lines based on quantity
    for (const line of itemLines) {
      const quantity = line.line_item.quantity;
      // 10% tax rate if quantity is 1, 20% if quantity is greater than 1
      const taxRate = quantity === 1 ? 10 : 20;

      taxLines.push({
        rate: taxRate,
        name: `Quantity-Based Tax (${taxRate}%)`,
        code: `QTY_TAX_${taxRate}`,
        line_item_id: line.line_item.id,
        provider_id: this.getIdentifier(),
      });
    }

    // Calculate tax for shipping lines (using 10% as default for shipping)
    for (const line of shippingLines) {
      taxLines.push({
        rate: 10,
        name: "Shipping Tax (10%)",
        code: "SHIPPING_TAX_10",
        shipping_line_id: line.shipping_line.id,
        provider_id: this.getIdentifier(),
      });
    }

    return taxLines;
  }
}
