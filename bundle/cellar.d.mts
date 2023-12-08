declare class Cellar {
    #private;
    get ready(): Promise<void>;
    constructor(uri: string);
    common(fn: string, args: any[]): Promise<any>;
    getItem(key: string): Promise<string>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
}

export { Cellar };
