import core from '@actions/core';
import fetch from 'node-fetch';
import fs from 'fs';
import AdmZip from 'adm-zip';
import path from 'path';
import FormData from 'form-data';

async function run() {
  try {
    const apikey = core.getInput('apikey', { required: true, trimWhitespace: true});
    const microfrontendSlug = core.getInput('microfrontend-slug', { required: true, trimWhitespace: true});
    const domain = core.getInput('domain', { required: false, trimWhitespace: true}).replace(/\/$/, '');
    const filePath = core.getInput('file-path', { required: true, trimWhitespace: true});
    const version = core.getInput('version', { required: true, trimWhitespace: true});

    // 1. Creates the Zip
    const zip = new AdmZip();
    zip.addLocalFolder(filePath);
    const zipPath = path.join(process.cwd(), `${microfrontendSlug}-${version}.zip`);
    zip.writeZip(zipPath);
    core.info(`Zipped file: ${zipPath}`);

    // 2. Upload
    const url = `${domain}/api/microfrontends/by-slug/${microfrontendSlug}/upload/${version}?apiKey=${apikey}`;
    core.info(`Uploading zipped file`);

    // Read file as buffer
    const fileBuffer = fs.readFileSync(zipPath);
    
    // Create FormData
    const form = new FormData();
    form.append('file', fileBuffer, {
      filename: `${microfrontendSlug}-${version}.zip`,
      contentType: 'application/zip'
    });

    // Send request with FormData
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...form.getHeaders(),
        'Accept': 'application/json'
      },
      body: form,
      duplex: 'half'
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Upload failed: ${response.status} ${text}`);
    }

    core.info(`Upload completed`);

    core.setOutput('response', response);
    return response
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
