import React from 'react';
import './App.css';
import { Provider } from 'react-redux'
import { store
    //    persistor
} from './store'
import Helpers from './help_component'
import Routes from './routes'
import './assets/font-awsome'
const App = ()=> {
    // const a_ratio = window.innerWidth / window.innerHeight * .8
    return (
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
          <section>
            <div className="no-printing">
              <Routes />
            </div>
            <Helpers />
          </section>
        {/* </PersistGate> */}
      </Provider>
    );
}

export default App
