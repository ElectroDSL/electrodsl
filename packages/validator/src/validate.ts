import { DocumentNode } from "@electrodsl/ast";


export function validate(
    document: DocumentNode
){

    const errors:string[]=[];


    for(const circuit of document.project.circuits){

        const ids =
            circuit.components.map(
                c=>c.id
            );


        for(const connection of circuit.connections){

            if(!ids.includes(connection.from.component)){

                errors.push(
                    `Unknown component ${connection.from.component}`
                );

            }


            if(!ids.includes(connection.to.component)){

                errors.push(
                    `Unknown component ${connection.to.component}`
                );

            }

        }

    }


    return errors;

}