import fs from "fs";
import path from "path";



import {
    LibraryLoader
}
    from "./LibraryLoader.js";

import {
    ComponentRegistry
}
    from "../registry/ComponentRegistry.js";



export class LibraryScanner {


    constructor(
        private root: string
    ) { }



    scan(
        registry: ComponentRegistry
    ) {


        const loader = new LibraryLoader();



        this.scanFolder(
            this.root,
            registry,
            loader
        );


    }



    private scanFolder(

        folder: string,

        registry: ComponentRegistry,

        loader: LibraryLoader

    ) {


        const items =
            fs.readdirSync(
                folder,
                {
                    withFileTypes: true
                }
            );



        for (const item of items) {


            const fullPath = path.join(folder, item.name  );

            //const fullPath = path.join("packages\\library\\library\\", item.name  );

            if (item.isDirectory()) {


                this.scanFolder(
                    fullPath,
                    registry,
                    loader
                );


            }



            if (
                item.name === "component.json"
            ) {


                const component =
                    loader.load(
                        fullPath
                    );



                registry.register(
                    component
                );


            }


        }


    }


}