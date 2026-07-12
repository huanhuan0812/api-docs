# MButtonBase 按钮组件库

## 概述

MButtonBase 是一个基于 Qt 的 Material Design 风格按钮组件库，提供了完整的按钮交互体验，包括水波纹动画、状态层反馈、焦点指示器和悬停提升效果。该库包含五种常用的按钮类型，适用于各种 UI 场景。

---

## 类列表

| 类名 | 描述 |
|------|------|
| [MButtonBase](#mbuttonbase) | 所有按钮的基类，提供水波纹、状态层、焦点指示器等核心功能 |
| [MElevatedButton](#melevatedbutton) | 悬浮按钮，带有 Material Design 风格的阴影效果 |
| [MFilledButton](#mfilledbutton) | 填充按钮，使用纯色背景 |
| [MOutlinedButton](#moutlinedbutton) | 描边按钮，透明背景带有彩色边框 |
| [MTextButton](#mtextbutton) | 文本按钮，无背景无边框 |
| [MToggleButton](#mtogglebutton) | 切换按钮，支持选中/未选中两种状态 |

---

## MButtonBase

### 类描述

`MButtonBase` 是抽象基类，继承自 `QPushButton`，提供了按钮的视觉交互框架。所有具体按钮类型都派生自该类。

**继承：** `QPushButton`

**所有子类：** `MElevatedButton`, `MFilledButton`, `MOutlinedButton`, `MTextButton`, `MToggleButton`

---

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `primaryColor` | `QColor` | `palette().color(QPalette::Highlight)` | 按钮的主题色 |
| `rippleColor` | `QColor` | `primaryColor` | 水波纹的颜色 |
| `cornerRadius` | `int` | 20 | 按钮的圆角半径（像素） |
| `rippleEnabled` | `bool` | true | 是否启用水波纹效果 |
| `stateLayerEnabled` | `bool` | true | 是否启用状态层效果 |
| `focusIndicatorEnabled` | `bool` | true | 是否启用焦点指示器 |
| `hoverElevationEnabled` | `bool` | true | 是否启用悬停提升效果 |
| `animationDuration` | `int` | 300 | 动画时长（毫秒） |

---

### 公有成员函数

#### 构造函数

---

##### `explicit MButtonBase(QWidget *parent = nullptr)`

构造一个默认的按钮实例。

| 参数 | 类型 | 描述 |
|------|------|------|
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

**说明：** 创建一个空白的按钮，需要后续调用 `setText()` 或 `setIcon()` 设置内容。

---

##### `explicit MButtonBase(const QString &text, QWidget *parent = nullptr)`

构造一个带有指定文本的按钮。

| 参数 | 类型 | 描述 |
|------|------|------|
| `text` | `const QString &` | 按钮上显示的文本 |
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

**说明：** 创建一个按钮并设置其显示文本。

---

##### `MButtonBase(const QIcon &icon, const QString &text, QWidget *parent = nullptr)`

构造一个带有图标和文本的按钮。

| 参数 | 类型 | 描述 |
|------|------|------|
| `icon` | `const QIcon &` | 按钮上显示的图标 |
| `text` | `const QString &` | 按钮上显示的文本 |
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

**说明：** 创建一个同时包含图标和文本的按钮。

---

#### 颜色访问器

---

##### `QColor primaryColor() const`

获取按钮的主题色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前主题色 |

**说明：** 主题色通常用于按钮的状态层、焦点指示器和文字颜色。

---

##### `void setPrimaryColor(const QColor &color)`

设置按钮的主题色。

| 参数 | 类型 | 描述 |
|------|------|------|
| `color` | `const QColor &` | 新的主题色 |

**说明：** 如果 `rippleColor` 未单独设置，水波纹颜色会自动跟随主题色变化。调用后会触发重绘。

---

##### `QColor rippleColor() const`

获取水波纹的颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前水波纹颜色 |

---

##### `void setRippleColor(const QColor &color)`

设置水波纹的颜色。

| 参数 | 类型 | 描述 |
|------|------|------|
| `color` | `const QColor &` | 新的水波纹颜色 |

**说明：** 默认与主题色相同。调用后会触发重绘。

---

#### 尺寸访问器

---

##### `int cornerRadius() const`

获取按钮的圆角半径。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `int` | 当前圆角半径（像素） |

---

##### `void setCornerRadius(int radius)`

设置按钮的圆角半径。

| 参数 | 类型 | 描述 |
|------|------|------|
| `radius` | `int` | 新的圆角半径（像素） |

**说明：** 控制按钮四角的圆润程度。调用后会触发重绘。

---

#### 视觉效果开关

---

##### `bool isRippleEnabled() const`

检查水波纹效果是否启用。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `bool` | 如果启用返回 `true`，否则返回 `false` |

---

##### `void setRippleEnabled(bool enabled)`

启用或禁用水波纹效果。

| 参数 | 类型 | 描述 |
|------|------|------|
| `enabled` | `bool` | `true` 表示启用，`false` 表示禁用 |

**说明：** 禁用水波纹时，水波纹的透明度和半径会被重置为 0。调用后会触发重绘。

---

##### `bool isStateLayerEnabled() const`

检查状态层效果是否启用。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `bool` | 如果启用返回 `true`，否则返回 `false` |

---

##### `void setStateLayerEnabled(bool enabled)`

启用或禁用状态层效果。

| 参数 | 类型 | 描述 |
|------|------|------|
| `enabled` | `bool` | `true` 表示启用，`false` 表示禁用 |

**说明：** 状态层在悬停和按下时显示半透明层，提供交互反馈。禁用时透明度会被重置为 0。调用后会触发重绘。

---

##### `bool isFocusIndicatorEnabled() const`

检查焦点指示器是否启用。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `bool` | 如果启用返回 `true`，否则返回 `false` |

---

##### `void setFocusIndicatorEnabled(bool enabled)`

启用或禁用焦点指示器。

| 参数 | 类型 | 描述 |
|------|------|------|
| `enabled` | `bool` | `true` 表示启用，`false` 表示禁用 |

**说明：** 焦点指示器在按钮获得键盘焦点时显示虚线边框。禁用时透明度会被重置为 0。调用后会触发重绘。

---

##### `bool isHoverElevationEnabled() const`

检查悬停提升效果是否启用。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `bool` | 如果启用返回 `true`，否则返回 `false` |

---

##### `void setHoverElevationEnabled(bool enabled)`

启用或禁用悬停提升效果。

| 参数 | 类型 | 描述 |
|------|------|------|
| `enabled` | `bool` | `true` 表示启用，`false` 表示禁用 |

**说明：** 悬停提升效果在鼠标悬停时使按钮轻微上浮，产生立体感。禁用时偏移量会被重置为 0。调用后会触发重绘。

---

#### 动画控制

---

##### `int animationDuration() const`

获取动画时长。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `int` | 当前动画时长（毫秒） |

---

##### `void setAnimationDuration(int ms)`

设置动画时长。

| 参数 | 类型 | 描述 |
|------|------|------|
| `ms` | `int` | 新的动画时长（毫秒） |

**说明：** 影响所有动画的速度，包括水波纹、状态层、焦点指示器和悬停提升动画。所有动画对象会同步更新时长。

---

#### 状态访问器

---

##### `void setCheckable(bool checkable)`

设置按钮是否可切换。

| 参数 | 类型 | 描述 |
|------|------|------|
| `checkable` | `bool` | `true` 表示按钮可切换，`false` 表示不可切换 |

**说明：** 调用基类的 `QPushButton::setCheckable()` 方法。可切换按钮在被点击时会在选中和未选中状态之间切换。

---

##### `bool isCheckable() const`

检查按钮是否可切换。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `bool` | 如果可切换返回 `true`，否则返回 `false` |

---

### 受保护成员函数

---

#### 纯虚函数（子类必须实现）

---

##### `virtual void paintBackground(QPainter &painter, const QRect &rect) = 0`

绘制按钮的背景。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |
| `rect` | `const QRect &` | 按钮的矩形区域 |

**说明：** 子类必须实现此方法以绘制各自的背景样式。填充按钮绘制纯色背景，描边按钮绘制透明背景等。

---

##### `virtual void paintBorder(QPainter &painter, const QRect &rect) = 0`

绘制按钮的边框。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |
| `rect` | `const QRect &` | 按钮的矩形区域 |

**说明：** 子类必须实现此方法以绘制各自的边框样式。描边按钮绘制彩色边框，填充按钮和文本按钮通常不绘制边框。

---

##### `virtual QColor getCurrentTextColor() const = 0`

获取当前文本颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前文本颜色 |

**说明：** 子类必须实现此方法，根据按钮的状态（启用/禁用、悬停/按下等）返回适当的文本颜色。

---

##### `virtual QColor getCurrentIconColor() const = 0`

获取当前图标颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前图标颜色 |

**说明：** 子类必须实现此方法，根据按钮的状态返回适当的图标颜色。

---

#### 绘制辅助函数

---

##### `void paintRipple(QPainter &painter, const QRect &rect)`

绘制水波纹效果。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |
| `rect` | `const QRect &` | 按钮的矩形区域 |

**说明：** 在 `paintEvent()` 中被调用，使用径向渐变从点击中心向外扩散绘制水波纹。如果 `rippleEnabled` 为 `false` 或水波纹透明度和半径为 0，则不绘制。

---

##### `void paintStateLayer(QPainter &painter, const QRect &rect)`

绘制状态层。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |
| `rect` | `const QRect &` | 按钮的矩形区域 |

**说明：** 在 `paintEvent()` 中被调用，在按钮背景之上绘制半透明状态层。状态层的透明度根据按钮状态（悬停/按下）动态变化。

---

##### `void paintFocusIndicator(QPainter &painter, const QRect &rect)`

绘制焦点指示器。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |
| `rect` | `const QRect &` | 按钮的矩形区域 |

**说明：** 在 `paintEvent()` 中被调用，当按钮获得键盘焦点时绘制虚线边框。边框使用主题色，带有虚线样式。

---

##### `void paintHoverElevation(QPainter &painter, const QRect &rect)`

绘制悬停提升阴影效果。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |
| `rect` | `const QRect &` | 按钮的矩形区域 |

**说明：** 在 `paintEvent()` 中被调用，当鼠标悬停时在按钮底部绘制阴影，产生上浮的立体效果。

---

##### `void paintLabel(QPainter &painter)`

绘制按钮的文本和图标。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |

**说明：** 使用 Qt 样式系统绘制按钮的标签内容，包括文本和图标。颜色由 `getCurrentTextColor()` 和 `getCurrentIconColor()` 决定。

---

#### 动画控制

---

##### `void startRippleAnimation(const QPointF &center)`

启动水波纹动画。

| 参数 | 类型 | 描述 |
|------|------|------|
| `center` | `const QPointF &` | 水波纹的起始中心点（通常是鼠标点击位置） |

**说明：** 从指定中心点开始，水波纹半径从 0 逐渐扩展到覆盖整个按钮，同时透明度从 0.15 逐渐衰减到 0。

---

##### `void startStateLayerAnimation(bool visible)`

启动状态层动画。

| 参数 | 类型 | 描述 |
|------|------|------|
| `visible` | `bool` | `true` 表示显示状态层，`false` 表示隐藏状态层 |

**说明：** 状态层透明度在 0 和目标值之间过渡。目标值根据按钮状态决定：按下时为 0.12，悬停时为 0.08。

---

##### `void startFocusIndicatorAnimation(bool visible)`

启动焦点指示器动画。

| 参数 | 类型 | 描述 |
|------|------|------|
| `visible` | `bool` | `true` 表示显示焦点指示器，`false` 表示隐藏焦点指示器 |

**说明：** 焦点指示器透明度在 0 和 1 之间过渡，在获得或失去键盘焦点时触发。

---

##### `void startHoverElevationAnimation(bool hovered)`

启动悬停提升动画。

| 参数 | 类型 | 描述 |
|------|------|------|
| `hovered` | `bool` | `true` 表示进入悬停状态，`false` 表示离开悬停状态 |

**说明：** 提升偏移量在 0 和 1 之间过渡，在鼠标进入或离开按钮时触发。

---

#### 状态访问器

---

##### `bool isHovered() const`

检查按钮是否处于悬停状态。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `bool` | 如果鼠标悬停在按钮上返回 `true`，否则返回 `false` |

---

##### `bool isPressed() const`

检查按钮是否处于按下状态。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `bool` | 如果按钮被按下返回 `true`，否则返回 `false` |

---

##### `const QPointF& rippleCenter() const`

获取水波纹的中心点。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `const QPointF &` | 水波纹中心点的引用 |

---

#### 工具函数

---

##### `QColor getContrastColor(const QColor &color) const`

计算与指定颜色形成对比的前景色。

| 参数 | 类型 | 描述 |
|------|------|------|
| `color` | `const QColor &` | 背景颜色 |

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 对比色（黑色 `#1e1e1e` 或白色 `#ffffff`） |

**说明：** 使用 YCbCr 亮度算法计算，如果背景亮度大于 0.5 返回深色，否则返回白色。用于确保文字在彩色背景上的可读性。

---

### 重载的保护成员函数

---

##### `void paintEvent(QPaintEvent *event) override`

绘制事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QPaintEvent *` | 绘制事件对象 |

**说明：** 按顺序调用各个绘制函数：悬停提升 → 背景 → 状态层 → 边框 → 焦点指示器 → 水波纹 → 标签。

---

##### `void mousePressEvent(QMouseEvent *event) override`

鼠标按下事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QMouseEvent *` | 鼠标事件对象 |

**说明：** 左键按下时记录按下状态，启动水波纹动画和状态层动画。然后调用基类实现。

---

##### `void mouseReleaseEvent(QMouseEvent *event) override`

鼠标释放事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QMouseEvent *` | 鼠标事件对象 |

**说明：** 左键释放时取消按下状态，根据悬停状态更新状态层动画。然后调用基类实现。

---

##### `void mouseMoveEvent(QMouseEvent *event) override`

鼠标移动事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QMouseEvent *` | 鼠标事件对象 |

**说明：** 记录当前鼠标位置，调用基类实现。

---

##### `void enterEvent(QEnterEvent *event) override`

鼠标进入事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QEnterEvent *` | 进入事件对象 |

**说明：** 设置悬停状态为 `true`，启动状态层动画和悬停提升动画。然后调用基类实现。

---

##### `void leaveEvent(QEvent *event) override`

鼠标离开事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QEvent *` | 事件对象 |

**说明：** 设置悬停状态为 `false`，启动状态层动画和悬停提升动画（退出方向）。然后调用基类实现。

---

##### `void focusInEvent(QFocusEvent *event) override`

获得焦点事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QFocusEvent *` | 焦点事件对象 |

**说明：** 如果焦点指示器启用，启动焦点指示器显示动画。然后调用基类实现。

---

##### `void focusOutEvent(QFocusEvent *event) override`

失去焦点事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QFocusEvent *` | 焦点事件对象 |

**说明：** 如果焦点指示器启用，启动焦点指示器隐藏动画。然后调用基类实现。

---

##### `void resizeEvent(QResizeEvent *event) override`

大小改变事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QResizeEvent *` | 大小改变事件对象 |

**说明：** 调用基类实现。

---

## MElevatedButton

### 类描述

`MElevatedButton` 是悬浮按钮，继承自 `MButtonBase`，带有 Material Design 风格的阴影效果，适合作为页面中的主要操作按钮。

**继承：** `MButtonBase`

---

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `elevation` | `qreal` | 2.0 | 默认阴影高度 |
| `pressedElevation` | `qreal` | 8.0 | 按下时的阴影高度 |
| `backgroundColor` | `QColor` | `primaryColor()` | 按钮的背景颜色 |

---

### 公有成员函数

#### 构造函数

---

##### `explicit MElevatedButton(QWidget *parent = nullptr)`

构造一个默认的悬浮按钮实例。

| 参数 | 类型 | 描述 |
|------|------|------|
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

**说明：** 创建一个空白的悬浮按钮，需要后续设置文本或图标。默认启用悬停提升效果。

---

##### `explicit MElevatedButton(const QString &text, QWidget *parent = nullptr)`

构造一个带有指定文本的悬浮按钮。

| 参数 | 类型 | 描述 |
|------|------|------|
| `text` | `const QString &` | 按钮上显示的文本 |
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

---

##### `MElevatedButton(const QIcon &icon, const QString &text, QWidget *parent = nullptr)`

构造一个带有图标和文本的悬浮按钮。

| 参数 | 类型 | 描述 |
|------|------|------|
| `icon` | `const QIcon &` | 按钮上显示的图标 |
| `text` | `const QString &` | 按钮上显示的文本 |
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

---

#### 阴影控制

---

##### `qreal elevation() const`

获取默认阴影高度。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `qreal` | 当前默认阴影高度 |

---

##### `void setElevation(qreal elevation)`

设置默认阴影高度。

| 参数 | 类型 | 描述 |
|------|------|------|
| `elevation` | `qreal` | 新的阴影高度 |

**说明：** 控制按钮在常态下的阴影强度。值越大阴影越明显。调用后会触发重绘。

---

##### `qreal pressedElevation() const`

获取按下时的阴影高度。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `qreal` | 当前按下时的阴影高度 |

---

##### `void setPressedElevation(qreal elevation)`

设置按下时的阴影高度。

| 参数 | 类型 | 描述 |
|------|------|------|
| `elevation` | `qreal` | 新的按下阴影高度 |

**说明：** 控制按钮在按下状态下的阴影高度，通常比默认值更大，以产生按下的立体感。调用后会触发重绘。

---

#### 背景颜色

---

##### `QColor backgroundColor() const`

获取按钮的背景颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前背景颜色 |

---

##### `void setBackgroundColor(const QColor &color)`

设置按钮的背景颜色。

| 参数 | 类型 | 描述 |
|------|------|------|
| `color` | `const QColor &` | 新的背景颜色 |

**说明：** 更改按钮的填充颜色。文本颜色会根据背景色自动计算对比色以确保可读性。调用后会触发重绘。

---

### 重载的保护成员函数

---

##### `void paintBackground(QPainter &painter, const QRect &rect) override`

绘制悬浮按钮的背景。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |
| `rect` | `const QRect &` | 按钮的矩形区域 |

**说明：** 使用 `backgroundColor()` 绘制圆角矩形背景。禁用状态下透明度降至 0.12。

---

##### `void paintBorder(QPainter &painter, const QRect &rect) override`

绘制悬浮按钮的边框。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |
| `rect` | `const QRect &` | 按钮的矩形区域 |

**说明：** 悬浮按钮通常不需要边框，此函数为空实现。

---

##### `QColor getCurrentTextColor() const override`

获取当前文本颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前文本颜色 |

**说明：** 按钮启用时返回与背景色对比的颜色（黑色或白色）。禁用时返回半透明灰色。

---

##### `QColor getCurrentIconColor() const override`

获取当前图标颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前图标颜色 |

**说明：** 与 `getCurrentTextColor()` 返回相同颜色。

---

##### `void mousePressEvent(QMouseEvent *event) override`

鼠标按下事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QMouseEvent *` | 鼠标事件对象 |

**说明：** 左键按下时启动阴影提升动画（提升到 `pressedElevation`）。然后调用基类实现。

---

##### `void mouseReleaseEvent(QMouseEvent *event) override`

鼠标释放事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QMouseEvent *` | 鼠标事件对象 |

**说明：** 左键释放时启动阴影恢复动画（恢复到 `elevation`）。然后调用基类实现。

---

##### `void enterEvent(QEnterEvent *event) override`

鼠标进入事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QEnterEvent *` | 进入事件对象 |

**说明：** 调用基类实现处理悬停效果。如果未按下且悬停提升效果启用，阴影高度保持不变（由基类控制偏移量）。

---

##### `void leaveEvent(QEvent *event) override`

鼠标离开事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QEvent *` | 事件对象 |

**说明：** 调用基类实现处理悬停效果。如果未按下，阴影高度恢复到默认值。

---

### 示例代码

```cpp
MElevatedButton *button = new MElevatedButton("Save Changes", this);
button->setElevation(4.0);
button->setPressedElevation(12.0);
button->setBackgroundColor(QColor("#1976D2"));
button->setPrimaryColor(QColor("#1976D2"));
button->setCornerRadius(8);
button->setAnimationDuration(200);
```

---

## MFilledButton

### 类描述

`MFilledButton` 是填充按钮，继承自 `MButtonBase`，使用纯色背景，适合作为页面中的主要操作按钮。

**继承：** `MButtonBase`

---

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `backgroundColor` | `QColor` | `primaryColor()` | 按钮的背景颜色 |

---

### 公有成员函数

#### 构造函数

---

##### `explicit MFilledButton(QWidget *parent = nullptr)`

构造一个默认的填充按钮实例。

| 参数 | 类型 | 描述 |
|------|------|------|
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

**说明：** 创建一个空白的填充按钮，背景色默认使用主题色。

---

##### `explicit MFilledButton(const QString &text, QWidget *parent = nullptr)`

构造一个带有指定文本的填充按钮。

| 参数 | 类型 | 描述 |
|------|------|------|
| `text` | `const QString &` | 按钮上显示的文本 |
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

---

##### `MFilledButton(const QIcon &icon, const QString &text, QWidget *parent = nullptr)`

构造一个带有图标和文本的填充按钮。

| 参数 | 类型 | 描述 |
|------|------|------|
| `icon` | `const QIcon &` | 按钮上显示的图标 |
| `text` | `const QString &` | 按钮上显示的文本 |
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

---

#### 背景颜色

---

##### `QColor backgroundColor() const`

获取按钮的背景颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前背景颜色 |

---

##### `void setBackgroundColor(const QColor &color)`

设置按钮的背景颜色。

| 参数 | 类型 | 描述 |
|------|------|------|
| `color` | `const QColor &` | 新的背景颜色 |

**说明：** 更改按钮的填充颜色。文本颜色会根据背景色自动计算对比色以确保可读性。调用后会触发重绘。

---

### 重载的保护成员函数

---

##### `void paintBackground(QPainter &painter, const QRect &rect) override`

绘制填充按钮的背景。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |
| `rect` | `const QRect &` | 按钮的矩形区域 |

**说明：** 使用 `backgroundColor()` 绘制圆角矩形背景。禁用状态下透明度降至 0.12。

---

##### `void paintBorder(QPainter &painter, const QRect &rect) override`

绘制填充按钮的边框。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |
| `rect` | `const QRect &` | 按钮的矩形区域 |

**说明：** 填充按钮通常不需要边框。仅在禁用状态下绘制半透明细边框以提供视觉区分。

---

##### `QColor getCurrentTextColor() const override`

获取当前文本颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前文本颜色 |

**说明：** 按钮启用时返回与背景色对比的颜色（黑色或白色）。禁用时返回半透明灰色。

---

##### `QColor getCurrentIconColor() const override`

获取当前图标颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前图标颜色 |

**说明：** 与 `getCurrentTextColor()` 返回相同颜色。

---

### 示例代码

```cpp
MFilledButton *button = new MFilledButton("Submit", this);
button->setBackgroundColor(QColor("#1976D2"));
button->setPrimaryColor(QColor("#1976D2"));
button->setCornerRadius(8);
button->setAnimationDuration(200);
```

---

## MOutlinedButton

### 类描述

`MOutlinedButton` 是描边按钮，继承自 `MButtonBase`，透明背景带有彩色边框，适合作为次要操作按钮。

**继承：** `MButtonBase`

---

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `borderWidth` | `qreal` | 1.0 | 边框宽度（像素） |

---

### 公有成员函数

#### 构造函数

---

##### `explicit MOutlinedButton(QWidget *parent = nullptr)`

构造一个默认的描边按钮实例。

| 参数 | 类型 | 描述 |
|------|------|------|
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

**说明：** 创建一个空白的描边按钮，背景透明，带有彩色边框。

---

##### `explicit MOutlinedButton(const QString &text, QWidget *parent = nullptr)`

构造一个带有指定文本的描边按钮。

| 参数 | 类型 | 描述 |
|------|------|------|
| `text` | `const QString &` | 按钮上显示的文本 |
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

---

##### `MOutlinedButton(const QIcon &icon, const QString &text, QWidget *parent = nullptr)`

构造一个带有图标和文本的描边按钮。

| 参数 | 类型 | 描述 |
|------|------|------|
| `icon` | `const QIcon &` | 按钮上显示的图标 |
| `text` | `const QString &` | 按钮上显示的文本 |
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

---

#### 边框控制

---

##### `qreal borderWidth() const`

获取边框宽度。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `qreal` | 当前边框宽度（像素） |

---

##### `void setBorderWidth(qreal width)`

设置边框宽度。

| 参数 | 类型 | 描述 |
|------|------|------|
| `width` | `qreal` | 新的边框宽度（像素） |

**说明：** 控制按钮边框的粗细。调用后会触发重绘。

---

### 重载的保护成员函数

---

##### `void paintBackground(QPainter &painter, const QRect &rect) override`

绘制描边按钮的背景。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |
| `rect` | `const QRect &` | 按钮的矩形区域 |

**说明：** 描边按钮背景透明，此函数为空实现。

---

##### `void paintBorder(QPainter &painter, const QRect &rect) override`

绘制描边按钮的边框。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |
| `rect` | `const QRect &` | 按钮的矩形区域 |

**说明：** 使用 `outlineColor()` 获取边框颜色，使用 `borderWidth()` 获取边框宽度。悬停或聚焦时边框颜色变为主题色，常态下为半透明灰色。

---

##### `QColor getCurrentTextColor() const override`

获取当前文本颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前文本颜色 |

**说明：** 按钮启用时返回主题色。禁用时返回半透明灰色。

---

##### `QColor getCurrentIconColor() const override`

获取当前图标颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前图标颜色 |

**说明：** 与 `getCurrentTextColor()` 返回相同颜色。

---

### 示例代码

```cpp
MOutlinedButton *button = new MOutlinedButton("Cancel", this);
button->setBorderWidth(2.0);
button->setPrimaryColor(QColor("#1976D2"));
button->setCornerRadius(8);
button->setAnimationDuration(200);
```

---

## MTextButton

### 类描述

`MTextButton` 是文本按钮，继承自 `MButtonBase`，无背景无边框，适合作为辅助操作按钮。

**继承：** `MButtonBase`

---

### 公有成员函数

#### 构造函数

---

##### `explicit MTextButton(QWidget *parent = nullptr)`

构造一个默认的文本按钮实例。

| 参数 | 类型 | 描述 |
|------|------|------|
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

**说明：** 创建一个空白的文本按钮，仅显示文本，无背景和边框。

---

##### `explicit MTextButton(const QString &text, QWidget *parent = nullptr)`

构造一个带有指定文本的文本按钮。

| 参数 | 类型 | 描述 |
|------|------|------|
| `text` | `const QString &` | 按钮上显示的文本 |
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

---

##### `MTextButton(const QIcon &icon, const QString &text, QWidget *parent = nullptr)`

构造一个带有图标和文本的文本按钮。

| 参数 | 类型 | 描述 |
|------|------|------|
| `icon` | `const QIcon &` | 按钮上显示的图标 |
| `text` | `const QString &` | 按钮上显示的文本 |
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

---

### 重载的保护成员函数

---

##### `void paintBackground(QPainter &painter, const QRect &rect) override`

绘制文本按钮的背景。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |
| `rect` | `const QRect &` | 按钮的矩形区域 |

**说明：** 文本按钮背景透明，此函数为空实现。

---

##### `void paintBorder(QPainter &painter, const QRect &rect) override`

绘制文本按钮的边框。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |
| `rect` | `const QRect &` | 按钮的矩形区域 |

**说明：** 文本按钮无边框，此函数为空实现。

---

##### `QColor getCurrentTextColor() const override`

获取当前文本颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前文本颜色 |

**说明：** 按钮启用时返回主题色。按下时透明度降至 0.5，悬停时透明度为 0.8。禁用时返回半透明灰色。

---

##### `QColor getCurrentIconColor() const override`

获取当前图标颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前图标颜色 |

**说明：** 与 `getCurrentTextColor()` 返回相同颜色。

---

### 示例代码

```cpp
MTextButton *button = new MTextButton("Learn More", this);
button->setPrimaryColor(QColor("#1976D2"));
button->setCornerRadius(8);
button->setAnimationDuration(200);
```

---

## MToggleButton

### 类描述

`MToggleButton` 是切换按钮，继承自 `MButtonBase`，支持选中和未选中两种状态，提供三种样式可供选择。

**继承：** `MButtonBase`

---

### 枚举类型

| 枚举名 | 值 | 描述 |
|--------|-----|------|
| `StyleFilled` | 0 | 填充样式，类似 MFilledButton |
| `StyleOutlined` | 1 | 描边样式，类似 MOutlinedButton（默认） |
| `StyleText` | 2 | 文本样式，类似 MTextButton |

---

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `checked` | `bool` | false | 是否处于选中状态 |
| `checkedColor` | `QColor` | `primaryColor()` | 选中状态的颜色 |
| `uncheckedColor` | `QColor` | `palette().color(QPalette::ButtonText)` | 未选中状态的颜色 |
| `toggleStyle` | `ToggleStyle` | `StyleOutlined` | 切换按钮的样式 |

---

### 公有成员函数

#### 构造函数

---

##### `explicit MToggleButton(QWidget *parent = nullptr)`

构造一个默认的切换按钮实例。

| 参数 | 类型 | 描述 |
|------|------|------|
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

**说明：** 创建一个空白的切换按钮，默认处于未选中状态，样式为 `StyleOutlined`。

---

##### `explicit MToggleButton(const QString &text, QWidget *parent = nullptr)`

构造一个带有指定文本的切换按钮。

| 参数 | 类型 | 描述 |
|------|------|------|
| `text` | `const QString &` | 按钮上显示的文本 |
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

---

##### `MToggleButton(const QIcon &icon, const QString &text, QWidget *parent = nullptr)`

构造一个带有图标和文本的切换按钮。

| 参数 | 类型 | 描述 |
|------|------|------|
| `icon` | `const QIcon &` | 按钮上显示的图标 |
| `text` | `const QString &` | 按钮上显示的文本 |
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

---

#### 状态控制

---

##### `bool isChecked() const`

检查按钮是否处于选中状态。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `bool` | 如果选中返回 `true`，否则返回 `false` |

---

##### `void setChecked(bool checked)`

设置按钮的选中状态。

| 参数 | 类型 | 描述 |
|------|------|------|
| `checked` | `bool` | `true` 表示选中，`false` 表示未选中 |

**说明：** 更改选中状态，更新按钮样式并触发 `toggled()` 信号。调用后会触发重绘。

---

#### 颜色配置

---

##### `QColor checkedColor() const`

获取选中状态的颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前选中状态颜色 |

---

##### `void setCheckedColor(const QColor &color)`

设置选中状态的颜色。

| 参数 | 类型 | 描述 |
|------|------|------|
| `color` | `const QColor &` | 新的选中状态颜色 |

**说明：** 选中状态的颜色用于按钮的背景、边框和文字。调用后会触发重绘。

---

##### `QColor uncheckedColor() const`

获取未选中状态的颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前未选中状态颜色 |

---

##### `void setUncheckedColor(const QColor &color)`

设置未选中状态的颜色。

| 参数 | 类型 | 描述 |
|------|------|------|
| `color` | `const QColor &` | 新的未选中状态颜色 |

**说明：** 未选中状态的颜色用于按钮的边框和文字。调用后会触发重绘。

---

#### 样式配置

---

##### `ToggleStyle toggleStyle() const`

获取当前切换样式。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `ToggleStyle` | 当前样式枚举值 |

---

##### `void setToggleStyle(ToggleStyle style)`

设置切换样式。

| 参数 | 类型 | 描述 |
|------|------|------|
| `style` | `ToggleStyle` | 新的样式值 |

**说明：** 切换按钮的外观样式，可选 `StyleFilled`、`StyleOutlined` 或 `StyleText`。调用后会更新相关开关并触发重绘。

---

#### 图标配置

---

##### `void setCheckedIcon(const QIcon &icon)`

设置选中状态下的图标。

| 参数 | 类型 | 描述 |
|------|------|------|
| `icon` | `const QIcon &` | 选中状态显示的图标 |

**说明：** 当按钮处于选中状态时显示此图标。调用后会触发重绘。

---

##### `void setUncheckedIcon(const QIcon &icon)`

设置未选中状态下的图标。

| 参数 | 类型 | 描述 |
|------|------|------|
| `icon` | `const QIcon &` | 未选中状态显示的图标 |

**说明：** 当按钮处于未选中状态时显示此图标。调用后会触发重绘。

---

### 信号

---

##### `void toggled(bool checked)`

当按钮的选中状态改变时发出此信号。

| 参数 | 类型 | 描述 |
|------|------|------|
| `checked` | `bool` | 新的选中状态 |

**说明：** 当调用 `setChecked()` 或用户点击按钮时触发。

---

### 重载的保护成员函数

---

##### `void paintBackground(QPainter &painter, const QRect &rect) override`

绘制切换按钮的背景。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |
| `rect` | `const QRect &` | 按钮的矩形区域 |

**说明：**
- `StyleFilled`：使用 `getCurrentBackgroundColor()` 填充圆角矩形背景
- `StyleOutlined`：背景透明
- `StyleText`：背景透明

---

##### `void paintBorder(QPainter &painter, const QRect &rect) override`

绘制切换按钮的边框。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter &` | 绘图上下文 |
| `rect` | `const QRect &` | 按钮的矩形区域 |

**说明：** 仅在 `StyleOutlined` 样式下绘制边框，颜色根据选中状态使用 `checkedColor` 或 `uncheckedColor`。

---

##### `QColor getCurrentTextColor() const override`

获取当前文本颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前文本颜色 |

**说明：**
- `StyleFilled`：返回与背景色对比的颜色
- `StyleOutlined` / `StyleText`：选中时返回 `checkedColor`，未选中时返回 `uncheckedColor`

---

##### `QColor getCurrentIconColor() const override`

获取当前图标颜色。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QColor` | 当前图标颜色 |

**说明：** 与 `getCurrentTextColor()` 返回相同颜色。

---

##### `void mouseReleaseEvent(QMouseEvent *event) override`

鼠标释放事件处理函数。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QMouseEvent *` | 鼠标事件对象 |

**说明：** 左键在按钮区域内释放时切换选中状态。然后调用基类实现。

---

### 示例代码

```cpp
// 创建切换按钮
MToggleButton *button = new MToggleButton("Enable Feature", this);
button->setCheckedColor(QColor("#1976D2"));
button->setUncheckedColor(Qt::gray);
button->setToggleStyle(MToggleButton::StyleFilled);
button->setCornerRadius(8);

// 设置不同状态的图标
button->setCheckedIcon(QIcon(":/icons/on.png"));
button->setUncheckedIcon(QIcon(":/icons/off.png"));

// 连接状态变化信号
connect(button, &MToggleButton::toggled, [](bool checked) {
    if (checked) {
        qDebug() << "Feature enabled";
    } else {
        qDebug() << "Feature disabled";
    }
});

// 初始设置为选中状态
button->setChecked(true);
```
