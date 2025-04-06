import * as fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

//writing file using file handler
const fh = await fs.promises.open('test-1.txt', 'w');
console.time('Without Stream');

for(let i = 1; i <= 1000000; i++) {
    await fh.write(Buffer.from(i.toString() + " "));
}

await fh.close();
console.timeEnd('Without Stream');

//writing file with stream
const writeStream = fs.createWriteStream('test-2.txt');
console.time('With Stream');

for(let i = 1; i <= 1000000; i++) {
    writeStream.write(i.toString() + " ");
}
writeStream.close();
console.timeEnd('With Stream');


console.time('Creating GZIP with Stream');
try {
    await pipeline(
        fs.createReadStream('test-2.txt'),
        createGzip(),
        fs.createWriteStream('test-3.gzip')
    );
} catch (error) {
    console.error("Stream pipeline error" + error);
}
console.timeEnd('Creating GZIP with Stream');