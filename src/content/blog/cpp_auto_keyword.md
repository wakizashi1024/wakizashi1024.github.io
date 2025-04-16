---
title: '[學習筆記]C++ auto關鍵字使用'
description: ''
pubDate: '2025-04-14 17:30:00'
# updatedDate: ''
heroImage: '/images/cpp_auto_keyword/hero_image.png'
author: 'wakizashi1024'
tags:
  - C++
  - cpp
---
## History

- 2025/04/14 First Version

## 前言

筆者的C++是在大學裡學的，只學到基本的語法和一些OOP的使用，實際上也只有用來寫過online jungle解題而已。

近期在學習使用SDL這個函式庫，從範例上看到了一個語法 `auto`，頓時讓我眼前一亮。沒想到除了Java和C#有 `var`關鍵字之外，C++也支援這麼好用的功能，在此寫一篇筆記記錄一下相關資訊。

## 🧠 C++ `auto` 是什麼？

C++ 的 `auto` 關鍵字從 **C++11** 開始支援，目的是讓編譯器根據初始化值自動推導變數的型別，省去冗長的型別宣告。

### ✅ 可使用情境

```cpp
auto x = 42;        // int
auto y = 3.14;      // double
auto z = "hello";   // const char*
```

### ✅ 搭配 STL 使用

```cpp
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> vec = {1, 2, 3};
    for (auto it = vec.begin(); it != vec.end(); ++it) {
        cout << *it << endl;
    }
}
```

### ✅ 搭配範圍 for 迴圈

```cpp
for (auto val : vec) {
    cout << val << endl;
}
```

### ✅ C++14 起支援函式返回值推導

```cpp
auto add(int a, int b) {
    return a + b;  // 自動推導為 int
}
```

### ✅ 搭配 `decltype(auto)` 保留參考型別

```cpp
int x = 10;
decltype(auto) y = (x); // y 是 int&
```

## ❌ `auto` 限制與不能使用的地方

| 限制                              | 說明                                   |
| --------------------------------- | -------------------------------------- |
| 必須初始化                        | `auto x;` 編譯錯誤，因為無法推導型別 |
| 不可用於函式參數                  | 除非使用 lambda 或模板                 |
| C++11 不支援成員變數使用 `auto` | C++14 起支援於 class 成員變數中使用    |
| 無法推導回傳值時使用              | 必須 return 明確的型別值供推導         |

## 🔍 C++ `auto` vs C# `var` vs Java `var` / `val` 比較

| 特性                    | C++`auto`                  | C#`var` | Java `var`（Java 10） | Java `val`（Lombok） |
| ----------------------- | ---------------------------- | --------- | ----------------------- | ---------------------- |
| 自動型別推導            | ✅ 是                        | ✅ 是     | ✅ 是                   | ✅ 是                  |
| 語法出現版本            | C++11                        | C# 3.0    | Java 10                 | 第三方套件             |
| 預設是否可變            | ✅ 是                        | ✅ 是     | ✅ 是                   | ❌ 不可變 (`final`)  |
| 必須初始化              | ✅                           | ✅        | ✅                      | ✅                     |
| 可否用於函數參數        | ❌                           | ❌        | ❌                      | ❌                     |
| 可否用於 class 成員變數 | ✅（C++14 起）               | ❌        | ❌                      | ❌                     |
| 是否保留參考/const      | ✅ 可搭配 `decltype(auto)` | ❌        | ❌                      | ✅ 為 `final`        |
| 是否為語法糖            | ✅                           | ✅        | ✅                      | ✅                     |

## 📘 範例比較

### C++ 範例

```cpp
auto x = 100;         // int
const auto y = 3.14;  // const double
auto& ref = x;        // int&
```

### C# 範例

```csharp
var x = 100;          // int
var str = "hello";    // string
// var y;             // ❌ 錯誤：必須初始化
```

### Java 10 `var` 範例

```java
var x = 100;          // int
var str = "hello";    // String
// var y;             // ❌ 錯誤：必須初始化
```

### Java Lombok `val` 範例

```java
val x = "hello";      // String 且為 final
// x = "world";       // ❌ 錯誤：val 是不可變的
```

## 🧾 小結與建議

| 語言         | 推薦使用場景                       | 注意事項                       |
| ------------ | ---------------------------------- | ------------------------------ |
| C++`auto`  | 迭代器、模板、自動推導引用與 const | 注意型別推導與參考行為         |
| C#`var`    | LINQ、匿名型別、避免冗長宣告       | 僅限區域變數                   |
| Java `var` | 區域變數明確初始化場景（Java 10+） | 適合簡潔程式碼，不建議過度使用 |
| Java `val` | 資料不可變的場景                   | 需搭配 Lombok 套件             |

> 有了自動推導雖然可以偷懶，但筆者還是建議能確定型別的部分最好還是用靜態方式宣告，這樣可讀性比較好，維護起來比較方便。
