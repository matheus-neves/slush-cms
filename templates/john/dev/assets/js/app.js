import $$ from 'jquery';
//import slick from 'slick-carousel'

export default (() => {

let APP = {

  cache: {
    ttl: $$('.header__ttl')
  },

  bind: () => {
    APP.funcs.helloWorld();
  },

  funcs: {

    helloWorld: () => {
      APP.cache.ttl.text('Hello World!');
    }

  },

  plugins: () => {

  },

  init: () => {
    APP.plugins();
    APP.funcs;
    APP.bind();
  }
};

APP.init();

})();
