const tryCatchWrapper = (fn) => async (...args) => {
    try {
      return await fn(...args); 
    } catch (error) {
      
      console.log('Error:', error?.message);
      throw error;
    }
  };
  export {tryCatchWrapper}