const { Facebook, Google } = require('./index');
const facebook = new Facebook();
const google = new Google('AIzaSyCHL_WqXfjAj1uZ0VYG6GdtKskTSjUh2Lk');

facebook.getNameFromEmail('yiperica@hotmail.com').then(res => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});
