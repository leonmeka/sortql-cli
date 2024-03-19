interface TokenSpecItem {
  pattern: RegExp;
  type: string | null;
}

export class TokenSpec implements Iterable<TokenSpecItem> {
  private items: TokenSpecItem[];

  constructor(items: TokenSpecItem[]) {
    this.items = items;
  }

  [Symbol.iterator](): Iterator<TokenSpecItem> {
    return this.items.values();
  }
}
