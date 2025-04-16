---
title: 'Nest.js檔案上傳 EP01: Express.js搭配Multer實作檔案上傳功能'
description: 'Express.js搭配Multer實作檔案上傳功能'
pubDate: '2024/03/21 00:00:00'
# updatedDate: ''
# heroImage: ''
author: 'wakizashi1024'
tags:
  - node.js
  - express.js
  - multer
  - file upload
---
## 前言

筆者最近接觸Nest.js，其使用Adaptor設計模式，可採用Express或Fastify作為實現。目前社群上Express的文件比較齊全，所以就以Express為主學習。本篇探討如何使用Express實作檔案上傳功能，下一篇再使用Nest.js實現。

## 建立專案

- 初始化專案

  - Bash commands

    ```bash
    mkdir express-example-multer
    cd express-example-multer
    npm init -y
    ```
  - tsconfig.json

    ```json
    {
        "compilerOptions": {
            "target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
            "module": "commonjs",                                /* Specify what module code is generated. */
            "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
            "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
            "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */
            "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
        }
    }
    ```

## 安裝依賴

```bash
npm install cors express multer
npm install -D @types/cors @types/express @types/multer @ts-node @tsc @typescript
```

此時package.json應該會像這樣(main和script start/build需要再做修改)

```json
{
  "name": "express-example-multer",
  "version": "1.0.0",
  "description": "",
  "main": "./dist/index.js",
  "scripts": {
    "start": "ts-node index.ts",
    "build": "tsc"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.3",
    "multer": "1.4.5-lts.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/multer": "^1.4.11",
    "ts-node": "^10.9.2",
    "tsc": "^2.0.4",
    "typescript": "^5.3.3"
  }
}
```

## 建立Express後端

- index.ts

```typescript
import { NextFunction, Request, Response } from 'express'
import express from 'express'
import multer, { MulterError } from 'multer'
import cors from 'cors'
import fs from 'fs'
import path from 'path'

const app = express()
app.use(cors())

app.listen(3000);
```

## 建立測試用網頁

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Express Multer file upload example</title>
    <script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
</head>
<body>
    <script>
    </script>
</body>
</html>
```

## 範例說明

本文有多個Use case分別對應不同的使用場景:

- 單個檔案上傳
- 多個檔案上傳
- 多檔案上傳(指定欄位名稱)
- 多檔案上傳(任意欄位名稱)

以下就一一介紹如何實作功能

### 單個檔案上傳

首先我們先從後端(index.ts)下手

```typescript
import { NextFunction, Request, Response } from 'express'
import express from 'express'
import multer, { MulterError } from 'multer'
import cors from 'cors'
import fs from 'fs'
import path from 'path'

const app = express()
app.use(cors())

const upload = multer({ dest: 'uploads/' }); // 初始化multer實例

app.post('/upload', upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
    console.log(`Reqest file: ${JSON.stringify(req?.file, null, 2)}`);
    console.log(`Reqest body: ${JSON.stringify(req?.body, null, 2)}`);
});

app.listen(3000);
```

這裡用multer(處理html multipart的middleware)來處理上傳檔案的處理，首先先初始化multer實例(dest為檔案上傳時存放的目錄)，然後我們宣告一個post路由來提供上傳Endpoint(這裡是/upload)。使用初始化後的 `upload.single`方法來接收post表單，然後定義Callback function來作後續處理。(這邊印出檔案資訊和post body)。

再來寫個簡單的前端頁面作測試(也可以用postman等工具來測試)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Express Multer file upload example</title>
    <script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
</head>
<body>
    <div>
        <span>Single file</span>
        <input id="fileInput" type="file"/>
    </div>

    <script>
        const fileInput = document.querySelector('#fileInput');
        async function formData() {
            const data = new FormData();
            data.set('Foo','Bar');
            data.set('serial', 114514);
            data.set('file', fileInput.files[0]);

            try {
                const res = await axios.post('http://localhost:3000/upload', data);
                console.log(res);
            } catch (err) {
                console.log(`Error when uploading single file: ${err}`);
            }
        }
        fileInput.onchange = formData;
    </script>
</body>
</html>
```

這邊簡單用一個 `input`元素來對應要上傳的檔案，然後註冊一個事件，當檔案發生變化時自動建立表單後上傳

(輸出結果: TBD)

### 多個檔案上傳

多個檔案和單個檔案的程式碼很像，只是我們要改用 `multer.array`來處理檔案

```typescript
app.post('/upload-multiple', upload.array('files', maxFileCount), (req: Request, res: Response, next: NextFunction) => {
    console.log(`Reqest files: ${JSON.stringify(req?.files, null, 2)}`);
    console.log(`Reqest body: ${JSON.stringify(req?.body, null, 2)}`);
}, (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(`Error: ${JSON.stringify(err, null, 2)}`);
    if (err instanceof MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).send('Too many files!');   
    }
});
```

`multer.array`有一個參數可以設定最多接收幾個檔案，當超過檔案限制時會拋出異常

前端測試程式碼

```html
<body>
    <div>
        <span>Multiple files</span>
        <input id="fileInputMulti" type="file" multiple />
    </div>

    <script>
    const fileInputMulti = document.querySelector('#fileInputMulti');
        async function formDataMulti() {
            const data = new FormData();
            data.set('Foo','Bar');
            data.set('serial', 114514);
            Array.from(fileInputMulti.files).forEach(file => {
                data.append('files', file);
            });

            try {
                const res = await axios.post('http://localhost:3000/upload-multiple', data);
                console.log(res);
            } catch (err) {
                console.log(`Error when uploading multiple files: ${err}`);
            }
        }
        fileInputMulti.onchange = formDataMulti;
    </script>
</body>
```

這邊將多個檔案上傳時組成一個陣列放入 `files`欄位，且 `input`元素需指定 `multiple`來告訴瀏覽器允許選擇多個檔案上傳

(輸出結果: TBD)

### 多檔案上傳(指定欄位名稱)

後端跟前端商量好使用指定的欄位名稱來代表特定的檔案，方便開發及測試

```typescript
app.post('/upload-multiple-with-specified-fields', upload.fields([
    { name: 'a-type-files', maxCount: 2 }, 
    { name: 'b-type-files', maxCount: 3 }
]), (req: Request, res: Response, next: NextFunction) => {
    console.log(`Reqest files: ${JSON.stringify(req?.files, null, 2)}`);
    console.log(`Reqest body: ${JSON.stringify(req?.body, null, 2)}`);
}, (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(`Error: ${JSON.stringify(err, null, 2)}`);
    if (err instanceof MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).send('Too many files!');   
    }
});
```

這裡定義了兩個欄位分別代表不同類型檔案。舉個實際例子，公告試題與解答的後台需要提供上傳兩種類型的PDF，一種是純考題，另一種是考題帶解答的版本。

前端測試程式碼

```html
<body>
    <div>
        <span>Multiple files with specified Fields</span>
        <input id="fileInputMultiWithSpecifiedFields" type="file" multiple />
    </div>

    <script>
        const fileInputMultiWithSpecifiedFields = document.querySelector('#fileInputMultiWithSpecifiedFields');
        async function formDataMultiWithSpecifiedFields() {
            const data = new FormData();
            data.set('Foo','Bar');
            data.set('serial', 114514);
            Array.from(fileInputMultiWithSpecifiedFields.files).forEach((file, idx) => {
                if (idx < 2) {
                    data.append('a-type-files', file);
                } else {
                    data.append('b-type-files', file);
                }
            });

            try {
                const res = await axios.post('http://localhost:3000/upload-multiple-with-specified-fields', data);
                console.log(res);
            } catch (err) {
                console.log(`Error when uploading multiple files with specified fields: ${err}`);
            }
        }
        fileInputMultiWithSpecifiedFields.onchange = formDataMultiWithSpecifiedFields;
    </script>
</body>
```

(輸出結果: TBD)

### 多檔案上傳(任意欄位名稱)

有時候我們功能要做的比較靈活，這時我們可能就不會限定使用者使用那些欄位名稱來上傳檔案，這時候就會用到 `multer.any`來處理

```typescript
app.post('/upload-multiple-with-fields', upload.any(), (req: Request, res: Response, next: NextFunction) => {
    console.log(`Reqest files: ${JSON.stringify(req?.files, null, 2)}`);
    console.log(`Reqest body: ${JSON.stringify(req?.body, null, 2)}`);
});
```

前端測試範例

```html
<script>
    const fileInputMultiWithFields = document.querySelector('#fileInputMultiWithFields');
    async function formDataMultiWithFields() {
        const data = new FormData();
        data.set('Foo','Bar');
        data.set('serial', 114514);
        Array.from(fileInputMultiWithFields.files).forEach((file, idx) => {
            data.append(generateUUID(), file);
        });

        try {
            const res = await axios.post('http://localhost:3000/upload-multiple-with-fields', data);
            console.log(res);
        } catch (err) {
            console.log(`Error when uploading multiple files with fields: ${err}`);
        }
    }
    fileInputMultiWithFields.onchange = formDataMultiWithFields;
</script>
```

這裡假設一個情境是雲端儲存空間提供使用者上傳任意個檔案，上傳時用UUID來代表紀錄上傳的檔案。

(輸出結果: TBD)

## 總結

本篇介紹了如何使用Express.js + Multer middleware來實作檔案上傳功能，有助於Nest.js實作同功能的理解(因為Nest.js底層就是封裝這兩個組件)，下一篇就是Nest.js的實作，敬請期待！
