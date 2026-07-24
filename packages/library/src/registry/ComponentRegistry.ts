import {ComponentDefinition} from "../ComponentDefinition.js";


export class ComponentRegistry {


private components =
new Map<string,ComponentDefinition>();



register(
component:ComponentDefinition
){

this.components.set(
component.id,
component
);

}



get(id:string){

return this.components.get(id);

}



list(){

return [
...this.components.keys()
];

}


}