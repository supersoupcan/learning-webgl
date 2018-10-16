import './style.scss';
import main from './main';

window.document.onreadystatechange = function(){
  switch(document.readyState){
    case 'interactive': {
      main(document.querySelector('#glcanvas'));
    }
  }
}