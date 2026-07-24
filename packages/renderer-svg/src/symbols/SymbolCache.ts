export class SymbolCache {

    private cache =
        new Map<string,string>();


    get(
        key:string
    ):string | undefined {

        return this.cache.get(key);

    }


    set(
        key:string,
        value:string
    ):void {

        this.cache.set(
            key,
            value
        );

    }

}


export const symbolCache =
    new SymbolCache();