export default{
  ADD_ASSET (state, data) {
    let index = state.assets.findIndex(e => e.id === data.id)

    if (index === -1) {
      if (data.amount === 0) {
        return
      }

      state.assets.push(data)
    }
    else {
      if (data.amount === 0) {
        state.assets.splice(index, 1)
        return
      }

      state.assets[index].amount = data.amount
    }
  },
  LOAD_ASSETS (state, data) {
    state.assets = data
  }
}
