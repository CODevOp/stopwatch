# React Timer
The design and code for this timer application come from the Pluralsight course React Fundamentals. The plan is to create 3 branches to make modifications to this timer. The master branch will have state container manually built with react and javascript. The second branch will use Redux state container. The third branch will convert the timer from Redux state container to a Reac-redux container.

React using a MVI architecture. Model View Intent (MVI), which is similar to MVC. MVI helps flush out purpose of functionality. 

## References
* [React Fundamentals](https://app.pluralsight.com/library/courses/react-fundamentals-update/table-of-contents)
* [Redux](https://redux.js.org/)
* [React-redux](https://react-redux.js.org/)
* Create local branch and push to remote [stackoverflow](https://stackoverflow.com/questions/1519006/how-do-you-create-a-remote-git-branch)

## Commands and Code
* [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) method from Javascript.
    ```Javascript
        setInterval(() => {
        model = update(model, 'TICK');
        console.log(model.time);
        render();
    }, 1000)
    ```
    1. setInterval takes a function and a interval in milliseconds.
* Create a new branch
    ```JavaScript

   // create a new branch
   git branch StateContainer
   
   // start using the new branch
   git checkout StateContainer
   
   // create the new branch on remote
   git push -u origin  StateContainer
    ```

* Modify application to use state container
    ```Javascript
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const view = (model) => { 
        let minutes = Math.floor(model.time / 60 );
        let seconds = model.time - (minutes * 60);
        let secondsFormatted = `${seconds < 10 ? '0' : ''}${seconds}`;
        let handler = (event) => { // *9 
            container.dispatch(model.running ? 'STOP' : 'START'); // change to dispatch on container
        }
        return <div>
        <p>{minutes}:{secondsFormatted}</p>
        <button onClick={handler} >{model.running ? 'Stop': 'Start'}</button>
        </div>
    }

    const update = (model = { running: false, time: 0 } , intent) => { // *4 
        const updates = {
            'START': (model) => Object.assign(model, {running: true}),
            'STOP': (model) => Object.assign(model, {running: false}),
            'TICK':  (model) => Object.assign(model, {time: model.time + (model.running ? 1 : 0 )})
        };
        return updates[intent](model);
    }

    let container = {} // empty container

    const render = () => {
        ReactDOM.render(view(container.getState()), // *6 call to getState
            document.getElementById('root')
        );
    };

    container.subscribe(render); // * 3 call to subscribe & *10

    setInterval(() => {
        container.dispatch('TICK'); // *2 call to dispatch & *7 pass in intent  & *8 
    }, 1000)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ```
    1.  state will have 3 methods, getState, dispatch, and subscribe.
    2.  dispatch applies an intent to application state
    3.  subscribe registers the callback and is called when the application state changes
    4.  update, change model to pass in an initial state to the model
    5.  create state container as an empty object
    6.  change render function, the view will call the state container getState().
    7.  The setInterval timer will dispatch intents to the container.
    8.  setInterval will no longer call render, the state container will control and track the communication through subscribe.
    9.  change the timer handler function to call the container dispatch method to togger 'START' or 'STOP' on a timer. 
    10. change the render method calls from directly calling render to calling render through the state container by calling a subscibe on the container.

* Create state container 
    ```Javascript
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

    ```
    1. container will call new function createStore.
    2. new function createStore() will receive a reducer
    3. createStore() will return state object with the 3 methods dispatch(), subscribe() and getState().
    4. dispatch() will update the state. Everytime the timer ticks, dispatch is called updating state and updating each of the hanlders. The onClick event of the the Start/Stop button will call dispatch() to change the state of the running variable, toggling between Start and Stop.
    5. Callbacks are registered with subscibe(). Each callback function will be called when the staet and an intent is passed into dispatch().
    6. The handler functions will call getstate() to update the controls, objects or events.

* Implement a Redux Application State Container
* Install
   
    ```Javascript
    // * 6
    npm install redux 
    ```
* Use Redux
    ```Javascript
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    import { createStore } from 'redux'
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const update = (model = { running: false, time: 0 } , action) => {
        const updates = {
            'START': (model) => Object.assign(model, {running: true}),
            'STOP': (model) => Object.assign(model, {running: false}),
            'TICK':  (model) => Object.assign(model, {time: model.time + (model.running ? 1 : 0 )})
        };
        return  (updates[action.type] || (() => model))(model);
    }
    let container = createStore(update);
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    setInterval(() => {
        container.dispatch({type: 'TICK'});
    }, timer)
    ```
    1. [Redux Reference](https://react-redux.js.org/)
    2. A Reducer takes state and an intent and converts it to an updated state.
    3. Intents are Actions in Redux.
    4. 4 functions will be used createStore, dispatch, getState and subscribe. The original state container was built using the same priciples of the Redux API. This made converting from the custom state container to Redux API very simple.
    5. Delete custom createStore() it will be replaced with the Redux API.
    6. Install Redux with npm install.
    7. Import createStore module from redux library.
    8. Create a container object with Redux.createStore passing in the update function.
    9. Replace call to render with call to container.subscribe() registering render function.
    10. Replace calls to update with call to dispatch container.dispatch(). The calls to dispatch pass in a JSON object, including type. Model is registered through the update function.
    11. The render function is updated to call the container.getState() and it updates an update view.
    
* Use React-Redux State Container
    1. Create a 3rd Branch to implement React-Redux
    ```Javascript
     // create a new branch
   git branch ReactReduxContainer
   
   // start using the new branch
   git checkout ReactReduxContainer
   
   // create the new branch on remote
   git push -u origin  ReactReduxContainer
    ```
    2. Install react-redux
    ```Javascript
    npm install react-redux
    ```
    
    3. Use reach-redux 
    ```Javascript
    // add to index.js
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    import { connect } from 'react-redux';
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ```
    
    4. Wrap view in a react component  
   ```Javascript
    // add to index.js
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const StopWatch = ReactRedux.connect(mapStateToProps, mapDispatchToProps)((model) => { 
        console.log(model);
        
        let minutes = Math.floor(model.time / 60 );
        let seconds = model.time - (minutes * 60);
        let secondsFormatted = `${seconds < 10 ? '0' : ''}${seconds}`;
        let handler = (event) => {
            container.dispatch(model.running ? {type: 'STOP'} : {type: 'START'});
        }
        return <div>
        <p>{minutes}:{secondsFormatted}</p>
        <button onClick={handler} >{model.running ? 'Stop': 'Start'}</button>
        </div>
    });
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ```
    * changes to view
        1. Wrap view in call to connect
        2. Pass in mapStateToProps and mapDispatchToProps functions.
        3. Cange view name to StopWatch, name with upper case because it is a react component.
  
    5. Add new functions mapStateToProps and mapDispatchToProps
    ```Javascript
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        
    function mapStateToProps(state) {
        return {};
    }

    function mapDispatchToProps(dispatch){
        return {};
    }
    const StopWatch ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ```
    * implemented simpe shell of a function
        1. The name is intuitive for both functions. One maps State to maps State to a set of prpoerties and the other or takes Dispatch and maps it to a set of properties.
        2. Returning an empty object containing some properties for the component is a valid implementation.
        3. Both function will be further defined.
    
    6. Replace render with ReactRedux.Provider
    ```Javascript
    ReactDOM.render(
        <Provider store={container}>
            <StopWatch />
        </  Provider>
        , 
        document.getElementById('root')
    );
    ```
    * Make call to StopWatch component
        1. The previous version made call to the view function and passed the state container.
        2. ReactRedux handles this, so the call is replaced with a call to the StopWatch component
        3. ReactRedux requires the component is wrapped in a Provider.
        4. The entire render function is replaced with a direct call to ReactDOM.render()
        5. The call to subscriber to the container store is also removed. ReactRedux will handle the subsription call.
    
    7. Final changes to integrate ReactRedux 
    ```Javascript
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~        
    function mapStateToProps(state) {
        return state;
    }

    function mapDispatchToProps(dispatch){
        return {
            onStart: () => {dispatch({type: 'START'});} ,
            onStop: () => {dispatch({type: 'STOP'});} ,
        };
    }
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~        
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
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ```
    * changes explained
        1. MapStateToProps; needs to only return state.
        2. mapDispatchToProps; needs to map the events from the start/stop button.
        3. StopWatch; 
            1. replace model with with props
            2. remove event handler
            3. replace call to handler with conditional (ternary) operator, shortcut for if statement.
        4. update or reducer function; ReactRedux optimize changes. It does this by checking if the application state has changed. It does this with a equality check. The state model is the same event though the values haved changed. To force it to update the view use an empty object. This will cause it to always see the events as a change to the state. 

             
