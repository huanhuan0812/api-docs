---
title: "使用文档"
order: 1
---

# ClassIsland IPC Bridge Plugin 使用文档

## 概述

ClassIsland IPC Bridge Plugin 是一个将 ClassIsland 内部事件桥接到 Windows 标准 IPC 机制的插件。它通过内存映射文件、全局事件和 Windows 消息三种方式对外广播 ClassIsland 的状态变化，使其他应用程序（Java、Python、C++ 等）能够实时接收课堂事件信息。

## 功能特性

- 🎓 **课堂事件广播**：上课、课间、放学等事件实时推送
- 📊 **课程状态同步**：当前课程、剩余时间、进度等信息
- 🔔 **多机制广播**：内存映射文件 + 全局事件 + Windows 消息
- 🌐 **跨语言支持**：任何支持 Windows API 的语言都能接收
- 💓 **心跳保活**：定期发送心跳包，确保连接状态

## 广播机制说明

| 机制 | 名称 | 说明 |
|------|------|------|
| 内存映射文件 | `Global\ClassIsland_Broadcast_MMF` | 存储 JSON 格式的广播数据，大小 1MB |
| 全局事件 | `Global\ClassIsland_Broadcast_Event` | 新数据到达时触发信号 |
| Windows 消息 | `ClassIsland_IPC_Broadcast` | 系统级广播消息 |

## 数据格式

所有广播数据均为 JSON 格式，基础结构如下：

```json
{
  "EventType": "OnClass",
  "EventName": "上课",
  "Timestamp": "2024-01-15T08:00:00",
  "EventData": { ... },
  "Source": "ClassIsland IPC Bridge"
}
```

### 事件类型

| EventType | EventName | 说明 |
|-----------|-----------|------|
| `OnClassNotifyId` | 上课 | 上课时间到 |
| `OnBreakingTimeNotifyId` | 课间休息 | 课间休息时间 |
| `OnAfterSchoolNotifyId` | 放学 | 放学时间到 |
| `CurrentTimeStateChangedNotifyId` | 时间状态变化 | 时间点状态变化 |
| `LessonInfo` | 课程信息更新 | 当前课程信息 |
| `FullState` | 完整状态 | 完整状态信息 |
| `Heartbeat` | 心跳 | 服务保活 |
| `ServerStarted` | 广播服务器启动 | 服务启动 |
| `ServerStopped` | 广播服务器停止 | 服务停止 |

### 完整状态数据示例

```json
{
  "EventType": "FullState",
  "EventName": "完整状态",
  "Timestamp": "2024-01-15T08:00:00",
  "EventData": null,
  "Source": "ClassIsland IPC Bridge",
  "CurrentSubjectName": "数学",
  "CurrentSubjectId": "123e4567-e89b-12d3-a456-426614174000",
  "CurrentTimeStart": "08:00:00",
  "CurrentTimeEnd": "08:45:00",
  "ClassPlanName": "周一课程表",
  "CurrentState": "OnClass",
  "IsTimerRunning": true,
  "OnClassLeftSeconds": 2700,
  "OnBreakingLeftSeconds": 0,
  "NextClassSubjectName": "语文",
  "NextClassTime": "09:00:00",
  "CurrentSelectedIndex": 2,
  "IsClassPlanEnabled": true,
  "IsClassPlanLoaded": true,
  "IsLessonConfirmed": true,
  "NextClassTimeStart": "09:00:00",
  "NextClassTimeEnd": "09:45:00",
  "NextBreakingTimeStart": "08:45:00",
  "NextBreakingTimeEnd": "09:00:00",
  "IsCurrentProfileTrusted": true,
  "CurrentProfilePath": "C:\\ClassIsland\\profile.json",
  "CurrentClassPlanName": "周一课程表"
}
```

### 状态枚举说明

| CurrentState | 说明 |
|--------------|------|
| `BeforeClass` | 课前 |
| `OnClass` | 上课中 |
| `OnBreakingTime` | 课间休息 |
| `AfterSchool` | 放学后 |

---

## Java 客户端

### 依赖要求
- Java 8 或更高版本

### 完整示例代码

```java
import java.io.*;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.concurrent.TimeUnit;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class ClassIslandReceiver {
    private static final String MMF_NAME = "Global\\ClassIsland_Broadcast_MMF";
    private static final String EVENT_NAME = "Global\\ClassIsland_Broadcast_Event";
    private static final int MMF_SIZE = 1024 * 1024; // 1MB
    
    private final Gson gson = new Gson();
    private boolean running = true;
    
    public interface EventListener {
        void onEvent(JsonObject data);
    }
    
    private EventListener listener;
    
    public void setEventListener(EventListener listener) {
        this.listener = listener;
    }
    
    public void start() {
        System.out.println("开始监听 ClassIsland 广播...");
        
        Thread receiverThread = new Thread(this::listenLoop);
        receiverThread.setDaemon(true);
        receiverThread.start();
    }
    
    private void listenLoop() {
        while (running) {
            try {
                // 等待全局事件信号
                if (waitForEvent(1000)) {
                    String data = readFromMemoryMappedFile();
                    if (data != null && !data.isEmpty()) {
                        JsonObject json = gson.fromJson(data, JsonObject.class);
                        if (listener != null) {
                            listener.onEvent(json);
                        }
                        onEventReceived(json);
                    }
                }
            } catch (Exception e) {
                System.err.println("监听错误: " + e.getMessage());
            }
        }
    }
    
    private boolean waitForEvent(int timeoutMillis) {
        // 使用 JNA 或 JNI 等待全局事件
        // 这里使用简单的轮询方式
        try {
            Thread.sleep(timeoutMillis);
            return true;
        } catch (InterruptedException e) {
            return false;
        }
    }
    
    private String readFromMemoryMappedFile() {
        RandomAccessFile raf = null;
        FileChannel channel = null;
        FileLock lock = null;
        
        try {
            // 打开内存映射文件
            raf = new RandomAccessFile("\\\\.\\mailslot\\" + MMF_NAME, "r");
            // 注意：Java 对全局内存映射文件支持有限，需要使用 JNA 或 JNI
            // 这里提供一个简化的读取示例
            
            File mmfFile = new File("\\\\.\\" + MMF_NAME);
            if (!mmfFile.exists()) {
                return null;
            }
            
            try (FileInputStream fis = new FileInputStream(mmfFile)) {
                // 读取长度
                byte[] lenBytes = new byte[4];
                if (fis.read(lenBytes) != 4) return null;
                int length = ByteBuffer.wrap(lenBytes).getInt();
                
                if (length <= 0 || length > MMF_SIZE) return null;
                
                // 读取数据
                byte[] dataBytes = new byte[length];
                int totalRead = 0;
                while (totalRead < length) {
                    int read = fis.read(dataBytes, totalRead, length - totalRead);
                    if (read == -1) break;
                    totalRead += read;
                }
                
                return new String(dataBytes, 0, totalRead, "UTF-8");
            }
        } catch (FileNotFoundException e) {
            return null;
        } catch (Exception e) {
            System.err.println("读取广播数据失败: " + e.getMessage());
            return null;
        } finally {
            if (lock != null) {
                try { lock.release(); } catch (IOException e) {}
            }
            if (channel != null) {
                try { channel.close(); } catch (IOException e) {}
            }
            if (raf != null) {
                try { raf.close(); } catch (IOException e) {}
            }
        }
    }
    
    private void onEventReceived(JsonObject data) {
        String eventType = data.get("EventType").getAsString();
        String eventName = data.get("EventName").getAsString();
        
        System.out.printf("[%s] %s - %s%n", 
            data.get("Timestamp").getAsString(), 
            eventName, 
            eventType);
        
        switch (eventType) {
            case "OnClassNotifyId":
                System.out.println("  → 上课啦！");
                break;
            case "OnBreakingTimeNotifyId":
                System.out.println("  → 课间休息");
                break;
            case "OnAfterSchoolNotifyId":
                System.out.println("  → 放学啦！");
                break;
            case "LessonInfo":
                String subject = data.get("CurrentSubjectName").getAsString();
                System.out.println("  → 当前课程: " + subject);
                break;
            case "FullState":
                printFullState(data);
                break;
        }
    }
    
    private void printFullState(JsonObject data) {
        System.out.println("  → 当前课程: " + data.get("CurrentSubjectName").getAsString());
        System.out.println("  → 课程时间: " + data.get("CurrentTimeStart").getAsString() 
            + " - " + data.get("CurrentTimeEnd").getAsString());
        System.out.println("  → 状态: " + data.get("CurrentState").getAsString());
        System.out.println("  → 剩余秒数: " + data.get("OnClassLeftSeconds").getAsInt());
        System.out.println("  → 下一节课: " + data.get("NextClassSubjectName").getAsString());
    }
    
    public void stop() {
        running = false;
        System.out.println("已停止监听");
    }
    
    // 使用示例
    public static void main(String[] args) {
        ClassIslandReceiver receiver = new ClassIslandReceiver();
        
        receiver.setEventListener(data -> {
            // 自定义事件处理
            System.out.println("收到事件: " + data.get("EventName").getAsString());
        });
        
        receiver.start();
        
        System.out.println("按 Enter 键退出...");
        try {
            System.in.read();
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        receiver.stop();
    }
}
```

### 使用 JNA 的完整实现（推荐）

```java
import com.sun.jna.*;
import com.sun.jna.platform.win32.*;
import com.sun.jna.ptr.IntByReference;
import java.nio.charset.StandardCharsets;

public class ClassIslandReceiverJNA {
    public interface Kernel32 extends Library {
        Kernel32 INSTANCE = Native.load("kernel32", Kernel32.class);
        
        HANDLE CreateFileMappingA(HANDLE hFile, Pointer lpAttributes, 
            int flProtect, int dwMaximumSizeHigh, int dwMaximumSizeLow, String lpName);
        
        Pointer MapViewOfFile(HANDLE hFileMappingObject, int dwDesiredAccess,
            int dwFileOffsetHigh, int dwFileOffsetLow, int dwNumberOfBytesToMap);
        
        boolean UnmapViewOfFile(Pointer lpBaseAddress);
        boolean CloseHandle(HANDLE hObject);
        HANDLE OpenEventA(int dwDesiredAccess, boolean bInheritHandle, String lpName);
        int WaitForSingleObject(HANDLE hHandle, int dwMilliseconds);
    }
    
    private static final int PAGE_READWRITE = 0x04;
    private static final int FILE_MAP_ALL_ACCESS = 0xF001F;
    private static final int EVENT_MODIFY_STATE = 0x0002;
    private static final int SYNCHRONIZE = 0x00100000;
    private static final int INFINITE = -1;
    
    private Kernel32.HANDLE eventHandle;
    private Kernel32.HANDLE mmfHandle;
    private Pointer mappedView;
    private boolean running = true;
    
    public void start() {
        // 打开全局事件
        eventHandle = Kernel32.INSTANCE.OpenEventA(
            SYNCHRONIZE, false, "Global\\ClassIsland_Broadcast_Event");
        
        // 打开内存映射文件
        mmfHandle = Kernel32.INSTANCE.CreateFileMappingA(
            new Kernel32.HANDLE(), null, PAGE_READWRITE, 0, 1024 * 1024,
            "Global\\ClassIsland_Broadcast_MMF");
        
        if (mmfHandle != null && mmfHandle.getPointer() != null) {
            mappedView = Kernel32.INSTANCE.MapViewOfFile(
                mmfHandle, FILE_MAP_ALL_ACCESS, 0, 0, 0);
        }
        
        // 启动监听线程
        Thread listener = new Thread(this::listenLoop);
        listener.setDaemon(true);
        listener.start();
    }
    
    private void listenLoop() {
        System.out.println("开始监听 ClassIsland 广播...");
        
        while (running) {
            int result = Kernel32.INSTANCE.WaitForSingleObject(eventHandle, 1000);
            if (result == 0) { // WAIT_OBJECT_0
                String data = readFromMappedView();
                if (data != null) {
                    System.out.println("收到广播: " + data);
                }
            }
        }
    }
    
    private String readFromMappedView() {
        if (mappedView == null) return null;
        
        try {
            // 读取长度（4字节）
            int length = mappedView.getInt(0);
            if (length <= 0 || length > 1024 * 1024) return null;
            
            // 读取数据
            byte[] dataBytes = mappedView.getByteArray(4, length);
            return new String(dataBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return null;
        }
    }
    
    public void stop() {
        running = false;
        if (mappedView != null) Kernel32.INSTANCE.UnmapViewOfFile(mappedView);
        if (mmfHandle != null) Kernel32.INSTANCE.CloseHandle(mmfHandle);
        if (eventHandle != null) Kernel32.INSTANCE.CloseHandle(eventHandle);
    }
}
```

---

## Python 客户端

### 依赖安装

```bash
pip install pywin32
```

### 完整示例代码

```python
import mmap
import time
import json
import threading
import win32event
import win32file
from typing import Optional, Callable

class ClassIslandReceiver:
    """ClassIsland 广播接收器"""
    
    MMF_NAME = "Global\\ClassIsland_Broadcast_MMF"
    EVENT_NAME = "Global\\ClassIsland_Broadcast_Event"
    MMF_SIZE = 1024 * 1024  # 1MB
    
    def __init__(self):
        self._running = False
        self._event_handle = None
        self._mmf_handle = None
        self._mmap = None
        self._listener: Optional[Callable] = None
        
    def set_listener(self, callback: Callable):
        """设置事件监听回调"""
        self._listener = callback
        
    def start(self):
        """启动监听"""
        try:
            # 打开全局事件
            self._event_handle = win32event.OpenEvent(
                win32event.EVENT_MODIFY_STATE | win32event.SYNCHRONIZE,
                False,
                self.EVENT_NAME
            )
        except:
            print("无法打开全局事件，将使用轮询模式")
            self._event_handle = None
            
        # 打开内存映射文件
        try:
            self._mmf_handle = win32file.CreateFile(
                self.MMF_NAME,
                win32file.GENERIC_READ,
                win32file.FILE_SHARE_READ,
                None,
                win32file.OPEN_EXISTING,
                0,
                None
            )
            if self._mmf_handle:
                self._mmap = mmap.mmap(
                    self._mmf_handle.handle,
                    self.MMF_SIZE,
                    access=mmap.ACCESS_READ
                )
        except Exception as e:
            print(f"打开内存映射文件失败: {e}")
            
        self._running = True
        self._listen_thread = threading.Thread(target=self._listen_loop, daemon=True)
        self._listen_thread.start()
        print("开始监听 ClassIsland 广播...")
        
    def _listen_loop(self):
        """监听循环"""
        while self._running:
            if self._event_handle:
                # 等待事件信号
                result = win32event.WaitForSingleObject(self._event_handle, 1000)
                if result != win32event.WAIT_OBJECT_0:
                    continue
                    
            data = self._read_from_mmap()
            if data:
                self._on_event(data)
                
    def _read_from_mmap(self) -> Optional[dict]:
        """从内存映射文件读取数据"""
        if not self._mmap:
            return None
            
        try:
            self._mmap.seek(0)
            # 读取长度
            length_bytes = self._mmap.read(4)
            if len(length_bytes) < 4:
                return None
            length = int.from_bytes(length_bytes, 'little')
            
            if length <= 0 or length > self.MMF_SIZE:
                return None
                
            # 读取数据
            data_bytes = self._mmap.read(length)
            if len(data_bytes) < length:
                return None
                
            json_str = data_bytes.decode('utf-8')
            return json.loads(json_str)
        except Exception as e:
            return None
            
    def _on_event(self, data: dict):
        """处理事件"""
        event_type = data.get('EventType', '')
        event_name = data.get('EventName', '')
        timestamp = data.get('Timestamp', '')
        
        print(f"[{timestamp}] {event_name} - {event_type}")
        
        # 根据事件类型处理
        if event_type == 'OnClassNotifyId':
            print("  → 上课啦！")
        elif event_type == 'OnBreakingTimeNotifyId':
            print("  → 课间休息")
        elif event_type == 'OnAfterSchoolNotifyId':
            print("  → 放学啦！")
        elif event_type == 'LessonInfo':
            subject = data.get('CurrentSubjectName', '未知')
            print(f"  → 当前课程: {subject}")
        elif event_type == 'FullState':
            self._print_full_state(data)
            
        # 调用自定义回调
        if self._listener:
            self._listener(data)
            
    def _print_full_state(self, data: dict):
        """打印完整状态"""
        print(f"  → 当前课程: {data.get('CurrentSubjectName', '无')}")
        print(f"  → 课程时间: {data.get('CurrentTimeStart')} - {data.get('CurrentTimeEnd')}")
        print(f"  → 状态: {data.get('CurrentState')}")
        print(f"  → 剩余秒数: {data.get('OnClassLeftSeconds')}")
        print(f"  → 下一节课: {data.get('NextClassSubjectName')}")
        
    def stop(self):
        """停止监听"""
        self._running = False
        if self._mmap:
            self._mmap.close()
        if self._mmf_handle:
            self._mmf_handle.close()
        if self._event_handle:
            win32event.CloseHandle(self._event_handle)
        print("已停止监听")
        
    def get_current_state(self) -> Optional[dict]:
        """获取当前状态"""
        return self._read_from_mmap()


# 使用示例
if __name__ == "__main__":
    receiver = ClassIslandReceiver()
    
    # 设置自定义回调
    def on_event(data):
        print(f"自定义处理: {data.get('EventName')}")
        
    receiver.set_listener(on_event)
    receiver.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        receiver.stop()
```

### 异步版本（asyncio）

```python
import asyncio
import json
import mmap
import win32event
from typing import Optional, Callable, Awaitable

class AsyncClassIslandReceiver:
    """异步 ClassIsland 广播接收器"""
    
    MMF_NAME = "Global\\ClassIsland_Broadcast_MMF"
    EVENT_NAME = "Global\\ClassIsland_Broadcast_Event"
    
    def __init__(self):
        self._running = False
        self._mmap: Optional[mmap.mmap] = None
        self._listener: Optional[Callable[[dict], Awaitable[None]]] = None
        
    def set_listener(self, callback: Callable[[dict], Awaitable[None]]):
        """设置异步事件监听回调"""
        self._listener = callback
        
    async def start(self):
        """启动监听"""
        # 打开内存映射文件
        try:
            import win32file
            handle = win32file.CreateFile(
                self.MMF_NAME,
                win32file.GENERIC_READ,
                win32file.FILE_SHARE_READ,
                None,
                win32file.OPEN_EXISTING,
                0,
                None
            )
            if handle:
                self._mmap = mmap.mmap(
                    handle.handle,
                    1024 * 1024,
                    access=mmap.ACCESS_READ
                )
        except Exception as e:
            print(f"打开内存映射文件失败: {e}")
            
        self._running = True
        await self._listen_loop()
        
    async def _listen_loop(self):
        """异步监听循环"""
        print("开始监听 ClassIsland 广播...")
        
        while self._running:
            data = self._read_from_mmap()
            if data:
                await self._on_event(data)
            await asyncio.sleep(0.1)
            
    def _read_from_mmap(self) -> Optional[dict]:
        """从内存映射文件读取数据"""
        if not self._mmap:
            return None
            
        try:
            self._mmap.seek(0)
            length_bytes = self._mmap.read(4)
            if len(length_bytes) < 4:
                return None
            length = int.from_bytes(length_bytes, 'little')
            
            if length <= 0:
                return None
                
            data_bytes = self._mmap.read(length)
            if len(data_bytes) < length:
                return None
                
            return json.loads(data_bytes.decode('utf-8'))
        except:
            return None
            
    async def _on_event(self, data: dict):
        """处理事件"""
        event_type = data.get('EventType', '')
        event_name = data.get('EventName', '')
        
        print(f"[{data.get('Timestamp')}] {event_name}")
        
        if event_type == 'OnClassNotifyId':
            print("  → 上课啦！")
        elif event_type == 'FullState':
            print(f"  → 当前课程: {data.get('CurrentSubjectName')}")
            
        if self._listener:
            await self._listener(data)
            
    async def stop(self):
        """停止监听"""
        self._running = False
        if self._mmap:
            self._mmap.close()


# 异步使用示例
async def main():
    receiver = AsyncClassIslandReceiver()
    
    async def on_event(data):
        print(f"异步回调: {data.get('EventName')}")
        
    receiver.set_listener(on_event)
    await receiver.start()
    
    try:
        await asyncio.sleep(60)  # 运行60秒
    finally:
        await receiver.stop()

if __name__ == "__main__":
    asyncio.run(main())
```

---

## C++ 客户端

### 完整示例代码

```cpp
#include <windows.h>
#include <iostream>
#include <string>
#include <thread>
#include <atomic>
#include <nlohmann/json.hpp>  // JSON 库，需要安装

using json = nlohmann::json;

class ClassIslandReceiver {
private:
    static constexpr const char* MMF_NAME = "Global\\ClassIsland_Broadcast_MMF";
    static constexpr const char* EVENT_NAME = "Global\\ClassIsland_Broadcast_Event";
    static constexpr DWORD MMF_SIZE = 1024 * 1024;  // 1MB
    
    HANDLE m_hEvent = nullptr;
    HANDLE m_hMMF = nullptr;
    LPVOID m_pMappedView = nullptr;
    std::atomic<bool> m_running{false};
    std::thread m_listenThread;
    
public:
    using EventCallback = std::function<void(const json&)>;
    
private:
    EventCallback m_callback;
    
public:
    ~ClassIslandReceiver() {
        stop();
    }
    
    void setCallback(EventCallback callback) {
        m_callback = callback;
    }
    
    bool start() {
        // 打开全局事件
        m_hEvent = OpenEventA(
            SYNCHRONIZE,
            FALSE,
            EVENT_NAME
        );
        
        if (!m_hEvent) {
            std::cout << "无法打开全局事件，将使用轮询模式" << std::endl;
        }
        
        // 打开内存映射文件
        m_hMMF = OpenFileMappingA(
            FILE_MAP_READ,
            FALSE,
            MMF_NAME
        );
        
        if (!m_hMMF) {
            std::cerr << "无法打开内存映射文件，错误码: " << GetLastError() << std::endl;
            return false;
        }
        
        // 映射视图
        m_pMappedView = MapViewOfFile(
            m_hMMF,
            FILE_MAP_READ,
            0, 0,
            MMF_SIZE
        );
        
        if (!m_pMappedView) {
            std::cerr << "映射视图失败，错误码: " << GetLastError() << std::endl;
            return false;
        }
        
        m_running = true;
        m_listenThread = std::thread(&ClassIslandReceiver::listenLoop, this);
        
        std::cout << "开始监听 ClassIsland 广播..." << std::endl;
        return true;
    }
    
    void stop() {
        m_running = false;
        if (m_listenThread.joinable()) {
            m_listenThread.join();
        }
        
        if (m_pMappedView) {
            UnmapViewOfFile(m_pMappedView);
            m_pMappedView = nullptr;
        }
        
        if (m_hMMF) {
            CloseHandle(m_hMMF);
            m_hMMF = nullptr;
        }
        
        if (m_hEvent) {
            CloseHandle(m_hEvent);
            m_hEvent = nullptr;
        }
        
        std::cout << "已停止监听" << std::endl;
    }
    
private:
    void listenLoop() {
        while (m_running) {
            if (m_hEvent) {
                // 等待事件信号
                DWORD result = WaitForSingleObject(m_hEvent, 1000);
                if (result != WAIT_OBJECT_0) {
                    continue;
                }
            }
            
            std::string data = readFromMMF();
            if (!data.empty()) {
                try {
                    json j = json::parse(data);
                    onEvent(j);
                } catch (const std::exception& e) {
                    std::cerr << "JSON 解析错误: " << e.what() << std::endl;
                }
            }
            
            if (!m_hEvent) {
                // 轮询模式
                Sleep(100);
            }
        }
    }
    
    std::string readFromMMF() {
        if (!m_pMappedView) {
            return "";
        }
        
        try {
            // 读取长度（4字节）
            DWORD length = *static_cast<DWORD*>(m_pMappedView);
            
            if (length <= 0 || length > MMF_SIZE) {
                return "";
            }
            
            // 读取数据
            char* dataPtr = static_cast<char*>(m_pMappedView) + sizeof(DWORD);
            return std::string(dataPtr, length);
        } catch (const std::exception& e) {
            return "";
        }
    }
    
    void onEvent(const json& data) {
        std::string eventType = data.value("EventType", "");
        std::string eventName = data.value("EventName", "");
        std::string timestamp = data.value("Timestamp", "");
        
        std::cout << "[" << timestamp << "] " << eventName << " - " << eventType << std::endl;
        
        // 根据事件类型处理
        if (eventType == "OnClassNotifyId") {
            std::cout << "  → 上课啦！" << std::endl;
        } else if (eventType == "OnBreakingTimeNotifyId") {
            std::cout << "  → 课间休息" << std::endl;
        } else if (eventType == "OnAfterSchoolNotifyId") {
            std::cout << "  → 放学啦！" << std::endl;
        } else if (eventType == "LessonInfo") {
            std::string subject = data.value("CurrentSubjectName", "未知");
            std::cout << "  → 当前课程: " << subject << std::endl;
        } else if (eventType == "FullState") {
            printFullState(data);
        }
        
        // 调用自定义回调
        if (m_callback) {
            m_callback(data);
        }
    }
    
    void printFullState(const json& data) {
        std::cout << "  → 当前课程: " << data.value("CurrentSubjectName", "无") << std::endl;
        std::cout << "  → 课程时间: " << data.value("CurrentTimeStart", "") 
                  << " - " << data.value("CurrentTimeEnd", "") << std::endl;
        std::cout << "  → 状态: " << data.value("CurrentState", "") << std::endl;
        std::cout << "  → 剩余秒数: " << data.value("OnClassLeftSeconds", 0) << std::endl;
        std::cout << "  → 下一节课: " << data.value("NextClassSubjectName", "") << std::endl;
    }
    
public:
    json getCurrentState() {
        std::string data = readFromMMF();
        if (!data.empty()) {
            try {
                return json::parse(data);
            } catch (...) {}
        }
        return json();
    }
};

// 使用示例
int main() {
    ClassIslandReceiver receiver;
    
    // 设置回调
    receiver.setCallback([](const json& data) {
        std::cout << "自定义回调: " << data.value("EventName", "") << std::endl;
    });
    
    if (!receiver.start()) {
        std::cerr << "启动失败" << std::endl;
        return 1;
    }
    
    std::cout << "按 Enter 键退出..." << std::endl;
    std::cin.get();
    
    receiver.stop();
    return 0;
}
```

### 轻量级版本（无第三方依赖）

```cpp
#include <windows.h>
#include <iostream>
#include <string>
#include <thread>
#include <atomic>

// 简单的 JSON 解析器（仅用于演示）
class SimpleJson {
public:
    static std::string getValue(const std::string& json, const std::string& key) {
        std::string searchKey = "\"" + key + "\"";
        size_t keyPos = json.find(searchKey);
        if (keyPos == std::string::npos) return "";
        
        size_t colonPos = json.find(':', keyPos + searchKey.length());
        if (colonPos == std::string::npos) return "";
        
        size_t startPos = json.find_first_not_of(" \t\n\r", colonPos + 1);
        if (startPos == std::string::npos) return "";
        
        if (json[startPos] == '"') {
            size_t endPos = json.find('"', startPos + 1);
            if (endPos != std::string::npos) {
                return json.substr(startPos + 1, endPos - startPos - 1);
            }
        }
        return "";
    }
};

class SimpleClassIslandReceiver {
private:
    static constexpr const char* MMF_NAME = "Global\\ClassIsland_Broadcast_MMF";
    HANDLE m_hMMF = nullptr;
    LPVOID m_pMappedView = nullptr;
    std::atomic<bool> m_running{false};
    
public:
    bool start() {
        m_hMMF = OpenFileMappingA(FILE_MAP_READ, FALSE, MMF_NAME);
        if (!m_hMMF) return false;
        
        m_pMappedView = MapViewOfFile(m_hMMF, FILE_MAP_READ, 0, 0, 1024 * 1024);
        if (!m_pMappedView) return false;
        
        m_running = true;
        std::thread([this]() { listenLoop(); }).detach();
        
        std::cout << "开始监听 ClassIsland 广播..." << std::endl;
        return true;
    }
    
    void stop() {
        m_running = false;
        if (m_pMappedView) UnmapViewOfFile(m_pMappedView);
        if (m_hMMF) CloseHandle(m_hMMF);
    }
    
private:
    void listenLoop() {
        while (m_running) {
            std::string data = readFromMMF();
            if (!data.empty()) {
                std::string eventType = SimpleJson::getValue(data, "EventType");
                std::string eventName = SimpleJson::getValue(data, "EventName");
                std::cout << "收到事件: " << eventName << " (" << eventType << ")" << std::endl;
                
                if (eventType == "OnClassNotifyId") {
                    std::cout << "  → 上课啦！" << std::endl;
                } else if (eventType == "LessonInfo") {
                    std::string subject = SimpleJson::getValue(data, "CurrentSubjectName");
                    std::cout << "  → 当前课程: " << subject << std::endl;
                }
            }
            Sleep(100);
        }
    }
    
    std::string readFromMMF() {
        if (!m_pMappedView) return "";
        
        try {
            DWORD length = *static_cast<DWORD*>(m_pMappedView);
            if (length <= 0 || length > 1024 * 1024) return "";
            
            char* dataPtr = static_cast<char*>(m_pMappedView) + sizeof(DWORD);
            return std::string(dataPtr, length);
        } catch (...) {
            return "";
        }
    }
};

int main() {
    SimpleClassIslandReceiver receiver;
    
    if (!receiver.start()) {
        std::cerr << "启动失败，请确保 ClassIsland 正在运行" << std::endl;
        return 1;
    }
    
    std::cout << "按 Enter 键退出..." << std::endl;
    std::cin.get();
    
    receiver.stop();
    return 0;
}
```

---

## 编译说明

### C++ 编译（MSVC）

```bash
# 使用 Visual Studio 开发者命令提示符
cl /EHsc /std:c++17 classisland_receiver.cpp /Fe:classisland_receiver.exe

# 或使用 CMake
cmake -B build
cmake --build build --config Release
```

### Python 依赖

```bash
pip install pywin32
```

### Java 编译

```bash
# 需要添加 Gson 库
javac -cp "gson-2.10.1.jar;." ClassIslandReceiver.java
java -cp "gson-2.10.1.jar;." ClassIslandReceiver
```

---

## 常见问题

### Q: 收不到广播数据？

1. 确保 ClassIsland 正在运行
2. 确保 IPC Bridge Plugin 已正确安装并启用
3. 检查内存映射文件是否存在：使用 `WinObj` 工具查看 `Global\ClassIsland_Broadcast_MMF`

### Q: 权限错误？

需要以普通用户权限运行即可，全局内核对象对所有用户可见。

### Q: 如何调试？

查看 ClassIsland 的日志输出，插件会输出详细的运行信息。

---

## 许可证

MIT License