
import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('tasks.csv', import.meta.url);

(async () => {
    try {
        // o código abaixo não utiliza Stream
        // const dataCSV = await fs.readFile(csvPath, 'utf-8')
        // const records = parse(dataCSV, {
        //     fromLine: 2
        // })

        // o código abaixo utiliza Stream
        const stream = fs.createReadStream(csvPath);
        const csvParse = parse({
            fromLine: 2
        });
        const records = stream.pipe(csvParse);

        console.log('start');
        for await (const record of records) {
            const [title, description] = record
            
            console.log(title, description)

            await fetch('http://localhost:3333/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                }),
            })
        }
        console.log('...done');

    } catch(e) {
        console.log(e)
    }
})();






