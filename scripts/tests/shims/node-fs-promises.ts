export async function readFile(_path: string): Promise<Uint8Array> {
    throw new Error(
        'node:fs/promises.readFile was called in a browser bundle. '
        + 'This code path should not run in the browser.'
    );
}
