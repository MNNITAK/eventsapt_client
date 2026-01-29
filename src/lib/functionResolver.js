const tryCatchWrapper = (fn) => async (...args) => {
    try {
      await fn(...args); // Execute the wrapped function
    } catch (error) {
      // Handle error here (log it, send response, etc.)
      //console.log('Error:', error?.message);
    }
  };
  export {tryCatchWrapper}