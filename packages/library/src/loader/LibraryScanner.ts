import fs from "fs";
import path from "path";

import {
    LibraryLoader
} from "./LibraryLoader.js";

import {
    ComponentRegistry
} from "../registry/ComponentRegistry.js";


export class LibraryScanner {


    constructor(
        private root: string
    ) {}



    scan(
        registry: ComponentRegistry
    ): void {


        const loader =
            new LibraryLoader();


        this.scanFolder(
            this.root,
            registry,
            loader
        );

    }




    private scanFolder(

        folder:string,

        registry:ComponentRegistry,

        loader:LibraryLoader

    ):void {


        const items =
            fs.readdirSync(
                folder,
                {
                    withFileTypes:true
                }
            );



        for(const item of items){


            const fullPath =
                path.join(
                    folder,
                    item.name
                );



            if(item.isDirectory()){


                this.scanFolder(
                    fullPath,
                    registry,
                    loader
                );


                continue;

            }




            //
            // New IEC format
            //
            if(item.name==="component.json"){


                const component =
                    loader.load(
                        fullPath
                    );


                registry.register(
                    component
                );


            }





            //
            // Legacy JSON format
            //
            if(
                item.name.endsWith(".json")
                &&
                item.name!=="component.json"
            ){


                const json =
                    JSON.parse(
                        fs.readFileSync(
                            fullPath,
                            "utf8"
                        )
                    );



                registry.register({

                    id:
                    json.type,


                    name:
                    json.type,


                    category:
                    "legacy",


                    symbol:{
                        file:
                        json.symbol+".svg",

                        width:100,

                        height:100
                    },


                    terminals:
                    json.pins.map(
                        (p:string)=>({

                            id:p,

                            name:p,

                            electricalType:
                            "power",

                            direction:
                            "bidirectional",

                            position:{
                                x:0,
                                y:0
                            }

                        })
                    )

                });


            }

        }

    }

}