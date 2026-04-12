/**
 * Shopping Cart Unit Tests
 * =========================
 * Generated with qa/unit-test skill
 * 
 * Prompt: "Write Jest unit tests for a shopping cart module
 *          with add, remove, clear, and calculateTotal functions.
 *          Cart should handle quantity updates and apply discounts."
 */

// Types
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Discount {
  code: string;
  percentage: number;
}

// Mock Cart implementation (replace with actual import)
class ShoppingCart {
  private items: CartItem[] = [];
  private discount: Discount | null = null;

  addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1): void {
    const existingItem = this.items.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ ...item, quantity });
    }
  }

  removeItem(itemId: string): void {
    this.items = this.items.filter((i) => i.id !== itemId);
  }

  updateQuantity(itemId: string, quantity: number): void {
    const item = this.items.find((i) => i.id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  clear(): void {
    this.items = [];
    this.discount = null;
  }

  applyDiscount(code: string, percentage: number): void {
    this.discount = { code, percentage };
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  calculateSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  calculateTotal(): number {
    const subtotal = this.calculateSubtotal();
    if (this.discount) {
      return subtotal * (1 - this.discount.percentage / 100);
    }
    return subtotal;
  }
}

// =============================================================================
// TESTS
// =============================================================================

describe('ShoppingCart', () => {
  let cart: ShoppingCart;

  beforeEach(() => {
    cart = new ShoppingCart();
  });

  // ---------------------------------------------------------------------------
  // Happy Path Tests
  // ---------------------------------------------------------------------------

  describe('addItem', () => {
    it('should add a new item to empty cart', () => {
      const item = { id: '1', name: 'Widget', price: 10.00 };
      
      cart.addItem(item);
      
      const items = cart.getItems();
      expect(items).toHaveLength(1);
      expect(items[0]).toEqual({ ...item, quantity: 1 });
    });

    it('should add item with specified quantity', () => {
      const item = { id: '1', name: 'Widget', price: 10.00 };
      
      cart.addItem(item, 3);
      
      expect(cart.getItems()[0].quantity).toBe(3);
    });

    it('should increment quantity when adding existing item', () => {
      const item = { id: '1', name: 'Widget', price: 10.00 };
      
      cart.addItem(item, 2);
      cart.addItem(item, 3);
      
      const items = cart.getItems();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(5);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      cart.addItem({ id: '1', name: 'Widget', price: 10.00 });
      cart.addItem({ id: '2', name: 'Gadget', price: 20.00 });
      
      cart.removeItem('1');
      
      const items = cart.getItems();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe('2');
    });

    it('should do nothing when removing non-existent item', () => {
      cart.addItem({ id: '1', name: 'Widget', price: 10.00 });
      
      cart.removeItem('999');
      
      expect(cart.getItems()).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity of existing item', () => {
      cart.addItem({ id: '1', name: 'Widget', price: 10.00 }, 2);
      
      cart.updateQuantity('1', 5);
      
      expect(cart.getItems()[0].quantity).toBe(5);
    });

    it('should remove item when quantity is set to zero', () => {
      cart.addItem({ id: '1', name: 'Widget', price: 10.00 }, 2);
      
      cart.updateQuantity('1', 0);
      
      expect(cart.getItems()).toHaveLength(0);
    });

    it('should remove item when quantity is negative', () => {
      cart.addItem({ id: '1', name: 'Widget', price: 10.00 }, 2);
      
      cart.updateQuantity('1', -1);
      
      expect(cart.getItems()).toHaveLength(0);
    });
  });

  describe('clear', () => {
    it('should remove all items from cart', () => {
      cart.addItem({ id: '1', name: 'Widget', price: 10.00 });
      cart.addItem({ id: '2', name: 'Gadget', price: 20.00 });
      
      cart.clear();
      
      expect(cart.getItems()).toHaveLength(0);
    });

    it('should clear discount when clearing cart', () => {
      cart.addItem({ id: '1', name: 'Widget', price: 100.00 });
      cart.applyDiscount('SAVE10', 10);
      
      cart.clear();
      cart.addItem({ id: '1', name: 'Widget', price: 100.00 });
      
      expect(cart.calculateTotal()).toBe(100.00);
    });
  });

  describe('calculateTotal', () => {
    it('should return 0 for empty cart', () => {
      expect(cart.calculateTotal()).toBe(0);
    });

    it('should calculate total for single item', () => {
      cart.addItem({ id: '1', name: 'Widget', price: 10.00 }, 3);
      
      expect(cart.calculateTotal()).toBe(30.00);
    });

    it('should calculate total for multiple items', () => {
      cart.addItem({ id: '1', name: 'Widget', price: 10.00 }, 2);
      cart.addItem({ id: '2', name: 'Gadget', price: 15.00 }, 3);
      
      expect(cart.calculateTotal()).toBe(65.00);
    });

    it('should apply discount to total', () => {
      cart.addItem({ id: '1', name: 'Widget', price: 100.00 });
      cart.applyDiscount('SAVE10', 10);
      
      expect(cart.calculateTotal()).toBe(90.00);
    });
  });

  // ---------------------------------------------------------------------------
  // Boundary Value Tests
  // ---------------------------------------------------------------------------

  describe('boundary values', () => {
    it('should handle item with price of 0', () => {
      cart.addItem({ id: '1', name: 'Free Item', price: 0 });
      
      expect(cart.calculateTotal()).toBe(0);
    });

    it('should handle very small prices', () => {
      cart.addItem({ id: '1', name: 'Cheap Item', price: 0.01 });
      
      expect(cart.calculateTotal()).toBe(0.01);
    });

    it('should handle large quantities', () => {
      cart.addItem({ id: '1', name: 'Widget', price: 1.00 }, 10000);
      
      expect(cart.calculateTotal()).toBe(10000.00);
    });

    it('should handle 100% discount', () => {
      cart.addItem({ id: '1', name: 'Widget', price: 100.00 });
      cart.applyDiscount('FREE', 100);
      
      expect(cart.calculateTotal()).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // Edge Cases
  // ---------------------------------------------------------------------------

  describe('edge cases', () => {
    it('should handle adding same item multiple times', () => {
      const item = { id: '1', name: 'Widget', price: 10.00 };
      
      cart.addItem(item);
      cart.addItem(item);
      cart.addItem(item);
      
      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getItems()[0].quantity).toBe(3);
    });

    it('should handle decimal prices correctly', () => {
      cart.addItem({ id: '1', name: 'Widget', price: 9.99 }, 3);
      
      expect(cart.calculateTotal()).toBeCloseTo(29.97, 2);
    });

    it('should return copy of items array (not reference)', () => {
      cart.addItem({ id: '1', name: 'Widget', price: 10.00 });
      const items = cart.getItems();
      
      items.push({ id: '2', name: 'Fake', price: 0, quantity: 1 });
      
      expect(cart.getItems()).toHaveLength(1);
    });
  });
});
