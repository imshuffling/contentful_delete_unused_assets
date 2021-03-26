# Delete unused assets

## Credit
Huge thanks to https://github.com/grncdr for his initial work on this. This version has been updated to use the latest version of the API (Currently 7.13.0) to support allow support for adjusting the environment ID.

## Usage
```
# Add .env file with access credentials
ACCESS_TOKEN=XXXX
SPACE_ID=XXXX
ENVIRONMENT_ID=XXXX

npm install && npm run cleanup-assets
```

