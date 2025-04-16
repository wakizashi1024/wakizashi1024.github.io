---
title: '[JS tricks]利用IIFE來提升程式效率'
description: '利用IIFE來提升程式效率'
pubDate: '2024/03/26 08:32:26'
# updatedDate: ''
# heroImage: ''
author: 'wakizashi1024'
tags:
  - javasctipt
  - js
  - iife
  - js tricks
  - frontend
  - web dev
---
## 什麼是IIFE

IIFE是"Immediately Invoked Function Expression"(立即執行函數)，是一種在定義js函數時同時立即執行該函數的技巧。

一個簡單的IIFE範例:

```javascript
(function () {
    const greeting = 'Hola!';

    console.log(greeting);
})
```

## IIFE的常用場景

1. 建立新的變數作用域: 因Javascipt是以函數(funciton)來區分作用域，所以我們可以利用IIFE來建立函數作用域來避免變數全局汙染。
2. 資料封裝/私有變數: 同第一點，在IIFE中定義的變數/函數對於外部來說是不可見的，利用這個特性可以實現模組化和資料封裝的功能。
3. 避免變數名稱衝突: 同前兩點，由於JS的生態系豐富，我們常會使用第三方函式庫來提升開發效率。利用IIFE的特性我們可以避免不同函式庫因變數名稱相同所產生的衝突。

## 使用IIFE提升效率的例子

如何利用IIFE來提升程式執行時的效率，以下舉幾個例子:

1. 不同瀏覽器的環境相容
   我們可能會寫一段通用程式碼來增加event handler

   ```javascript
   function addEventHandler(el, evtName, handler) {
       if (el.addEventListener) {
           el.addEventListener(evtName, handler);
       } else if (el.attachEvent) {
           el.attachEvent('on' + evtName, handler);
       } else {
           el['on' + evtName] = handler;
       }
   }
   ```

   這段程式碼使用起來沒問題，但隨著專案越來越大，程式呼叫的次數越來越多，但其實每次程式路徑都是固定的，使用IIFE改造後如下:

   ```javascript
    var addEventHandler = (function () {
        if (document.addEventListener) {
            return function (el, evtName, handler) {
                el.addEventHandler(evtName, handler);
            };
        } else if (document.attachEvent) {
            return function (el, evtName, handler) {
                el.attachEvent('on' + evtName, handler);
            };
        } else {
            return function (el, evtName, handler) {
                el['on' + evtName] = handler;
            }
        }
    })();
   ```

   改造後只要在程式初始化時定義addEventHandler，不需要每次都判斷，節省了許多開銷。
2. 不同裝置的環境相容

   現在很多SPA會需要多端共用的情況(Electrion, Cordova等)，在開發時可能常常會寫如下的程式

   ```javascript
   function requset(options) {
       if (typeof window !== 'undefined') {
           // Broswer environment logic
       } else {
           // Node environment logic 
       }
   }
   ```

   使用IIFE改造後:

   ```javascript
   var request = (function () {
       if (typeof window !== 'undefined') {
           return function (options) {
               // Broswer environment logic
           }
       } else {
           return function (options) {
               /// Node environment logic 
           }
       }
   })();
   ```
3. 通用方法在背景重複產生的匿名物件

   我們常常會開發一些共用的utils功能，如以下範例:

   ```javascript
   function removeSpace(str) {
       return str.replace(/\s/g '');
   }
   ```

   每執行一次就會產生一次匿名Regexp物件，我們可以使用IIFE + 閉包的特性來改造:

   ```javascript
   var removeSpace = (function () {
       var regex = /\s/g;

       return function (str) {
           return str.replace(regex, '');
       }
   })();
   ```

   這樣就不會每次呼叫時都浪費時間去建立匿名物件了

## 結語

通過以上例子可以得知，當遇到一些重複的固定邏輯時，可以使用IIFE的特性在程式初始化時就綁定這些邏輯，來達到性能最佳化。且這些程式片段還可以整理起來成一個通用的函式庫，在不同的專案中重複使用。
