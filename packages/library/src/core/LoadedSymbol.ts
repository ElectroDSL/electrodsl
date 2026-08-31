export interface LoadedSymbol {

    id: string;

    svg: string;

    width: number;

    height: number;

    terminals?: Array<{
        id: string;
        name: string;
        position: {
            x: number;
            y: number;
        };
    }>;

}
