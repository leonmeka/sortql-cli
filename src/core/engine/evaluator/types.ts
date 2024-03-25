export interface Properties {
  name: string;
  extension: string;
  size: number;
  content: string;
  created: Date;
  modified: Date;
  accessed: Date;
}

export type PropertyKey = keyof Properties;
