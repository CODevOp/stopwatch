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
