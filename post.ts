/**
 * Simple helper script for creating posts in the correct way.
 */

import fs from 'node:fs/promises';
import readline from 'node:readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const date = new Date().toISOString().split('T')[0];

rl.question(`title: `, async title => {
    try {
        const cleaned = title.trim().toLocaleLowerCase().replaceAll(' ', '-');
        const content = `---
layout: post.liquid
title: "${title}"
date: ${date}
---`;
        const path = `./src/posts/${date}-${cleaned}.md`;
        await fs.writeFile(path, content);

        const imgPath = `./src/img/posts/${cleaned}`;
        await fs.mkdir(imgPath);
        console.log('wrote post to:', path);
        console.log('created image path at:', imgPath);
    } catch (err) {
        console.log(err);
    }
    rl.close();
});
