# Micro Frontend Upload GitHub Action

This GitHub Action helps you upload micro frontend packages to a Micro Frontend Orchestrator Hub. It packages your micro frontend into a zip file and uploads it to the specified endpoint with versioning support.

## Features

- Automatically zips your micro frontend directory
- Handles versioned deployments
- Provides clear error messages for troubleshooting
- Supports custom domains for the Micro Frontend Orchestrator Hub

## Inputs

### `apikey`
**Required** API key for authenticating with the Micro Frontend Orchestrator Hub.

### `microfrontend-slug`
**Required** The unique identifier (slug) for your micro frontend in the hub.

### `domain`
**Required** The base URL of your Micro Frontend Orchestrator Hub (e.g., https://your-hub.example.com).

### `file-path`
**Required** Path to the directory containing your micro frontend build files.

### `version`
**Required** Version number for this deployment (e.g., 1.0.0).

## Example Usage

```yaml
name: Deploy Micro Frontend

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Micro Frontend
      run: |
        npm install
        npm run build
        
    - name: Upload to Micro Frontend Hub
      uses: mfe-orchestrator-hub/github-action@0.0.5
      with:
        apikey: ${{ secrets.MICROFRONTEND_API_KEY }}
        microfrontend-slug: 'your-microfrontend'
        domain: 'https://your-hub.example.com'
        file-path: './build'
        version: '1.0.0'
```

## Error Handling

The action will fail with a descriptive error message if:
- The API key is invalid
- The micro frontend slug doesn't exist
- The upload fails for any reason
- The specified file path doesn't exist

## Development

### Prerequisites
- Node.js 14+
- npm or yarn

### Building

```bash
npm install
npm run build
```

### Testing

```bash
npm test
```

## License

This project is licensed under the [MIT License](LICENSE).
