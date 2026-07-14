---
title: "流式读取"
order: 2
---
# litexml::stream API 文档

## 概述

`litexml::stream` 是一个高性能的流式XML解析库，采用事件驱动模型，支持Unicode编码、命名空间、实体解析等完整的XML 1.0特性。该库提供了基于回调、事件队列和处理器接口三种使用方式。

**命名空间:** `litexml::stream`

---

## 类索引

| 类名 | 描述 |
|------|------|
| [Location](#location) | 表示解析位置信息 |
| [Attribute](#attribute) | XML属性 |
| [ElementInfo](#elementinfo) | XML元素信息 |
| [ParseEvent](#parseevent) | 解析事件 |
| [ParseError](#parseerror) | 解析错误 |
| [EventHandler](#eventhandler) | 事件处理器接口 |
| [ReaderConfig](#readerconfig) | 读取器配置 |
| [StreamReader](#streamreader) | 流式读取器 |
| [FastBuffer](#fastbuffer) | 高性能缓冲区 |
| [UnicodeConverter](#unicodeconverter) | Unicode转换工具 |
| [UnicodeDecoder](#unicodedecoder) | Unicode解码器 |
| [Namespace](#namespace) | 命名空间信息 |
| [TextBuffer](#textbuffer) | 文本缓冲区（内部类） |

---

## Location

表示解析位置信息。

```cpp
struct Location {
    size_t line{1};
    size_t column{1};
    size_t offset{0};
    
    std::string to_string() const;
};
```

### 成员变量

| 变量 | 类型 | 描述 |
|------|------|------|
| `line` | `size_t` | 行号（从1开始） |
| `column` | `size_t` | 列号（从1开始） |
| `offset` | `size_t` | 字节偏移量 |

### 成员函数

#### to_string

```cpp
std::string to_string() const
```

返回格式化的位置字符串，格式为 `"line X, column Y, offset Z"`。

---

## Namespace

表示命名空间信息。

```cpp
struct Namespace {
    std::string prefix;
    std::string uri;
    
    bool operator==(const Namespace& other) const;
};
```

### 成员变量

| 变量 | 类型 | 描述 |
|------|------|------|
| `prefix` | `std::string` | 命名空间前缀 |
| `uri` | `std::string` | 命名空间URI |

---

## Attribute

表示XML属性，提供类型转换方法。

```cpp
class Attribute {
public:
    Attribute();
    Attribute(std::string name, std::string value, Location loc = {});
    
    // 访问器
    const std::string& name() const noexcept;
    const std::string& value() const noexcept;
    const Location& location() const noexcept;
    const std::string& namespace_uri() const noexcept;
    const std::string& local_name() const noexcept;
    const std::string& prefix() const noexcept;
    
    // 类型转换
    template<std::integral T> std::optional<T> as_integer(int base = 10) const;
    template<std::floating_point T> std::optional<T> as_float() const;
    bool as_boolean() const;
    std::optional<std::chrono::system_clock::time_point> as_datetime() const;
};
```

### 成员函数

#### 构造函数

```cpp
Attribute(std::string name, std::string value, Location loc = {})
```

构造一个属性对象。自动解析命名空间信息（前缀和本地名称）。

#### 访问器

| 函数 | 返回值 | 描述 |
|------|--------|------|
| `name()` | `const std::string&` | 获取属性全名 |
| `value()` | `const std::string&` | 获取属性值 |
| `location()` | `const Location&` | 获取属性位置 |
| `namespace_uri()` | `const std::string&` | 获取命名空间URI |
| `local_name()` | `const std::string&` | 获取本地名称（不含前缀） |
| `prefix()` | `const std::string&` | 获取前缀 |

#### as_integer

```cpp
template<std::integral T>
std::optional<T> as_integer(int base = 10) const
```

将属性值转换为整数类型。

- **参数:** `base` - 进制（默认为10）
- **返回:** 成功返回转换值，失败返回 `std::nullopt`
- **示例:**
```cpp
auto count = attr.as_integer<int>();      // 十进制
auto hex = attr.as_integer<int>(16);      // 十六进制
```

#### as_float

```cpp
template<std::floating_point T>
std::optional<T> as_float() const
```

将属性值转换为浮点数类型。

- **返回:** 成功返回转换值，失败返回 `std::nullopt`
- **示例:**
```cpp
auto val = attr.as_float<double>();
```

#### as_boolean

```cpp
bool as_boolean() const
```

将属性值转换为布尔值。

- **返回:** 当值为 `"true"`、`"1"`、`"yes"` 或 `"on"` 时返回 `true`（不区分大小写），否则返回 `false`

#### as_datetime

```cpp
std::optional<std::chrono::system_clock::time_point> as_datetime() const
```

将属性值解析为ISO 8601日期时间。

- **支持格式:** `YYYY-MM-DDTHH:MM:SS`、带毫秒、带时区偏移或 `Z`
- **返回:** 成功返回 `time_point`，失败返回 `std::nullopt`

---

## ElementInfo

表示XML元素信息。

```cpp
class ElementInfo {
public:
    ElementInfo();
    ElementInfo(std::string name, Location start, Location end = {});
    
    // 访问器
    const std::string& name() const noexcept;
    const Location& start_location() const noexcept;
    const Location& end_location() const noexcept;
    const std::vector<Attribute>& attributes() const noexcept;
    const std::vector<Namespace>& namespaces() const noexcept;
    const std::string& namespace_uri() const noexcept;
    const std::string& local_name() const noexcept;
    size_t depth() const noexcept;
    bool is_empty() const noexcept;
    
    // 属性操作
    void add_attribute(Attribute attr);
    std::optional<Attribute> find_attribute(std::string_view name) const;
    std::optional<Attribute> find_attribute(std::string_view namespace_uri, std::string_view local_name) const;
    std::optional<std::string_view> attribute_value(std::string_view name) const;
    
    // 命名空间操作
    void add_namespace(Namespace ns);
    std::optional<std::string_view> get_namespace_uri(std::string_view prefix) const;
    
    // 设置器
    void set_namespace_uri(std::string uri);
    void set_local_name(std::string name);
    void set_depth(size_t depth) noexcept;
    void set_empty(bool empty) noexcept;
};
```

### 成员函数

#### 构造函数

```cpp
ElementInfo(std::string name, Location start, Location end = {})
```

构造元素信息对象。

#### 访问器

| 函数 | 返回值 | 描述 |
|------|--------|------|
| `name()` | `const std::string&` | 获取元素全名 |
| `start_location()` | `const Location&` | 获取开始标签位置 |
| `end_location()` | `const Location&` | 获取结束标签位置 |
| `attributes()` | `const std::vector<Attribute>&` | 获取所有属性 |
| `namespaces()` | `const std::vector<Namespace>&` | 获取命名空间列表 |
| `namespace_uri()` | `const std::string&` | 获取命名空间URI |
| `local_name()` | `const std::string&` | 获取本地名称 |
| `depth()` | `size_t` | 获取嵌套深度 |
| `is_empty()` | `bool` | 是否为自关闭元素 |

#### find_attribute

```cpp
std::optional<Attribute> find_attribute(std::string_view name) const
```

按名称查找属性。

```cpp
std::optional<Attribute> find_attribute(std::string_view namespace_uri, std::string_view local_name) const
```

按命名空间URI和本地名称查找属性。

#### attribute_value

```cpp
std::optional<std::string_view> attribute_value(std::string_view name) const
```

获取属性值，相当于 `find_attribute(name)->value()`。

#### get_namespace_uri

```cpp
std::optional<std::string_view> get_namespace_uri(std::string_view prefix) const
```

查找前缀对应的命名空间URI。

---

## ParseEvent

表示一个解析事件。

```cpp
class ParseEvent {
public:
    ParseEvent();
    ParseEvent(EventType type, Location loc = {});
    
    EventType type() const noexcept;
    const Location& location() const noexcept;
    const std::string& text() const;
    const ElementInfo& element() const;
    
    void set_text(std::string text);
    void set_element(ElementInfo elem);
    
    bool is_start_element() const;
    bool is_end_element() const;
    bool is_characters() const;
    bool is_whitespace() const;
};
```

### 成员函数

| 函数 | 返回值 | 描述 |
|------|--------|------|
| `type()` | `EventType` | 获取事件类型 |
| `location()` | `const Location&` | 获取事件位置 |
| `text()` | `const std::string&` | 获取文本内容（字符/注释/CDATA事件） |
| `element()` | `const ElementInfo&` | 获取元素信息（开始/结束元素事件） |
| `is_start_element()` | `bool` | 是否为开始元素事件 |
| `is_end_element()` | `bool` | 是否为结束元素事件 |
| `is_characters()` | `bool` | 是否为字符事件 |
| `is_whitespace()` | `bool` | 是否为空白事件 |

---

## EventType

事件类型枚举。

```cpp
enum class EventType {
    StartDocument,          // 文档开始
    EndDocument,            // 文档结束
    StartElement,           // 开始元素
    EndElement,             // 结束元素
    Characters,             // 字符内容
    CDATA,                  // CDATA段
    Comment,                // 注释
    ProcessingInstruction,  // 处理指令
    Whitespace,             // 空白字符
    EntityReference,        // 实体引用
    Error                   // 错误
};
```

---

## ParseError

解析错误异常类。

```cpp
class ParseError : public std::runtime_error {
public:
    ParseError(std::string message, Location loc = {});
    const Location& location() const noexcept;
};
```

### 成员函数

| 函数 | 返回值 | 描述 |
|------|--------|------|
| `location()` | `const Location&` | 获取错误发生位置 |

---

## EventHandler

事件处理器抽象接口。

```cpp
class EventHandler {
public:
    virtual ~EventHandler() = default;
    virtual void on_start_document();
    virtual void on_end_document();
    virtual void on_start_element(const ElementInfo& element);
    virtual void on_end_element(const ElementInfo& element);
    virtual void on_characters(std::string_view text);
    virtual void on_cdata(std::string_view text);
    virtual void on_comment(std::string_view text);
    virtual void on_whitespace(std::string_view text);
    virtual void on_processing_instruction(std::string_view target, std::string_view data);
    virtual void on_error(const ParseError& error);
};
```

### 成员函数

所有函数默认为空实现，子类可选择性重写。

| 函数 | 描述 |
|------|------|
| `on_start_document()` | 文档开始时调用 |
| `on_end_document()` | 文档结束时调用 |
| `on_start_element()` | 遇到开始元素时调用 |
| `on_end_element()` | 遇到结束元素时调用 |
| `on_characters()` | 遇到字符内容时调用 |
| `on_cdata()` | 遇到CDATA段时调用 |
| `on_comment()` | 遇到注释时调用 |
| `on_whitespace()` | 遇到空白字符时调用（受配置控制） |
| `on_processing_instruction()` | 遇到处理指令时调用 |
| `on_error()` | 发生错误时调用 |

---

## ReaderConfig

读取器配置结构。

```cpp
struct ReaderConfig {
    bool preserve_whitespace{false};
    bool coalesce_text{true};
    bool expand_entities{true};
    bool validate_names{true};
    bool namespace_aware{true};
    bool strict_parsing{true};
    bool support_extended_entities{true};
    bool support_numeric_entities{true};
    bool strict_mode{true};
    bool require_closed_tags{true};
    bool allow_incomplete_documents{false};
    size_t max_depth{1024};
    size_t max_attribute_count{1024};
    size_t max_text_length{1024 * 1024};
    std::string encoding{"UTF-8"};
    bool detect_encoding{true};
    bool normalize_unicode{true};
    size_t buffer_size{8192};
    size_t chunk_size{4096};
    bool prefetch_data{true};
};
```

### 配置项说明

| 配置项 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `preserve_whitespace` | `bool` | `false` | 是否保留纯空白文本节点 |
| `coalesce_text` | `bool` | `true` | 是否合并相邻文本节点 |
| `expand_entities` | `bool` | `true` | 是否展开实体引用 |
| `validate_names` | `bool` | `true` | 是否验证XML名称有效性 |
| `namespace_aware` | `bool` | `true` | 是否启用命名空间支持 |
| `strict_parsing` | `bool` | `true` | 是否严格解析模式 |
| `support_extended_entities` | `bool` | `true` | 是否支持扩展实体 |
| `support_numeric_entities` | `bool` | `true` | 是否支持数值实体 |
| `strict_mode` | `bool` | `true` | 严格模式（同strict_parsing） |
| `require_closed_tags` | `bool` | `true` | 是否要求所有标签闭合 |
| `allow_incomplete_documents` | `bool` | `false` | 是否允许不完整文档 |
| `max_depth` | `size_t` | `1024` | 最大嵌套深度 |
| `max_attribute_count` | `size_t` | `1024` | 单个元素最大属性数 |
| `max_text_length` | `size_t` | `1MB` | 最大文本长度 |
| `encoding` | `std::string` | `"UTF-8"` | 默认编码 |
| `detect_encoding` | `bool` | `true` | 是否自动检测编码 |
| `normalize_unicode` | `bool` | `true` | 是否规范化Unicode |
| `buffer_size` | `size_t` | `8192` | 内部缓冲区大小 |
| `chunk_size` | `size_t` | `4096` | 分块大小 |
| `prefetch_data` | `bool` | `true` | 是否预取数据 |

---

## StreamReader

流式XML读取器，核心类。

```cpp
class StreamReader {
public:
    using Callback = std::function<void(const ParseEvent&)>;
    using Filter = std::function<bool(const ParseEvent&)>;
    
    // 构造函数
    StreamReader();
    StreamReader(std::string_view input, const ReaderConfig& config = {});
    StreamReader(std::string_view input, const std::string& encoding, const ReaderConfig& config = {});
    
    // 工厂方法
    static std::unique_ptr<StreamReader> from_file(const std::filesystem::path& path, 
                                                    const ReaderConfig& config = {});
    
    // 配置
    void set_config(const ReaderConfig& config) noexcept;
    const ReaderConfig& config() const noexcept;
    void set_preserve_whitespace(bool preserve) noexcept;
    
    // 事件处理
    void set_callback(Callback callback);
    void set_handler(EventHandler* handler);
    void set_filter(Filter filter);
    
    // 解析
    bool parse();
    std::optional<ParseEvent> next_event();
    
    // 状态
    Encoding detected_encoding() const;
    size_t depth() const noexcept;
};
```

### 构造函数

```cpp
StreamReader()
```

默认构造函数，需要后续调用 `set_config()` 并传入数据。

```cpp
StreamReader(std::string_view input, const ReaderConfig& config = {})
```

使用UTF-8数据构造读取器。

```cpp
StreamReader(std::string_view input, const std::string& encoding, const ReaderConfig& config = {})
```

使用指定编码的数据构造读取器。

### 静态工厂方法

#### from_file

```cpp
static std::unique_ptr<StreamReader> from_file(const std::filesystem::path& path, 
                                                const ReaderConfig& config = {})
```

从文件创建读取器。

- **参数:**
  - `path` - 文件路径
  - `config` - 读取器配置
- **返回:** `std::unique_ptr<StreamReader>`
- **异常:** 文件打开失败时抛出 `ParseError`
- **示例:**
```cpp
auto reader = StreamReader::from_file("data.xml");
reader->parse();
```

### 配置方法

#### set_config

```cpp
void set_config(const ReaderConfig& config) noexcept
```

设置读取器配置。

#### config

```cpp
const ReaderConfig& config() const noexcept
```

获取当前配置。

#### set_preserve_whitespace

```cpp
void set_preserve_whitespace(bool preserve) noexcept
```

设置是否保留空白字符（便捷方法）。

### 事件处理方法

#### set_callback

```cpp
void set_callback(Callback callback)
```

设置回调函数，每个解析事件触发时调用。

- **示例:**
```cpp
reader.set_callback([](const ParseEvent& event) {
    if (event.is_start_element()) {
        std::cout << "Start: " << event.element().name() << "\n";
    }
});
```

#### set_handler

```cpp
void set_handler(EventHandler* handler)
```

设置事件处理器对象。

- **注意:** 指针必须保持有效，库不负责内存管理
- **示例:**
```cpp
class MyHandler : public EventHandler {
    void on_start_element(const ElementInfo& elem) override {
        std::cout << "Element: " << elem.name() << "\n";
    }
};
MyHandler handler;
reader.set_handler(&handler);
```

#### set_filter

```cpp
void set_filter(Filter filter)
```

设置事件过滤器，返回 `false` 的事件不会被分发。

- **示例:**
```cpp
reader.set_filter([](const ParseEvent& event) {
    return event.type() != EventType::Comment;  // 过滤注释
});
```

### 解析方法

#### parse

```cpp
bool parse()
```

执行完整解析。

- **返回:** 解析成功返回 `true`，失败返回 `false`
- **异常:** 不抛出异常，错误通过回调/处理器报告

#### next_event

```cpp
std::optional<ParseEvent> next_event()
```

获取下一个解析事件（迭代器风格）。

- **返回:** 成功返回 `ParseEvent`，文档结束返回 `std::nullopt`
- **示例:**
```cpp
while (auto event = reader.next_event()) {
    if (event->is_start_element()) {
        // 处理元素
    }
}
```

### 状态方法

#### detected_encoding

```cpp
Encoding detected_encoding() const
```

获取检测到的编码类型。

#### depth

```cpp
size_t depth() const noexcept
```

获取当前解析深度（元素嵌套层级）。

---

## FastBuffer

高性能内部缓冲区。

```cpp
class FastBuffer {
public:
    FastBuffer(size_t size = 8192);
    
    void fill(std::string_view input, size_t& pos);
    void prefetch(std::string_view input, size_t& pos);
    char peek(size_t offset = 0) const;
    char advance();
    void advance(size_t n);
    bool eof() const;
    size_t available() const;
    size_t position() const;
    void reset();
    const char* data() const;
    size_t size() const;
};
```

### 成员函数

| 函数 | 描述 |
|------|------|
| `fill(input, pos)` | 从输入填充缓冲区 |
| `prefetch(input, pos)` | 预取数据到缓冲区 |
| `peek(offset)` | 查看缓冲区内容，不移动读位置 |
| `advance()` | 前进一个字符 |
| `advance(n)` | 前进n个字符 |
| `eof()` | 是否到达缓冲区末尾 |
| `available()` | 可用字符数 |
| `position()` | 当前读位置 |
| `reset()` | 重置缓冲区 |
| `data()` | 获取缓冲区数据指针 |
| `size()` | 获取缓冲区有效数据大小 |

---

## UnicodeConverter

Unicode转换工具类（静态方法）。

```cpp
class UnicodeConverter {
public:
    static Encoding detect_bom(std::string_view data);
    static Encoding detect_from_xml_declaration(std::string_view data);
};
```

### 静态函数

#### detect_bom

```cpp
static Encoding detect_bom(std::string_view data)
```

检测BOM（字节顺序标记）。

- **支持:** UTF-8, UTF-16 LE/BE, UTF-32 LE/BE
- **返回:** 检测到的编码类型

#### detect_from_xml_declaration

```cpp
static Encoding detect_from_xml_declaration(std::string_view data)
```

从XML声明中检测编码。

```cpp
// 示例
auto enc = UnicodeConverter::detect_from_xml_declaration(
    "<?xml version=\"1.0\" encoding=\"UTF-16\"?>"
);
// 返回 Encoding::UTF_16_BE
```

---

## UnicodeDecoder

Unicode解码器。

```cpp
class UnicodeDecoder {
public:
    explicit UnicodeDecoder(Encoding encoding = Encoding::UTF_8);
    
    std::string decode(std::string_view data) const;
    
    static char32_t read_utf8_char(std::string_view data, size_t& pos);
    static std::string encode_utf8(char32_t codepoint);
    static bool is_valid_codepoint(char32_t codepoint);
};
```

### 成员函数

#### 构造函数

```cpp
explicit UnicodeDecoder(Encoding encoding = Encoding::UTF_8)
```

创建指定编码的解码器。

#### decode

```cpp
std::string decode(std::string_view data) const
```

将输入数据解码为UTF-8字符串。

#### read_utf8_char

```cpp
static char32_t read_utf8_char(std::string_view data, size_t& pos)
```

从UTF-8字符串中读取一个字符。

- **参数:**
  - `data` - UTF-8字符串
  - `pos` - 读取位置（引用，会自动更新）
- **返回:** 读取的Unicode码点

#### encode_utf8

```cpp
static std::string encode_utf8(char32_t codepoint)
```

将Unicode码点编码为UTF-8字符串。

#### is_valid_codepoint

```cpp
static bool is_valid_codepoint(char32_t codepoint)
```

检查码点是否有效（排除代理对和超出范围的码点）。

---

## Encoding

编码类型枚举。

```cpp
enum class Encoding {
    UTF_8,
    UTF_16_LE,
    UTF_16_BE,
    UTF_32_LE,
    UTF_32_BE,
    Unknown
};
```

---

## 使用示例

### 示例1：基础解析（回调方式）

```cpp
#include "xml_stream.hpp"
#include <iostream>

using namespace litexml::stream;

int main() {
    std::string xml = R"(
        <?xml version="1.0"?>
        <book id="123">
            <title>XML Programming</title>
            <author>John Doe</author>
        </book>
    )";
    
    ReaderConfig config;
    config.preserve_whitespace = true;
    
    StreamReader reader(xml, config);
    
    reader.set_callback([](const ParseEvent& event) {
        switch (event.type()) {
            case EventType::StartElement: {
                auto& elem = event.element();
                std::cout << "Start: " << elem.name();
                if (auto attr = elem.find_attribute("id")) {
                    std::cout << " id=" << attr->value();
                }
                std::cout << "\n";
                break;
            }
            case EventType::EndElement:
                std::cout << "End: " << event.element().name() << "\n";
                break;
            case EventType::Characters:
                std::cout << "Text: " << event.text() << "\n";
                break;
            default:
                break;
        }
    });
    
    reader.parse();
    return 0;
}
```

### 示例2：迭代器方式

```cpp
StreamReader reader(xml);

while (auto event = reader.next_event()) {
    if (event->is_start_element()) {
        // 处理元素
    } else if (event->is_characters()) {
        // 处理文本
    }
}
```

### 示例3：使用事件处理器

```cpp
class BookHandler : public EventHandler {
private:
    std::string current_element;
    std::string title;
    std::string author;
    
public:
    void on_start_element(const ElementInfo& elem) override {
        current_element = elem.name();
    }
    
    void on_characters(std::string_view text) override {
        if (current_element == "title") {
            title = text;
        } else if (current_element == "author") {
            author = text;
        }
    }
    
    void on_end_element(const ElementInfo& elem) override {
        if (elem.name() == "book") {
            std::cout << "Book: " << title << " by " << author << "\n";
        }
    }
};

// 使用
BookHandler handler;
reader.set_handler(&handler);
reader.parse();
```

### 示例4：从文件解析

```cpp
auto reader = StreamReader::from_file("data.xml");
reader->set_callback([](const ParseEvent& event) {
    // 处理事件
});
reader->parse();
```

### 示例5：属性类型转换

```cpp
reader.set_callback([](const ParseEvent& event) {
    if (event.is_start_element()) {
        const auto& elem = event.element();
        if (auto attr = elem.find_attribute("count")) {
            if (auto count = attr->as_integer<int>()) {
                std::cout << "Count: " << *count << "\n";
            }
        }
        if (auto attr = elem.find_attribute("enabled")) {
            std::cout << "Enabled: " << attr->as_boolean() << "\n";
        }
        if (auto attr = elem.find_attribute("created")) {
            if (auto time = attr->as_datetime()) {
                // 处理时间
            }
        }
    }
});
```

### 示例6：配置自定义

```cpp
ReaderConfig config;
config.max_depth = 100;
config.max_text_length = 1024 * 1024 * 10;  // 10MB
config.preserve_whitespace = true;
config.coalesce_text = false;

StreamReader reader(xml, config);
```

---

## 错误处理

解析错误通过以下方式报告：

1. **回调方式:** `EventType::Error` 事件
2. **处理器方式:** `EventHandler::on_error()`
3. **迭代器方式:** 返回 `EventType::Error` 事件

```cpp
reader.set_callback([](const ParseEvent& event) {
    if (event.type() == EventType::Error) {
        std::cerr << "Parsing error at " << event.location().to_string() << "\n";
    }
});
```

---

## 性能考虑

1. **缓冲区大小:** 通过 `config.buffer_size` 调整，默认8KB
2. **预取:** `config.prefetch_data` 启用预取
3. **文本合并:** `config.coalesce_text` 控制是否合并相邻文本节点
4. **名称验证:** `config.validate_names` 可禁用以提高性能

---

## 线程安全

`StreamReader` 不是线程安全的，不应在多个线程中同时访问同一实例。