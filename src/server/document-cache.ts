import { Parser, SourceDocumentNode } from "../parser";

export class DocumentCache {
  private documents: Record<string, Document> = {};

  public update(uri: string, content: string) {
    this.documents[uri] = new Document(content);
  }

  public get(uri: string) {
    if (!(uri in this.documents)) return null;

    return this.documents[uri];
  }
}

export class Document {
  public ast!: SourceDocumentNode;

  constructor(content: string) {
    const parser = new Parser();
    this.ast = parser.parseSourceDocument(content);
  }
}
