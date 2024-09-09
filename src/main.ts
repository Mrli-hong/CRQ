
import Vue from 'vue';
import * as components from './components';

const install = (app: any) => {
    Object.keys(components).map(key => {
        app.component(key, (components as any)[key])
    });
}

const componentmap: any = {
    ...components,
    install
};
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
// console.log('componentmap', componentmap)

export default componentmap;