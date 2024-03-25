---
title: '自製Chrome Extension - Bilibili live checker(自動通知直播間開播)'
description: '自製Chrome Extension - bilibili live checker(自動通知直播間開播)'
pubDate: '2023-10-23 12:03:06'
# updatedDate: ''
heroImage: '/images/bilibili_live_checker/Screenshot%202023-10-23%20122859.png'
author: 'wakizashi1024'
tags:
  - chrome extension
  - bilibili
  - javascript
  - js
---
## 起因

看B站(Bilibili)直播很久了，網頁端關注主播正在直播提示很常不完整或是開播很久後才顯示。這讓我這個同時段看好幾台直播的老DD錯過不少精彩直播片段。剛好最近在看Chrome Extension開發，順便做個小專案來練習一下。而且插件很方便移除和審核代碼，對於有系統潔癖或資安疑慮的人來說是一大福音。(說的就是筆者)

## 已實現的功能

廢話不多說，先上效果圖:

![開播提示](/images/bilibili_live_checker/Screenshot%202023-10-23%20122859.png)

可以看到12:03開播不久馬上就提示了，效果還蠻不錯的。

在主播個人空間加了訂閱按鈕，按下可以加入通知提醒
![個人空間 - 未訂閱](/images/bilibili_live_checker/Screenshot%202023-10-23%20123821.png)

![個人空間 - 已訂閱](/images/bilibili_live_checker/Screenshot%202023-10-23%20124324.png)

後續還有些功能還需完善，更多詳情請移駕該項目的Github網址: [https://github.com/wakizashi1024/bilibili-live-checker](https://github.com/wakizashi1024/bilibili-live-checker)
