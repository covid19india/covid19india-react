declare class Denque<T = any> {
  constructor();
  constructor(array: T[]);

  push(item: T): number;
  unshift(item: T): number;
  pop(): T | undefined;
  removeBack(): T | undefined;
  shift(): T | undefined;
  peekBack(): T | undefined;
  peekFront(): T | undefined;
  peekAt(index: number): T | undefined;
  get(index: number): T | undefined;
  remove(index: number, count: number): T[];
  removeOne(index: number): T | undefined;
  splice(index: number, count: number, ...item: T[]): T[] | undefined;
  isEmpty(): boolean;
  clear(): void;

  toString(): string;
  toArray(): T[];

  length: number;
}

export = Denque;
