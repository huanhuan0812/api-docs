---
title: "使用方法"
order: 2
---

### 要求
1. Qt 6.0+
2. c++17+

## 1.安装

- ### CMake
    - **1.直接使用**<br></br>
        在文件中直接添加：
        ```cmake
        set(SOURCES
            QCsv.cpp
        )

        # 设置头文件目录
        set(HEADERS
            QCsv.hpp
        )

        # 添加可执行文件
        add_executable(myapp ${SOURCES} ${HEADERS})
        ```
    - **2.安装到目录**<br></br>
        [安装方法](./install)

- ### qmake

    添加
    ```prolog
    # 添加头文件
    HEADERS += QCsv.hpp

    # 添加源文件
    SOURCES += QCsv.cpp
    ```

## 2.使用

### 1.构造
```cpp
    QCsv csv(QString filePath); //禁止使用 QCsv csv; （未打开文件的csv对象）
    //或者
    QCsv csv2(csv); //移动构造，禁用拷贝
```

### 2.文件操作
| 方法 | 返回值 | 描述 |
|------|--------|------|
| `open(const QString& filePath)` | `void` | 打开指定路径的文件 |
| `close()` | `void` | 关闭当前文件 |
| `isOpen()` | `bool` | 检查文件是否已打开 |
| `load()` | `void` | 加载文件内容 |
| `save()` | `bool` | 保存数据到当前文件 |
| `saveAs(const QString& filePath)` | `bool` | 另存为指定文件 |
| `atomicSave()` | `bool` | 原子保存（防止数据损坏） |
| `atomicSaveAs(const QString& filePath)` | `bool` | 原子另存为 |
| `sync()` | `QFuture<bool>` | 异步同步数据到磁盘 |
| `finalize()` | `void` | 保存并关闭文件 |

### 3.数据访问
| 方法 | 返回值 | 描述 |
|------|--------|------|
| `getValue(const QString& key) const` | `QString` | 获取指定键的值（键格式如 "A1"） |
| `tryGetValue(const QString& key) const` | `std::optional<QString>` | 尝试获取值，失败返回空 |
| `setValue(const QString& key, const QString& value)` | `void` | 设置指定单元格的值 |
| `contains(const QString& key) const` | `bool` | 检查单元格是否存在 |
| `keys() const` | `QList<QString>` | 获取所有单元格键 |
| `size() const` | `int` | 获取单元格总数 |
| `isEmpty() const` | `bool` | 检查数据是否为空 |

### 4.批量操作
| 方法 | 返回值 | 描述 |
|------|--------|------|
| `setValues(const QHash<QString, QString>& values)` | `void` | 批量设置多个单元格 |
| `getAllValues() const` | `QHash<QString, QString>` | 获取所有数据 |

### 5.搜索功能
| 方法 | 返回值 | 描述 |
|------|--------|------|
| `search(const QString& value) const` | `QList<QString>` | 搜索包含指定值的所有单元格键 |
| `searchByPrefix(const QString& prefix) const` | `QList<QString>` | 搜索键以指定前缀开头的单元格 |

### 6.属性设置
| 方法 | 返回值 | 描述 |
|------|--------|------|
| `setSeparator(char sep)` | `void` | 设置CSV分隔符 |
| `getSeparator() const` | `char` | 获取当前分隔符 |
| `setFilePath(const QString& path)` | `void` | 设置文件路径 |
| `getFilePath() const` | `QString` | 获取当前文件路径 |
| `clear()` | `void` | 清空所有数据 |

### 7.元数据
| 方法 | 返回值 | 描述 |
|------|--------|------|
| `getRowCount() const` | `int` | 获取最大行号 |
| `getColumnCount() const` | `int` | 获取最大列号 |
| `size() const` | `int` | 获取单元格数量 |
| `getLastModified() const` | `QDateTime` | 获取文件的最后修改时间 |
| `getFileSize() const` | `qint64` | 获取文件大小（字节） |
| `getAllMetadata() const` | `QMap<QString, QVariant>` | 获取所有文件元数据 |

### 8.流式读取
| 方法 | 返回值 | 描述 |
|------|--------|------|
| `operator>>(QCsv& csv, QString& value)` | `QCsv&` | 流式读取下一个值 |
| `resetStream()` | `void` | 重置流读取位置 |
| `hasNext()` | `bool` | 判断是否到达文件末尾 |

### 9.行、列名称处理
| 方法 | 返回值 | 描述 |
|------|--------|------|
| `enableHeaders(bool enable)` | `void` | 启用或禁用行/列表头 |
| `headersEnabled() const` | `bool` | 检查是否启用了表头 |
| **列标题**| - | - |
| `setHeaderRow(int row=1)` | `void` | 设置作为列标题的行号 |
| `setColumnHeader(int col, const QString& header)` | `void` | 设置指定列的标题 |
| `setColumnHeaders(const QHash<int, QString>& headers)` | `void` | 批量设置列标题 |
| `searchColumnHeader(const QString& header) const` | `QList<int>` | 搜索包含指定标题的列号 |
| `getColumnHeader(int col) const` | `QString` | 获取指定列的标题 |
| `getColumnHeaders() const` | `QList<QString>` | 获取所有列标题（按列号顺序） |
| `getColumnHeaderLists() const` | `QStringList` | 获取所有列标题列表 |
| `getHeaderRow() const` | `int` | 获取当前作为列标题的行号 |
| **行标题**| - | - |
| `setHeaderColumn(int col=1)` | `void` | 设置作为行标题的列号 |
| `setRowHeader(int row, const QString& header)` | `void` | 设置指定行的标题 |
| `setRowHeaders(const QHash<int, QString>& headers)` | `void` | 批量设置行标题 |
| `searchRowHeader(const QString& header) const` | `QList<int>` | 搜索包含指定标题的行号 |
| `getRowHeader(int row) const` | `QString` | 获取指定行的标题 |
| `getRowHeaders() const` | `QList<QString>` | 获取所有行标题（按行号顺序） |
| `getRowHeaderLists() const` | `QStringList` | 获取所有行标题列表 |
| `getHeaderCol() const` | `int` | 获取当前作为行标题的列号 |

### 10.类型判断与转换
| 方法 | 返回值 | 描述 |
|------|--------|------|
| **判断** | - | - |
| `isNumeric(const QString& value) const` | `bool` | 判断值是否为数值类型 |
| `isDate(const QString& value, const QString& format = "yyyy-MM-dd") const` | `bool` | 判断值是否为指定格式的日期 |
| `isBoolean(const QString& value) const` | `bool` | 判断值是否为布尔类型（true/false） |
| **转换** | - | - |
| `toDouble(const QString& value) const` | `std::optional<double>` | 将值转换为浮点数，失败返回空 |
| `toDate(const QString& value, const QString& format = "yyyy-MM-dd") const` | `std::optional<QDate>` | 将值转换为日期，失败返回空 |
| `toBoolean(const QString& value) const` | `std::optional<bool>` | 将值转换为布尔值，失败返回空 |

### 11.信号
| 信号 | 参数 | 描述 |
|------|------|------|
| `dataChanged` | `const QString& key, const QString& oldValue, const QString& newValue` | 当单元格数据发生变化时发出，包含键、旧值和新值 |
| `fileOpened` | `const QString& filePath` | 文件成功打开时发出 |
| `fileClosed` | 无参数 | 文件关闭时发出 |
| `fileSaved` | `const QString& filePath` | 文件成功保存时发出 |
| `error` | `const QString& errorString` | 发生错误时发出，包含错误信息 |

这些信号可以用于监控 `QCsv` 对象的状态变化和操作结果，便于在 UI 层进行相应的反馈和处理。

## 3.源代码
[源代码](https://github.com/huanhuan0812/qtcsv/blob/main/tests/test.cpp)