import core from '@actions/core';
import fetch from 'node-fetch';
import fs from 'fs';
import AdmZip from 'adm-zip';
import path from 'path';

async function run() {
  try {
    const apikey = core.getInput('apikey');
    const microfrontendSlug = core.getInput('microfrontend-slug');
    const domain = core.getInput('domain').replace(/\/$/, '');
    const filePath = core.getInput('file-path');
    const version = core.getInput('version');

    // 1. Creates the Zip
    const zip = new AdmZip();
    zip.addLocalFolder(filePath);
    const zipPath = path.join(process.cwd(), `${microfrontendSlug}-${version}.zip`);
    zip.writeZip(zipPath);
    core.info(`Zipped folder: ${zipPath}`);

    // 2. Upload
    const url = `${domain}/api/microfrontends/by-slug/${microfrontendSlug}/upload/${version}?apiKey=${apikey}`;
    core.info(`Uploading to ${url}...`);

    const stats = fs.statSync(zipPath);
    const fileStream = fs.createReadStream(zipPath);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Length': stats.size
      },
      body: fileStream
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Upload failed: ${response.status} ${text}`);
    }

    core.info(`Upload completed: ${await response.text()}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
