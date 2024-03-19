interface SpecItem {
  pattern: RegExp;
  type: string | null;
}

export class Spec implements Iterable<SpecItem> {
  private items: SpecItem[];

  constructor(items: SpecItem[]) {
    this.items = items;
  }

  [Symbol.iterator](): Iterator<SpecItem> {
    return this.items.values();
  }
}
