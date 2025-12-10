import { Node } from "./nodes";
import { Token } from "./token";

export type OptionalToken = Token | null;
export type NodeOrTokenArray = (Node | Token)[];
