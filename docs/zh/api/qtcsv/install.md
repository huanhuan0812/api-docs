---
hide: true
---
## QtCsv 库的安装方法

## 1. 基础安装流程

### 配置和构建
```bash
# 创建构建目录
mkdir build
cd build

# 配置（使用默认安装路径）
cmake ..

# 或者指定安装路径
cmake .. -DCMAKE_INSTALL_PREFIX=/usr/local

# 可选：启用 widgets 支持
cmake .. -DQTCSV_WIDGETS=ON

# 可选：构建测试
cmake .. -DBUILD_TESTING=ON

# 编译
make -j$(nproc)  # Linux
# 或
cmake --build . --parallel
```

### 安装
```bash
# 方法1：使用 make
sudo make install

# 方法2：使用 cmake
sudo cmake --install .

# 方法3：指定安装前缀
sudo cmake --install . --prefix /usr/local

# 方法4：安装到自定义目录（不需要sudo）
cmake --install . --prefix ~/local
```

## 2. 不同平台的安装路径

### Linux 典型安装
```bash
# 系统级安装
cmake .. -DCMAKE_INSTALL_PREFIX=/usr
sudo make install

# 用户级安装
cmake .. -DCMAKE_INSTALL_PREFIX=~/.local
make install
```

### Windows 安装
```bash
# 在 Visual Studio 命令提示符中
mkdir build
cd build
cmake .. -DCMAKE_INSTALL_PREFIX=C:/Program Files/QtCsv
cmake --build . --config Release
cmake --install . --config Release
```

### macOS 安装
```bash
mkdir build
cd build
cmake .. -DCMAKE_INSTALL_PREFIX=/usr/local
make
sudo make install
```

## 3. 安装后文件布局

安装后的目录结构示例（Linux）：

```
/usr/local/
├── include/
│   └── QtCsv/
│       ├── QCsv.hpp
│       ├── CsvTableModel.h (如果启用)
│       └── CsvTableView.h  (如果启用)
├── lib/
│   ├── libQtCsv.so -> libQtCsv.so.1
│   ├── libQtCsv.so.1 -> libQtCsv.so.1.0.0
│   ├── libQtCsv.so.1.0.0
│   └── cmake/
│       └── QtCsv/
│           ├── QtCsvConfig.cmake
│           ├── QtCsvConfigVersion.cmake
│           └── QtCsvTargets.cmake
└── lib64/ (某些系统)
    └── pkgconfig/
        └── QtCsv.pc
```

## 4. 验证安装

### 检查库文件
```bash
# Linux
ls -la /usr/local/lib/libQtCsv*
ldconfig -p | grep QtCsv

# 检查 pkg-config
pkg-config --modversion QtCsv
pkg-config --cflags --libs QtCsv
```

### 测试链接
```bash
# 编译测试程序
g++ test.cpp -o test $(pkg-config --cflags --libs QtCsv)
```

## 5. 在项目中使用安装的 QtCsv

### 方法1：使用 find_package (推荐)
```cmake
# 在项目的 CMakeLists.txt 中
cmake_minimum_required(VERSION 3.16)
project(MyProject)

# 查找 QtCsv
find_package(QtCsv REQUIRED)

# 如果安装在不同位置，指定路径
# find_package(QtCsv REQUIRED PATHS /custom/install/path)

# 使用库
add_executable(myapp main.cpp)
target_link_libraries(myapp PRIVATE QtCsv::QtCsv)
```

### 方法2：使用 pkg-config
```cmake
find_package(PkgConfig REQUIRED)
pkg_check_modules(QTCSV REQUIRED QtCsv)

add_executable(myapp main.cpp)
target_include_directories(myapp PRIVATE ${QTCSV_INCLUDE_DIRS})
target_link_libraries(myapp PRIVATE ${QTCSV_LIBRARIES})
```

### 方法3：手动指定路径
```cmake
add_executable(myapp main.cpp)
target_include_directories(myapp PRIVATE /usr/local/include)
target_link_libraries(myapp PRIVATE /usr/local/lib/libQtCsv.so)
```

## 6. 卸载

### 方法1：使用 uninstall 目标（如果配置）
```bash
cd build
sudo make uninstall
# 或
sudo cmake --build . --target uninstall
```

### 方法2：手动卸载
```bash
# 查看安装的文件
cat build/install_manifest.txt

# 手动删除
sudo xargs rm < build/install_manifest.txt
```

### 方法3：创建卸载脚本
创建 `cmake_uninstall.cmake.in`：
```cmake
if(NOT EXISTS "@CMAKE_CURRENT_BINARY_DIR@/install_manifest.txt")
    message(FATAL_ERROR "Cannot find install manifest")
endif()

file(READ "@CMAKE_CURRENT_BINARY_DIR@/install_manifest.txt" files)
string(REGEX REPLACE "\n" ";" files "${files}")
foreach(file ${files})
    message(STATUS "Uninstalling $ENV{DESTDIR}${file}")
    if(EXISTS "$ENV{DESTDIR}${file}")
        exec_program(
            "@CMAKE_COMMAND@" -E remove "$ENV{DESTDIR}${file}"
            OUTPUT_VARIABLE rm_out
            RETURN_VALUE rm_retval
        )
        if(NOT "${rm_retval}" STREQUAL 0)
            message(FATAL_ERROR "Problem when removing $ENV{DESTDIR}${file}")
        endif()
    else()
        message(STATUS "File $ENV{DESTDIR}${file} does not exist.")
    endif()
endforeach()
```

## 7. 常见问题解决

### 找不到库
```bash
# 设置 CMake 查找路径
export CMAKE_PREFIX_PATH=/usr/local/lib/cmake/QtCsv:$CMAKE_PREFIX_PATH

# 或直接在 CMake 中指定
cmake .. -DQtCsv_DIR=/usr/local/lib/cmake/QtCsv
```

### 运行时找不到共享库
```bash
# Linux: 更新库缓存
sudo ldconfig

# 或设置 LD_LIBRARY_PATH
export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH
```

### 权限问题
```bash
# 使用 sudo 进行系统级安装
sudo make install

# 或安装到用户目录
cmake .. -DCMAKE_INSTALL_PREFIX=~/.local
make install
```

## 8. 打包

### 创建二进制包
```bash
# 创建安装目录
cmake .. -DCMAKE_INSTALL_PREFIX=/tmp/qtcsv-install
make install

# 打包
tar -czf qtcsv-1.0.0-linux.tar.gz -C /tmp/qtcsv-install .
```

### 创建 DEB 包（Linux）
```bash
# 使用 CPack
cmake ..
cpack -G DEB
```