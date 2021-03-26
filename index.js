#!/usr/bin/env babel-node --stage=0

import { createClient } from 'contentful-management'
require('dotenv').config()

const client = createClient({
  // This is the access token for this space. Normally you get the token in the Contentful web app
  accessToken: process.env.ACCESS_TOKEN,
})

const spaceId = process.env.SPACE_ID;
const environmentId = process.env.ENVIRONMENT_ID;

async function main() {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);
  const assetLinkFields = await findAssetLinkFields(environment);
  await walkAssets(environment, maybeDeleteAsset.bind(null, environment, assetLinkFields));
}

async function findAssetLinkFields(environment) {
  const contentTypes = await environment.getContentTypes();

  return contentTypes.items.reduce((assetLinkFields, items) => {
    assetLinkFields[items.id] = contentTypes.items
      .filter(fieldIsAssetLink)
      .map((field) => field.id);
    return assetLinkFields;
  }, {});
}

function fieldIsAssetLink(field) {
  return (
    (field.type === "Link" && field.linkType === "Asset") ||
    (field.type === "Array" && fieldIsAssetLink(field.items))
  );
}

async function walkAssets(environment, fn) {
  const order = "-sys.createdAt";
  const limit = 1000;

  async function next(skip) {
    const items = await environment.getAssets({ skip, limit, order });
    await Promise.all(items.items.map(fn));
    if (items.length === limit) {
      return next(skip + limit);
    }
  }

  return next(0);
}

async function maybeDeleteAsset(environment, assetLinkFields, asset) {
  const id = asset.sys.id;
  const referencesToAsset = await environment.getEntries({
    links_to_asset: asset.sys.id,
  });

  if (!referencesToAsset.items.length > 0) {
    console.log("\x1b[41m%s\x1b[0m" ,"🗑️  DELETE Asset", id, asset.fields.title);

    // No links to this asset from the selected field, safe to delete
    if (asset.sys.publishedVersion) {
      asset = await asset.unpublish(asset.sys.id);
    }
    await asset.delete(asset.sys.id);
  } else {
    console.log("\x1b[32m%s\x1b[0m" ,"👌 KEEP Asset", id, asset.fields.title);
  }
}

main().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
