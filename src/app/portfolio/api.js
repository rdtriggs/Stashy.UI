import localforage from 'localforage'

const NAMESPACE_ASSET = 'ASSET-'

export const fetchAssets = () => {
  return localforage.startsWith(NAMESPACE_ASSET).then((result) => {
    let assets = []
    if (result !== null) {
      for (let key in result) {
        if (result.hasOwnProperty(key)) {
          assets.push(result[key])
        }
      }
    }
    return assets
  }).catch((err) => {
    console.log('An error occurred when trying to fetch assets', err)
  })
}

export const saveAsset = (asset) => {
  return localforage.setItem(NAMESPACE_ASSET + asset.id, asset).then((value) => {
    return value
  }).catch((err) => {
    console.log('An error occurred when trying to add an asset', err)
  })
}

export const deleteAsset = (asset) => {
  return localforage.removeItem(NAMESPACE_ASSET + asset.id).catch((err) => {
    console.log('An error occurred when trying to add an asset', err)
  })
}
