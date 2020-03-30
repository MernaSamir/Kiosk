import React, { Component } from 'react'
import i18next from 'i18next';
i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en: {
        translation: {
          "key": "hello world"
        }
      },
      de: {
        translation: {
          "key": "hello welt"
        }
      }
    }
  }, function(err, t) {
    // init set content
    updateContent();
  });
  
  function updateContent() {
    // return i18next.t('key');
    document.getElementById('output').innerHTML = i18next.t('key');
  }
  
  function changeLng(lng) {
    i18next.changeLanguage(lng);
  }
  
  i18next.on('languageChanged', () => {
    updateContent();
  });
export default class Test extends Component {


  

  
  render() {
    
    return (
      <div >
        <button  onClick={i18next.changeLanguage.bind(this,'de')}>change</button>
        <div id ='output'>
           
        </div>
      </div>
    )
  }
}
