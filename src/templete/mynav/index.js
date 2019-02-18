import NavCss from './mynav.css';//引入样式
import MyNav from './mynav.html';//引入模板
console.log(MyNav)
// Create a class for the element
class MyTopNav extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    // 创建 shadow root
    var shadow = this.attachShadow({mode: 'open'});

    // 创建 div
    var wrapper = document.createElement('div');
    wrapper.setAttribute('class','wrapper');

    // Create some CSS to apply to the shadow dom
    var style = document.createElement('style');
    style.textContent = NavCss

    // attach the created elements to the shadow dom

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.innerHTML = MyNav;
  }
}

// 定义新元素
customElements.define('my-top-nav', MyTopNav);