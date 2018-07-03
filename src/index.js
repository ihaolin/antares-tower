import ReactDOM from 'react-dom'
import React from 'react'
import App from './App'

ReactDOM.render(
  <App/>,
  document.getElementById('app')
)

/*
const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    document.getElementById('app')
  )
}

render(app)

if (module.hot) {
  module.hot.accept('./app', () => { render(app) })
}
*/