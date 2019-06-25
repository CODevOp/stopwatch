import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux'
import { connect, Provider } from 'react-redux';

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

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch){
    return {
        onStart: () => { dispatch({type: 'START'}); } ,
        onStop: () => { dispatch({type: 'STOP'}); } ,
    };
}

const StopWatch = connect(mapStateToProps, mapDispatchToProps)((props) => { 
    console.log(props);
    
    let minutes = Math.floor(props.time / 60 );
    let seconds = props.time - (minutes * 60);
    let secondsFormatted = `${seconds < 10 ? '0' : ''}${seconds}`;

    return <div>
    <p>{minutes}:{secondsFormatted}</p>
    <button onClick={props.running ? props.onStop : props.onStart} >{props.running ? 'Stop': 'Start'}</button>
    </div>
});

const update = (model = { running: false, time: 0 } , action) => {
    const updates = {
        'START': (model) => Object.assign({}, model, {running: true}),
        'STOP': (model) => Object.assign({}, model, {running: false}),
        'TICK':  (model) => Object.assign({}, model, {time: model.time + (model.running ? 1 : 0 )})
    };
    return  (updates[action.type] || (() => model))(model);
}

let container = createStore(update);

ReactDOM.render(
    <Provider store={container}>
        <StopWatch />
    </  Provider>
    , 
    document.getElementById('root')
);


let timer = 1000; // 1 second, 1 milliseconds
setInterval(() => {
    container.dispatch({type: 'TICK'});
}, timer)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
