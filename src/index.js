import React from 'react'
import thunk from 'redux-thunk'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import Head from './components/Head'
import App from './containers/App'
import Collections from './containers/Collections'
import CreateTopic from './containers/CreateTopic'
import Detail from './containers/Detail'
import Message from './containers/Message'
import UserInfo from './containers/UserInfo'
import reducer from './reducers'

import 'antd/dist/antd.css'

const store = createStore(
    reducer,
    applyMiddleware(thunk)
)

render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Head} >
                <IndexRoute component={App}/>
                <Route path="/page(/:pageNum)" component={App} />
                <Route path="/category/:categorySlug(/:pageNum)" component={App} />
            </Route>
            <Route path="/collect/:loginname" component={Collections} />
            <Route path="/topic/:id" component={Detail} />
            <Route path="/user/:loginname" component={UserInfo} />
            <Route path="/message" component={Message} />
            <Route path="/createtopic(/:topicId)" component={CreateTopic} />
        </Router>
    </Provider>,
    document.getElementById('root')
)