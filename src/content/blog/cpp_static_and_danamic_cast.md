---
title: "[學習筆記]C++ 的 static_cast 與 dynamic_cast：從實例理解型別轉換"
description: ''
pubDate: '2025-04-16'
# updatedDate: ''
heroImage: '/images/cpp_static_and_danamic_cast/hero_image.png'
author: 'wakizashi1024'
date: 2025-04-16
tags: ["c++", "cpp", "type_cast", "static_cast", "dynamic_cast", "oop"]
# categories: ["程式語言", "C++"]
---
## History

- 2025/04/16 First Version

---

<br />

## 前言

在 C++ 中，型別轉換（type casting）是一個重要但容易被誤用的主題。筆者近期在學習SDL的時候，發現 `static_cast` 和 `dynamic_cast`這兩種新語法。原來除了傳統的 C-style cast還有這種高級功能，經過資料查找和實際使用後，本文將透過實例與語言對照，深入探討這兩者的差異與適用情境。

<br />

## 🔁 C-style cast 與 `static_cast`

傳統的 C-style cast 語法如下：

```cpp
int x = (int)3.14;
```

這種寫法簡單快速，但有幾個缺點：

- 難以閱讀與維護
- 編譯器難以針對潛在錯誤給出警告
- 安全性低，容易誤轉造成未定行為（Undefined Behavior）

<br />

### ✅ 使用 `static_cast`

C++ 提供 `static_cast` 作為更安全、語意明確的替代：

```cpp
int x = static_cast<int>(3.14);
```

`static_cast` 適用於：

- 基本型別之間的轉換（如 `double` ➝ `int`）
- 類別指標間的轉換（有繼承關係）
- `void*` 與其他指標之間

舉例來說：

```cpp
class Base {};
class Derived : public Base {};

Base* b = new Derived();
Derived* d = static_cast<Derived*>(b);  // 危險：編譯可過，執行時無檢查
```

這樣的轉型在你確定 `b` 實際指向 `Derived` 時沒問題，但若不是，就會發生未定行為。

<br/>

## 🧭 使用 `dynamic_cast` 的情境

當你不確定物件的實際型別，或處理多型類別（有 virtual 函式）時，`dynamic_cast` 就派上用場了。

它會在**執行階段檢查轉型是否安全**，轉型失敗時會回傳 `nullptr`（指標）或拋出 `std::bad_cast`（參考）。

### ✅ 實務案例：GUI 控件

```cpp
class Widget {
public:
    virtual void draw() const { std::cout << "Drawing widget\n"; }
    virtual ~Widget() = default;
};

class Button : public Widget {
public:
    void draw() const override { std::cout << "Drawing button\n"; }
    void click() const { std::cout << "Button clicked!\n"; }
};

class TextBox : public Widget {
public:
    void draw() const override { std::cout << "Drawing text box\n"; }
    void inputText(const std::string& text) {
        std::cout << "Text input: " << text << std::endl;
    }
};

void processWidget(Widget* w) {
    if (Button* btn = dynamic_cast<Button*>(w)) {
        btn->click();
    } else if (TextBox* tb = dynamic_cast<TextBox*>(w)) {
        tb->inputText("Hello World");
    } else {
        std::cout << "Unknown widget type\n";
    }
}
```

<br />

## 🔄 與 Java、C# 的對照

C#跟Java也有些在執行時檢查/轉換型別的語法，這裡列出筆者常用的跟C++做一下對比

### Java：

```java
if (w instanceof Button) {
    ((Button) w).click();
}
```

- 使用 `instanceof` 搭配強制轉型
- 錯誤轉型會丟出 `ClassCastException`

### C#：

```csharp
if (w is Button btn) {
    btn.Click();
}
```

或使用 `as`：

```csharp
var btn = w as Button;
if (btn != null) {
    btn.Click();
}
```

<br />

## ✅ 小結

| 功能         | C++                        | Java                    | C#                          |
| ------------ | -------------------------- | ----------------------- | --------------------------- |
| 執行期檢查   | `dynamic_cast`           | `instanceof` + 強轉型 | `is` / `as`             |
| 編譯期轉型   | `static_cast`            | 無明確對應（皆動態）    | 明確轉型 + pattern matching |
| 安全性       | 中（需小心使用）           | 高                      | 高                          |
| 錯誤轉型行為 | `nullptr` / `bad_cast` | 例外                    | `null` / 跳過執行區塊     |

在多型與繼承密集的系統中，筆者建議：

- ✅ **已知型別轉換：使用 `static_cast`**
- ✅ **不確定型別來源時：使用 `dynamic_cast`**
- 🚫 **避免使用 C-style cast**

<br />

---

<br />

> 希望本文能讓你對 C++ 的轉型系統有更清晰的認識。若你平常是 Java/C# 的開發者，理解 `dynamic_cast`也能幫助你更安全地撰寫 C++ 多型程式碼。
