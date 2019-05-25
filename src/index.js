import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

let model = {
    running: false,
    time: 110
};

let intents = {
    TICK: 'TICK',
    START: 'START',
    STOP: 'STOP',
    RESET: 'RESET',

}
const view = (model) => { 
    console.log(model);
    
    let minutes = Math.floor(model.time / 60 );
    let seconds = model.time - (minutes * 60);
    let secondsFormatted = `${seconds < 10 ? '0' : ''}${seconds}`;
    let handler = (event) => {
        container.dispatch(model.running ? 'STOP' : 'START');
    }
    return <div>
    <p>{minutes}:{secondsFormatted}</p>
    <button onClick={handler} >{model.running ? 'Stop': 'Start'}</button>
    </div>
}

const update = (model = { running: false, time: 0 } , intent) => {
    const updates = {
        'START': (model) => Object.assign(model, {running: true}),
        'STOP': (model) => Object.assign(model, {running: false}),
        'TICK':  (model) => Object.assign(model, {time: model.time + (model.running ? 1 : 0 )})
    };
    return updates[intent](model);
}
const createStore = (reducer) => {
    let internalState;
    let handlers = []; // array of handlers
    return {
        dispatch: (intent) => {
           internalState = reducer(internalState, intent);
           console.log(handlers);
           
           handlers.forEach(handler => {handler(); }); // call each handler
        },
        subscribe: (handler) => {
            handlers.push(handler);
        },
        getState: () => internalState
    };
};

let container = createStore(update);

const render = () => {
    ReactDOM.render(view(container.getState()), 
        document.getElementById('root')
    );
};

container.subscribe(render);

let timer = 1000; // 1 second, 1 milliseconds
setInterval(() => {
    container.dispatch('TICK');
}, timer)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
