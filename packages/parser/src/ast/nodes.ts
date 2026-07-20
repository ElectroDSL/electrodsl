export interface DocumentNode {
  type: "Document";
  version: string;
  project: ProjectNode;
}

export interface ProjectNode {
  type: "Project";
  name: string;
  circuits: [];
}