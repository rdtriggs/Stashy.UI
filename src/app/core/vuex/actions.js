import Vue from 'vue'
import moment from 'moment'
import { fetchTickers, saveTickers } from '../api'

let isBusy = false

export const updateTickers = ({commit}) => {
  if (isBusy) {
    return
  }

  isBusy = true
  Vue.axios.get('https://api.stashy.net/v1/ticker').then((response) => {
    if (!response.data.tickers) {
      return
    }

    commit('UPDATE_TICKERS', response.data)
    saveTickers(response.data)

    isBusy = false
  })
}

export const loadTickers = ({state, commit}) => {
  if (!state.tickers || Object.keys(state.tickers).length === 0) {
    fetchTickers().then((result) => {
      if (result !== null) {
        if (moment(result.cached).add(1, 'minutes').isBefore(moment())) {
          updateTickers({commit})
        }
        else {
          commit('LOAD_TICKERS', result)
        }
      }
      else {
        updateTickers({commit})
      }
    })
  }
}
