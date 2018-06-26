// FileAPI，是一些列文件处理规范的基础，包含最基础的文件操作的JS接口设计
// 文件操作API：

FileList 
// 代表一组文件的JS对象，比如通过input[type="file"]元素选中的本地文件列表
filelist[index] // 得到第index个文件 

Blob
// 代表一段二进制数据，且允许通过JS对其数据以字节为单位进行“切割”，关于Blob对象
blob.size // 只读特性，数据的字节数  
blob.type // 对象的MIME类型，若是未知类型返回空字符串
blob.slice(start,length) // 将当前文件切割并将结果返回,可以通过这个方法访问到字节内部的原始数据块

File
// 代表一个文件，是从Blob接口继承而来的，并在此基础上增加了诸如文件名、MIME类型之类的特性，关于File对象 
file.size // 继承自Blob，意义同上  
file.slice(start, length) // 继承自Blob，意义同上  
file.name // 只读属性，文件名  
file.type // 只读属性，文件的MIME类型  
file.lastModifiedDate // 只读属性，最后文件修改时间

FileReader
// 属性
reader.result //读取的结果(二进制、文本或DataURL格式)  
reader.readyState //读取操作的状态(EMPTY、LOADING、DONE) 
// 方法
reader.readAsArrayBuffer(blob/file) //将读取结果封装成ArrayBuffer，如果想使用一般需要转换成Int8Array或DataView
reader.readAsBinaryString(blob/file) // 以二进制格式读取文件内容  
reader.readAsText(file, [encoding]) //以文本(及字符串)格式读取文件内容，并且可以强制选择文件编码 
reader.readAsDataURL(file) //以DataURL格式读取文件内容  
reader.abort() // 终止读取操作 
// 事件
reader.onloadstart // 读取操作开始时触发  
reader.onload // 读取操作成功时触发  
reader.onloadend // 读取操作完成时触发
reader.onprogress//读取过程中触发实时监控读取进度
reader.onabort // 读取操作被中断时触发  
reader.onerror // 读取操作失败时触发 


FileWriter
//

// Blob接口和File接口可以返回数据的字节数等信息，也可以“切割”，但无法获取真正的内容，这也正是FileReader存在的意义，而文件大小不一时，读取文件可能存在明显的时间花费，所以我们用异步的方式，通过触发另外的事件来返回读取到的文件内容