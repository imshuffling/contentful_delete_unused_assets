# Delete unused assets

This is an example script for deleting assets that aren't linked in your content model. It does this by walking through all assets and checking for any links back to them.

WARNING: This script does not take into account assets that are only linked inside of Text fields. If you primarily embed images directly using the markdown editor, this will very likely delete assets you depend on.

You must fill in your own CMA access token, space ID & the Environment ID in the .env before runnning.

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

