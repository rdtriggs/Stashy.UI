import * as components from './components'

export default [
  {
    path: '/',
    redirect: 'portfolio'
  },
  {
    path: '*',
    component: components.Error404
  }
]
