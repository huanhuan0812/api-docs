# QToast 吐司提示组件

## 概述

QToast 是一个轻量级的 Qt 吐司提示组件，用于在应用程序中显示短暂的临时通知。它支持自定义位置、持续时间、颜色、字体大小和圆角等属性，并提供输入穿透功能，不会干扰用户的操作。

---

## 类列表

| 类名 | 描述 |
|------|------|
| [QToast](#qtoast) | 吐司提示组件，支持自定义样式和位置 |

---

## QToast

### 类描述

`QToast` 继承自 `QWidget`，提供了一个浮动在屏幕上方的临时提示窗口。它会在指定时间后自动淡出并销毁，支持鼠标事件穿透，不会阻塞用户交互。

**继承：** `QWidget`

---

### 枚举类型

| 枚举名 | 值 | 描述 |
|--------|-----|------|
| `ToastDuration` | - | 吐司显示时长枚举 |
| `LENGTH_SHORT` | 1500 | 短时间显示（1.5 秒） |
| `LENGTH_LONG` | 3000 | 长时间显示（3 秒） |
| `ToastPosition` | - | 吐司位置枚举 |
| `POSITION_BOTTOM` | 0 | 底部位置（默认） |
| `POSITION_CENTER` | 1 | 中央位置 |
| `POSITION_TOP` | 2 | 顶部位置 |

---

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `opacity` | `qreal` | 0.0 | 吐司的透明度（0.0 ~ 1.0） |

---

### 公有成员函数

#### 构造函数

---

##### `explicit QToast(QWidget *parent = nullptr)`

构造一个吐司提示实例。

| 参数 | 类型 | 描述 |
|------|------|------|
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

**说明：** 创建一个吐司提示对象，默认不显示。需要调用 `setText()` 和 `show()` 来显示内容。

---

##### `~QToast()`

析构函数，清理吐司提示资源。

---

#### 内容设置

---

##### `void setText(const QString &text)`

设置吐司显示的文本内容。

| 参数 | 类型 | 描述 |
|------|------|------|
| `text` | `const QString &` | 要显示的文本内容 |

**说明：** 文本会自动换行以适应最大宽度。调用后会自动计算并更新吐司的大小。

---

#### 时长控制

---

##### `void setDuration(int ms)`

设置吐司的显示时长。

| 参数 | 类型 | 描述 |
|------|------|------|
| `ms` | `int` | 显示时长（毫秒） |

**说明：** 可以使用预定义的 `LENGTH_SHORT`（1500ms）或 `LENGTH_LONG`（3000ms），也可以传入自定义毫秒值。

---

#### 位置控制

---

##### `void setPosition(ToastPosition position)`

设置吐司的显示位置。

| 参数 | 类型 | 描述 |
|------|------|------|
| `position` | `ToastPosition` | 位置枚举值 |

**说明：** 可选位置包括 `POSITION_TOP`（顶部）、`POSITION_CENTER`（居中）和 `POSITION_BOTTOM`（底部，默认）。

---

##### `void setBottomMarginRatio(qreal ratio)`

设置底部边距相对于屏幕高度的比例。

| 参数 | 类型 | 描述 |
|------|------|------|
| `ratio` | `qreal` | 底部边距比例，取值范围 0.0 ~ 0.5，默认 0.08 |

**说明：** 仅在位置为 `POSITION_BOTTOM` 时生效。控制吐司距离屏幕底部的距离。

---

##### `void setMinBottomMargin(int minMargin)`

设置底部边距的最小值。

| 参数 | 类型 | 描述 |
|------|------|------|
| `minMargin` | `int` | 最小底部边距（像素），默认为 0 |

**说明：** 仅在位置为 `POSITION_BOTTOM` 时生效。确保吐司不会贴边显示。

---

#### 样式设置

---

##### `void setBackgroundColor(const QColor &color)`

设置吐司的背景颜色。

| 参数 | 类型 | 描述 |
|------|------|------|
| `color` | `const QColor &` | 背景颜色 |

**说明：** 默认背景色为 `QColor(40, 40, 40, 230)`（深灰色半透明）。调用后会触发重绘。

---

##### `void setTextColor(const QColor &color)`

设置吐司的文本颜色。

| 参数 | 类型 | 描述 |
|------|------|------|
| `color` | `const QColor &` | 文本颜色 |

**说明：** 默认文本颜色为白色。调用后会更新标签样式。

---

##### `void setCornerRadius(int radius)`

设置吐司的圆角半径。

| 参数 | 类型 | 描述 |
|------|------|------|
| `radius` | `int` | 圆角半径（像素），默认 25 |

**说明：** 控制吐司四角的圆润程度。调用后会触发重绘。

---

##### `void setMargins(int horizontal, int vertical)`

设置吐司的内边距。

| 参数 | 类型 | 描述 |
|------|------|------|
| `horizontal` | `int` | 水平内边距（像素），默认 40 |
| `vertical` | `int` | 垂直内边距（像素），默认 15 |

**说明：** 控制文本与吐司边缘之间的距离。调用后会重新计算吐司大小。

---

##### `void setMaxWidth(int maxWidth)`

设置吐司的最大宽度。

| 参数 | 类型 | 描述 |
|------|------|------|
| `maxWidth` | `int` | 最大宽度（像素），默认 0（自动计算） |

**说明：** 默认情况下，吐司宽度为屏幕宽度的 80%，最大 600px。设置此值可覆盖默认行为。

---

##### `void setFontSize(int size)`

设置文本字体大小。

| 参数 | 类型 | 描述 |
|------|------|------|
| `size` | `int` | 字体大小（像素），默认 14 |

**说明：** 调用后会更新标签样式并重新计算吐司大小。

---

#### 显示控制

---

##### `void show()`

显示吐司提示。

**说明：** 吐司以淡入动画显示，在 `duration` 指定的时间后自动淡出并销毁。如果吐司正在显示，调用此方法无效。

---

#### 静态工厂方法

---

##### `static void makeToast(QWidget *parent, const QString &text, int duration = LENGTH_SHORT, ToastPosition position = POSITION_BOTTOM)`

快速创建并显示一个吐司提示。

| 参数 | 类型 | 描述 |
|------|------|------|
| `parent` | `QWidget *` | 父窗口指针 |
| `text` | `const QString &` | 要显示的文本 |
| `duration` | `int` | 显示时长（毫秒），默认 `LENGTH_SHORT` |
| `position` | `ToastPosition` | 显示位置，默认 `POSITION_BOTTOM` |

**说明：** 这是最简单的吐司调用方式，使用默认样式。吐司会在显示后自动销毁。

---

##### `static void makeToast(QWidget *parent, const QString &text, int duration, ToastPosition position, int fontSize, const QColor &backgroundColor = QColor(40, 40, 40, 230), const QColor &textColor = Qt::white)`

快速创建并显示一个自定义样式的吐司提示。

| 参数 | 类型 | 描述 |
|------|------|------|
| `parent` | `QWidget *` | 父窗口指针 |
| `text` | `const QString &` | 要显示的文本 |
| `duration` | `int` | 显示时长（毫秒） |
| `position` | `ToastPosition` | 显示位置 |
| `fontSize` | `int` | 字体大小（像素） |
| `backgroundColor` | `const QColor &` | 背景颜色，默认深灰色半透明 |
| `textColor` | `const QColor &` | 文本颜色，默认白色 |

**说明：** 提供更多自定义选项，吐司会在显示后自动销毁。

---

#### 透明度控制

---

##### `void setOpacity(qreal opacity)`

设置吐司的透明度。

| 参数 | 类型 | 描述 |
|------|------|------|
| `opacity` | `qreal` | 透明度值，范围 0.0 ~ 1.0 |

**说明：** 此属性用于动画控制。通常不需要手动调用，由内部动画管理。

---

##### `qreal opacity() const`

获取当前透明度。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `qreal` | 当前透明度值 |

---

### 重载的保护成员函数

---

##### `void paintEvent(QPaintEvent *event) override`

绘制事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QPaintEvent *` | 绘制事件对象 |

**说明：** 使用 `m_backgroundColor` 和 `m_cornerRadius` 绘制圆角矩形背景。

---

##### `void showEvent(QShowEvent *event) override`

显示事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QShowEvent *` | 显示事件对象 |

**说明：** 在显示时将透明度重置为 0，为淡入动画做准备。

---

##### `void resizeEvent(QResizeEvent *event) override`

大小改变事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QResizeEvent *` | 大小改变事件对象 |

**说明：** 在大小改变时触发重绘。

---

##### `bool nativeEvent(const QByteArray &eventType, void *message, qintptr *result) override`

原生事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `eventType` | `const QByteArray &` | 事件类型标识 |
| `message` | `void *` | 原生事件消息指针 |
| `result` | `qintptr *` | 结果值指针 |

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `bool` | 如果事件已处理返回 `true`，否则返回 `false` |

**说明：** 在 Windows 平台上处理 `WM_NCHITTEST` 消息，返回 `HTTRANSPARENT` 以实现鼠标事件穿透。

---

### 私有成员函数

---

##### `void initUI()`

初始化用户界面。

**说明：** 设置窗口标志、创建标签、配置动画和定时器。在构造函数中调用。

---

##### `void updateSize()`

更新吐司的大小。

**说明：** 根据文本内容和最大宽度计算吐司的尺寸。文本会自动换行，确保适合屏幕。

---

##### `void updatePosition()`

更新吐司的位置。

**说明：** 根据当前屏幕尺寸和 `m_position` 设置计算吐司的坐标。

---

##### `void setupPlatformSpecificTransparency()`

设置平台特定的透明度/穿透支持。

**说明：** 针对不同操作系统进行特殊配置，确保鼠标事件穿透正常工作。

---

### 私有槽函数

---

##### `void onAnimationFinished()`

动画完成时的槽函数。

**说明：** 当淡出动画完成时，隐藏并销毁吐司对象。

---

### 示例代码

#### 基础用法

```cpp
// 最简单的用法 - 使用静态工厂方法
QToast::makeToast(this, "操作成功！", QToast::LENGTH_SHORT);

// 长时间显示
QToast::makeToast(this, "文件已保存", QToast::LENGTH_LONG);

// 自定义位置
QToast::makeToast(this, "顶部提示", QToast::LENGTH_SHORT, QToast::POSITION_TOP);
QToast::makeToast(this, "居中提示", QToast::LENGTH_SHORT, QToast::POSITION_CENTER);
```

#### 自定义样式

```cpp
// 使用完整参数的自定义样式
QToast::makeToast(
    this,
    "自定义样式提示",
    QToast::LENGTH_LONG,
    QToast::POSITION_BOTTOM,
    18,  // 字体大小
    QColor(33, 150, 243, 230),  // 蓝色背景
    Qt::white  // 白色文字
);

// 红色错误提示
QToast::makeToast(
    this,
    "操作失败，请重试",
    QToast::LENGTH_LONG,
    QToast::POSITION_CENTER,
    16,
    QColor(244, 67, 54, 230),  // 红色背景
    Qt::white
);
```

#### 对象方式使用

```cpp
// 创建可复用的吐司对象
QToast *toast = new QToast(this);
toast->setText("加载中...");
toast->setDuration(2000);
toast->setPosition(QToast::POSITION_CENTER);
toast->setBackgroundColor(QColor(0, 0, 0, 200));
toast->setTextColor(Qt::white);
toast->setCornerRadius(12);
toast->setMaxWidth(400);
toast->setFontSize(16);
toast->show();

// 更新内容并重新显示
toast->setText("加载完成！");
toast->show();

// 修改底部边距
toast->setPosition(QToast::POSITION_BOTTOM);
toast->setBottomMarginRatio(0.15);  // 距离底部 15% 屏幕高度
toast->setMinBottomMargin(50);      // 最小 50 像素
toast->show();
```

#### 不同场景的吐司

```cpp
// 成功提示
void showSuccess(const QString &msg) {
    QToast::makeToast(
        this,
        "✓ " + msg,
        QToast::LENGTH_SHORT,
        QToast::POSITION_BOTTOM,
        15,
        QColor(76, 175, 80, 230),  // 绿色
        Qt::white
    );
}

// 错误提示
void showError(const QString &msg) {
    QToast::makeToast(
        this,
        "✗ " + msg,
        QToast::LENGTH_LONG,
        QToast::POSITION_CENTER,
        16,
        QColor(244, 67, 54, 230),  // 红色
        Qt::white
    );
}

// 信息提示
void showInfo(const QString &msg) {
    QToast::makeToast(
        this,
        "ℹ " + msg,
        QToast::LENGTH_SHORT,
        QToast::POSITION_BOTTOM,
        14,
        QColor(33, 150, 243, 230),  // 蓝色
        Qt::white
    );
}
```

---

## 平台兼容性

### Windows

- 使用 `WM_NCHITTEST` 消息处理实现鼠标事件穿透
- 支持 `Qt::WindowTransparentForInput`（Qt 5.15+）

### macOS

- 使用 `Qt::WindowTransparentForInput`（Qt 5.15+）
- 旧版本通过 `Qt::WA_TransparentForMouseEvents` 实现

### Linux

- 使用 `Qt::WindowTransparentForInput`（Qt 5.15+）
- 旧版本通过 `Qt::WA_TransparentForMouseEvents` 实现

---

## 构建配置

### CMake 配置

```cmake
find_package(Qt6 REQUIRED COMPONENTS Widgets)

add_library(ToastLib STATIC
    QToast.cpp
)

target_link_libraries(ToastLib Qt6::Widgets)
target_include_directories(ToastLib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
```

### QMake 配置

```pro
QT += widgets

HEADERS += QToast.h
SOURCES += QToast.cpp

# 如果需要编译为动态库
DEFINES += QTOAST_LIBRARY QTOAST_SHARED
```

---

## 注意事项

1. **输入穿透**：吐司默认不会拦截鼠标事件，用户可以与底层控件正常交互。

2. **自动销毁**：吐司在淡出动画完成后会自动调用 `deleteLater()` 销毁，无需手动管理内存。

3. **屏幕适配**：吐司会自动适配屏幕大小，确保在任意分辨率下都能正常显示。

4. **线程安全**：吐司操作必须在主线程中执行（UI 线程）。

5. **父窗口**：虽然需要传入 `parent` 参数，但吐司实际上是独立窗口，不受父窗口位置影响。

6. **多屏支持**：吐司默认显示在主屏幕上。对于多屏环境，可扩展 `updatePosition()` 方法以支持当前活动屏幕。
