import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import styled, { createGlobalStyle } from "styled-components"
import { BrowserRouter, Switch, Route, withRouter, Link, matchPath } from "react-router-dom"
import { TransitionGroup, CSSTransition } from "react-transition-group"

function preloadImage(url)
{
    var img=new Image()
    img.src=url
}

const LayoutApp = ({ children }) => {
  return (
    <div>
      <ul className="navs-header">
        <li>
          <Link
            to={getPathWithState('/')}
          >Home</Link>
        </li>
        <li>
          <Link
            to={getPathWithState('/content')}
          >Content</Link>
        </li>
      </ul>

      <ul className="navs">
        <li>
          <Link
            to={getPathWithState('/about-us')}
          >About us (1)</Link>
        </li>
      </ul>
      <App/>
    </div>
  )
}

const ContentLevel0 = () => {
  return (
    <div className="content-page-0" style={{ backgroundImage: 'url("/bg-1.png")' }}>
      <ul className="navs-header">
        <li>
          <Link
            to={getPathWithState('/')}
          >Home</Link>
        </li>
        <li>
          <Link
            to={getPathWithState('/content')}
          >Content</Link>
        </li>
      </ul>

      <ul className="navs">
        <li>
          <Link
            to={getPathWithState('/about-us', { transitionName: 'bottom' })}
          >Content Level 1</Link>
        </li>
      </ul>
    </div>
  )
}

const About = () => {
  return (
    <div className="about-page" style={{ backgroundImage: 'url("/bg-2.png")' }}>
      <ul className="navs-header">
        <li>
          <Link
            to={getPathWithState('/')}
          >Home</Link>
        </li>
      </ul>

      <ul className="navs">
        <li>
          <Link
            to={getPathWithState('/about-us-b')}
          >Content Level 2</Link>
        </li>
      </ul>

      <div className="container -show">
        <div className="title">Content Level 2</div>
      </div>
    </div>
  )
}

const AboutB = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 200)
  }, [])

  return (
    <div className="about-page-b" style={{ backgroundImage: 'url("/bg-3.png")' }}>
      <div className={`loading-container ${isLoading? '-show': ''}`}>Loading</div>
      <div className={`container from-bottom ${!isLoading? '-show': ''}`}>
        <div className="title">About US B</div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
    </div>
  )
}

export const routes = [
  { path: '/', exact: true, component: LayoutApp, isRequiredAuth: false, pageLevel: 0, transitionName: 'fade' },
  { path: '/content', exact: true, component: ContentLevel0, isRequiredAuth: false, pageLevel: 0, transitionName: 'fade'},
  { path: '/about-us', exact: true, component: About, isRequiredAuth: false, pageLevel: 1, transitionName: 'fade' },
  { path: '/about-us-b', exact: true, component: AboutB, isRequiredAuth: false, pageLevel: 2, transitionName: 'bottom' },
]

function getPageLevelByPath(path) {
  const matchingRoute = routes.find((route) =>
    matchPath(path, {
      path: route.path,
      exact: route.exact,
    })
  )
  return matchingRoute ? matchingRoute.pageLevel: 0
}

function getPathWithState(path, state = {}) {
  const matchingRoute = routes.find((route) =>
    matchPath(path, {
      path: route.path,
      exact: route.exact,
    })
  )

  return {
    pathname: matchingRoute?.path,
    state: {
      pageLevel: matchingRoute?.pageLevel,
      transitionName: matchingRoute?.transitionName,
      ...state
    }
  }
}

const Content = withRouter(({ location }) => {
  const [prevPageLevel, setPrevPageLevel] = useState(0)
  const [prevPageTransition, setPrevPageTransition] = useState('')

  const pageLevel = location.state?.pageLevel ?? 0
  const isBack = prevPageLevel > pageLevel
  const originTransitionName = location.state?.transitionName ?? 'fade'
  const transitionName = isBack? prevPageTransition: originTransitionName
  const timeout = pageLevel === prevPageLevel? 0: 320

  useEffect(() => {
    setPrevPageLevel(getPageLevelByPath(location.pathname))
    setPrevPageTransition(originTransitionName)

    preloadImage('/bg-1.png')
    preloadImage('/bg-2.png')
    preloadImage('/bg-3.png')
  }, [])

  return (
    <div>
      <TransitionGroup
        childFactory={child => React.cloneElement(
            child,
            {
              classNames: isBack? `${transitionName}-reverse`: transitionName,
              timeout: timeout
            }
          )}
      >
        <CSSTransition
          key={location.key}
          timeout={{ enter: timeout, exit: timeout }}
          classNames={isBack? `${transitionName}-reverse`: transitionName}
          onEntered={() => {
            setPrevPageLevel(pageLevel)
            setPrevPageTransition(originTransitionName)
          }}
        >
          <Switch location={location}>
            {routes.map((route) => (
              <Route
                key={route.path}
                exact={route.exact}
                path={route.path}
              >
                <route.component />
              </Route>
            ))}
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
})

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Content/>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
