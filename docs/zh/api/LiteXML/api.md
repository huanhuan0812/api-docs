# LiteXML API 文档

## 概述

LiteXML 是一个轻量级的 XML 解析与序列化库，采用现代 C++ 设计，提供高效的内存管理和 DOM 操作接口。

**命名空间:** `litexml`

---

## 类索引

| 类 | 描述 |
|---|---|
| [DocumentNode](#documentnode) | XML 文档节点 |
| [ElementNode](#elementnode) | 元素节点 |
| [TextNode](#textnode) | 文本节点 |
| [CDataNode](#cdatanode) | CDATA 节点 |
| [CommentNode](#commentnode) | 注释节点 |
| [DOMNode](#domnode) | 所有节点的基类 |
| [XMLParser](#xmlparser) | XML 解析器 |
| [XMLSerializer](#xmlserializer) | XML 序列化器 |
| [DocumentAllocator](#documentallocator) | 内存池分配器 |

---

## DOMNode

所有 DOM 节点的基类。

### 公共成员函数

| 函数 | 描述 |
|---|---|
| `T* appendChild(T* child)` | 追加子节点，返回子节点指针 |
| `std::optional<DOMNode*> getFirstChild() const` | 获取第一个子节点 |
| `std::optional<DOMNode*> getLastChild() const` | 获取最后一个子节点 |
| `DOMNode* getParent() const` | 获取父节点 |
| `std::optional<DOMNode*> getNextSibling() const` | 获取下一个兄弟节点 |
| `std::optional<DOMNode*> getPreviousSibling() const` | 获取上一个兄弟节点 |
| `bool removeChild(DOMNode* child)` | 移除子节点 |
| `bool replaceChild(DOMNode* newChild, DOMNode* oldChild)` | 替换子节点 |
| `std::optional<DOMNode*> findChild(Predicate pred) const` | 按谓词查找子节点 |
| `auto getChildrenByType<Type>() const` | 按类型获取子节点视图 |

### 公共成员变量

| 变量 | 类型 | 描述 |
|---|---|---|
| `type` | `NodeType` | 节点类型 |
| `nodeName` | `std::string_view` | 节点名称 |
| `nodeValue` | `std::string_view` | 节点值 |
| `children` | `std::vector<DOMNode*>` | 子节点列表 |

### 节点类型枚举

```cpp
enum class NodeType : uint8_t {
    Document,              // 文档节点
    Element,               // 元素节点
    Text,                  // 文本节点
    CData,                 // CDATA 节点
    Comment,               // 注释节点
    ProcessingInstruction  // 处理指令
};
```

---

## DocumentNode

XML 文档节点，继承自 `DOMNode`。

### 公共成员函数

| 函数 | 描述 |
|---|---|
| `void setEncoding(std::string_view encoding)` | 设置文档编码 |
| `void setVersion(std::string_view version)` | 设置 XML 版本 |
| `std::optional<std::string_view> getEncoding() const` | 获取文档编码 |
| `std::optional<std::string_view> getVersion() const` | 获取 XML 版本 |
| `ElementNode* getDocumentElement() const` | 获取根元素 |
| `ElementNode* getElementById(std::string_view id) const` | 按 ID 获取元素 |
| `std::vector<ElementNode*> getElementsByTagName(std::string_view tagName) const` | 按标签名获取元素列表 |
| `std::vector<ElementNode*> getElementsByTagNameNS(std::string_view namespaceUri, std::string_view localName) const` | 按命名空间和本地名获取元素列表 |
| `auto getAllElements() const` | 获取所有元素（视图） |
| `DocumentAllocator& getAllocator()` | 获取内存分配器引用 |

---

## ElementNode

元素节点，继承自 `DOMNode`。

### 公共成员函数

| 函数 | 描述 |
|---|---|
| `std::string_view getTagName() const` | 获取标签名（含前缀） |
| `std::string_view getLocalName() const` | 获取本地名（不含前缀） |
| `std::optional<std::string_view> getPrefix() const` | 获取命名空间前缀 |
| `std::optional<std::string_view> getNamespaceUri() const` | 获取命名空间 URI |
| `void setNamespaceUri(std::string_view uri)` | 设置命名空间 URI |
| `const std::vector<NamespaceInfo>& getNamespaceDeclarations() const` | 获取命名空间声明列表 |
| `void addNamespaceDeclaration(std::string_view prefix, std::string_view uri)` | 添加命名空间声明 |
| `bool hasDefaultNamespace() const` | 是否有默认命名空间 |
| `std::optional<std::string_view> getDefaultNamespace() const` | 获取默认命名空间 URI |
| `std::optional<std::string_view> getAttribute(std::string_view name) const` | 获取属性值 |
| `std::string_view getAttributeOrDefault(std::string_view name, std::string_view defaultValue = "") const` | 获取属性值，不存在返回默认值 |
| `void setAttribute(std::string_view name, std::string_view value)` | 设置属性 |
| `const AttributeMap& getAttributes() const` | 获取所有属性映射 |
| `auto begin() const / auto end() const` | 属性迭代器 |

### 类型别名

```cpp
using AttributeMap = std::unordered_map<std::string_view, std::string_view>;
```

---

## TextNode

文本节点，继承自 `DOMNode`。

### 公共成员函数

| 函数 | 描述 |
|---|---|
| `std::string_view getText() const` | 获取文本内容 |
| `bool isEmpty() const` | 是否为空或仅含空白字符 |

---

## CDataNode

CDATA 节点，继承自 `DOMNode`。

### 公共成员函数

| 函数 | 描述 |
|---|---|
| `std::string_view getData() const` | 获取 CDATA 数据 |

---

## CommentNode

注释节点，继承自 `DOMNode`。

### 公共成员函数

| 函数 | 描述 |
|---|---|
| `std::string_view getComment() const` | 获取注释内容 |

---

## DocumentAllocator

内存池分配器，用于高效管理 DOM 节点内存。

### 公共成员函数

| 函数 | 描述 |
|---|---|
| `T* create<Args...>(Args&&... args)` | 在内存池中创建对象 |
| `std::string_view intern(std::string_view sv)` | 将字符串存入内存池 |
| `std::string_view intern(const std::string& str)` | 将字符串存入内存池 |

### 说明

- 所有通过 `create()` 创建的对象由内存池自动管理
- `intern()` 返回的 `string_view` 在文档生命周期内有效
- 默认块大小：64KB

---

## XMLParser

XML 解析器。

### 配置结构 `Config`

| 成员 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| `preserveWhitespace` | `bool` | `false` | 是否保留空白文本节点 |
| `parseComments` | `bool` | `false` | 是否解析注释（否则跳过） |
| `parseProcessingInstructions` | `bool` | `false` | 是否解析处理指令 |
| `strictMode` | `bool` | `true` | 严格模式 |
| `parseNamespaces` | `bool` | `true` | 是否解析命名空间 |
| `maxDepth` | `size_t` | `1000` | 最大嵌套深度 |

### 公共成员函数

| 函数 | 描述 |
|---|---|
| `XMLParser(const Config& config)` | 带配置构造 |
| `XMLParser()` | 默认构造 |
| `ParseResultT<std::unique_ptr<DocumentNode>> parse(std::string_view xml)` | 解析 XML 字符串 |
| `ParseResultT<std::unique_ptr<DocumentNode>> parseFile(std::string_view filename)` | 解析 XML 文件 |
| `void setConfig(const Config& config)` | 设置配置 |
| `const Config& getConfig() const` | 获取配置 |

### 解析结果

```cpp
enum class ParseError : uint8_t {
    Success,              // 成功
    UnexpectedEOF,        // 意外的文件结束
    InvalidTag,           // 无效标签
    MismatchedTag,        // 标签不匹配
    InvalidAttribute,     // 无效属性
    InvalidCharacter,     // 无效字符
    InvalidEntity,        // 无效实体
    InvalidProlog,        // 无效序言
    InvalidCDATA,         // 无效 CDATA
    InvalidComment,       // 无效注释
    InvalidProcessingInstruction, // 无效处理指令
    MalformedXML,         // 格式错误的 XML
    FileNotFound,         // 文件未找到
    IOError               // I/O 错误
};
```

### 使用示例

```cpp
litexml::XMLParser parser;
auto result = parser.parse("<root><child>Hello</child></root>");
if (result) {
    auto& doc = *result;
    auto* root = doc->getDocumentElement();
    // ... 处理文档
} else {
    std::cerr << result.error().toString() << std::endl;
}
```

---

## XMLSerializer

XML 序列化器，将 DOM 树输出为 XML 字符串。

### 配置结构 `Config`

| 成员 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| `prettyPrint` | `bool` | `false` | 是否格式化输出 |
| `indentString` | `std::string` | `"  "` | 缩进字符串 |
| `writeProlog` | `bool` | `true` | 是否输出 XML 声明 |
| `writeNamespaces` | `bool` | `true` | 是否输出命名空间声明 |
| `useQualifiedNames` | `bool` | `true` | 是否使用限定名 |

### 公共成员函数

| 函数 | 描述 |
|---|---|
| `XMLSerializer()` | 默认构造 |
| `XMLSerializer(const Config& config)` | 带配置构造 |
| `std::string serialize(const DOMNode* node) const` | 序列化 DOM 节点 |

### 使用示例

```cpp
litexml::XMLSerializer serializer{
    { .prettyPrint = true, .indentString = "  " }
};
std::string xml = serializer.serialize(doc.get());
std::cout << xml << std::endl;
```

---

## 命名空间支持

### NamespaceInfo 结构

| 成员 | 类型 | 描述 |
|---|---|---|
| `prefix` | `std::string_view` | 命名空间前缀 |
| `uri` | `std::string_view` | 命名空间 URI |

### 成员函数

| 函数 | 描述 |
|---|---|
| `bool matches(std::string_view p, std::string_view u) const` | 检查是否匹配 |
| `bool isDefault() const` | 是否为默认命名空间 |

---

## 错误处理

所有解析操作返回 `ParseResultT<T>`，即 `std::expected<T, ParseResult>`。

### ParseResult 结构

| 成员 | 类型 | 描述 |
|---|---|---|
| `error` | `ParseError` | 错误码 |
| `message` | `std::string` | 错误描述 |
| `position` | `std::optional<size_t>` | 错误位置 |

### 成员函数

| 函数 | 描述 |
|---|---|
| `bool isSuccess() const` | 检查是否成功 |
| `std::string toString() const` | 获取可读的错误描述 |

---

## 线程安全性

- `DocumentNode` 及其子节点**不是**线程安全的
- `XMLParser` 和 `XMLSerializer` 的实例可以安全地在不同线程中使用，但不应共享
- `DocumentAllocator` 不是线程安全的