# MCard 卡片组件

## 概述

MCard 是一个 Material Design 风格的卡片组件，继承自 `MWidgetBase`，用于在应用程序中展示内容块。它支持标题、副标题、自定义内容、选中状态、点击交互和多种样式模式。

---

## 类列表

| 类名 | 描述 |
|------|------|
| [MCard](#mcard) | 卡片组件，支持标题、内容、交互和样式定制 |

---

## MCard

### 类描述

`MCard` 继承自 `MWidgetBase`，提供了一个可交互的内容容器。它支持标题和副标题显示、自定义内容小部件、点击和选中状态、悬停提升效果以及描边/悬浮样式模式。

**继承：** `MWidgetBase`

---

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `checkable` | `bool` | false | 卡片是否可切换选中状态 |
| `checked` | `bool` | false | 卡片是否处于选中状态 |
| `clickable` | `bool` | true | 卡片是否可点击 |

---

### 公有成员函数

#### 构造函数

---

##### `explicit MCard(QWidget *parent = nullptr)`

构造一个默认的卡片实例。

| 参数 | 类型 | 描述 |
|------|------|------|
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

**说明：** 创建一个空白卡片，默认有阴影和圆角，大小为自适应。

---

##### `explicit MCard(const QString &title, QWidget *parent = nullptr)`

构造一个带有标题的卡片。

| 参数 | 类型 | 描述 |
|------|------|------|
| `title` | `const QString &` | 卡片标题文本 |
| `parent` | `QWidget *` | 父窗口指针，默认为 `nullptr` |

**说明：** 创建卡片并设置标题。标题显示在卡片顶部。

---

##### `~MCard()`

析构函数，清理卡片资源。

---

#### 内容设置

---

##### `void setTitle(const QString &title)`

设置卡片的标题。

| 参数 | 类型 | 描述 |
|------|------|------|
| `title` | `const QString &` | 标题文本 |

**说明：** 标题显示在卡片顶部，使用中等字重。如果标题为空，标题区域会自动隐藏。调用后卡片大小会自动调整。

---

##### `QString title() const`

获取卡片的标题。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QString` | 当前标题文本 |

---

##### `void setSubtitle(const QString &subtitle)`

设置卡片的副标题。

| 参数 | 类型 | 描述 |
|------|------|------|
| `subtitle` | `const QString &` | 副标题文本 |

**说明：** 副标题显示在标题下方，使用较小的字体。如果副标题为空，副标题区域会自动隐藏。调用后卡片大小会自动调整。

---

##### `QString subtitle() const`

获取卡片的副标题。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QString` | 当前副标题文本 |

---

##### `void setContentWidget(QWidget *widget)`

设置卡片的内容小部件。

| 参数 | 类型 | 描述 |
|------|------|------|
| `widget` | `QWidget *` | 要显示的内容小部件 |

**说明：** 将任意 QWidget 设置为卡片的内容区域。内容小部件会自动填充卡片主体区域，并继承透明背景。如果已有内容小部件，会被替换并删除。调用后卡片大小会自动调整。

---

##### `QWidget* contentWidget() const`

获取当前的内容小部件。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QWidget *` | 当前内容小部件指针，如果没有则返回 `nullptr` |

---

#### 自适应控制

---

##### `void setAutoResize(bool autoResize)`

设置卡片是否自动调整大小。

| 参数 | 类型 | 描述 |
|------|------|------|
| `autoResize` | `bool` | `true` 表示自动调整，`false` 表示固定大小 |

**说明：** 启用时，卡片会根据标题、副标题和内容的大小自动调整尺寸。禁用时，可以使用 `setFixedWidth()`、`setFixedHeight()` 等方法手动控制大小。

---

##### `bool autoResize() const`

检查卡片是否自动调整大小。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `bool` | 如果自动调整返回 `true`，否则返回 `false` |

---

##### `QSize contentSizeHint() const`

获取内容区域的建议大小。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QSize` | 内容区域的建议尺寸 |

**说明：** 计算标题、副标题和内容小部件的总大小，用于确定卡片的合适尺寸。

---

#### 交互模式

---

##### `void setCheckable(bool checkable)`

设置卡片是否可切换选中状态。

| 参数 | 类型 | 描述 |
|------|------|------|
| `checkable` | `bool` | `true` 表示可切换，`false` 表示不可切换 |

**说明：** 启用后，点击卡片会在选中和未选中状态之间切换。选中状态下卡片边框会高亮为主题色。

---

##### `bool isCheckable() const`

检查卡片是否可切换选中状态。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `bool` | 如果可切换返回 `true`，否则返回 `false` |

---

##### `void setChecked(bool checked)`

设置卡片的选中状态。

| 参数 | 类型 | 描述 |
|------|------|------|
| `checked` | `bool` | `true` 表示选中，`false` 表示未选中 |

**说明：** 仅当 `checkable` 为 `true` 时生效。选中状态会改变卡片的背景色和边框颜色。调用后会触发 `checkedChanged()` 信号。

---

##### `bool isChecked() const`

检查卡片是否处于选中状态。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `bool` | 如果选中返回 `true`，否则返回 `false` |

---

##### `void setClickable(bool clickable)`

设置卡片是否可点击。

| 参数 | 类型 | 描述 |
|------|------|------|
| `clickable` | `bool` | `true` 表示可点击，`false` 表示不可点击 |

**说明：** 启用时，鼠标悬停会变为手型指针，点击会触发 `clicked()` 信号。禁用时卡片不会响应点击交互。

---

##### `bool isClickable() const`

检查卡片是否可点击。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `bool` | 如果可点击返回 `true`，否则返回 `false` |

---

#### 卡片样式

---

##### `void setOutlined(bool outlined)`

设置卡片是否为描边样式。

| 参数 | 类型 | 描述 |
|------|------|------|
| `outlined` | `bool` | `true` 表示描边样式，`false` 表示填充样式 |

**说明：** 描边样式下，卡片背景透明，带有彩色边框，阴影被禁用。填充样式下，卡片有背景色和阴影。

---

##### `bool isOutlined() const`

检查卡片是否为描边样式。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `bool` | 如果是描边样式返回 `true`，否则返回 `false` |

---

##### `void setElevated(bool elevated)`

设置卡片是否为高悬浮样式。

| 参数 | 类型 | 描述 |
|------|------|------|
| `elevated` | `bool` | `true` 表示高悬浮样式，`false` 表示普通样式 |

**说明：** 高悬浮样式下，卡片的阴影高度增加到 4.0，并自动禁用描边模式。普通样式下，阴影高度为 1.0。

---

##### `bool isElevated() const`

检查卡片是否为高悬浮样式。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `bool` | 如果是高悬浮样式返回 `true`，否则返回 `false` |

---

##### `void setCornerRadius(qreal radius)`

设置卡片的圆角半径。

| 参数 | 类型 | 描述 |
|------|------|------|
| `radius` | `qreal` | 圆角半径（像素） |

**说明：** 覆盖基类的 `setCornerRadius()` 方法，在设置圆角后会更新遮罩区域。

---

##### `void setShadowEnabled(bool enabled)`

设置是否启用阴影。

| 参数 | 类型 | 描述 |
|------|------|------|
| `enabled` | `bool` | `true` 表示启用，`false` 表示禁用 |

**说明：** 覆盖基类方法，在阴影状态变化时会更新布局边距和遮罩。

---

#### 尺寸控制

---

##### `void setFixedWidth(int width)`

设置卡片的固定宽度。

| 参数 | 类型 | 描述 |
|------|------|------|
| `width` | `int` | 固定宽度（像素），不能小于 `MIN_CARD_WIDTH`（100） |

**说明：** 调用此方法会自动禁用 `autoResize`。

---

##### `void setFixedHeight(int height)`

设置卡片的固定高度。

| 参数 | 类型 | 描述 |
|------|------|------|
| `height` | `int` | 固定高度（像素），不能小于 `MIN_CARD_HEIGHT`（80） |

**说明：** 调用此方法会自动禁用 `autoResize`。

---

##### `void setMaximumWidth(int width)`

设置卡片的最大宽度。

| 参数 | 类型 | 描述 |
|------|------|------|
| `width` | `int` | 最大宽度（像素），不能小于 `MIN_CARD_WIDTH`（100） |

**说明：** 调用此方法会自动禁用 `autoResize`。

---

##### `void setMaximumHeight(int height)`

设置卡片的最大高度。

| 参数 | 类型 | 描述 |
|------|------|------|
| `height` | `int` | 最大高度（像素），不能小于 `MIN_CARD_HEIGHT`（80） |

**说明：** 调用此方法会自动禁用 `autoResize`。

---

##### `void setMinimumWidth(int width)`

设置卡片的最小宽度。

| 参数 | 类型 | 描述 |
|------|------|------|
| `width` | `int` | 最小宽度（像素），不能小于 `MIN_CARD_WIDTH`（100） |

**说明：** 调用此方法会自动禁用 `autoResize`。

---

##### `void setMinimumHeight(int height)`

设置卡片的最小高度。

| 参数 | 类型 | 描述 |
|------|------|------|
| `height` | `int` | 最小高度（像素），不能小于 `MIN_CARD_HEIGHT`（80） |

**说明：** 调用此方法会自动禁用 `autoResize`。

---

### 信号

---

##### `void clicked()`

当卡片被点击时发出。

**说明：** 仅在 `clickable` 为 `true` 时触发。点击事件在鼠标释放时检测。

---

##### `void pressed()`

当卡片被按下时发出。

**说明：** 鼠标左键按下时立即触发。

---

##### `void released()`

当卡片被释放时发出。

**说明：** 鼠标左键释放时触发。

---

##### `void checkedChanged(bool checked)`

当卡片的选中状态改变时发出。

| 参数 | 类型 | 描述 |
|------|------|------|
| `checked` | `bool` | 新的选中状态 |

**说明：** 仅在 `checkable` 为 `true` 且状态发生变化时触发。

---

##### `void entered()`

当鼠标进入卡片区域时发出。

---

##### `void left()`

当鼠标离开卡片区域时发出。

---

### 重载的保护成员函数

---

##### `void drawForeground(QPainter *painter, const QRect &rect) override`

绘制卡片的前景内容。

| 参数 | 类型 | 描述 |
|------|------|------|
| `painter` | `QPainter *` | 绘图上下文 |
| `rect` | `const QRect &` | 绘制区域 |

**说明：** 在描边模式下绘制卡片边框。选中时边框为主题色（2px），悬停时为轮廓色（1px），普通状态为虚线轮廓。

---

##### `void onHoverEnter() override`

鼠标进入时的处理函数。

**说明：** 更新悬停状态，触发 `entered()` 信号。在可点击且非描边模式下，根据是否高悬浮样式执行对应的提升动画。

---

##### `void onHoverLeave() override`

鼠标离开时的处理函数。

**说明：** 更新悬停状态，触发 `left()` 信号。在可点击且非描边模式下，恢复阴影高度。

---

##### `void onPress() override`

按下时的处理函数。

**说明：** 触发 `pressed()` 信号。在可点击模式下，降低阴影高度以模拟按下效果。

---

##### `void onRelease() override`

释放时的处理函数。

**说明：** 触发 `released()` 信号。在可点击模式下，根据悬停状态恢复相应的阴影高度。

---

##### `void mousePressEvent(QMouseEvent *event) override`

鼠标按下事件处理。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QMouseEvent *` | 鼠标事件对象 |

**说明：** 左键按下且可点击时，设置按下状态并触发 `pressed()` 信号。然后调用基类实现。

---

##### `void mouseReleaseEvent(QMouseEvent *event) override`

鼠标释放事件处理。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QMouseEvent *` | 鼠标事件对象 |

**说明：** 左键释放且可点击时，取消按下状态并触发 `released()` 信号。如果鼠标在卡片区域内释放，触发 `clicked()` 信号，并在可切换状态下切换选中状态。然后调用基类实现。

---

##### `void mouseDoubleClickEvent(QMouseEvent *event) override`

鼠标双击事件处理。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QMouseEvent *` | 鼠标事件对象 |

**说明：** 可点击时触发 `clicked()` 信号。

---

##### `void resizeEvent(QResizeEvent *event) override`

大小改变事件处理。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `QResizeEvent *` | 大小改变事件对象 |

**说明：** 调用基类实现并更新遮罩区域。

---

##### `QSize sizeHint() const override`

获取卡片的建议大小。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QSize` | 建议的卡片尺寸 |

**说明：** 在自动调整模式下，返回内容大小加上内边距。最小尺寸受 `MIN_CARD_WIDTH`（100）和 `MIN_CARD_HEIGHT`（80）限制。

---

##### `QSize minimumSizeHint() const override`

获取卡片的最小大小。

| 返回值 | 类型 | 描述 |
|--------|------|------|
| 返回 | `QSize` | 最小尺寸 |

**说明：** 返回 `MIN_CARD_WIDTH` x `MIN_CARD_HEIGHT`。

---

##### `virtual void updateCardAppearance()`

更新卡片的外观。

**说明：** 更新样式并触发重绘。子类可以重写此方法以自定义外观更新逻辑。

---

### 私有成员函数

---

##### `void initCard()`

初始化卡片。

**说明：** 设置默认属性（圆角 12、阴影高度 1.0、启用阴影），创建布局，更新外观。

---

##### `void setupLayout()`

设置卡片的布局结构。

**说明：** 创建垂直布局，包含标题区域和内容容器。标题区域包含标题和副标题标签。

---

##### `void updateStyle()`

更新卡片的样式。

**说明：** 根据选中状态、悬停状态和样式模式更新标题颜色、副标题颜色和背景色。

---

##### `void updateSizePolicy()`

更新大小策略。

**说明：** 在自动调整模式下设置为 Preferred/Preferred，否则设置为 Fixed/Fixed。

---

##### `void updateMask()`

更新卡片的遮罩区域。

**说明：** 使用圆角矩形路径创建遮罩，确保子组件不会溢出圆角边界。

---

##### `void updateLayoutMargins()`

更新布局边距。

**说明：** 根据阴影启用状态调整布局边距，为阴影预留空间。

---

### 私有槽函数

---

##### `void onContentClicked()`

内容被点击时的槽函数。

**说明：** 当内容小部件被点击时触发卡片的点击和选中逻辑。

---

### 常量

| 常量名 | 值 | 描述 |
|--------|-----|------|
| `MIN_CARD_WIDTH` | 100 | 卡片最小宽度（像素） |
| `MIN_CARD_HEIGHT` | 80 | 卡片最小高度（像素） |
| `SHADOW_MARGIN` | 10 | 阴影预留边距（像素） |

---

### 示例代码

#### 基础用法

```cpp
// 创建带标题的卡片
MCard *card = new MCard("设置", this);
card->setSubtitle("调整应用程序偏好");

// 添加内容小部件
QWidget *content = new QWidget();
QVBoxLayout *contentLayout = new QVBoxLayout(content);
contentLayout->addWidget(new QCheckBox("启用自动保存"));
contentLayout->addWidget(new QCheckBox("显示通知"));
card->setContentWidget(content);

// 启用选中
card->setCheckable(true);
card->setChecked(true);

connect(card, &MCard::clicked, []() {
    qDebug() << "卡片被点击";
});
connect(card, &MCard::checkedChanged, [](bool checked) {
    qDebug() << "选中状态:" << checked;
});
```

#### 样式模式

```cpp
// 普通卡片（默认）
MCard *normalCard = new MCard("普通卡片", this);
normalCard->setElevation(2.0);

// 描边卡片
MCard *outlinedCard = new MCard("描边卡片", this);
outlinedCard->setOutlined(true);

// 高悬浮卡片
MCard *elevatedCard = new MCard("高悬浮卡片", this);
elevatedCard->setElevated(true);

// 可选中卡片
MCard *selectableCard = new MCard("可选中卡片", this);
selectableCard->setCheckable(true);
selectableCard->setChecked(false);
```

#### 自定义尺寸

```cpp
MCard *card = new MCard("固定大小卡片", this);

// 方式一：设置固定尺寸（自动禁用 autoResize）
card->setFixedWidth(300);
card->setFixedHeight(200);

// 方式二：设置最小/最大尺寸
card->setMinimumWidth(200);
card->setMaximumWidth(500);
card->setMinimumHeight(100);
card->setMaximumHeight(300);

// 方式三：恢复自动调整
card->setAutoResize(true);
```

#### 交互控制

```cpp
MCard *card = new MCard("交互卡片", this);

// 禁用点击（只读模式）
card->setClickable(false);

// 启用选中模式
card->setCheckable(true);

// 连接所有信号
connect(card, &MCard::clicked, this, &MyWidget::onCardClicked);
connect(card, &MCard::pressed, this, &MyWidget::onCardPressed);
connect(card, &MCard::released, this, &MyWidget::onCardReleased);
connect(card, &MCard::entered, this, &MyWidget::onCardEntered);
connect(card, &MCard::left, this, &MyWidget::onCardLeft);
```

#### 动态更新内容

```cpp
MCard *card = new MCard(this);

// 更新标题
card->setTitle("新标题");

// 更新副标题
card->setSubtitle("新的副标题");

// 替换内容小部件
QWidget *newContent = new QWidget();
newContent->setStyleSheet("background: #f0f0f0;");
card->setContentWidget(newContent);

// 卡片会自动调整大小
```

#### 卡片列表

```cpp
QWidget *container = new QWidget();
QVBoxLayout *layout = new QVBoxLayout(container);

// 创建多个卡片
for (int i = 0; i < 5; ++i) {
    MCard *card = new MCard(QString("项目 #%1").arg(i + 1), container);
    card->setSubtitle(QString("这是第 %1 个卡片").arg(i + 1));
    card->setCheckable(true);
    layout->addWidget(card);
}

// 所有卡片自动排列
```