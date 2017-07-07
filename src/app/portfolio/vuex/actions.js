import { fetchAssets, saveAsset, deleteAsset } from '../api'

export const addAsset = ({commit}, asset) => {
  commit('ADD_ASSET', asset)
  if (asset.amount > 0) {
    saveAsset(asset)
  }
  else {
    deleteAsset(asset)
  }
}

export const loadAssets = ({state, commit}) => {
  if (!state.assets || Object.keys(state.assets).length === 0) {
    fetchAssets().then((result) => {
      if (result !== null) {
        commit('LOAD_ASSETS', result)
      }
    })
  }
}
