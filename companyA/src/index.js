import React from 'react'
import ReactDOM from 'react-dom'

import Root from './components/Root'
import store from './store'
import './index.css'

ReactDOM.render(<Root store={store} />, document.getElementById('root'))
