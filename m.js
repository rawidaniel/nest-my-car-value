const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('The first promise has resolved');
    resolve(10);
  }, 1 * 1000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('The second promise has rejected');
    resolve(20);
  }, 2 * 1000);
});

Promise.allSettled([p1, p2]).then(([result1, result2]) => {
  console.log(result1.value, result2.value);
});

{
  id: 1;
  name: 'John';
  age: 30;
  friends: ['Mary', 'Steve', 'Sam'];
  another: {
    id: 2;
    name: 'John';
    age: 30;
  }
}

{
  id: 2;
  name: 'John';
  age: 30;
}
