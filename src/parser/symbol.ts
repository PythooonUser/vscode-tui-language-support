import { Token } from "./token";

export class Symbol {
  public name: Token | string;

  public constructor(name: Token | string) {
    this.name = name;
  }
}
