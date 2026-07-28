export interface ComponentIntent {

    id:string;

    type:string;

    description:string;

    category:
      | "source"
      | "protection"
      | "switching"
      | "load"
      | "control";

    properties?:Record<string,string>;

}