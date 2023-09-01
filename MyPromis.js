class Promise {
  #value;
  #implementThenFunc;
  #DetailedLogEnable = true

  constructor(resolve) {
    this.#logger("constructor the cb is: ", resolve.toString())
    /* 
      resolve is a function, pass to this function the #success function
      ==> when constructor called the function that will run will be #success
      with the value passed from then() in resolve()
    */
    resolve(this.#success);
  }

  /* 
    Logger function to log more info of the callBack 
    and the values in the class
    this.#DetailedLogEnable = true => to log details
  */
  #logger = (...values) => {
    if (this.#DetailedLogEnable) {
      console.log("Logger start");
      values.forEach(val => console.log(val));
      console.log("Logger end");
    }
  }

  /* 
    this function will save the private value
    and will run the inside of the then function
    if there is new promise return in then =>
    the value will be promise => send it to then function with 
    success function as the function to run therefore
    there will be #success(#success(private value))
  */
  #success = (value) => {
    process.nextTick(() => {
      this.#logger("#success value = ", value);
      if (value instanceof Promise) {
        this.#logger("value instanceof Promise");
        value.then(this.#success);
        return;
      }

      this.#value = value;
      this.#runThenFunc();
    })
  }

  /* 
    function to run the private function 
    calls from success and then.
    eventually it runs #success(thenCb(this.#value))
    what ever thenCb(this.#value) return saved in #success
  */
  #runThenFunc = () => {
    this.#implementThenFunc ? this.#implementThenFunc(res => res(this.#value)) : null;
  }

  /* 
    must return new Promise = to enable chaining of then.
    every time it calles it return new promise and save the 
    implemented of then in #implementThenFunc
  */
  then = (thenCb) => {
    return new Promise((resolve) => {
      this.#implementThenFunc = () => resolve(thenCb(this.#value));
      this.#logger("runThenFunc call from then");
      this.#value ? this.#runThenFunc() : null;
    })
  }
}

console.log("first print");

new Promise((resolve) => {
  setTimeout(() => {
    resolve("first result");
  }, 3000)
})
  .then((result) => {
    const newResult = `${result} - 1`;
    console.log("second result", newResult);
    return newResult;
  })
  .then((result) => {
    return new Promise((resolve) => {
      resolve(`${result} - 2`);
    });
  })
  .then((result) => {
    console.log("final result", result);
  });

console.log("Last print");